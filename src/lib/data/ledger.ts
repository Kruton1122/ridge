import {
  MODELS,
  SCHEMA_VERSION,
  SCORES,
  SNAPSHOT_DATE,
  formatContext,
  formatScore,
  getModel,
  scoreOf,
} from "./catalog";
import type { AccessStatus, LabId, Model } from "./types";

export const LEDGER_SOURCES = [
  { name: "Artificial Analysis", url: "https://artificialanalysis.ai/leaderboards/models" },
  { name: "LMArena / OpenLM", url: "https://openlm.ai/chatbot-arena/" },
  { name: "Vals AI", url: "https://vals.ai/benchmarks/swebench" },
  { name: "Cursor (CursorBench 4.0)", url: "https://cursor.com/cursorbench" },
];

export const NEXT_PULL_WEEKDAY = 1;
export const NEXT_PULL_HOUR_ET = 9;

export function nextPullIso(now = new Date()): string {
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const hours = et.getHours() + et.getMinutes() / 60;
  let add = (NEXT_PULL_WEEKDAY - day + 7) % 7;
  if (add === 0 && hours >= NEXT_PULL_HOUR_ET) add = 7;
  const next = new Date(et);
  next.setDate(et.getDate() + add);
  next.setHours(NEXT_PULL_HOUR_ET, 0, 0, 0);
  return next.toISOString();
}

export function nextPullLabel(now = new Date()): string {
  const iso = nextPullIso(now);
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    timeZone: "America/New_York",
  }) + " ET";
}

export function listDollarPerAa(
  model: Model,
  aa: number,
  mode: "list" | "promo",
): number | null {
  const price =
    mode === "promo" && model.promoPricing && (!model.promoPricing.until || model.promoPricing.until >= SNAPSHOT_DATE)
      ? model.promoPricing
      : model.pricing;
  if (!price || !aa) return null;
  return (price.inputPerM + price.outputPerM) / 2 / aa;
}

export function formatDollarPerAa(value: number | null): string {
  if (value == null) return "—";
  return `$${value.toFixed(2)}`;
}

export function statusLabel(status: AccessStatus): string {
  if (status === "ga") return "GA";
  if (status === "preview") return "Preview";
  if (status === "partner") return "Partner";
  return "Promo";
}

export interface LedgerRow {
  rank: number;
  id: string;
  name: string;
  shortName: string;
  lab: LabId;
  labName: string;
  license: Model["license"];
  status: AccessStatus;
  aa: number | null;
  aaNote?: string;
  swe: number | null;
  arena: number | null;
  dollarPerAa: number | null;
  priceIn: number | null;
  priceOut: number | null;
  promoIn: number | null;
  promoOut: number | null;
  promoUntil: string | null;
  context: number | null;
}

export function buildLedger(mode: "list" | "promo" = "promo"): LedgerRow[] {
  const aaRows = SCORES.filter((s) => s.benchmarkId === "aa-intelligence").sort(
    (a, b) => b.value - a.value,
  );
  return aaRows.map((row, i) => {
    const model = getModel(row.modelId)!;
    const swe = scoreOf(model.id, "swe-bench");
    const arena = scoreOf(model.id, "arena-elo");
    const promoLive =
      model.promoPricing && (!model.promoPricing.until || model.promoPricing.until >= SNAPSHOT_DATE)
        ? model.promoPricing
        : null;
    return {
      rank: i + 1,
      id: model.id,
      name: model.name,
      shortName: model.shortName,
      lab: model.lab,
      labName: model.labName,
      license: model.license,
      status: model.status,
      aa: row.value,
      aaNote: row.note,
      swe: swe?.value ?? null,
      arena: arena?.value ?? null,
      dollarPerAa: listDollarPerAa(model, row.value, mode),
      priceIn: model.pricing?.inputPerM ?? null,
      priceOut: model.pricing?.outputPerM ?? null,
      promoIn: promoLive?.inputPerM ?? null,
      promoOut: promoLive?.outputPerM ?? null,
      promoUntil: promoLive?.until ?? null,
      context: model.contextTokens,
    };
  });
}

export function ledgerPayload(mode: "list" | "promo" = "promo") {
  return {
    schemaVersion: SCHEMA_VERSION,
    last_updated: `${SNAPSHOT_DATE}T13:00:00-04:00`,
    index: "Artificial Analysis Intelligence Index v4.2",
    citation: "Cite the source URL and the as-of date.",
    sources: LEDGER_SOURCES,
    next_pull: nextPullIso(),
    priceMode: mode,
    rows: buildLedger(mode),
  };
}

export function ledgerCsv(mode: "list" | "promo" = "promo"): string {
  const payload = ledgerPayload(mode);
  const header = [
    "rank",
    "id",
    "name",
    "lab",
    "status",
    "license",
    "aa_v4_2",
    "swe",
    "arena",
    "dollar_per_aa",
    "price_in",
    "price_out",
    "context",
  ];
  const lines = [
    `# Ridge ledger last_updated=${payload.last_updated} index=${payload.index}`,
    `# sources=${LEDGER_SOURCES.map((s) => s.url).join(" ")}`,
    `# ${payload.citation}`,
    header.join(","),
    ...payload.rows.map((r) =>
      [
        r.rank,
        r.id,
        `"${r.name}"`,
        r.labName,
        r.status,
        r.license,
        r.aa ?? "",
        r.swe ?? "",
        r.arena ?? "",
        r.dollarPerAa != null ? r.dollarPerAa.toFixed(3) : "",
        r.priceIn ?? "",
        r.priceOut ?? "",
        r.context ?? "",
      ].join(","),
    ),
  ];
  return lines.join("\n") + "\n";
}

export function formatPricePair(model: Model, mode: "list" | "promo"): string {
  const promoLive =
    mode === "promo" &&
    model.promoPricing &&
    (!model.promoPricing.until || model.promoPricing.until >= SNAPSHOT_DATE);
  const price = promoLive ? model.promoPricing! : model.pricing;
  if (!price) return "—";
  return `$${price.inputPerM} / $${price.outputPerM}`;
}

export { formatContext, formatScore };
