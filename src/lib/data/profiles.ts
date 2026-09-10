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
  "deepseek-v4.1-flash": {
    epithet: "Flash that ate Pro",
    voice:
      "A cheaper MoE with vision and a Pro retirement clock attached — and, so far, no seat on any independent board. Cite the API card and leave the benchmark cells blank until Artificial Analysis, Vals or Arena publish one.",
    strengths: [
      "Peak list $0.30 / $1.20 per 1M, off-peak at half",
      "MIT weights and native multimodal input",
      "Million-token context, served as deepseek-flash",
    ],
    watch: [
      "No independent AA / Arena / Vals row on Ridge yet",
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
      "Do not overwrite this id with Flash",
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
    watch: ["Do not read the partner max row as the public default"],
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
  "grok-4.6": {
    epithet: "The value flagship",
    voice:
      "A post-training refresh of 4.5, sold on price-to-score rather than a pretrain win. Not Grok 4 — that older row sits well below this one, and folding the two together is how a board publishes a wrong number with a straight face.",
    strengths: ["$2 / $6 per 1M", "500K context", "Generally available, no preview asterisk"],
    watch: ["4.7 already teased", "Never collapse this row onto Grok 4"],
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
  meta: { motif: "Meta blue #0081FB. Spark is proprietary Muse, not Llama." },
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
