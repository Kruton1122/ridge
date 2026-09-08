export type LabId =
  | "anthropic"
  | "openai"
  | "xai"
  | "google"
  | "moonshot"
  | "deepseek"
  | "zhipu"
  | "alibaba"
  | "meta"
  | "other";

export type License = "proprietary" | "open-weight";
export type AccessStatus = "ga" | "preview" | "partner" | "promo";

export interface Model {
  id: string;
  name: string;
  shortName: string;
  lab: LabId;
  labName: string;
  released: string;
  contextTokens: number | null;
  pricing: { inputPerM: number; outputPerM: number } | null;
  license: License;
  status: AccessStatus;
  promoPricing?: { inputPerM: number; outputPerM: number; until: string } | null;
  aliases: string[];
  summary: string;
}

export interface Benchmark {
  id: string;
  name: string;
  short: string;
  category: string;
  unit: "index" | "percent" | "elo";
  higherIsBetter: boolean;
  description: string;
  sourceName: string;
  sourceUrl: string;
  asOf: string;
}

export interface Score {
  modelId: string;
  benchmarkId: string;
  value: number;
  sourceName: string;
  sourceUrl: string;
  asOf: string;
  note?: string;
  harness?: string;
}

export interface NewsItem {
  id: string;
  kind: "release" | "ranking" | "rumor" | "policy" | "controversy";
  title: string;
  dek: string;
  summary: string;
  pull?: string;
  body: string[];
  date: string;
  sourceName: string;
  sourceUrl: string;
  models: string[];
  tags: string[];
}

export interface CatalogView {
  models: Model[];
  scores: Score[];
}

export interface SourcePull {
  id: string;
  name: string;
  url: string;
  ok: boolean;
  rows: number;
  error?: string;
}

export interface LiveMeta {
  seedDate: string;
  pulledAt: string | null;
  nextPullAt: string;
  staleAfterDays: number;
  usedLive: boolean;
  sources: SourcePull[];
}
