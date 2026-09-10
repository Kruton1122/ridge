/**
 * Structured per-model About dossiers.
 *
 * Editorial only. No live board scores live here — those belong to `catalog.ts`.
 * Vendor/self-reported eval highlights must be labeled as company claims in the UI.
 * Fill models gradually; pages without an entry keep the thin voice profile.
 */
export interface ModelAbout {
  /** 1–2 short paragraphs introducing the model. */
  lede: string;
  /** How the lab positions the model. */
  framing?: string;
  /** Ship / availability timeline. */
  rollout?: { date: string; text: string }[];
  /** Caveat under the timeline (slips, soft launches, etc.). */
  rolloutNote?: string;
  /** "What they claim" bullets — always labeled as company claims in the UI. */
  claims?: string[];
  /** Optional caveat on vendor eval tables vs third-party boards. */
  vendorEvalsNote?: string;
  /** Model id, context, price, modalities, etc. */
  specs?: { label: string; value: string }[];
  /** Surfaces / products where it ships. */
  whereUsed?: string[];
  /** Optional citations. */
  sources?: { label: string; url: string }[];
}

export const ABOUTS: Record<string, ModelAbout> = {
  "grok-4.6": {
    lede:
      "Grok 4.6 is SpaceXAI's (formerly xAI) flagship cut for coding, agents, and knowledge work. It shipped as a post-training refresh of Grok 4.5 rather than a fresh pretrain, with the pitch aimed at long-running agent loops and day-to-day builder work at a value sticker.\n\nRidge treats it as its own catalog row. It is not Grok 4, and folding the two together is how a board publishes the wrong number with a straight face.",
    framing:
      "SpaceXAI sells 4.6 as the practical flagship: stronger coding and agent behavior than 4.5, long-context work, and a price meant to undercut peers on the same capability band. The company leaned on its own eval tables at launch; third-party boards place it in a similar band without matching every vendor headline.",
    rollout: [
      {
        date: "2026-08-07",
        text: "Musk floated an imminent ship window, then the date slipped a few days.",
      },
      {
        date: "2026-08-12",
        text: "Announced and released. Same-day availability across Cursor, Grok Build, the SpaceXAI API, OpenRouter, Vercel AI Gateway, and Cloudflare Workers AI.",
      },
      {
        date: "2026-08-14",
        text: "Reached GitHub Copilot.",
      },
      {
        date: "2026-08-19",
        text: "Landed on Amazon Bedrock.",
      },
      {
        date: "2026-08-21",
        text: "Added to Gemini Enterprise model choice.",
      },
      {
        date: "2026-08-26",
        text: "Arrived in Azure AI Foundry.",
      },
      {
        date: "2026-08-28",
        text: "Consumer rollout on Grok.com, iOS, and Android.",
      },
      {
        date: "2026-09",
        text: "Early September availability through Snowflake Cortex.",
      },
    ],
    rolloutNote:
      "Grok 4.5 had shipped on 8 July 2026. The 4.6 cut is the August follow-on, not a rename of the older Grok 4 row.",
    claims: [
      "Clear step up from Grok 4.5 on coding, agent harnesses, and knowledge-work tasks (company-reported).",
      "Tuned for long-running agents that keep tools, memory, and multi-step plans in play.",
      "Price-to-score positioning against peer flagships rather than a claim of topping every independent board.",
      "Vendor eval tables at launch highlighted gains versus 4.5 across internal coding and agent suites.",
    ],
    vendorEvalsNote:
      "Company-reported benches are labeled as such on this page. Independent boards put Grok 4.6 in roughly the same capability band as other value flagships; Ridge's live catalog scores stay the source of truth for this site and are not restated here when a vendor table disagrees.",
    specs: [
      { label: "Model id", value: "grok-4.6" },
      { label: "Context", value: "500K tokens" },
      { label: "Knowledge cutoff", value: "1 February 2026" },
      { label: "Modalities", value: "Multimodal in, text out" },
      { label: "Reasoning", value: "Selectable reasoning tiers" },
      { label: "Tools", value: "Native tool use / function calling" },
      {
        label: "Price (under 200K ctx)",
        value: "$2 input / $0.50 cached input / $6 output per 1M tokens",
      },
      {
        label: "Price (over 200K ctx)",
        value: "Rates double above the 200K context threshold",
      },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "SpaceXAI (formerly xAI)" },
    ],
    whereUsed: [
      "Cursor",
      "Grok Build",
      "SpaceXAI API",
      "OpenRouter",
      "Vercel AI Gateway",
      "Cloudflare Workers AI",
      "GitHub Copilot",
      "Amazon Bedrock",
      "Gemini Enterprise",
      "Azure AI Foundry",
      "Grok.com",
      "Grok iOS",
      "Grok Android",
      "Snowflake Cortex",
    ],
    sources: [
      {
        label: "Artificial Analysis model board",
        url: "https://artificialanalysis.ai/leaderboards/models",
      },
    ],
  },
};
