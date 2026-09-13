/**
 * Read-only derivations over the catalog for the /new site.
 *
 * Ridge Bot's daily pipeline writes catalog.ts, desk.ts, changelog.ts and
 * public/llms.txt. Nothing here writes anything — every number below is
 * computed from those files at render time, so a scrape lands on this site
 * without a second edit.
 */
import { BENCHMARKS, MODELS, SCORES, SNAPSHOT_DATE, formatContext, getModel } from "./catalog";
import { CHANGELOG } from "./changelog";
import { NEWS } from "./desk";
import { listDollarPerAa } from "./ledger";
import type { Benchmark, LabId, Model, Score } from "./types";
import { WIRE } from "./wire";

export type PriceMode = "list" | "promo";

/**
 * Preferred display order. AA is the headline, then the corroborating cuts.
 *
 * This is a *hint*, not a whitelist: any benchmark added to `BENCHMARKS` in
 * catalog.ts that is not listed here still renders, sorted to the end. Adding a
 * fifth board is a catalog edit and nothing else — no component needs touching.
 */
const BOARD_ORDER_HINT = ["aa-intelligence", "swe-bench", "cursor-bench", "arena-elo", "terminal-bench"];

export interface BoardRow {
  rank: number;
  of: number;
  /** Another row on this board holds the same value. */
  tied: boolean;
  model: Model;
  score: Score;
  /** Share of the top score on this benchmark, 0–1. Bar length only. */
  share: number;
}

/**
 * Competition ranking (1, 1, 3), not ordinal.
 *
 * Fable 5.1 and Astra both score 53 on AA v4.2. Numbering them #1 and #2 because
 * one happens to sort first would be a claim the source never made — and
 * inventing a separation between equal numbers is the same sin as inventing the
 * numbers. Tied rows share a rank and carry a flag so the UI can say so.
 */
export function board(benchmarkId: string): BoardRow[] {
  const rows = SCORES.filter((s) => s.benchmarkId === benchmarkId)
    .filter((s) => getModel(s.modelId))
    .sort((a, b) => b.value - a.value);
  const peak = rows[0]?.value ?? 1;
  const floor = benchmarkId === "arena-elo" ? Math.min(...rows.map((r) => r.value)) - 20 : 0;
  const span = Math.max(peak - floor, 1);

  return rows.map((score) => ({
    rank: rows.filter((r) => r.value > score.value).length + 1,
    of: rows.length,
    tied: rows.filter((r) => r.value === score.value).length > 1,
    model: getModel(score.modelId)!,
    score,
    share: Math.max(0.03, (score.value - floor) / span),
  }));
}

export interface Rank {
  rank: number;
  of: number;
  tied: boolean;
  value: number;
  score: Score;
}

/** `#3 of 10` — a score with a denominator is a measurement, not a claim. */
export function rankOf(modelId: string, benchmarkId: string): Rank | null {
  const rows = board(benchmarkId);
  const hit = rows.find((r) => r.model.id === modelId);
  if (!hit) return null;
  return {
    rank: hit.rank,
    of: hit.of,
    tied: hit.tied,
    value: hit.score.value,
    score: hit.score,
  };
}

/**
 * Every benchmark in the catalog, in preferred order. Driven by `BENCHMARKS`
 * rather than a fixed list, so a new board added by the daily pipeline appears
 * on the homepage, the benchmarks index, every model dossier and the compare
 * table without a code change.
 */
export function benchmarksWithScores(): Benchmark[] {
  const rank = (id: string) => {
    const i = BOARD_ORDER_HINT.indexOf(id);
    return i === -1 ? BOARD_ORDER_HINT.length : i;
  };
  return [...BENCHMARKS].sort((a, b) => rank(a.id) - rank(b.id) || a.name.localeCompare(b.name));
}

/** Labs that actually have a row in the catalog, ordered by best AA score. */
export function labsPresent(): { id: LabId; label: string }[] {
  const seen = new Map<LabId, string>();
  for (const model of MODELS) {
    if (!seen.has(model.lab)) seen.set(model.lab, model.labName);
  }
  const best = new Map<LabId, number>();
  for (const row of board("aa-intelligence")) {
    const current = best.get(row.model.lab);
    if (current == null || row.score.value > current) best.set(row.model.lab, row.score.value);
  }
  return [...seen.entries()]
    .map(([id, label]) => ({ id, label }))
    .sort(
      (a, b) =>
        (best.get(b.id) ?? -1) - (best.get(a.id) ?? -1) ||
        a.label.localeCompare(b.label) ||
        a.id.localeCompare(b.id),
    );
}

