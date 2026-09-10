import type { Benchmark, Model, Score } from "./types";
export { NEWS, isFresh } from "./desk";

export const SNAPSHOT_DATE = "2026-09-10";
export const SNAPSHOT_LABEL = "10 September 2026";
export const SCHEMA_VERSION = "1.1.0";

export const LABS: Record<Model["lab"], { name: string; short: string; color: string }> = {
  anthropic: { name: "Anthropic", short: "Anthropic", color: "#D4A27F" },
  openai: { name: "OpenAI", short: "OpenAI", color: "#10A37F" },
  xai: { name: "xAI", short: "xAI", color: "#E8EAED" },
  google: { name: "Google DeepMind", short: "Google", color: "#4285F4" },
  moonshot: { name: "Moonshot AI", short: "Moonshot", color: "#007CFF" },
  deepseek: { name: "DeepSeek", short: "DeepSeek", color: "#4D6BFE" },
  zhipu: { name: "Zhipu AI", short: "Z.ai", color: "#3D7EFF" },
  alibaba: { name: "Alibaba", short: "Alibaba", color: "#FF6A00" },
  meta: { name: "Meta", short: "Meta", color: "#0081FB" },
  other: { name: "Other", short: "Other", color: "#8EA0B0" },
};

// publicOpinionStars / Note / AsOf ride through m({...}) when set.
// Leave them undefined for now — Ridge Bot / half-week routine fills them from Grok Build X scrapes. Do not invent.
function m(
  partial: Omit<Model, "status"> & { status?: Model["status"] },
): Model {
  return { status: "ga", promoPricing: null, ...partial };
}

