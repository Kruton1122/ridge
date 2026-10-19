import type { ModelAbout } from "./abouts";
import { ABOUTS } from "./abouts";
import type { LabId, Model } from "./types";

/**
 * Editorial voice for model pages.
 *
 * **No benchmark numbers live in this file.** They used to, and they went stale
 * the moment the daily pull moved a score — the published pages spent days
 * quoting a 7 September board against a 10 September catalog. Scores belong to
 * `catalog.ts`, which the scrape owns; this file carries only the parts that do
 * not drift: temperament, positioning, and the caveats a reader needs.
 *
 * Structured About dossiers live in `abouts.ts` and attach here as optional
 * `about`. Vendor claims in those dossiers must stay labeled as company claims;
 * live board numbers never belong in either file.
 *
 * Prices and context windows are fine here — they change on a lab announcement,
 * not on a rerun — but even those are better read live from the catalog where a
 * page can manage it.
 */
export interface ModelProfile {
  epithet: string;
  voice: string;
  strengths: string[];
  watch: string[];
  about?: ModelAbout;
}

export type { ModelAbout };

const PROFILES: Record<string, ModelProfile> = {
  "claude-haiku-5.5": {
    epithet: "The legwork Claude",
    voice:
      "The small, fast end of the Claude 5.5 family, out 7 October. Anthropic built it for jobs that run all day at scale, and for subagent work under Opus or Sonnet.",
    strengths: [
      "Very low price for short prompts",
      "First Haiku with an effort dial and adaptive thinking",
      "Tops the small models Artificial Analysis compares it with",
    ],
    watch: [
      "Long prompts cost five times as much per token",
      "Thinks hard at max effort, so token bills climb",
      "Anthropic still points complex agentic coding at Sonnet and Opus",
    ],
  },
  "mistral-large-4": {
    epithet: "Le Chonk",
    voice:
      "Mistral's trillion-parameter flagship, in API preview from 6 October with open weights promised by the end of the month. Mistral aims it at cyber defense, finance, legal work, and reading images rather than at topping every general board, and its pitch is that you will be able to run it yourself, under your own rules.",
    strengths: [
      "Open weights promised by the end of October",
      "Takes on cyber tasks that several closed models decline",
      "1M context per Mistral; text and image in",
    ],
    watch: [
      "Preview checkpoint: Mistral is still training it, so scores may move",
      "Not open yet. API only until the weights ship, and the license is unnamed",
      "List price returns to $1.36 / $4.18 after the two-week launch discount",
    ],
  },
  "beam-1.0": {
    epithet: "The American open workhorse",
    voice:
      "Reflection's first model: a 501B open-weight mixture-of-experts under Apache 2.0. Independent tests put it second among the US open models they have run and well behind the best Chinese ones, and it gets there on very few tokens. Reflection's own coding numbers are Reflection's claims.",
    strengths: [
      "Apache 2.0 weights in BF16, FP8 and NVFP4, with day-one vLLM, SGLang and Transformers support",
      "Frugal: AA ran its Index on 79M output tokens, against a median of 130M for similar models",
      "AA calls its Cyber Index score of 34 the best from a US open-weight model it has tested",
    ],
    watch: [
      "AA Index 30, well behind GLM-5.3 (45) and Kimi K3 (44)",
      "Weakest on terminal work in AA's tests: 3.0% on Terminal-Bench 4.0",
      "No published price: Reflection's API is a free beta with daily limits",
    ],
  },
  "minimax-m3.1-flash": {
    epithet: "The cheap fast one",
    voice:
      "MiniMax's new Flash model is a cheap, quick reasoning model with a 1M token window. Artificial Analysis scores it 42 on its Index, a point below Claude Haiku 5.5, for $0.15 in and $0.60 out per million tokens. MiniMax's agent and cyber charts are MiniMax's claims.",
    strengths: [
      "AA Index 42 at $0.15 / $0.60 per 1M tokens",
      "1M token context with text and image input",
      "MiniMax says it runs at 170+ tokens per second median",
    ],
    watch: [
      "Only one independent score so far: no Cyber, Arena+, Harvey or Vals rows",
      "Weights are promised but not out, so Ridge marks it proprietary",
      "AA calls it very verbose: 180M output tokens to run its Index",
    ],
  },
  "step-5-preview": {
    epithet: "The cheap third seat",
    voice:
      "StepFun's flagship, now an open-weight model. Independent tests put it third among open models on AA's Index, level with Kimi K3 and a point behind GLM-5.3, at a list price well under most closed models. StepFun's coding and finance charts are StepFun's claims.",
    strengths: [
      "AA Index 44, third among open-weight models on AA's list",
      "AA Cyber 48 with no tasks declined",
      "$1.00 / $2.70 per 1M tokens on StepFun's international API",
    ],
    watch: [
      "Vals Terminal-Bench 4.0 31.82, 17th of 49, below the 33.3 on StepFun's own card",
      "StepFun Model License 1.0 adds attribution and commercial-license conditions, so it is not plain Apache",
      "No CursorBench, Harvey LAB-AA or Vals SWE-bench score",
    ],
  },
  "mimo-v2.6-pro": {
    epithet: "The new open leader",
    voice:
      "Xiaomi's trillion-parameter flagship and, on Artificial Analysis, the top open-weight model: 46, a point over GLM-5.3, at under a dollar per million output tokens. The weights are MIT licensed. Xiaomi's agent and cyber charts are Xiaomi's claims.",
    strengths: [
      "AA Index 46, first among open-weight models on AA's list",
      "AA Cyber 56 with no tasks declined, the same rounded score as Grok 4.7 at the top",
      "$0.435 / $0.87 per 1M tokens on Xiaomi's API, with MIT weights",
    ],
    watch: [
      "Hugging Face hosts MiMo-V2.6-Pro-RL and -MOPD, and Xiaomi does not name the checkpoint behind the API",
      "Vals Terminal-Bench 4.0 31.31, 18th of 49, below the 34.9 on Xiaomi's card",
      "Still well behind the closed leaders: Claude Opus 5.5 scores 58 on AA",
    ],
  },
  "deepseek-v4.1-flash": {
    epithet: "Flash that ate Pro",
    voice:
      "A cheaper MoE with vision and a Pro retirement clock attached. Since 17 October deepseek-flash serves the 1017 update. Prices come from the API card, and the board shows only independent scores, not the lab's own tables.",
    strengths: [
      "Peak list $0.30 / $1.20 per 1M, off-peak at half, unchanged by 1017",
      "MIT weights and native multimodal input",
      "Million-token context, served as deepseek-flash",
    ],
    watch: [
      "AA Index and Vals TB4 now score 1017; Cyber, Arena+, Harvey and TB2.1 are still the September build",
      "No Vals SWE-bench score",
      "The lab's own agent tables stay off this ledger",
      "The v4-pro alias routes here from 14 September",
    ],
  },
  "deepseek-v4-pro": {
    epithet: "The Pro on notice",
    voice:
      "The open-weight coding row in this ledger. After 14 September the API name keeps working — the model behind it becomes Flash until V4.1-Pro ships, which is exactly the kind of substitution a version-aware catalog exists to survive.",
    strengths: ["A published Vals SWE-bench row", "Existing open-weight Pro checkpoint"],
    watch: [
      "Routes to V4.1-Flash from 2026-09-14 04:00 UTC",
      "Tracked separately from Flash, even while the alias routes there",
    ],
  },
  "gpt-6-astra": {
    epithet: "The September flagship",
    voice:
      "OpenAI's Fable-priced answer rather than Sol with a new coat — the first flagship since Sol that belongs on the same line as Anthropic's top cut, and priced level with it instead of under it.",
    strengths: [
      "Priced level with Fable, not beneath it",
      "A clear step over Sol on the live board",
      "Million-token-plus context",
    ],
    watch: [
      "Cyber-capable work stays Daybreak-gated",
      "About 2.5× Sol's sticker",
      "Effort variant changes the number — cite which one",
    ],
  },
  "claude-fable-5.1": {
    epithet: "The September cut",
    voice:
      "A refresh, not a new pretrain: cheaper cache reads, the same terracotta temperament, and the composite taken the week it shipped. Artificial Analysis measures it with the default server-side fallback engaged, so a citation of the headline number should carry the fallback too.",
    strengths: [
      "Cache reads roughly 75% under Fable 5",
      "Million-token context, 128k max output",
    ],
    watch: [
      "Output tokens are still expensive",
      "The headline row runs with a safety fallback",
      "Independent write-ups flagged more confident wrong answers",
    ],
  },
  "claude-opus-5": {
    epithet: "The careful closer",
    voice:
      "The Claude you hire when the diff has to land. It has held the SWE-bench seat in this ledger since July even as the composite moved on around it, which is a reminder that the composite is not the only question.",
    strengths: ["The coding row in this catalog", "Half Fable's sticker"],
    watch: ["No longer the leading Anthropic row on the composite"],
  },
  "muse-spark-1.3": {
    epithet: "Meta at the frontier",
    voice:
      "The public xhigh cut, and the one a normal API key actually reaches. The figure people quote in headlines is usually the partner max row — a different tier, a different number, and not a seat you can buy.",
    strengths: [
      "List price $1.25 / $4.25 per 1M",
      "Million-token context with image and video in",
    ],
    watch: ["The partner max row is not the public default"],
  },
  "muse-spark-open": {
    epithet: "The downloadable Spark",
    voice:
      "Meta's open-weight Muse. The weights are public, the license has strings, and independent scores are thin: AA lists it at 39 and Arena+ at 1484. Quote Meta's chart as Meta's.",
    strengths: ["Open weights with a 1M context window", "Hosted by seven providers at the Spark 1.3 price"],
    watch: ["AA Index 39 trails GLM-5.3 (45) and Kimi K3 (44)", "Meta's card asks for about 700GB of GPU memory at 4-bit", "Muse Model License, not Apache or MIT"],
  },
  "muse-wonder": {
    epithet: "Meta's API frontier",
    voice:
      "The Muse Wonder you can actually call. Four points over Spark 1.3 max on AA's index, same list price as Opus 5.5, still marked preview. Second on AA's legal board behind its bigger sibling.",
    strengths: ["AA Intelligence Index 52 at max", "1M context with image, video, audio and PDF input"],
    watch: ["Preview on the API", "About 2.8x Spark 1.3 max cost per AA task", "Weak on AA's knowledge test"],
  },
  "muse-wonder-full": {
    epithet: "The subscription peak",
    voice:
      "Meta's strongest model, level with Sonnet 5.5 on AA's index, and only reachable inside Muse Code. Cite the access if you cite the number.",
    strengths: ["AA Intelligence Index 56 at max", "AA ranks it first on CritPt and GDP.pdf"],
    watch: ["No API, Muse Code subscribers only", "No per-token price"],
  },
  "muse-spark-1.3-max": {
    epithet: "The preview peak",
    voice:
      "Partner max. Higher than the public xhigh row on every board that has measured both, and not callable from a standard key. Cite the access status if you cite the number.",
    strengths: ["The higher of Meta's two measured rows"],
    watch: ["Partner preview — not generally available"],
  },
  "gpt-5.6-sol": {
    epithet: "The reasoning seat",
    voice:
      "Sol keeps taking the hard benches, does not always win the composite, and still invoices like a flagship. Astra is the newer OpenAI step; Sol is the one already sitting in production loops.",
    strengths: ["Published SWE-bench and Terminal-Bench rows", "Established in production"],
    watch: ["$30 per 1M output", "Superseded at the top of OpenAI's range by Astra"],
  },
  "grok-4.7": {
    epithet: "The September value cut",
    voice:
      "SpaceXAI's 21 September follow-on to 4.6 at the same $2 / $6 sticker. Its scores come from Artificial Analysis, Arena+, Cursor.com, and Vals. There is no SWE-bench Verified score for this cut.",
    strengths: ["Same $2 / $6 list as 4.6", "Generally available ship signal from SpaceXAI"],
    watch: [
      "Vendor launch-chart figures (TB 4.0, DeepSWE, Harvey) are company claims, not board scores",
      "Tracked separately from Grok 4.6 and the older Grok 4",
    ],
  },
  "grok-4.6": {
    epithet: "The value flagship",
    voice:
      "A post-training refresh of 4.5, sold on price-to-score rather than a pretrain win. Not Grok 4 — that older row sits well below this one, and folding the two together is how a board publishes a wrong number with a straight face.",
    strengths: ["$2 / $6 per 1M", "500K context", "Generally available, no preview asterisk"],
    watch: ["4.7 shipped 21 Sep and has its own row", "Not the same model as the older Grok 4"],
  },
  "gemini-3.8-flash": {
    epithet: "The September Flash",
    voice:
      "The fourth Flash in four months, and the reason the missing Pro reads louder rather than quieter. Google can mint a workhorse every few weeks; it has not minted a flagship.",
    strengths: [
      "Promo $0.75 / $3.75 per 1M through 31 December",
      "Million-token context; text, image, video and speech in",
    ],
    watch: [
      "Cost per task rose against 3.7 because it emits more tokens",
      "Promo reverts to $1.50 / $7.50",
    ],
  },
};