/** Average of input and output list price per 1M tokens. Ridge's price proxy. */
export function midPrice(model: Model, mode: PriceMode = "promo"): number | null {
  const promoLive =
    mode === "promo" &&
    model.promoPricing &&
    (!model.promoPricing.until || model.promoPricing.until >= SNAPSHOT_DATE)
      ? model.promoPricing
      : null;
  const price = promoLive ?? model.pricing;
  if (!price) return null;
  return (price.inputPerM + price.outputPerM) / 2;
}

export function promoIsLive(model: Model): boolean {
  return Boolean(
    model.promoPricing && (!model.promoPricing.until || model.promoPricing.until >= SNAPSHOT_DATE),
  );
}

export interface ScatterPoint {
  model: Model;
  /** Mid price per 1M tokens. */
  x: number;
  /** AA Intelligence Index v4.2. */
  y: number;
  dollarPerAa: number;
  /** On the cost/score Pareto frontier: nothing is both cheaper and smarter. */
  frontier: boolean;
}

/**
 * Price against AA Index for every model that has both. A point is on the
 * frontier when no other point is cheaper *and* at least as high-scoring.
 */
export function scatter(mode: PriceMode = "promo"): ScatterPoint[] {
  const points = board("aa-intelligence")
    .map((row) => {
      const x = midPrice(row.model, mode);
      if (x == null) return null;
      const dpa = listDollarPerAa(row.model, row.score.value, mode);
      if (dpa == null) return null;
      return { model: row.model, x, y: row.score.value, dollarPerAa: dpa, frontier: false };
    })
    .filter((p): p is ScatterPoint => p !== null);

  for (const p of points) {
    p.frontier = !points.some(
      (q) => q !== p && q.x <= p.x && q.y >= p.y && (q.x < p.x || q.y > p.y),
    );
  }
  return points.sort((a, b) => a.x - b.x);
}

export interface TimelinePoint {
  model: Model;
  released: string;
  /** ms epoch, for plotting. */
  t: number;
  aa: number;
  /** True when this model set a new high among everything released up to its date. */
  setsHigh: boolean;
}

/**
 * Release date against the *current* v4.2 score — one ruler, no back-dated
 * numbers. Ridge has no historical index series, so this is deliberately not
 * a "score over time" chart and must not be labeled as one.
 */
export function timeline(): TimelinePoint[] {
  const points = board("aa-intelligence")
    .map((row) => ({
      model: row.model,
      released: row.model.released,
      t: Date.parse(`${row.model.released}T00:00:00Z`),
      aa: row.score.value,
      setsHigh: false,
    }))
    .filter((p) => Number.isFinite(p.t))
    .sort((a, b) => a.t - b.t);

  let high = -Infinity;
  for (const p of points) {
    if (p.aa > high) {
      p.setsHigh = true;
      high = p.aa;
    }
  }
  return points;
}

export interface LabStat {
  lab: LabId;
  name: string;
  models: Model[];
  scored: number;
  bestAa: BoardRow | null;
  cheapestPerAa: { model: Model; dollarPerAa: number } | null;
  openWeights: number;
}

export function labStats(mode: PriceMode = "promo"): LabStat[] {
  const aa = board("aa-intelligence");
  const byLab = new Map<LabId, Model[]>();
  for (const model of MODELS) {
    const list = byLab.get(model.lab) ?? [];
    list.push(model);
    byLab.set(model.lab, list);
  }

  return [...byLab.entries()]
    .map(([lab, models]) => {
      const rows = aa.filter((r) => r.model.lab === lab);
      const priced = models
        .map((model) => {
          const rank = rankOf(model.id, "aa-intelligence");
          if (!rank) return null;
          const dpa = listDollarPerAa(model, rank.value, mode);
          return dpa == null ? null : { model, dollarPerAa: dpa };
        })
        .filter((p): p is { model: Model; dollarPerAa: number } => p !== null)
        .sort((a, b) => a.dollarPerAa - b.dollarPerAa);

      return {
        lab,
        name: models[0]?.labName ?? lab,
        models: [...models].sort((a, b) => b.released.localeCompare(a.released)),
        scored: rows.length,
        bestAa: rows[0] ?? null,
        cheapestPerAa: priced[0] ?? null,
        openWeights: models.filter((m) => m.license === "open-weight").length,
      };
    })
    .sort((a, b) => (b.bestAa?.score.value ?? -1) - (a.bestAa?.score.value ?? -1));
}