export const MODELS: Model[] = [
  m({
    id: "claude-fable-5.1",
    name: "Claude Fable 5.1",
    shortName: "Fable 5.1",
    lab: "anthropic",
    labName: "Anthropic",
    released: "2026-09-01",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 10, outputPerM: 50 },
    license: "proprietary",
    aliases: ["fable 5.1", "claude-fable-5.1", "claude fable 5.1", "fable-5-1"],
    summary: "1 September refresh. Tied with Astra atop AA Intelligence Index at 53 (max with fallback, v4.2/v4.3 as of 8 Sept). Cache reads 75% cheaper than Fable 5.",
    publicOpinionStars: 4,
    publicOpinionNote: 'Practitioner daily driver / Opus-5 successor on coding and prose; credit burn and refusals block a clean 5. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "claude-opus-5",
    name: "Claude Opus 5",
    shortName: "Opus 5",
    lab: "anthropic",
    labName: "Anthropic",
    released: "2026-07-24",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 5, outputPerM: 25 },
    license: "proprietary",
    aliases: ["opus 5", "claude-opus-5", "claude opus 5"],
    summary: "Coding closer. AA Index 51 max (v4.2/v4.3 as of 8 Sept). Still the SWE-bench closer in the August Vals cut.",
    publicOpinionStars: 3,
    publicOpinionNote: 'Still a coding closer on paper; public affection has moved to Fable 5.1, and the writing-slop meme is sticky. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "claude-fable-5",
    name: "Claude Fable 5",
    shortName: "Fable 5",
    lab: "anthropic",
    labName: "Anthropic",
    released: "2026-06-09",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 10, outputPerM: 50 },
    license: "proprietary",
    aliases: ["fable 5", "claude-fable-5", "claude fable 5"],
    summary: "June Mythos-class model. AA Index 50 with fallback (as of 8 Sept). Succeeded by 5.1 on 1 September.",
  }),
  m({
    id: "muse-spark-1.3",
    name: "Muse Spark 1.3 xhigh",
    shortName: "Spark xhigh",
    lab: "meta",
    labName: "Meta",
    released: "2026-09-02",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 1.25, outputPerM: 4.25 },
    license: "proprietary",
    aliases: ["muse spark 1.3", "muse-spark-1.3", "spark 1.3", "spark 1.3 xhigh"],
    summary: "Public xhigh cut. AA Index 45 (as of 8 Sept). v4.1.1 was 61 — do not mix the rulers.",
    status: "ga",
    publicOpinionStars: 3,
    publicOpinionNote: 'OpenCode workhorse at a fraction of Fable/Astra cost; this week’s expert story is the Terminal-Bench 4.0 / benchmaxx fight, not a love wave. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "muse-spark-1.3-max",
    name: "Muse Spark 1.3 max",
    shortName: "Spark max",
    lab: "meta",
    labName: "Meta",
    released: "2026-09-02",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 1.25, outputPerM: 4.25 },
    license: "proprietary",
    aliases: ["spark 1.3 max", "muse-spark-1.3-max", "spark max"],
    summary: "Partner-preview max row. AA Index 48 (as of 8 Sept). v4.1.1 was 62. Not the public API default.",
    status: "partner",
  }),
  m({
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    shortName: "Astra",
    lab: "openai",
    labName: "OpenAI",
    released: "2026-09-03",
    contextTokens: 1_050_000,
    pricing: { inputPerM: 10, outputPerM: 50 },
    license: "proprietary",
    aliases: ["gpt-6", "gpt 6 astra", "astra", "gpt-6-astra", "gpt6 astra"],
    summary: "Shipped 3 September. AA Index 53 max — tied with Fable 5.1 on the live board (as of 8 Sept). $10 / $50, same sticker as Fable.",
    publicOpinionStars: 4,
    publicOpinionNote: 'Computer-use and 3D demos look like a step-change; quota burn and spiky failures are the other half of the conversation. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "gpt-5.6-sol",
    name: "GPT-5.6 Sol",
    shortName: "Sol",
    lab: "openai",
    labName: "OpenAI",
    released: "2026-07-09",
    contextTokens: null,
    pricing: { inputPerM: 5, outputPerM: 30 },
    license: "proprietary",
    aliases: ["sol", "gpt-5.6", "gpt 5.6 sol", "gpt-5.6-sol"],
    summary: "Previous OpenAI flagship. AA Index 47 max (as of 8 Sept). Astra is the new step on this board.",
    publicOpinionStars: 3,
    publicOpinionNote: 'Respectable leftover flagship; public talk is what Astra replaced, not a new verdict. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "grok-4.6",
    name: "Grok 4.6",
    shortName: "Grok 4.6",
    lab: "xai",
    labName: "xAI",
    released: "2026-08-12",
    contextTokens: 500_000,
    pricing: { inputPerM: 2, outputPerM: 6 },
    license: "proprietary",
    aliases: ["grok 4.6", "grok-4.6", "grok-4-6", "grok4.6"],
    summary: "AA Index 44 high (as of 8 Sept). Not Grok 4 (that older row is 46). $2 / $6.",
    publicOpinionStars: 3,
    publicOpinionNote: 'Price/speed and AutomationBench-AA #2; capability still read as a tier behind Astra/Fable, and eyes are already on 4.7. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "kimi-k3",
    name: "Kimi K3",
    shortName: "K3",
    lab: "moonshot",
    labName: "Moonshot AI",
    released: "2026-07-16",
    contextTokens: 1_048_576,
    pricing: { inputPerM: 3, outputPerM: 15 },
    license: "open-weight",
    aliases: ["kimi k3", "k3", "kimi-k3"],
    summary: "Open-weight on this board at 44 max (as of 8 Sept). Frontend/practitioner favorite.",
    publicOpinionStars: 4,
    publicOpinionNote: 'Practitioner favorite for frontend and cheap open-weight agents; not this week’s viral model. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "glm-5.3",
    name: "GLM-5.3",
    shortName: "GLM-5.3",
    lab: "zhipu",
    labName: "Zhipu AI",
    released: "2026-08-18",
    contextTokens: null,
    pricing: { inputPerM: 1.4, outputPerM: 4.4 },
    license: "open-weight",
    aliases: ["glm 5.3", "glm-5.3"],
    summary: "Open-weight AA Index 60 at max.",
  }),
  m({
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    shortName: "3.8 Flash",
    lab: "google",
    labName: "Google DeepMind",
    released: "2026-09-02",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 1.5, outputPerM: 7.5 },
    license: "proprietary",
    aliases: ["gemini 3.8", "3.8 flash", "gemini-3.8-flash", "gemini 3.8 flash"],
    summary: "Fourth Flash in four months. AA Index 41 high (as of 8 Sept). Intro $0.75 / $3.75 through 31 Dec, then $1.50 / $7.50.",
    status: "promo",
    promoPricing: { inputPerM: 0.75, outputPerM: 3.75, until: "2026-12-31" },
    publicOpinionStars: 3,
    publicOpinionNote: 'Fast cheap demo machine and Copilot budget seat; expert week was the Terminal-Bench 4.0 cliff, not a love wave. (Grok Build X, 2026-09-08)',
    publicOpinionAsOf: "2026-09-08",
  }),
  m({
    id: "qwen-3.8-max",
    name: "Qwen 3.8 Max",
    shortName: "Qwen 3.8",
    lab: "alibaba",
    labName: "Alibaba",
    released: "2026-07-01",
    contextTokens: null,
    pricing: { inputPerM: 2, outputPerM: 6 },
    license: "open-weight",
    aliases: ["qwen 3.8 max", "qwen3.8-max"],
    summary: "Alibaba Max. AA Index 58.",
  }),
  m({
    id: "gpt-5.6-terra",
    name: "GPT-5.6 Terra",
    shortName: "Terra",
    lab: "openai",
    labName: "OpenAI",
    released: "2026-07-09",
    contextTokens: null,
    pricing: null,
    license: "proprietary",
    aliases: ["terra", "gpt-5.6 terra"],
    summary: "Mid-tier 5.6. AA 57 max.",
  }),
  m({
    id: "gemini-3.7-flash",
    name: "Gemini 3.7 Flash",
    shortName: "3.7 Flash",
    lab: "google",
    labName: "Google DeepMind",
    released: "2026-08-13",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 0.75, outputPerM: 3.75 },
    license: "proprietary",
    aliases: ["gemini 3.7", "3.7 flash", "gemini-3.7-flash"],
    summary: "Preceded 3.8. AA 56 high. Still the speed cut.",
  }),
  m({
    id: "grok-4.5",
    name: "Grok 4.5",
    shortName: "Grok 4.5",
    lab: "xai",
    labName: "xAI",
    released: "2026-07-08",
    contextTokens: 500_000,
    pricing: { inputPerM: 2, outputPerM: 6 },
    license: "proprietary",
    aliases: ["grok 4.5", "grok-4.5"],
    summary: "Base for the 4.6 post-train. AA 56.",
  }),
  m({
    id: "claude-sonnet-5",
    name: "Claude Sonnet 5",
    shortName: "Sonnet 5",
    lab: "anthropic",
    labName: "Anthropic",
    released: "2026-06-30",
    contextTokens: 1_000_000,
    pricing: null,
    license: "proprietary",
    aliases: ["sonnet 5", "claude sonnet 5"],
    summary: "Workhorse Claude. AA 55.",
  }),
  m({
    id: "deepseek-v4.1-flash",
    name: "DeepSeek V4.1 Flash",
    shortName: "V4.1 Flash",
    lab: "deepseek",
    labName: "DeepSeek",
    released: "2026-09-10",
    contextTokens: 1_000_000,
    pricing: { inputPerM: 0.3, outputPerM: 1.2 },
    license: "open-weight",
    status: "ga",
    aliases: [
      "deepseek-flash",
      "deepseek flash",
      "v4.1 flash",
      "deepseek-v4.1-flash",
      "deepseek v4.1 flash",
      "deepseek-v4-flash",
      "deepseek-v4-flash-vision-exp",
    ],
    summary:
      "552B MoE (8B active in / 16B out), native multimodal, 1M context. API id deepseek-flash. List pair is peak cache-miss $0.30 / peak output $1.20 per 1M; off-peak is half; cache-hit peak $0.006 / off-peak $0.003 (API docs as of 2026-09-10). MIT weights on HF. No independent AA / Arena / Vals row yet.",
  }),
  m({
    id: "deepseek-v4-pro",
    name: "DeepSeek V4 Pro",
    shortName: "V4 Pro",
    lab: "deepseek",
    labName: "DeepSeek",
    released: "2026-08-13",
    contextTokens: null,
    pricing: { inputPerM: 1.32, outputPerM: 3.96 },
    license: "open-weight",
    aliases: ["deepseek v4", "v4 pro", "deepseek-v4-pro"],
    summary:
      "Open-weight coder. Vals SWE-bench 96.4 (as of 10 Sept). DeepSeek is phasing Pro: from 2026-09-14 04:00 UTC, deepseek-v4-pro routes to V4.1-Flash at Flash pricing until V4.1-Pro ships (API docs / launch note).",
  }),
  m({
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    shortName: "Luna",
    lab: "openai",
    labName: "OpenAI",
    released: "2026-07-09",
    contextTokens: null,
    pricing: { inputPerM: 0.2, outputPerM: 1.2 },
    license: "proprietary",
    aliases: ["luna", "gpt-5.6 luna"],
    summary: "Cheap 5.6 twin. Strong SWE-bench for pennies.",
  }),
  m({
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    shortName: "3.1 Pro",
    lab: "google",
    labName: "Google DeepMind",
    released: "2026-03-01",
    contextTokens: 1_000_000,
    pricing: null,
    license: "proprietary",
    aliases: ["gemini 3.1 pro"],
    summary: "Still the public Gemini Pro. 3.5 Pro remains unreleased.",
  }),
];

