#!/usr/bin/env node
/**
 * Data sanity check for the Ridge catalog and its editorial feeds.
 *
 *   node scripts/check-data.mjs          (or: npm run check:data)
 *
 * Loads src/lib/data/{catalog,ledger,desk,wire,changelog,voice}.ts and fails
 * (exit 1) on structural mistakes: duplicate ids, malformed scores, scores or
 * models pointing at a missing board / model / lab, duplicate or undated
 * wire / desk / changelog items, and a few repeat mistakes (a trusted-access
 * score leaking onto the board, scores with stray decimals). Softer
 * inconsistencies are printed as warnings and do not fail the run.
 *
 * The data files are TypeScript, so each one is transpiled with the repo's own
 * `typescript` into a temp dir (extensionless relative imports get ".mjs").
 * That runs on any supported Node with no flags and writes nothing to the repo.
 */
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { isMainModule } from "./with-app-env.mjs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const DATA_FILES = ["types", "catalog", "desk", "wire", "changelog", "voice", "ledger"];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const NEWS_KINDS = new Set(["release", "ranking", "rumor", "policy", "controversy"]);
const WIRE_BEATS = new Set(["release", "ranking", "policy", "rumor", "labs", "industry"]);
const TRUSTED_RE = /trusted[- ]access|daybreak/i;
/** The trusted-access cyber value AA lists for GPT-6 Sol (Daybreak Blue); never a public score. */
const SOL_TRUSTED_CYBER = 69;

/**
 * Transpile the data files into a temp dir and import them.
 * @param {string} [root]
 */