export interface Fact {
  text: string;
  /** Which benchmark or field this came from, for the source line. */
  source?: { name: string; url: string; asOf: string };
}

export interface Dossier {
  model: Model;
  scores: { benchmark: Benchmark; rank: Rank }[];
  missing: Benchmark[];
  aa: Rank | null;
  dollarPerAa: number | null;
  dollarPerAaRank: { rank: number; of: number; tied: boolean } | null;
  midPrice: number | null;
  priceRank: { rank: number; of: number } | null;
  strengths: Fact[];
  watch: Fact[];
  supersededBy: Model[];
  siblings: Model[];
  news: typeof NEWS;
  wire: typeof WIRE;
  changelog: { date: string; title: string; items: string[] }[];
}

/**
 * Everything a model page needs, derived live. Strengths and watch-items are
 * computed from the catalog rather than written by hand, so they cannot go
 * stale behind a scrape.
 */
export function dossier(modelId: string, mode: PriceMode = "promo"): Dossier | null {
  const model = getModel(modelId);
  if (!model) return null;

  const scores: { benchmark: Benchmark; rank: Rank }[] = [];
  const missing: Benchmark[] = [];
  for (const benchmark of benchmarksWithScores()) {
    const rank = rankOf(model.id, benchmark.id);
    if (rank) scores.push({ benchmark, rank });
    else missing.push(benchmark);
  }

  const aa = rankOf(model.id, "aa-intelligence");
  const dpa = aa ? listDollarPerAa(model, aa.value, mode) : null;

  const allDpa = scatter(mode);
  const mine = allDpa.find((p) => p.model.id === model.id) ?? null;
  const dollarPerAaRank = mine
    ? {
        rank: allDpa.filter((p) => p.dollarPerAa < mine.dollarPerAa).length + 1,
        of: allDpa.length,
        tied: allDpa.filter((p) => p.dollarPerAa === mine.dollarPerAa).length > 1,
      }
    : null;

  const mid = midPrice(model, mode);
  const pricedMids = MODELS.map((m) => midPrice(m, mode)).filter((v): v is number => v != null);
  const priceRank =
    mid == null
      ? null
      : {
          rank: pricedMids.filter((v) => v < mid).length + 1,
          of: pricedMids.length,
        };

  const strengths: Fact[] = [];
  const watch: Fact[] = [];

  for (const { benchmark, rank } of scores) {
    if (rank.rank <= 3) {
      strengths.push({
        text: `${rank.tied ? "Joint " : ""}#${rank.rank} of ${rank.of} on ${benchmark.name} — ${formatValue(benchmark, rank.value)}`,
        source: {
          name: rank.score.sourceName,
          url: rank.score.sourceUrl,
          asOf: rank.score.asOf,
        },
      });
    }
  }

  if (model.license === "open-weight") {
    strengths.push({ text: "Open weights — runnable outside the vendor API." });
  }
  if (dollarPerAaRank && dollarPerAaRank.rank <= 3) {
    strengths.push({
      text: `${dollarPerAaRank.tied ? "Joint " : ""}#${dollarPerAaRank.rank} of ${dollarPerAaRank.of} on $/AA — ${dpa != null ? `$${dpa.toFixed(2)}` : "—"} per index point`,
    });
  }
  if (model.contextTokens && model.contextTokens >= 1_000_000) {
    strengths.push({
      text: `${Math.round(model.contextTokens / 1_000_000)}M-token context window`,
    });
  }
  if (promoIsLive(model) && model.promoPricing) {
    strengths.push({
      text: `Promo pricing ${moneyPair(model.promoPricing.inputPerM, model.promoPricing.outputPerM)} through ${model.promoPricing.until}`,
    });
  }

  for (const benchmark of missing) {
    watch.push({
      text: `No ${benchmark.short} row in this snapshot — Ridge leaves it blank rather than estimating.`,
    });
  }
  if (model.status === "partner") {
    watch.push({
      text: "Partner preview — not the public API default. Cite the status with the number.",
    });
  }
  if (model.status === "preview") {
    watch.push({ text: "Preview access — the public row may move when it reaches GA." });
  }
  if (promoIsLive(model) && model.promoPricing && model.pricing) {
    watch.push({
      text: `Promo ends ${model.promoPricing.until}; list reverts to ${moneyPair(model.pricing.inputPerM, model.pricing.outputPerM)}.`,
    });
  }
  if (priceRank && mid != null && priceRank.rank > priceRank.of * 0.75) {
    watch.push({
      text: `Top-quartile price on this board — $${mid.toFixed(2)} per 1M at the midpoint.`,
    });
  }

  const supersededBy = aa
    ? MODELS.filter((m) => {
        if (m.lab !== model.lab || m.id === model.id) return false;
        if (m.released <= model.released) return false;
        const other = rankOf(m.id, "aa-intelligence");
        return Boolean(other && other.value > aa.value);
      }).sort((a, b) => b.released.localeCompare(a.released))
    : [];
  for (const newer of supersededBy) {
    watch.push({
      text: `${newer.labName} has since shipped ${newer.name}, which scores higher on the AA board.`,
    });
  }

  return {
    model,
    scores,
    missing,
    aa,
    dollarPerAa: dpa,
    dollarPerAaRank,
    midPrice: mid,
    priceRank,
    strengths,
    watch,
    supersededBy,
    siblings: MODELS.filter((m) => m.lab === model.lab && m.id !== model.id).sort((a, b) =>
      b.released.localeCompare(a.released),
    ),
    news: NEWS.filter((n) => n.models.includes(model.id)),
    wire: WIRE.filter((w) => w.models.includes(model.id)),
    changelog: CHANGELOG.filter(
      (entry) => entry.items.some((item) => mentions(item, model)) || mentions(entry.title, model),
    ),
  };
}

