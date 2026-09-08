import type { LabId, Model } from "./types";

export interface ModelProfile {
  epithet: string;
  voice: string;
  strengths: string[];
  watch: string[];
}

const PROFILES: Record<string, ModelProfile> = {
  "gpt-6-astra": {
    epithet: "The September flagship",
    voice:
      "Astra is OpenAI’s Fable-priced answer, not Sol with a new coat. $10 / $50, a million-token window, second on AA Index v4.2 at 55. First place is still terracotta.",
    strengths: ["AA v4.2 55 max", "Coding-agent cost vs Fable 5", "Clear step over Sol at 51"],
    watch: ["Does not lead the Intelligence Index", "Cyber work is Daybreak-gated", "2.5× Sol’s sticker"],
  },
  "claude-fable-5.1": {
    epithet: "The September cut",
    voice:
      "Fable 5.1 is a refresh, not a new pretrain. Cheaper cache reads, higher Arena Elo, same terracotta temperament. It took the composite the week it shipped.",
    strengths: ["AA Index v4.2 57 max with fallback", "Arena Elo still first in the last listing", "Cache reads 75% under Fable 5"],
    watch: ["Output tokens are still dear", "Days old on some harnesses"],
  },
  "claude-opus-5": {
    epithet: "The careful closer",
    voice: "Opus is the Claude you hire when the diff has to land. First on SWE-bench Verified in this ledger.",
    strengths: ["SWE-bench 97.0%", "AA v4.2 54 max"],
    watch: ["Loses the overall board to Fable 5.1"],
  },
  "muse-spark-1.3": {
    epithet: "Meta at the frontier",
    voice:
      "Public xhigh is 52 on v4.2. Last week’s 61 was v4.1.1. Max is a different row and still partner-preview.",
    strengths: ["AA v4.2 52 xhigh", "List price $1.25 / $4.25"],
    watch: ["Do not treat max 53 as the public API default"],
  },
  "muse-spark-1.3-max": {
    epithet: "The preview peak",
    voice: "Partner max is 53 on v4.2 (62 on the old ruler). Cite the status if you cite the number.",
    strengths: ["AA v4.2 53 max"],
    watch: ["Partner preview"],
  },
  "gpt-5.6-sol": {
    epithet: "The reasoning seat",
    voice: "Sol keeps taking the hard benches. It does not always win the composite. It does win ARC and the coding index.",
    strengths: ["AA v4.2 51 max", "SWE-bench 96.2%", "Terminal-Bench leader here"],
    watch: ["$30 / 1M output"],
  },
  "grok-4.6": {
    epithet: "The value flagship",
    voice: "A post-training refresh of 4.5. Ties Sol on the Intelligence Index at $2 / $6. Not Grok 4 (that older row is 46).",
    strengths: ["AA v4.2 51 high", "$2 / $6", "500K context"],
    watch: ["4.7 already teased"],
  },
  "gemini-3.8-flash": {
    epithet: "The September Flash",
    voice: "Fourth Flash in four months. 47 at high on v4.2. Promo price through 31 Dec.",
    strengths: ["AA v4.2 47 high", "Promo $0.75 / $3.75"],
    watch: ["Cost per task rose vs 3.7 because it talks more"],
  },
};

export const LAB_THEME: Record<LabId, { motif: string }> = {
  anthropic: { motif: "Terracotta #D4A27F. Literary names, expensive cache." },
  openai: { motif: "Official green #10A37F. Family of three: Sol, Terra, Luna." },
  xai: { motif: "Silver #E8EAED. Value on the same composite." },
  google: { motif: "Google blue #4285F4. Flash iterating while Pro waits." },
  moonshot: { motif: "Kimi blue #007CFF. Open-weight near-frontier." },
  deepseek: { motif: "Indigo #4D6BFE. Coder checkpoints." },
  zhipu: { motif: "Z.ai blue. MIT weights." },
  alibaba: { motif: "Orange #FF6A00. Max as a ceiling name." },
  meta: { motif: "Meta blue #0081FB. Spark is proprietary Muse, not Llama." },
  other: { motif: "Neutral slate." },
};

export function profileFor(model: Model): ModelProfile {
  return (
    PROFILES[model.id] ?? {
      epithet: model.license === "open-weight" ? "Open weights" : "Closed weights",
      voice: model.summary,
      strengths: [],
      watch: [],
    }
  );
}