export const LAB_THEME: Record<LabId, { motif: string }> = {
  anthropic: { motif: "Terracotta #D4A27F. Literary names, expensive cache." },
  openai: { motif: "Official green #10A37F. Family of three: Sol, Terra, Luna." },
  xai: { motif: "Silver #E8EAED. Value on the same composite." },
  google: { motif: "Google blue #4285F4. Flash iterating while Pro waits." },
  moonshot: { motif: "Kimi blue #007CFF. Open-weight near-frontier." },
  deepseek: { motif: "Indigo #4D6BFE. Flash/Pro cadence, open weights." },
  zhipu: { motif: "Z.ai blue. MIT weights." },
  alibaba: { motif: "Orange #FF6A00. Max as a ceiling name." },
  meta: { motif: "Meta blue #0081FB. Muse is not Llama. Mostly proprietary; Spark Open is the open-weight one." },
  mistral: { motif: "Mistral orange #FA500F. Paris lab, sovereign pitch, open weights promised." },
  reflection: { motif: "Reflection lime #CDE048. New US lab; Apache 2.0 open weights, efficiency pitch." },
  stepfun: { motif: "StepFun cyan #00E5D8 (AA uses the same). Chinese lab; open-weight Step 5 at a low price." },
  minimax: { motif: "MiniMax crimson #EB3568 (AA uses the same). Shanghai lab; cheap Flash models, weights promised later." },
  xiaomi: { motif: "Xiaomi pink #FF4FA3, chosen because Xiaomi's own orange is taken by Alibaba and Mistral. Phone and EV maker; MIT open weights." },
  other: { motif: "Neutral slate." },
};

export function profileFor(model: Model): ModelProfile {
  const base =
    PROFILES[model.id] ?? {
      epithet: model.license === "open-weight" ? "Open weights" : "Closed weights",
      voice: model.summary,
      strengths: [],
      watch: [],
    };
  const about = ABOUTS[model.id];
  return about ? { ...base, about } : base;
}