function mentions(text: string, model: Model): boolean {
  const hay = text.toLowerCase();
  if (hay.includes(model.id.toLowerCase())) return true;
  if (hay.includes(model.shortName.toLowerCase())) return true;
  return model.aliases.some((alias) => hay.includes(alias.toLowerCase()));
}

/**
 * Prices with consistent decimals. The catalog stores 0.3 and 1.2 as plain
 * numbers, which render as "$0.3 / $1.2" — ragged decimals in a money column
 * are the classic tell of a table nobody proofread. Whole dollars stay whole.
 */
export function money(value: number): string {
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

/** "$10 / $50" — input over output, per 1M tokens. */
export function moneyPair(input: number, output: number): string {
  return `${money(input)} / ${money(output)}`;
}

export function formatValue(benchmark: Benchmark, value: number): string {
  if (benchmark.unit === "percent") return `${value}%`;
  if (benchmark.unit === "elo") return value.toLocaleString();
  return String(value);
}

export interface Coverage {
  benchmark: Benchmark;
  scored: number;
  total: number;
}

/** How much of the catalog each benchmark actually covers. Honesty module. */
export function coverage(): Coverage[] {
  return benchmarksWithScores().map((benchmark) => ({
    benchmark,
    scored: SCORES.filter((s) => s.benchmarkId === benchmark.id).length,
    total: MODELS.length,
  }));
}

export interface Headline {
  label: string;
  model: Model | null;
  value: string;
  sub: string;
}

/** The four cards above the board. Each answers "which model should I use". */
export function headlines(mode: PriceMode = "promo"): Headline[] {
  const aa = board("aa-intelligence");
  const top = aa[0] ?? null;

  const value =
    scatter(mode)
      .filter((p) => p.frontier)
      .sort((a, b) => a.dollarPerAa - b.dollarPerAa)[0] ?? null;

  const open = aa.find((r) => r.model.license === "open-weight") ?? null;

  const newest = [...MODELS].sort((a, b) => b.released.localeCompare(a.released))[0] ?? null;
  const newestRank = newest ? rankOf(newest.id, "aa-intelligence") : null;

  return [
    {
      label: "Intelligence",
      model: top?.model ?? null,
      value: top ? String(top.score.value) : "—",
      sub: top ? `AA Index v4.2 · ${top.tied ? "joint " : ""}#1 of ${top.of}` : "No scored row",
    },
    {
      label: "Best value",
      model: value?.model ?? null,
      value: value ? `$${value.dollarPerAa.toFixed(2)}` : "—",
      sub: value ? "Per AA index point · on the frontier" : "No priced row",
    },
    {
      label: "Open weights",
      model: open?.model ?? null,
      value: open ? String(open.score.value) : "—",
      sub: open
        ? `Highest open-weight AA · ${open.tied ? "joint " : ""}#${open.rank} of ${open.of}`
        : "No scored row",
    },
    {
      label: "Newest entry",
      model: newest,
      value: newestRank ? String(newestRank.value) : "—",
      sub: newest ? `Released ${newest.released}` : "—",
    },
  ];
}

export interface SearchEntry {
  id: string;
  kind: "model" | "news" | "benchmark" | "lab" | "page";
  title: string;
  sub: string;
  to: string;
  keywords: string;
}

/** Flat index for the command palette. */
export function searchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  for (const model of MODELS) {
    const aa = rankOf(model.id, "aa-intelligence");
    entries.push({
      id: `model:${model.id}`,
      kind: "model",
      title: model.name,
      sub: aa
        ? `${model.labName} · AA ${aa.value} · ${aa.tied ? "tied for #" : "#"}${aa.rank} of ${aa.of}`
        : `${model.labName} · unscored`,
      to: `/models/${model.id}`,
      keywords: [model.id, model.shortName, model.labName, ...model.aliases].join(" "),
    });
  }
  for (const item of NEWS) {
    entries.push({
      id: `news:${item.id}`,
      kind: "news",
      title: item.title,
      sub: `Desk · ${item.date}`,
      to: `/news/${item.id}`,
      keywords: [item.kind, ...item.tags, item.dek].join(" "),
    });
  }
  for (const benchmark of benchmarksWithScores()) {
    entries.push({
      id: `bench:${benchmark.id}`,
      kind: "benchmark",
      title: benchmark.name,
      sub: `${benchmark.sourceName} · as of ${benchmark.asOf}`,
      to: `/benchmarks/${benchmark.id}`,
      keywords: [benchmark.short, benchmark.category, benchmark.sourceName].join(" "),
    });
  }
  for (const lab of labStats()) {
    entries.push({
      id: `lab:${lab.lab}`,
      kind: "lab",
      title: lab.name,
      sub: `${lab.models.length} model${lab.models.length === 1 ? "" : "s"} on the ledger`,
      to: `/labs/${lab.lab}`,
      keywords: lab.models.map((m) => m.shortName).join(" "),
    });
  }
  for (const page of [
    { title: "Ledger", to: "/", sub: "The full board" },
    { title: "Models", to: "/models", sub: "Every row in the catalog" },
    { title: "Compare", to: "/compare", sub: "Two to four models, side by side" },
    { title: "Benchmarks", to: "/benchmarks", sub: "What each index measures" },
    { title: "News", to: "/news", sub: "Wire and Ridge desk" },
    { title: "Methodology", to: "/methodology", sub: "How the ledger is built" },
    { title: "Changelog", to: "/changelog", sub: "Every cut since the seed" },
    { title: "API", to: "/api", sub: "Machine-readable endpoints" },
  ]) {
    entries.push({
      id: `page:${page.to}`,
      kind: "page",
      title: page.title,
      sub: page.sub,
      to: page.to,
      keywords: page.title,
    });
  }
  return entries;
}