export const BENCHMARKS: Benchmark[] = [
  {
    id: "aa-intelligence",
    name: "AA Intelligence Index v4.2",
    short: "AA Index",
    category: "composite",
    unit: "index",
    higherIsBetter: true,
    description:
      "Artificial Analysis composite, rebased 4 September 2026 (v4.2: AA-Briefcase and GDP.pdf added, GPQA Diamond dropped). Not comparable 1:1 with August 60s-scale rows.",
    sourceName: "Artificial Analysis",
    sourceUrl: "https://artificialanalysis.ai/leaderboards/models",
    asOf: SNAPSHOT_DATE,
  },
  {
    id: "arena-elo",
    name: "Arena Elo",
    short: "Arena",
    category: "preference",
    unit: "elo",
    higherIsBetter: true,
    description: "OpenLM / Arena+ pairwise Elo.",
    sourceName: "Arena+",
    sourceUrl: "https://openlm.ai/chatbot-arena/",
    asOf: "2026-09-10",
  },
  {
    id: "swe-bench",
    name: "SWE-bench Verified",
    short: "SWE-bench",
    category: "coding",
    unit: "percent",
    higherIsBetter: true,
    description: "Resolved GitHub issues under Mini-SWE-agent on Vals.",
    sourceName: "Vals AI",
    sourceUrl: "https://vals.ai/benchmarks/swebench",
    asOf: "2026-09-10",
  },
  {
    id: "terminal-bench",
    name: "Terminal-Bench 2.1",
    short: "Term",
    category: "agents",
    unit: "percent",
    higherIsBetter: true,
    description: "Agentic terminal tasks.",
    sourceName: "Artificial Analysis",
    sourceUrl: "https://artificialanalysis.ai/leaderboards/models",
    asOf: SNAPSHOT_DATE,
  },
];

