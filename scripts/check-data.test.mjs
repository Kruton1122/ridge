import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { checkData, isIsoDate, loadData } from "./check-data.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NOW = new Date("2026-10-16T12:00:00Z");

function good() {
  return {
    LABS: { acme: { name: "Acme", short: "Acme", color: "#112233" }, other: { name: "Other", short: "Other", color: "#8EA0B0" } },
    MODELS: [
      { id: "a-1", name: "A 1", shortName: "A", lab: "acme", labName: "Acme", released: "2026-10-01", contextTokens: 1_000_000, pricing: null, license: "open-weight", aliases: ["a 1"] },
      { id: "b-1", name: "B 1", shortName: "B", lab: "acme", labName: "Acme", released: "2026-10-02", contextTokens: null, pricing: { inputPerM: 1, outputPerM: 2 }, license: "proprietary", aliases: ["b 1"] },
    ],
    BENCHMARKS: [
      { id: "idx", name: "Index", short: "Idx", unit: "index", asOf: "2026-10-16" },
      { id: "old", name: "Old (archived)", short: "Old", unit: "percent", asOf: "2026-10-16" },
      { id: "aa-cyber", name: "Cyber", short: "Cyber", unit: "index", asOf: "2026-10-16" },
    ],
    SCORES: [
      { modelId: "a-1", benchmarkId: "idx", value: 30, sourceName: "AA", sourceUrl: "https://example.com", asOf: "2026-10-16" },
      { modelId: "b-1", benchmarkId: "idx", value: 41.25, sourceName: "AA", sourceUrl: "https://example.com", asOf: "2026-10-15", note: "variant: max" },
    ],
    WIRE: [{ id: "w1", title: "W", blurb: "Text", date: "2026-10-16", outlet: "O", url: "https://example.com", beat: "release", models: ["a-1"] }],
    NEWS: [{ id: "n1", kind: "release", title: "N", dek: "d", summary: "s", body: ["p"], date: "2026-10-16", sourceName: "S", sourceUrl: "https://example.com", models: ["a-1"], tags: [] }],
    CHANGELOG: [
      { date: "2026-10-16", title: "Two", items: ["x"] },
      { date: "2026-10-15", title: "One", items: ["y"] },
    ],
    VOICE_ROWS: [{ provider: "P", model: "M", index: "86.9", reasoning: "99%", dynamics: null, agentic: null, arenaElo: "1070", taskSuccess: "94.8%", ttfa: "0.81" }],
    VOICE_AS_OF: "2026-10-16",
  };
}

const run = (mutate) => {
  const d = good();
  mutate(d);
  return checkData(d, { now: NOW });
};
const has = (r, re) => r.errors.some((e) => re.test(e));

test("isIsoDate accepts real dates only", () => {
  assert.equal(isIsoDate("2026-10-16"), true);
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("16 Oct 2026"), false);
  assert.equal(isIsoDate(undefined), false);
});

test("clean synthetic data passes", () => {
  const r = checkData(good(), { now: NOW });
  assert.deepEqual(r.errors, []);
});

test("duplicate model ids and missing labs fail", () => {
  assert.ok(has(run((d) => d.MODELS.push({ ...d.MODELS[0] })), /duplicate model id a-1/));
  assert.ok(has(run((d) => (d.MODELS[0].lab = "nowhere")), /lab "nowhere" is not in LABS/));
});

test("scores must point at a real model and board, once", () => {
  assert.ok(has(run((d) => (d.SCORES[0].modelId = "ghost")), /model "ghost" is not in the catalog/));
  assert.ok(has(run((d) => (d.SCORES[0].benchmarkId = "nope")), /board "nope" does not exist/));
  assert.ok(has(run((d) => d.SCORES.push({ ...d.SCORES[0] })), /duplicate score for a-1 \/ idx/));
});

test("scores must be plain numbers with at most two decimals", () => {
  assert.ok(has(run((d) => (d.SCORES[0].value = "30%")), /not a finite number/));
  assert.ok(has(run((d) => (d.SCORES[0].value = Number.NaN)), /not a finite number/));
  assert.ok(has(run((d) => (d.SCORES[0].value = 30.123)), /more than 2 decimals/));
  assert.ok(has(run((d) => (d.SCORES[0].value = 130)), /outside the plausible range/));
  assert.deepEqual(run((d) => (d.SCORES[0].value = 49.49)).errors, []);
});