export interface CompareValue {
  text: string | null;
  number: number | null;
  /** Bar length among the selected set, high-is-better rows only. */
  share: number | null;
  /** Signed gap versus the leader of this row. Null on the leader, a tie, or a blank. */
  delta: string | null;
  rank: Rank | null;
  hint: string | null;
  best: boolean;
}

export interface CompareRow {
  id: string;
  label: string;
  kind: "score" | "money" | "text";
  section: "boards" | "cost" | "access";
  note?: string;
  sourceUrl?: string;
  cells: CompareValue[];
}

const MAX_COMPARE = 4;

export function compare(
  ids: string[],
  mode: PriceMode = "promo",
): {
  models: Model[];
  rows: CompareRow[];
} {
  const models = ids
    .slice(0, MAX_COMPARE)
    .map((id) => getModel(id))
    .filter((m): m is Model => Boolean(m));
  if (models.length === 0) return { models: [], rows: [] };

  const rows: CompareRow[] = [];

  for (const benchmark of benchmarksWithScores()) {
    const ranks = models.map((m) => rankOf(m.id, benchmark.id));
    rows.push(
      finishRow(
        {
          id: benchmark.id,
          label: benchmark.short,
          kind: "score",
          section: "boards",
          note: `${benchmark.sourceName} · as of ${benchmark.asOf}`,
          sourceUrl: benchmark.sourceUrl,
          cells: ranks.map((r) => ({
            text: r ? formatValue(benchmark, r.value) : null,
            number: r?.value ?? null,
            share: null,
            delta: null,
            rank: r,
            hint: r?.score.note ?? null,
            best: false,
          })),
        },
        "high",
        "score",
      ),
    );
  }

  rows.push(
    finishRow(
      {
        id: "price",
        label: "Price in / out per 1M",
        kind: "money",
        section: "cost",
        cells: models.map((m) => {
          const promo = mode === "promo" && promoIsLive(m) ? m.promoPricing! : m.pricing;
          return {
            text: promo ? moneyPair(promo.inputPerM, promo.outputPerM) : null,
            number: midPrice(m, mode),
            share: null,
            delta: null,
            rank: null,
            hint: mode === "promo" && promoIsLive(m) ? `Promo through ${m.promoPricing!.until}` : null,
            best: false,
          };
        }),
      },
      "low",
      "money",
    ),
  );

  rows.push(
    finishRow(
      {
        id: "dpa",
        label: "$ per AA point",
        kind: "money",
        section: "cost",
        note: "Ridge proxy: list mid-price ÷ AA Index. Not AA cost-per-task.",
        cells: models.map((m) => {
          const aa = rankOf(m.id, "aa-intelligence");
          const dpa = aa ? listDollarPerAa(m, aa.value, mode) : null;
          return {
            text: dpa == null ? null : `$${dpa.toFixed(2)}`,
            number: dpa,
            share: null,
            delta: null,
            rank: null,
            hint: null,
            best: false,
          };
        }),
      },
      "low",
      "money",
    ),
  );

  rows.push(
    finishRow(
      {
        id: "context",
        label: "Context window",
        kind: "text",
        section: "cost",
        cells: models.map((m) => ({
          text: m.contextTokens ? formatContext(m.contextTokens) : null,
          number: m.contextTokens,
          share: null,
          delta: null,
          rank: null,
          hint: m.contextTokens ? `${m.contextTokens.toLocaleString()} tokens` : null,
          best: false,
        })),
      },
      "high",
      "tokens",
    ),
  );

  if (models.some((m) => m.publicOpinionStars != null)) {
    rows.push(
      finishRow(
        {
          id: "opinion",
          label: "Public opinion",
          kind: "text",
          section: "access",
          note: "Sourced stars only. Blank means Ridge has not published a scrape for that row.",
          cells: models.map((m) => ({
            text: m.publicOpinionStars != null ? `${m.publicOpinionStars} / 5` : null,
            number: m.publicOpinionStars ?? null,
            share: null,
            delta: null,
            rank: null,
            hint: m.publicOpinionAsOf ? `as of ${m.publicOpinionAsOf}` : null,
            best: false,
          })),
        },
        "high",
        null,
      ),
    );
  }

  rows.push({
    id: "weights",
    label: "Weights",
    kind: "text",
    section: "access",
    cells: models.map((m) => ({
      text: m.license === "open-weight" ? "Open" : "Closed",
      number: null,
      share: null,
      delta: null,
      rank: null,
      hint: null,
      best: false,
    })),
  });

  rows.push({
    id: "access",
    label: "Access",
    kind: "text",
    section: "access",
    cells: models.map((m) => ({
      text: m.status === "ga" ? "GA" : m.status === "preview" ? "Preview" : m.status === "partner" ? "Partner" : "Promo",
      number: null,
      share: null,
      delta: null,
      rank: null,
      hint: null,
      best: false,
    })),
  });

  rows.push(
    finishRow(
      {
        id: "released",
        label: "Released",
        kind: "text",
        section: "access",
        cells: models.map((m) => ({
          text: m.released,
          number: Date.parse(`${m.released}T00:00:00Z`),
          share: null,
          delta: null,
          rank: null,
          hint: null,
          best: false,
        })),
      },
      "high",
      null,
    ),
  );

  return { models, rows };
}

