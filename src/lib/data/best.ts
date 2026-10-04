import { MODELS, getBenchmark } from "./catalog";
import { board, formatValue, scatter, type BoardRow } from "./derived";
import type { Model } from "./types";

/**
 * "Best for…" picks. Every pick is the top of ONE published board (or one catalog spec),
 * never a blend Ridge made up. Ties name every co-leader. Thin coverage is said out loud.
 */
export interface PickRow {
  model: Model;
  value: string;
}

export interface Pick {
  id: string;
  label: string;
  question: string;
  leaders: PickRow[];
  /** Next distinct values after the leaders. */
  behind: PickRow[];
  /** Where the number comes from. */
  basis: string;
  sourceName: string;
  sourceUrl: string | null;
  asOf: string | null;
  href: string | null;
  measured: number;
  total: number;
  /** The publisher's note on the leading score (variant, refusals…). */
  leaderNote?: string;
  caveat?: string;
  /** The board hasn't measured most of today's top models, so its leader may be a default. */
  stale?: boolean;
}

const THIN = 0.5;
/** A board missing this many of the AA top five is too out of date for a "best" claim. */
const FRONT = 5;
const STALE_MISSING = 3;

/** Exact counts: labs quote 1,050,000 vs 1,048,576, which any rounding would call a tie. */
const ctx = (t: number | null) => (t ? t.toLocaleString("en-US") : "—");

function fromBoard(
  id: string,
  benchmarkId: string,
  label: string,
  question: string,
  filter: (r: BoardRow) => boolean = () => true,
  caveat?: string,
): Pick | null {
  const b = getBenchmark(benchmarkId);
  if (!b) return null;
  const all = board(benchmarkId);
  const rows = all.filter(filter);
  if (!rows.length) return null;
  const topV = rows[0].score.value;
  const leaders = rows.filter((r) => r.score.value === topV);
  const rest = rows.filter((r) => r.score.value !== topV).slice(0, 2);
  const thin = all.length / MODELS.length < THIN;
  const onBoard = new Set(all.map((r) => r.model.id));
  const front = board("aa-intelligence").slice(0, FRONT).map((r) => r.model);
  const missing = benchmarkId === "aa-intelligence" ? [] : front.filter((m) => !onBoard.has(m.id));
  const stale = missing.length >= STALE_MISSING;
  const names = missing.map((m) => m.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];
  const cav = [
    stale ? `Out of date: this board hasn't scored ${list}, from the current AA top ${FRONT}, so an older model leads by default.` : undefined,
    caveat,
    thin ? `Only ${all.length} of ${MODELS.length} catalogued models have a published score here, so an unmeasured model could beat it.` : undefined,
  ].filter(Boolean).join(" ");
  return {
    id,
    label,
    question,
    leaders: leaders.map((r) => ({ model: r.model, value: formatValue(b, r.score.value) })),
    behind: rest.map((r) => ({ model: r.model, value: formatValue(b, r.score.value) })),
    basis: b.name,
    sourceName: b.sourceName,
    sourceUrl: leaders[0].score.sourceUrl ?? b.sourceUrl,
    asOf: leaders[0].score.asOf ?? b.asOf,
    href: `/benchmarks/${b.id}`,
    measured: all.length,
    total: MODELS.length,
    leaderNote: leaders.length === 1 ? leaders[0].score.note : undefined,
    caveat: cav || undefined,
    stale,
  };
}

function bestValue(): Pick | null {
  const pts = scatter("promo").filter((p) => p.frontier).sort((a, b) => a.dollarPerAa - b.dollarPerAa);
  if (!pts.length) return null;
  const fmt = (v: number) => `$${v.toFixed(2)}`;
  const top = fmt(pts[0].dollarPerAa);
  const leaders = pts.filter((p) => fmt(p.dollarPerAa) === top);
  const aa = getBenchmark("aa-intelligence");
  return {
    id: "value",
    label: "Best value",
    question: "Most intelligence per dollar?",
    leaders: leaders.map((p) => ({ model: p.model, value: top })),
    behind: pts.filter((p) => fmt(p.dollarPerAa) !== top).slice(0, 2).map((p) => ({ model: p.model, value: fmt(p.dollarPerAa) })),
    basis: "$ per AA Index point, on the cost frontier",
    sourceName: "Ridge construction from list prices + AA Index",
    sourceUrl: null,
    asOf: aa?.asOf ?? null,
    href: "/methodology",
    measured: scatter("promo").length,
    total: MODELS.length,
    caveat: "Mid list price ÷ AA score. A shelf tag for sorting, not a forecast of your bill; output-heavy work costs more.",
  };
}

function longestContext(): Pick | null {
  const withCtx = MODELS.filter((m) => m.contextTokens).sort((a, b) => (b.contextTokens ?? 0) - (a.contextTokens ?? 0));
  if (!withCtx.length) return null;
  const top = withCtx[0].contextTokens;
  const leaders = withCtx.filter((m) => m.contextTokens === top);
  const rest: Model[] = [];
  for (const m of withCtx) {
    if (m.contextTokens === top) continue;
    if (rest.length && rest[rest.length - 1].contextTokens === m.contextTokens) continue;
    rest.push(m);
    if (rest.length === 2) break;
  }
  return {
    id: "context",
    label: "Longest memory",
    question: "Which can read the most at once?",
    leaders: leaders.map((m) => ({ model: m, value: ctx(m.contextTokens) })),
    behind: rest.map((m) => ({ model: m, value: ctx(m.contextTokens) })),
    basis: "Context window, in tokens",
    sourceName: "Each lab's published spec",
    sourceUrl: null,
    asOf: null,
    href: null,
    measured: withCtx.length,
    total: MODELS.length,
    caveat: "A spec, not a measurement: how well a model actually uses a long window isn't on any board Ridge reads.",
  };
}

export function bestPicks(): Pick[] {
  return [
    fromBoard("smartest", "aa-intelligence", "Smartest overall", "Which model is the smartest all-round?"),
    fromBoard("coding", "swe-bench", "Coding", "Which fixes real bugs in real code best?"),
    fromBoard("ide", "cursor-bench", "Coding in an editor", "Which handles messy multi-file work best?", undefined,
      "Cursor runs this board on its own harness, so it measures models as Cursor uses them."),
    fromBoard("agents", "terminal-bench", "Agents & terminal", "Which gets the most done on its own at a command line?"),
    fromBoard("cyber", "aa-cyber", "Cyber security", "Which finds and patches security bugs best?", undefined,
      "Several frontier models refuse a large share of these tasks on safety grounds, so a low score here often means “declined”, not “can’t”."),
    fromBoard("people", "arena-elo", "People's pick", "Which answers do people prefer, blind?"),
    fromBoard("open", "aa-intelligence", "Best open weights", "Smartest model you can download and run yourself?", (r) => r.model.license === "open-weight"),
    bestValue(),
    longestContext(),
  ].filter((p): p is Pick => p !== null);
}