test("score dates must be real and not in the future", () => {
  assert.ok(has(run((d) => (d.SCORES[0].asOf = "2026-13-01")), /malformed date/));
  assert.ok(has(run((d) => (d.SCORES[0].asOf = "2026-12-25")), /in the future/));
});

test("a trusted-access value cannot be the public GPT-6 Sol cyber score", () => {
  const r = run((d) => {
    d.MODELS.push({ ...d.MODELS[0], id: "gpt-6-sol" });
    d.SCORES.push({ modelId: "gpt-6-sol", benchmarkId: "aa-cyber", value: 69, sourceName: "AA", sourceUrl: "https://example.com", asOf: "2026-10-16" });
  });
  assert.ok(has(r, /Daybreak Blue trusted-access value/));
});

test("a note about trusted access must exclude it and must not quote the cell value", () => {
  const withNote = (note, value = 37) =>
    run((d) => d.SCORES.push({ modelId: "a-1", benchmarkId: "aa-cyber", value, sourceName: "AA", sourceUrl: "https://example.com", asOf: "2026-10-16", note }));
  assert.deepEqual(withNote("AA also lists a trusted-access version at 69; Ridge does not count it.").errors, []);
  assert.ok(has(withNote("AA also lists a trusted-access version at 69; Ridge does not count it.", 69), /quotes the cell value 69/));
  assert.ok(has(withNote("Daybreak Blue, trusted-access version"), /does not say it is excluded/));
});

test("wire, desk and changelog items need unique ids and real dates", () => {
  assert.ok(has(run((d) => d.WIRE.push({ ...d.WIRE[0] })), /wire: duplicate id w1/));
  assert.ok(has(run((d) => delete d.WIRE[0].date), /wire w1: missing or malformed date/));
  assert.ok(has(run((d) => (d.NEWS[0].date = "")), /desk n1: missing or malformed date/));
  assert.ok(has(run((d) => d.NEWS.push({ ...d.NEWS[0] })), /desk: duplicate id n1/));
  assert.ok(has(run((d) => (d.WIRE[0].models = ["ghost"])), /unknown model "ghost"/));
  assert.ok(has(run((d) => d.CHANGELOG.push({ ...d.CHANGELOG[1] })), /duplicate entry/));
  assert.ok(has(run((d) => (d.CHANGELOG[1].date = undefined)), /changelog #2.*malformed date/));
  assert.ok(has(run((d) => (d.CHANGELOG[0].items = [])), /non-empty list/));
});

test("soft findings warn without failing", () => {
  const r = run((d) => {
    d.SCORES[0].asOf = "2026-10-16";
    d.BENCHMARKS[0].asOf = "2026-10-01";
    d.SCORES.push({ modelId: "a-1", benchmarkId: "old", value: 50, sourceName: "AA", sourceUrl: "https://example.com", asOf: "2026-10-06" });
    d.WIRE[0].url = "";
  });
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => /after the board's own asOf/.test(w)));
  assert.ok(r.warnings.some((w) => /marked archived/.test(w)));
  assert.ok(r.warnings.some((w) => /no source URL/.test(w)));
});

test("voice rows need unique, plain-number cells", () => {
  assert.ok(has(run((d) => d.VOICE_ROWS.push({ ...d.VOICE_ROWS[0] })), /voice: duplicate row/));
  assert.ok(has(run((d) => (d.VOICE_ROWS[0].index = "86.9%")), /index.*plain number/));
});

test("the real data passes (warnings allowed)", async () => {
  const { errors } = checkData(await loadData());
  assert.deepEqual(errors, []);
});

test("CLI exits 0 on the real data", () => {
  const r = spawnSync(process.execPath, [join(ROOT, "scripts/check-data.mjs")], { encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /check-data: \d+ models/);
});

test("note guards: a dropped protected prefix or a banned figure fails", () => {
  const guards = {
    protectedPrefixes: [{ modelId: "b-1", benchmarkId: "idx", prefix: "variant: max" }],
    bannedFragments: [{ benchmarkId: "idx", fragment: "before the hallucination gate" }],
  };
  assert.deepEqual(checkData(good(), { now: NOW, noteGuards: guards }).errors, []);
  const d = good();
  d.SCORES[1].note = "best listed row";
  d.SCORES[0].note = "#1 of 2; 20.8% before the hallucination gate";
  const { errors } = checkData(d, { now: NOW, noteGuards: guards });
  assert.ok(errors.some((e) => e.includes("b-1/idx") && e.includes("must start with")));
  assert.ok(errors.some((e) => e.includes("a-1/idx") && e.includes("banned text")));
});