function finishRow(
  row: CompareRow,
  dir: "high" | "low",
  format: "score" | "money" | "tokens" | null,
): CompareRow {
  const numbers = row.cells.map((c) => c.number);
  const winner = bestIndex(numbers, dir);
  const defined = numbers.filter((n): n is number => n != null);
  const leader = defined.length
    ? dir === "low"
      ? Math.min(...defined)
      : Math.max(...defined)
    : null;
  return {
    ...row,
    cells: row.cells.map((cell, i) => ({
      ...cell,
      best: winner === i,
      share:
        dir === "high" && cell.number != null && leader != null && leader !== 0
          ? Math.max(0.04, cell.number / leader)
          : null,
      delta:
        format === "tokens" &&
        cell.number != null &&
        leader != null &&
        formatContext(cell.number) === formatContext(leader)
          ? null
          : format
            ? deltaText(cell.number, leader, format)
            : null,
    })),
  };
}

function deltaText(
  value: number | null,
  leader: number | null,
  format: "score" | "money" | "tokens",
): string | null {
  if (value == null || leader == null || value === leader) return null;
  const diff = value - leader;
  const sign = diff > 0 ? "+" : "−";
  const mag = Math.abs(diff);
  if (format === "money") return `${sign}${money(mag)}`;
  if (format === "tokens") return `${sign}${formatContext(mag)}`;
  const shown = Number.isInteger(mag) ? String(mag) : mag.toFixed(1).replace(/\.0$/, "");
  return `${sign}${shown}`;
}