export async function loadData(root = ROOT) {
  const out = mkdtempSync(join(tmpdir(), "ridge-check-data-"));
  try {
    for (const name of DATA_FILES) {
      const src = readFileSync(join(root, "src/lib/data", `${name}.ts`), "utf8");
      const js = ts.transpileModule(src, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      writeFileSync(join(out, `${name}.mjs`), js.replace(/(from\s+["'])(\.\/[\w-]+)(["'])/g, "$1$2.mjs$3"));
    }
    const load = (name) => import(pathToFileURL(join(out, `${name}.mjs`)).href);
    const [catalog, desk, wire, changelog, voice, ledger] = await Promise.all(
      ["catalog", "desk", "wire", "changelog", "voice", "ledger"].map(load),
    );
    return {
      MODELS: catalog.MODELS,
      LABS: catalog.LABS,
      BENCHMARKS: catalog.BENCHMARKS,
      SCORES: catalog.SCORES,
      SNAPSHOT_DATE: catalog.SNAPSHOT_DATE,
      NEWS: desk.NEWS,
      WIRE: wire.WIRE,
      CHANGELOG: changelog.CHANGELOG,
      VOICE_ROWS: voice.VOICE_ROWS,
      VOICE_AS_OF: voice.VOICE_AS_OF,
      buildLedger: ledger.buildLedger,
      ledgerCsv: ledger.ledgerCsv,
    };
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

/** True for a real calendar date written YYYY-MM-DD. */
export function isIsoDate(value) {
  if (typeof value !== "string" || !DATE_RE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** At most two decimals, allowing float noise. */
function hasMoreThanTwoDecimals(v) {
  return Math.abs(v * 100 - Math.round(v * 100)) > 1e-6;
}

function duplicates(values) {
  const seen = new Set();
  const dup = new Set();
  for (const v of values) (seen.has(v) ? dup : seen).add(v);
  return [...dup];
}

/**
 * Run every check. Pure: takes the loaded data, returns messages.
 * @param {any} data
 * @param {{ now?: Date }} [opts]
 * @returns {{ errors: string[], warnings: string[] }}
 */
/** Score-note guards shared with scripts/apply-briefing-staging.py. */
export const NOTE_GUARDS = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "note-guards.json"), "utf8"));

export function checkData(data, { now = new Date(), noteGuards = NOTE_GUARDS } = {}) {
  /** @type {string[]} */
  const errors = [];
  /** @type {string[]} */
  const warnings = [];
  const err = (m) => errors.push(m);
  const warn = (m) => warnings.push(m);
  const { MODELS = [], LABS = {}, BENCHMARKS = [], SCORES = [], NEWS = [], WIRE = [], CHANGELOG = [] } = data;
  const VOICE_ROWS = data.VOICE_ROWS ?? [];
  for (const sc of SCORES) {
    const note = sc.note ?? "";
    for (const g of noteGuards.protectedPrefixes ?? []) {
      if (sc.modelId === g.modelId && sc.benchmarkId === g.benchmarkId && !note.startsWith(g.prefix))
        err(`score ${sc.modelId}/${sc.benchmarkId}: note must start with ${JSON.stringify(g.prefix)} (protected in scripts/note-guards.json)`);
    }
    for (const b of noteGuards.bannedFragments ?? []) {
      if ((b.benchmarkId == null || b.benchmarkId === sc.benchmarkId) && (b.modelId == null || b.modelId === sc.modelId) && note.includes(b.fragment))
        err(`score ${sc.modelId}/${sc.benchmarkId}: note contains banned text ${JSON.stringify(b.fragment)} (scripts/note-guards.json)`);
    }
  }
  const limit = new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10);
  const checkDate = (where, value) => {
    if (!isIsoDate(value)) err(`${where}: missing or malformed date ${JSON.stringify(value)} (want YYYY-MM-DD)`);
    else if (value > limit) err(`${where}: date ${value} is in the future`);
  };

  // ---- labs, models
  for (const [id, lab] of Object.entries(LABS)) {
    if (!lab || !lab.name || !/^#[0-9a-fA-F]{6}$/.test(lab.color ?? "")) err(`lab ${id}: needs a name and a #RRGGBB color`);
  }
  for (const id of duplicates(MODELS.map((m) => m.id))) err(`duplicate model id ${id}`);
  const modelIds = new Set(MODELS.map((m) => m.id));
  const aliasOwner = new Map();
  for (const m of MODELS) {
    if (!m.id || !m.name || !m.shortName) err(`model ${m.id ?? "(no id)"}: id, name and shortName are required`);
    if (!Object.hasOwn(LABS, m.lab)) err(`model ${m.id}: lab ${JSON.stringify(m.lab)} is not in LABS`);
    else if (LABS[m.lab].name !== m.labName && m.lab !== "other") {
      warn(`model ${m.id}: labName ${JSON.stringify(m.labName)} differs from LABS.${m.lab}.name ${JSON.stringify(LABS[m.lab].name)}`);
    }
    checkDate(`model ${m.id} released`, m.released);
    if (m.license !== "proprietary" && m.license !== "open-weight") err(`model ${m.id}: bad license ${JSON.stringify(m.license)}`);
    if (m.pricing !== null && !(Number.isFinite(m.pricing?.inputPerM) && Number.isFinite(m.pricing?.outputPerM))) {
      err(`model ${m.id}: pricing must be null or numeric inputPerM/outputPerM`);
    }
    if (m.contextTokens !== null && !(Number.isInteger(m.contextTokens) && m.contextTokens > 0)) {
      err(`model ${m.id}: contextTokens must be null or a positive integer`);
    }
    for (const a of m.aliases ?? []) {
      const key = String(a).trim().toLowerCase();
      const owner = aliasOwner.get(key);
      if (owner && owner !== m.id) warn(`alias ${JSON.stringify(a)} is used by both ${owner} and ${m.id}; the scrape matcher may pick the wrong row`);
      aliasOwner.set(key, owner ?? m.id);
    }
  }

  // ---- boards
  for (const id of duplicates(BENCHMARKS.map((b) => b.id))) err(`duplicate benchmark id ${id}`);
  const boards = new Map(BENCHMARKS.map((b) => [b.id, b]));
  for (const b of BENCHMARKS) {
    if (!b.id || !b.name || !b.short) err(`benchmark ${b.id ?? "(no id)"}: id, name and short are required`);
    if (!["index", "percent", "elo"].includes(b.unit)) err(`benchmark ${b.id}: bad unit ${JSON.stringify(b.unit)}`);
    checkDate(`benchmark ${b.id} asOf`, b.asOf);
  }

  // ---- scores
  const pairs = new Map();
  const newest = new Map();
  for (const s of SCORES) {
    const where = `score ${s.modelId} / ${s.benchmarkId}`;
    if (!modelIds.has(s.modelId)) err(`${where}: model ${JSON.stringify(s.modelId)} is not in the catalog`);
    const board = boards.get(s.benchmarkId);
    if (!board) err(`${where}: board ${JSON.stringify(s.benchmarkId)} does not exist`);
    if (typeof s.value !== "number" || !Number.isFinite(s.value)) {
      err(`${where}: value ${JSON.stringify(s.value)} is not a finite number (no strings, no percent signs)`);
    } else {
      if (hasMoreThanTwoDecimals(s.value)) err(`${where}: value ${s.value} has more than 2 decimals`);
      if (board?.unit === "elo" ? s.value < 500 || s.value > 3500 : s.value < 0 || s.value > 100) {
        err(`${where}: value ${s.value} is outside the plausible range for a ${board?.unit} board`);
      }
    }
    if (!s.sourceName || !/^https?:\/\//.test(s.sourceUrl ?? "")) err(`${where}: sourceName and an http(s) sourceUrl are required`);
    checkDate(`${where} asOf`, s.asOf);
    const key = `${s.modelId}\u0000${s.benchmarkId}`;
    pairs.set(key, (pairs.get(key) ?? 0) + 1);
    if (isIsoDate(s.asOf) && (newest.get(s.benchmarkId) ?? "") < s.asOf) newest.set(s.benchmarkId, s.asOf);

    // Repeat mistake: a trusted-access (Daybreak Blue) value taken as the public GPT-6 Sol score.
    if (s.modelId === "gpt-6-sol" && s.benchmarkId === "aa-cyber" && s.value === SOL_TRUSTED_CYBER) {
      err(`${where}: ${SOL_TRUSTED_CYBER} is the Daybreak Blue trusted-access value; Ridge does not count it`);
    }
    if (typeof s.note === "string" && TRUSTED_RE.test(s.note)) {
      const quoted = (s.note.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
      if (quoted.includes(s.value)) err(`${where}: note mentions a trusted-access version and quotes the cell value ${s.value}; the cell may hold the trusted row`);
      if (!/not count|excluded|does not use|not use/i.test(s.note)) err(`${where}: note mentions trusted access but does not say it is excluded`);
    }
  }
  for (const [key, n] of pairs) {
    if (n > 1) err(`duplicate score for ${key.replace("\u0000", " / ")} (${n} rows)`);
  }
  // Softer: dates that disagree with the board header.
  for (const b of BENCHMARKS) {
    const latest = newest.get(b.id);
    if (!latest) continue;
    if (isIsoDate(b.asOf) && latest > b.asOf) {
      warn(`board ${b.id}: a score is dated ${latest}, after the board's own asOf ${b.asOf}`);
    }
    if (/archived|stale/i.test(b.name) && isIsoDate(b.asOf) && b.asOf > latest) {
      err(`board ${b.id} is marked archived but its asOf ${b.asOf} is newer than its latest score ${latest}; archived boards must not be re-dated`);
    }
  }

  // ---- wire, desk, changelog
  const checkFeed = (label, items, kinds, kindKey, needText) => {
    for (const id of duplicates(items.map((i) => i.id))) err(`${label}: duplicate id ${id}`);
    for (const i of items) {
      const where = `${label} ${i.id ?? "(no id)"}`;
      if (!i.id) err(`${label}: item without an id (${JSON.stringify(i.title ?? "")})`);
      if (!i.title) err(`${where}: missing title`);
      checkDate(`${where}`, i.date);
      if (!kinds.has(i[kindKey])) err(`${where}: bad ${kindKey} ${JSON.stringify(i[kindKey])}`);
      if (!needText(i)) err(`${where}: missing body text`);
      for (const mid of i.models ?? []) if (!modelIds.has(mid)) err(`${where}: references unknown model ${JSON.stringify(mid)}`);
    }
  };
  checkFeed("wire", WIRE, WIRE_BEATS, "beat", (i) => typeof i.blurb === "string" && i.blurb.trim());
  for (const i of WIRE) {
    // An item can legitimately lack a public URL (e.g. a screenshot of a post), so this only warns.
    if (!/^https?:\/\//.test(i.url ?? "")) warn(`wire ${i.id}: no source URL`);
  }
  checkFeed("desk", NEWS, NEWS_KINDS, "kind", (i) => Array.isArray(i.body) && i.body.length > 0 && i.body.every((p) => typeof p === "string" && p.trim()));
  const seenLog = new Set();
  CHANGELOG.forEach((c, n) => {
    const where = `changelog #${n + 1} (${c?.title ?? "no title"})`;
    if (!c?.title) err(`${where}: missing title`);
    checkDate(where, c?.date);
    if (!Array.isArray(c?.items) || !c.items.length || !c.items.every((t) => typeof t === "string" && t.trim())) err(`${where}: needs a non-empty list of text items`);
    const key = `${c?.date}|${c?.title}`;
    if (seenLog.has(key)) err(`changelog: duplicate entry ${key}`);
    seenLog.add(key);
    const prev = CHANGELOG[n - 1];
    if (prev && isIsoDate(prev.date) && isIsoDate(c?.date) && c.date > prev.date) warn(`${where}: dated after the entry above it; the changelog is newest first`);
  });

  // ---- voice board (separate from the text ledger)
  if (data.VOICE_AS_OF !== undefined) checkDate("voice VOICE_AS_OF", data.VOICE_AS_OF);
  const voiceKeys = VOICE_ROWS.map((r) => `${r.provider} / ${r.model}`);
  for (const k of duplicates(voiceKeys)) err(`voice: duplicate row ${k}`);
  for (const r of VOICE_ROWS) {
    const where = `voice ${r.provider} / ${r.model}`;
    if (!r.provider || !r.model) err(`${where}: provider and model are required`);
    if (r.index !== null && !/^\d{1,3}(\.\d)?$/.test(r.index)) err(`${where}: index ${JSON.stringify(r.index)} is not a plain number`);
    if (r.arenaElo !== null && !/^\d{3,4}$/.test(r.arenaElo)) err(`${where}: arenaElo ${JSON.stringify(r.arenaElo)} is not a whole number`);
    if (r.ttfa !== null && !/^\d+(\.\d{1,2})?$/.test(r.ttfa)) err(`${where}: ttfa ${JSON.stringify(r.ttfa)} is not a number of seconds`);
  }

  // ---- derived ledger must build
  if (typeof data.buildLedger === "function") {
    try {
      const rows = data.buildLedger("list");
      if (rows.length !== MODELS.length) err(`ledger: ${rows.length} rows for ${MODELS.length} models`);
      if (typeof data.ledgerCsv === "function" && !String(data.ledgerCsv("list")).includes("\n")) err("ledger: CSV came back empty");
    } catch (e) {
      err(`ledger: failed to build (${e instanceof Error ? e.message : e})`);
    }
  }

  return { errors, warnings };
}

async function main() {
  const data = await loadData();
  const { errors, warnings } = checkData(data);
  for (const w of warnings) console.warn(`warn  ${w}`);
  for (const e of errors) console.error(`ERROR ${e}`);
  console.log(
    `check-data: ${data.MODELS.length} models, ${data.SCORES.length} scores, ${data.BENCHMARKS.length} boards, ` +
      `${data.WIRE.length} wire, ${data.NEWS.length} desk, ${data.CHANGELOG.length} changelog, ${data.VOICE_ROWS.length} voice rows: ` +
      `${errors.length} error(s), ${warnings.length} warning(s)`,
  );
  process.exit(errors.length ? 1 : 0);
}

if (isMainModule(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(2);
  });
}