function s(
  modelId: string,
  benchmarkId: string,
  value: number,
  sourceName: string,
  sourceUrl: string,
  asOf: string,
  note?: string,
): Score {
  return { modelId, benchmarkId, value, sourceName, sourceUrl, asOf, note };
}

export const SCORES: Score[] = [
  s("claude-fable-5.1", "aa-intelligence", 53, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max with fallback"),
  s("gpt-6-astra", "aa-intelligence", 53, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max"),
  s("claude-opus-5", "aa-intelligence", 51, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max"),
  s("claude-fable-5", "aa-intelligence", 50, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: with fallback"),
  s("muse-spark-1.3", "aa-intelligence", 45, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: xhigh"),
  s("muse-spark-1.3-max", "aa-intelligence", 48, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max"),
  s("gpt-5.6-sol", "aa-intelligence", 47, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max"),
  s("grok-4.6", "aa-intelligence", 44, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: high"),
  s("kimi-k3", "aa-intelligence", 44, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: max"),
  s("gemini-3.8-flash", "aa-intelligence", 41, "Artificial Analysis", "https://artificialanalysis.ai/leaderboards/models", "2026-09-10", "best effort/variant: high"),

  s("claude-fable-5.1", "arena-elo", 1520, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("claude-opus-5", "arena-elo", 1511, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("claude-fable-5", "arena-elo", 1510, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("gpt-5.6-sol", "arena-elo", 1509, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("grok-4.6", "arena-elo", 1507, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("kimi-k3", "arena-elo", 1506, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("qwen-3.8-max", "arena-elo", 1506, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("gpt-5.6-terra", "arena-elo", 1505, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("grok-4.5", "arena-elo", 1504, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("gemini-3.1-pro", "arena-elo", 1504, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("gemini-3.7-flash", "arena-elo", 1503, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10"),
  s("gemini-3.8-flash", "arena-elo", 1505, "Arena+", "https://openlm.ai/chatbot-arena/", "2026-09-10", "early listing"),

  s("claude-opus-5", "swe-bench", 97, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("deepseek-v4-pro", "swe-bench", 96.4, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("gpt-5.6-sol", "swe-bench", 96.2, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("grok-4.6", "swe-bench", 95.6, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("claude-fable-5", "swe-bench", 95, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("kimi-k3", "swe-bench", 93.4, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("gpt-5.6-luna", "swe-bench", 93, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("qwen-3.8-max", "swe-bench", 85.6, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),
  s("grok-4.5", "swe-bench", 86.6, "Vals AI", "https://vals.ai/benchmarks/swebench", "2026-09-10"),

  s("gpt-5.6-sol", "terminal-bench", 88.8, "Vellum", "https://www.vellum.ai/llm-leaderboard", "2026-07-24"),
  s("grok-4.6", "terminal-bench", 88.4, "Artificial Analysis", "https://felloai.com/best-ai-models/", "2026-08-13"),
  s("kimi-k3", "terminal-bench", 88.3, "Vellum", "https://www.vellum.ai/llm-leaderboard", "2026-07-24"),
  s("gemini-3.7-flash", "terminal-bench", 85.8, "Vellum", "https://www.vellum.ai/llm-leaderboard", "2026-07-24"),
  s("muse-spark-1.3", "terminal-bench", 85, "Artificial Analysis", "https://artificialanalysis.ai/articles/muse-spark-1-3", "2026-09-02", "v2.1 xhigh"),
  s("claude-fable-5", "terminal-bench", 84.3, "Vellum", "https://www.vellum.ai/llm-leaderboard", "2026-07-24"),
];

export function getModel(id: string, models: Model[] = MODELS) {
  return models.find((row) => row.id === id);
}

export function getBenchmark(id: string) {
  return BENCHMARKS.find((b) => b.id === id);
}

export function scoreOf(modelId: string, benchmarkId: string, scores: Score[] = SCORES) {
  return scores.find((s) => s.modelId === modelId && s.benchmarkId === benchmarkId);
}

export function rankBenchmark(benchmarkId: string, scores: Score[] = SCORES) {
  return scores
    .filter((s) => s.benchmarkId === benchmarkId)
    .sort((a, b) => b.value - a.value);
}

export function formatScore(benchmarkId: string, value: number) {
  const bench = getBenchmark(benchmarkId);
  if (!bench) return String(value);
  if (bench.unit === "percent") return `${value}%`;
  if (bench.unit === "elo") return value.toLocaleString();
  return String(value);
}

export function formatPrice(model: Model) {
  if (!model.pricing) return "—";
  return `$${model.pricing.inputPerM} / $${model.pricing.outputPerM}`;
}

export function formatContext(tokens: number | null) {
  if (!tokens) return "—";
  if (tokens >= 1_000_000) return `${Math.round(tokens / 1_000_000)}M`;
  return `${Math.round(tokens / 1000)}K`;
}