/**
 * Catalog-driven starting sets. A fifth model on the AA board, a cheaper $/AA
 * seat, or a new open-weight row reshapes these without a code change.
 */
export function comparePresets(): { id: string; label: string; sub: string; ids: string[] }[] {
  const aa = board("aa-intelligence");
  const top: string[] = [];
  for (const row of aa) {
    if (top.length === 0) {
      top.push(row.model.id);
      continue;
    }
    const firstRank = aa.find((r) => r.model.id === top[0])?.rank ?? 1;
    if (row.rank === firstRank) {
      top.push(row.model.id);
      continue;
    }
    if (top.length < 2) top.push(row.model.id);
    break;
  }

  const value = ledgerRows()
    .filter((row) => row.dollarPerAa != null)
    .sort((a, b) => a.dollarPerAa! - b.dollarPerAa!)
    .slice(0, 3)
    .map((row) => row.model.id);

  const open = MODELS.filter((m) => m.license === "open-weight")
    .slice(0, 4)
    .map((m) => m.id);

  const out: { id: string; label: string; sub: string; ids: string[] }[] = [];
  if (top.length >= 2) {
    out.push({
      id: "top",
      label: "Top of the board",
      sub: "Headline AA ranks, including ties",
      ids: top.slice(0, MAX_COMPARE),
    });
  }
  if (value.length >= 2) {
    out.push({
      id: "value",
      label: "Value seats",
      sub: "Lowest $ per AA point on this snapshot",
      ids: value,
    });
  }
  if (open.length >= 2) {
    out.push({
      id: "open",
      label: "Open weights",
      sub: "Every open-weight row, scored or not",
      ids: open,
    });
  }
  return out;
}

/**
 * Short sourced sentences about who leads each row. Ties are named as ties.
 * Never picks a "winner" of the comparison as a whole.
 */
export function compareLeads(ids: string[], mode: PriceMode = "promo"): string[] {
  const { models, rows } = compare(ids, mode);
  if (models.length < 2) return [];
  const out: string[] = [];

  for (const row of rows) {
    const named = row.cells
      .map((cell, i) => ({ cell, model: models[i] }))
      .filter((x) => x.cell.number != null);
    if (named.length < 2) continue;

    const winners = named.filter((x) => x.cell.best);
    if (winners.length === 1) {
      const w = winners[0];
      if (row.kind === "score") {
        const rank = w.cell.rank
          ? ` (${w.cell.rank.tied ? "tied for #" : "#"}${w.cell.rank.rank} of ${w.cell.rank.of})`
          : "";
        out.push(`${w.model.name} leads ${row.label} at ${w.cell.text}${rank}.`);
      } else if (row.id === "dpa") {
        out.push(`${w.model.name} is cheapest per AA point at ${w.cell.text}.`);
      } else if (row.id === "price") {
        out.push(`${w.model.name} has the lowest mid-price at ${w.cell.text}.`);
      } else if (row.id === "context") {
        if (named.every((x) => x.cell.text === w.cell.text)) continue;
        out.push(`${w.model.name} has the widest context window (${w.cell.text}).`);
      }
    } else if (winners.length === 0 && row.kind === "score") {
      const nums = named.map((x) => x.cell.number!);
      const peak = Math.max(...nums);
      const tied = named.filter((x) => x.cell.number === peak);
      if (tied.length >= 2) {
        const names = tied.map((t) => t.model.shortName).join(" and ");
        out.push(`${names} tie on ${row.label} at ${tied[0].cell.text}.`);
      }
    }
    if (out.length >= 4) break;
  }
  return out;
}

function bestIndex(values: (number | null)[], dir: "high" | "low"): number | null {
  let best: number | null = null;
  let bestValue: number | null = null;
  let ties = 0;
  values.forEach((value, i) => {
    if (value == null) return;
    if (bestValue == null || (dir === "high" ? value > bestValue : value < bestValue)) {
      bestValue = value;
      best = i;
      ties = 1;
    } else if (value === bestValue) {
      ties += 1;
    }
  });
  return ties === 1 ? best : null;
}

/**
 * The board Ridge ranks by. Everything else is a corroborating cut.
 *
 * This is the one benchmark id the UI knows by name, because the site's whole
 * ordering is "ranked by the AA Intelligence Index". Every *other* benchmark is
 * discovered from the catalog.
 */
export const HEADLINE_BENCHMARK = "aa-intelligence";

export interface Row {
  model: Model;
  /** Null when the headline board has not published a row for this model. */
  rank: number | null;
  of: number;
  tied: boolean;
  /** benchmarkId → score, present only where a publisher has one. */
  scores: Record<string, Score>;
  /** Headline score's share of the top score, 0–1. Bar length only. */
  headlineShare: number;
  dollarPerAa: number | null;
  midPrice: number | null;
  priceIn: number | null;
  priceOut: number | null;
  promo: boolean;
}

/**
 * Every model in the catalog, not just the scored ones.
 *
 * `buildLedger` in ledger.ts drives the public JSON/CSV contract and only walks
 * the AA rows, so it is left alone. The site shows the whole catalog because
 * the empty cells are the point: a model with no independent score is a fact
 * about the benchmark landscape, not a gap to be hidden.
 */
export function ledgerRows(mode: PriceMode = "promo"): Row[] {
  const ranked = board(HEADLINE_BENCHMARK);
  const byId = new Map(ranked.map((r) => [r.model.id, r]));

  const rows: Row[] = MODELS.map((model) => {
    // Every benchmark the catalog holds, not a fixed four.
    const scores: Record<string, Score> = {};
    for (const score of SCORES) {
      if (score.modelId === model.id) scores[score.benchmarkId] = score;
    }
    const headline = byId.get(model.id) ?? null;
    const aa = scores[HEADLINE_BENCHMARK] ?? null;

    return {
      model,
      rank: headline?.rank ?? null,
      of: ranked.length,
      tied: headline?.tied ?? false,
      scores,
      headlineShare: headline?.share ?? 0,
      dollarPerAa: aa ? listDollarPerAa(model, aa.value, mode) : null,
      midPrice: midPrice(model, mode),
      priceIn: activePrice(model, mode)?.inputPerM ?? null,
      priceOut: activePrice(model, mode)?.outputPerM ?? null,
      promo: mode === "promo" && promoIsLive(model),
    };
  });

  return rows.sort((a, b) => {
    if (a.rank != null && b.rank != null) return a.rank - b.rank;
    if (a.rank != null) return -1;
    if (b.rank != null) return 1;
    return b.model.released.localeCompare(a.model.released);
  });
}

function activePrice(model: Model, mode: PriceMode) {
  if (mode === "promo" && promoIsLive(model)) return model.promoPricing!;
  return model.pricing;
}

/** Models with no score on any tracked benchmark — the "refused to fake" list. */
export function unscoredModels(): Model[] {
  return MODELS.filter((model) => !SCORES.some((s) => s.modelId === model.id));
}

export const CATALOG_STATS = {
  get models() {
    return MODELS.length;
  },
  get scored() {
    return new Set(SCORES.map((s) => s.modelId)).size;
  },
  get benchmarks() {
    return BENCHMARKS.length;
  },
  get labs() {
    return new Set(MODELS.map((m) => m.lab)).size;
  },
  get sources() {
    return new Set(SCORES.map((s) => s.sourceUrl)).size;
  },
};
