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

  "grok-4.5": {
    lede:
      "Grok 4.5 was xAI's flagship model heading into the summer of 2026, shipped 8 July as the company's first model jointly trained with Cursor on real developer-agent interaction traces rather than static code repositories. The pitch was coding, agentic tasks, and knowledge work, at a price meant to undercut peer flagships.\n\nRidge tracks it as its own catalog row. It became the base for the Grok 4.6 post-train about a month later, but the two are separate ships with separate rollout histories.",
    framing:
      "xAI (the company later rebranded SpaceXAI) sold 4.5 as its smartest model yet for real engineering work — end-to-end app building, long-document knowledge tasks, and office work in Word, Excel, and PowerPoint — while leaning hard on the Cursor co-training angle as a differentiator from general-purpose coding models trained on static repos.",
    rollout: [
      {
        date: "2026-06-28",
        text: "Musk said Grok 4.5 had entered private testing at SpaceX and Tesla, focused on internal coding workflows.",
      },
      {
        date: "2026-07-08",
        text: "Announced and released. Day-one availability in the xAI API, Cursor (all plans), Grok Build, and the xAI console; US access first.",
      },
      {
        date: "2026-07-17",
        text: "EU access opened.",
      },
      {
        date: "2026-07-22",
        text: "Consumer rollout: live on grok.com, X, and the Grok apps for iOS and Android.",
      },
      {
        date: "2026-07-28",
        text: "Reached GitHub Copilot (Pro, Pro+, Max, Business, Enterprise), with adjustable low/medium/high reasoning levels; Business and Enterprise admins had to opt in.",
      },
    ],
    rolloutNote:
      "Grok 4.5 was superseded roughly a month later by Grok 4.6, a post-training refresh rather than a fresh pretrain. Some 4.5-era coverage inconsistently mixes in Grok 4.6 dates (notably GitHub Copilot's August rollout) — this timeline covers 4.5's own launch only.",
    claims: [
      "Positioned as xAI's smartest model yet for coding, agentic tasks, and knowledge work (company framing at launch).",
      "First model jointly trained with Cursor on real developer-agent interaction data, aimed at fixing codebase-awareness and long multi-step task consistency.",
      "Company-reported launch benchmarks: DeepSWE 1.0 62.0%, SWE Marathon 29.0% resolution, Terminal-Bench 2.1 83.3%, SWE-Bench Pro 64.7% resolve rate.",
      "Claimed roughly 4.2x fewer output tokens than Opus 4.8 (max) on comparable tasks, served at 'fast-model' speeds of about 80 TPS.",
    ],
    vendorEvalsNote:
      "The benchmark figures above are xAI's own launch-day numbers, labeled as company claims. Ridge's live catalog scores are the source of truth for this site and are not restated here when a vendor table disagrees.",
    specs: [
      { label: "Model id", value: "grok-4.5" },
      { label: "Context", value: "500K tokens" },
      { label: "Knowledge cutoff", value: "January 2026" },
      { label: "Modalities", value: "Text and image in, text out" },
      { label: "Reasoning", value: "Selectable low / medium / high reasoning levels" },
      { label: "Tools", value: "Function calling and structured outputs" },
      {
        label: "Price (under 200K ctx)",
        value: "$2 input / $0.30 cached input / $6 output per 1M tokens",
      },
      {
        label: "Price (over 200K ctx)",
        value: "$4 input / $0.60 cached input / $12 output per 1M tokens",
      },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "xAI (later renamed SpaceXAI)" },
    ],
    whereUsed: [
      "xAI API",
      "Cursor",
      "Grok Build",
      "OpenRouter",
      "Vercel AI Gateway",
      "Cloudflare Workers AI",
      "GitHub Copilot",
      "Grok.com",
      "X",
      "Grok iOS",
      "Grok Android",
      "Microsoft 365 add-ins (Word, Excel, PowerPoint, Outlook)",
    ],
    sources: [
      { label: "Introducing Grok 4.5 (xAI)", url: "https://x.ai/news/grok-4-5" },
      {
        label: "Bringing Grok 4.5 to iOS, Android, Web, and X (xAI)",
        url: "https://x.ai/news/grok-4-5-everywhere",
      },
      { label: "Grok 4.5 in GitHub Copilot (xAI)", url: "https://x.ai/news/grok-github-copilot" },
      { label: "Grok 4.5 model docs (xAI)", url: "https://docs.x.ai/developers/models/grok-4.5" },
      {
        label: "Grok 4.5 is now available in GitHub Copilot (GitHub Changelog)",
        url: "https://github.blog/changelog/2026-07-28-grok-4-5-is-now-available-in-github-copilot/",
      },
    ],
  },

  "claude-fable-5.1": {
    lede:
      "Claude Fable 5.1 is Anthropic's current flagship, shipped 1 September 2026 as a refresh of Claude Fable 5 rather than a new pretrain. Anthropic aims it at the hardest end of the lineup: whole-codebase coding, multi-hour agent harnesses, and dense-document vision work, with adaptive thinking always on.\n\nRidge tracks it as its own catalog row, distinct from Fable 5. The two share a price ($10 input / $50 output per million tokens) and a 1M-token context window, but 5.1 has its own knowledge cutoff and its own board score — folding the two together would blur a real capability delta.",
    framing:
      "Anthropic positions 5.1 as the model to reach for when Opus 5 at higher effort still falls short on demanding reasoning or long-horizon agentic work, not as a general-purpose default. The company's own benchmark tables emphasize gains over Fable 5 on agentic-coding and computer-use suites, alongside a steep cut to prompt-cache pricing as the practical reason to upgrade agent-heavy workloads.",
    rollout: [
      {
        date: "2026-09-01",
        text: "Announced and released alongside Claude Mythos 5.1 (the Project Glasswing-restricted twin, same weights, fewer safeguards trimmed). Generally available same-day on Claude.ai, the Claude API, Amazon Bedrock, Google Cloud, and Microsoft Foundry/Azure.",
      },
      {
        date: "2026-09",
        text: "Anthropic began phasing in expanded 'Enterprise Frontier Safeguards' starting that fall.",
      },
    ],
    rolloutNote:
      "Mythos 5.1 is the same model under Project Glasswing access controls, not a separate release. Fable 5 (9 June 2026) is now marked legacy in Anthropic's docs but stays available at the same price.",
    claims: [
      "Beats Fable 5 on Anthropic's own agentic-coding suites at launch — e.g. Terminal-Bench 4.0 55.8% vs 42.0%, and OSWorld 2.0 (strict) 41.7% vs 36.1%.",
      "Cache-read pricing cut 75% (to $0.25/MTok), which Anthropic says lowers typical-workload cost about 25% and highly agentic workload cost up to about 45% versus Fable 5.",
      "Claude Code users see roughly 60% fewer safety-classifier interventions per session than on Fable 5.",
      "Outputs carry an invisible watermark, positioned by Anthropic as an EU AI Act provenance feature.",
    ],
    vendorEvalsNote:
      "The benchmark deltas above are Anthropic's own launch tables comparing 5.1 to 5, not Ridge's board. Ridge's live catalog score stays the source of truth for this site and isn't restated here.",
    specs: [
      { label: "Model id", value: "claude-fable-5-1" },
      { label: "Context", value: "1M tokens (default and maximum)" },
      { label: "Max output", value: "128K tokens" },
      { label: "Reliable knowledge cutoff", value: "June 2026" },
      { label: "Training data cutoff", value: "June 2026" },
      { label: "Modalities", value: "Text and image input, text output" },
      { label: "Reasoning", value: "Adaptive thinking, always on; effort low–max, default high" },
      { label: "Tools", value: "Native tool use, memory tool, code execution, programmatic tool calling" },
      { label: "Price", value: "$10 input / $50 output per 1M tokens" },
      { label: "Cache read price", value: "$0.25 per 1M tokens (2.5% of input price)" },
      {
        label: "Data retention",
        value: "30-day minimum; not available under zero data retention without express authorization",
      },
      { label: "Retirement commitment", value: "Not sooner than 1 September 2027" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Anthropic" },
    ],
    whereUsed: [
      "Claude.ai",
      "Claude Code",
      "Claude Enterprise",
      "Claude API",
      "Amazon Bedrock",
      "Google Cloud (Vertex AI)",
      "Microsoft Foundry",
      "Claude Platform on AWS",
    ],
    sources: [
      {
        label: "Introducing Claude Fable 5.1 and Claude Mythos 5.1 (Anthropic)",
        url: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
      },
      {
        label: "Claude models overview (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/overview",
      },
      {
        label: "Claude Fable 5 model page — comparison table (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/fable-5/overview",
      },
    ],
  },

  "claude-opus-5": {
    lede:
      "Claude Opus 5 is Anthropic's mid-tier flagship, released 24 July 2026 at the same price as its predecessor Opus 4.8: $5 input / $25 output per million tokens. Anthropic's pitch is a model that lands close to Fable 5's frontier intelligence at roughly half the cost, with an effort dial that trades thinking depth — and spend — per request.\n\nIt was the fourth Claude 5-generation model Anthropic shipped in under two months (Sonnet 5, then Fable 5, then Opus 5), part of a cadence of frequent capability and cost refreshes rather than single blockbuster launches. Ridge scores it as its own row, separate from Opus 4.8 and Fable 5.",
    framing:
      "Anthropic positions Opus 5 as the default recommendation for most workloads: the new default model on Claude Max and the strongest model available on Claude Pro, with Fable 5.1 reserved for cases where Opus 5 at high effort still underperforms. Company benchmark tables lean on cost-adjusted comparisons against Fable 5 — score-per-dollar rather than raw leaderboard position.",
    rollout: [
      {
        date: "2026-07-24",
        text: "Announced and released. Same-day availability on the Claude API (claude-opus-5), Claude.ai, Claude Pro, Claude Max (new default), and Claude Code.",
      },
      {
        date: "2026-07-24",
        text: "Launch-week coverage also placed it same-day in GitHub Copilot, VS Code, Cursor, Amazon Bedrock, and Google Cloud (Vertex AI).",
      },
    ],
    rolloutNote:
      "Opus 5 shipped at unchanged pricing from Opus 4.8 ($5/$25) — the headline change Anthropic sells is capability and the effort dial, not a price cut.",
    claims: [
      "'Comes close to the frontier intelligence of Claude Fable 5 at half the price' (Anthropic's framing).",
      "More than doubles Opus 4.8's score on Anthropic's internal Frontier-Bench v0.1, at a lower cost per task.",
      "Scores within 0.5% of Fable 5's peak CursorBench 3.2 result at max effort, at half the cost.",
      "On ARC-AGI-3, scores roughly 3x the next-best model Anthropic tested.",
      "Outperforms Fable 5 on OSWorld 2.0 at just over a third of the cost.",
    ],
    vendorEvalsNote:
      "All comparisons above are Anthropic's own launch-day tables, run against models and tasks the company chose. They are not Ridge's board scores — treat them as the company's framing of its own release.",
    specs: [
      { label: "Model id", value: "claude-opus-5" },
      { label: "Context", value: "1M tokens (default and maximum)" },
      { label: "Max output", value: "128K tokens (up to 300K via Batch API beta)" },
      { label: "Reliable knowledge cutoff", value: "May 2026" },
      { label: "Training data cutoff", value: "May 2026" },
      { label: "Modalities", value: "Text and image input, text output" },
      { label: "Reasoning", value: "Adaptive thinking, on by default; effort low–max, default high" },
      { label: "Fast mode", value: "Research preview; ~2.5x output speed at ~2x price" },
      { label: "Price", value: "$5 input / $25 output per 1M tokens" },
      { label: "Cache read price", value: "$0.50 per 1M tokens (10% of input price)" },
      { label: "Retirement commitment", value: "Not sooner than 24 July 2027" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Anthropic" },
    ],
    whereUsed: [
      "Claude.ai",
      "Claude Pro",
      "Claude Max",
      "Claude Code",
      "Claude Cowork",
      "Claude API",
      "Amazon Bedrock",
      "Google Cloud (Vertex AI)",
      "GitHub Copilot",
      "VS Code",
      "Cursor",
    ],
    sources: [
      { label: "Introducing Claude Opus 5 (Anthropic)", url: "https://www.anthropic.com/news/claude-opus-5" },
      {
        label: "Claude models overview (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/overview",
      },
    ],
  },

  "claude-fable-5": {
    lede:
      "Claude Fable 5 was Anthropic's flagship for three months: released 9 June 2026 as the first Mythos-class model, built for long-horizon autonomous coding and knowledge work with a 1M-token context window and adaptive thinking always on. It shipped alongside a limited-access twin, Claude Mythos 5, released through Project Glasswing without Fable 5's safety classifiers.\n\nAnthropic's docs now mark Fable 5 legacy, superseded by Fable 5.1 on 1 September 2026, though it remains available at the same $10/$50 per-million-token price. Ridge keeps it as a distinct catalog row rather than folding it into the 5.1 line — the two have different knowledge cutoffs and different board scores.",
    framing:
      "At launch Anthropic called Fable 5 the most capable model it had ever made publicly available, pitched at software engineering, scientific research, and autonomous task execution rather than casual chat. The model briefly became a live case study in export-control risk: within days of release, both Fable 5 and Mythos 5 were suspended for all users under new US export controls, then restored later the same month.",
    rollout: [
      {
        date: "2026-06-09",
        text: "Announced and released. Public GA of Fable 5; limited release of Mythos 5 through Project Glasswing. Day-one availability on GitHub Copilot, Amazon Bedrock, Google Cloud, and Microsoft Foundry.",
      },
      {
        date: "2026-06-12",
        text: "US government export controls applied to Fable 5 and Mythos 5. Anthropic restricted access to foreign nationals and suspended both models for all users.",
      },
      {
        date: "2026-06-30",
        text: "Export controls lifted; access to Fable 5 and Mythos 5 restored.",
      },
      {
        date: "2026-09-01",
        text: "Superseded as Anthropic's flagship by Claude Fable 5.1; recategorized as legacy but kept live at the same price.",
      },
    ],
    rolloutNote:
      "The 12–30 June suspension was a real gap in availability, not a ship-date slip — Fable 5 was live, then pulled for all users for roughly two and a half weeks, then restored at the same specs and price.",
    claims: [
      "Anthropic's most capable publicly available model at launch, with strength in software engineering, knowledge work, vision, scientific research, and autonomous task execution (company framing).",
      "High-risk cybersecurity, biology, chemistry, and distillation requests are blocked and fall back to Claude Opus 4.8 (company-reported safety behavior).",
    ],
    vendorEvalsNote:
      "Anthropic's June 2026 launch materials lean on capability framing more than head-to-head benchmark tables; treat the 'most capable' language as the company's own claim, not a Ridge-verified board result.",
    specs: [
      { label: "Model id", value: "claude-fable-5" },
      { label: "Context", value: "1M tokens (default and maximum)" },
      { label: "Max output", value: "128K tokens" },
      { label: "Reliable knowledge cutoff", value: "January 2026" },
      { label: "Training data cutoff", value: "January 2026" },
      { label: "Modalities", value: "Text and image input, text output" },
      { label: "Reasoning", value: "Adaptive thinking, always on; effort low–max, default high" },
      { label: "Price", value: "$10 input / $50 output per 1M tokens" },
      { label: "Cache read price", value: "$1 per 1M tokens (10% of input price)" },
      {
        label: "Data retention",
        value: "30-day minimum; Covered Model, not available under zero data retention without express authorization",
      },
      { label: "Status", value: "Legacy (active); retirement not sooner than 9 June 2027" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Anthropic" },
    ],
    whereUsed: [
      "Claude API",
      "GitHub Copilot",
      "Amazon Bedrock",
      "Google Cloud (Vertex AI)",
      "Microsoft Foundry",
      "Claude Platform on AWS",
    ],
    sources: [
      {
        label: "Redeploying Claude Fable 5 (Anthropic)",
        url: "https://www.anthropic.com/news/redeploying-fable-5",
      },
      {
        label: "Introducing Claude Fable 5 and Claude Mythos 5 (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/fable-5/introducing-claude-fable-5-and-claude-mythos-5",
      },
      {
        label: "Claude Fable 5 model page (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/fable-5/overview",
      },
      {
        label: "Claude Fable 5 is generally available for GitHub Copilot (GitHub Changelog)",
        url: "https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/",
      },
    ],
  },

  "claude-sonnet-5": {
    lede:
      "Claude Sonnet 5 is Anthropic's workhorse mid-tier model, released 30 June 2026 as the default model for Free and Pro Claude plans and available to Max, Team, and Enterprise users. Anthropic calls it its 'most agentic Sonnet model yet,' built to plan, use tools like browsers and terminals, and hold up through sustained coding sessions at a price well below Opus.\n\nIt launched at introductory pricing of $2 input / $10 output per million tokens, originally slated to rise to $3/$15 after 31 August 2026 — Anthropic instead made the introductory rate permanent from 10 August 2026. Ridge tracks it as its own catalog row; catalog.ts leaves pricing unset, so the figures here come straight from Anthropic's own pricing pages.",
    framing:
      "Anthropic frames Sonnet 5 as the practical middle of the lineup: substantially ahead of Sonnet 4.6, and on some complex agentic and knowledge-work tasks close to — the company says sometimes past — Claude Opus 4.8, at a fraction of the cost. It ships with cyber safeguards on by default, matching the Opus 4.7/4.8 posture rather than a lighter mid-tier policy.",
    rollout: [
      {
        date: "2026-06-30",
        text: "Announced and released. Default model for Free and Pro plans; available to Max, Team, and Enterprise. Same-day on the Claude API (claude-sonnet-5), Claude Platform on AWS, and Microsoft Foundry; Google Vertex AI listed as coming soon.",
      },
      {
        date: "2026-08-10",
        text: "Anthropic made the $2/$10 introductory price permanent, canceling the previously announced 31 August rise to $3/$15.",
      },
    ],
    rolloutNote:
      "The pricing story is the notable rollout wrinkle: Sonnet 5 launched as an introductory offer with a built-in expiration, then Anthropic reversed course and kept the launch price standing.",
    claims: [
      "'Most agentic Sonnet model yet' — plans autonomously, uses tools like browsers and terminals, and sustains long coding sessions (company framing).",
      "Substantially outscores Sonnet 4.6 on most of Anthropic's internal evals, and approaches — or on some knowledge-work tasks exceeds — Claude Opus 4.8.",
      "Lower rates of misaligned behavior than Sonnet 4.6, and substantially reduced ability to develop software exploits versus Opus-tier models (company-reported safety evaluation).",
    ],
    vendorEvalsNote:
      "The Sonnet-4.6 and Opus-4.8 comparisons above are Anthropic's own internal evals from its June 2026 launch post, not Ridge's board. Ridge's live catalog score (AA 55) is the number of record for this site.",
    specs: [
      { label: "Model id", value: "claude-sonnet-5" },
      { label: "Context", value: "1M tokens (default and maximum)" },
      { label: "Max output", value: "128K tokens (up to 300K via Batch API beta)" },
      { label: "Reliable knowledge cutoff", value: "January 2026" },
      { label: "Training data cutoff", value: "January 2026" },
      { label: "Modalities", value: "Text and image input, text output" },
      { label: "Reasoning", value: "Adaptive thinking; effort low–max, default high" },
      { label: "Price", value: "$2 input / $10 output per 1M tokens (made permanent 10 Aug 2026)" },
      { label: "Cache read price", value: "$0.20 per 1M tokens (10% of input price)" },
      { label: "Retirement commitment", value: "Not sooner than 30 June 2027" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Anthropic" },
    ],
    whereUsed: [
      "Claude.ai (Free, Pro default)",
      "Claude Max",
      "Claude Team",
      "Claude Enterprise",
      "Claude API",
      "Claude Platform on AWS",
      "Microsoft Foundry",
    ],
    sources: [
      { label: "Introducing Claude Sonnet 5 (Anthropic)", url: "https://www.anthropic.com/news/claude-sonnet-5" },
      {
        label: "Claude models overview (Claude Platform Docs)",
        url: "https://platform.claude.com/docs/en/models/overview",
      },
      {
        label: "Anthropic launches Claude Sonnet 5 as a cheaper way to run agents (TechCrunch)",
        url: "https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/",
      },
    ],
  },

  "gpt-6-astra": {
    lede:
      "GPT-6 Astra is OpenAI's flagship model, shipped 3 September 2026 as a limited preview before wider release the next day. OpenAI calls it \"the world's most intelligent and aligned model,\" built on the company's largest pretraining run to date — the first to use more than 100,000 GPUs, run at its Stargate site in Texas.\n\nRidge tracks it as gpt-6-astra, distinct from the GPT-5.6 line (Sol, Terra, Luna) it succeeds. It is also OpenAI's first model to cross the \"Critical\" cybersecurity threshold under the company's Preparedness Framework, which triggered extra deployment restrictions and a staged rollout rather than a same-day full release.",
    framing:
      "OpenAI pitches Astra as a generational leap across cybersecurity, professional work, software engineering, and science, with president Greg Brockman suggesting it could eventually be seen as an arrival of AGI. The release is also framed around safety: OpenAI says it delayed Astra after a July 2026 Hugging Face data-handling incident to add safeguards, and crossing the Critical cyber threshold means cybersecurity-focused access is gated behind an application program rather than open at launch.",
    rollout: [
      {
        date: "2026-09-03",
        text: "Limited preview to approved users; companies in OpenAI's application-based cybersecurity program get first access. Codex CLI v0.153.1 ships hours later with first-class Astra support.",
      },
      {
        date: "2026-09-04",
        text: "General availability begins: rollout to ChatGPT Plus, Pro, Business, and Enterprise, the OpenAI API, and Amazon Bedrock/AWS, described as arriving \"over the coming days.\" Microsoft Foundry (Azure AI) lists gpt-6-astra in its model catalog the same day.",
      },
    ],
    rolloutNote:
      "In ChatGPT, Astra surfaces as GPT-6 Pro on Pro, Business, and Enterprise plans; standard Plus chat does not get GPT-6 Pro. Enterprise workspace admins must manually enable Astra — it is off by default at launch. GPT-5.6 Sol, Terra, and Luna (shipped 9 July 2026) are OpenAI's prior line, not folded into this row.",
    claims: [
      "\"The world's most intelligent and aligned model\" (company framing), built on OpenAI's largest pretraining run to date — first to use more than 100,000 GPUs.",
      "Generational leap in cybersecurity, professional work, software engineering, and science (company-reported); described as nearly 2x faster at computer use than prior models.",
      "98% on FrontierMath Tier 4, 99.9% on ARC-AGI-3, and 100% on ExploitBench, tested without production safeguards (company-reported).",
      "First OpenAI model to cross the Critical cybersecurity threshold under the Preparedness Framework — able to find and exploit novel vulnerabilities in hardened targets without step-by-step human guidance (company classification).",
      "President Greg Brockman suggested Astra could eventually be seen as the arrival of AGI.",
    ],
    vendorEvalsNote:
      "FrontierMath, ARC-AGI-3, and ExploitBench figures above are OpenAI's own launch numbers. Ridge's live catalog score (AA Index) is tracked separately on this model's catalog row and is the only board number this site treats as verified.",
    specs: [
      { label: "Model id", value: "gpt-6-astra" },
      { label: "Context", value: "1,050,000 tokens (922K max input)" },
      { label: "Max output", value: "128,000 tokens" },
      { label: "Knowledge cutoff", value: "30 April 2026" },
      { label: "Modalities", value: "Text + image in, text out" },
      { label: "Reasoning", value: "Configurable effort: low / medium / high / xhigh / max" },
      {
        label: "Tools",
        value: "Function calling, structured outputs, web search, file search, code interpreter, computer use",
      },
      {
        label: "Price (standard)",
        value: "$10 input / $1 cached input / $12.50 cache write / $50 output per 1M tokens",
      },
      { label: "Price (Fast mode)", value: "Roughly 2x the standard rate for faster inference" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "OpenAI" },
    ],
    whereUsed: [
      "ChatGPT (Plus, Pro, Business, Enterprise)",
      "Codex",
      "Codex CLI",
      "OpenAI API",
      "Microsoft Azure AI Foundry",
      "Amazon Bedrock / AWS",
      "OpenRouter",
    ],
    sources: [
      { label: "GPT-6 Astra — OpenAI", url: "https://openai.com/index/gpt-6-astra/" },
      {
        label: "GPT-6 Astra system card — OpenAI Deployment Safety Hub",
        url: "https://deploymentsafety.openai.com/gpt-6-astra",
      },
      {
        label: "GPT-6 Astra model docs — OpenAI API",
        url: "https://developers.openai.com/api/docs/models/gpt-6-astra",
      },
      {
        label:
          "OpenAI launches GPT-6 Astra, its first model to cross a critical cybersecurity threshold — CSO Online",
        url: "https://www.csoonline.com/article/4218679/openai-launches-gpt-6-astra-its-first-model-to-cross-a-critical-cybersecurity-threshold.html",
      },
      {
        label: "OpenAI announces rollout of GPT-6 Astra model — CNBC",
        url: "https://www.cnbc.com/2026/09/03/open-ai-astra-gpt-6-cyber.html",
      },
    ],
  },

  "gpt-5.6-sol": {
    lede:
      "GPT-5.6 Sol is the flagship of OpenAI's GPT-5.6 family — Sol, Terra, and Luna — previewed 26 June 2026 and launched to general availability on 9 July 2026. OpenAI built it for frontier reasoning and long-horizon agentic work, sitting above Terra and Luna as the top of the three-model tier.\n\nRidge tracks Sol as its own catalog row, distinct from Terra and Luna despite the shared ship date. It is also OpenAI's prior flagship, since superseded by GPT-6 Astra on 3 September 2026.",
    framing:
      "OpenAI positions Sol as the model for developers and enterprises running frontier reasoning and long agent loops, adding a new \"max\" reasoning-effort tier and an \"Ultra\" mode that spins up subagents for complex work. The company leaned on its own launch benchmark tables (Terminal-Bench 2.1, ExploitBench, biology evals); independent boards are what Ridge actually scores against.",
    rollout: [
      {
        date: "2026-06-26",
        text: "OpenAI previews the GPT-5.6 family (Sol, Terra, Luna), initially limited to a small group of trusted partner organizations.",
      },
      {
        date: "2026-07-09",
        text: "General availability. Sol, Terra, and Luna ship together across ChatGPT, Codex, and the API.",
      },
      {
        date: "2026-07-30",
        text: "OpenAI's second pricing move on the family cuts Luna and Terra prices; Sol's price is left unchanged.",
      },
    ],
    rolloutNote:
      "A U.S. government AI safety review preceded the 9 July general release. Sol shipped as one of three GPT-5.6 models; don't fold its numbers into Terra's or Luna's.",
    claims: [
      "\"Frontier reasoning and long-horizon agentic work\" is how OpenAI frames Sol's role atop the family (company framing).",
      "New SOTA on Terminal-Bench 2.1 among OpenAI's own models at launch (company-reported).",
      "Competitive ExploitBench results using roughly one-third of the output tokens of competing systems (company-reported).",
      "Biology evals roughly 9 points above GPT-5.5 on Human Pathogen Capabilities, with gains on Virology and Molecular Biology too (company-reported).",
      "New \"max\" reasoning-effort tier and an \"Ultra\" subagent mode for accelerating complex work.",
    ],
    vendorEvalsNote:
      "Terminal-Bench, ExploitBench, and biology-eval figures above are OpenAI's own launch numbers, not Ridge-verified scores. Ridge's live catalog score (AA Index) is tracked separately and is the number this site treats as verified.",
    specs: [
      { label: "Model id", value: "gpt-5.6-sol" },
      { label: "Context", value: "1,000,000 tokens" },
      { label: "Max output", value: "128,000 tokens" },
      { label: "Knowledge cutoff", value: "16 February 2026" },
      { label: "Modalities", value: "Text; image input with detail:original to avoid resizing" },
      {
        label: "Tools",
        value: "Programmatic Tool Calling, multi-agent subagent spin-up, prompt cache breakpoints, function calling",
      },
      { label: "Price", value: "$5 input / $30 output per 1M tokens (unchanged since launch)" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "OpenAI" },
    ],
    whereUsed: ["ChatGPT", "Codex", "OpenAI API"],
    sources: [
      {
        label: "GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI",
        url: "https://openai.com/index/gpt-5-6/",
      },
      {
        label: "Previewing GPT-5.6 Sol — OpenAI",
        url: "https://openai.com/index/previewing-gpt-5-6-sol/",
      },
      {
        label: "Introducing GPT-5.6 series: Sol, Terra and Luna — OpenAI Developer Community",
        url: "https://community.openai.com/t/introducing-gpt-5-6-series-sol-terra-and-luna-coming-july-9-10am-pt/1384931",
      },
      {
        label: "The new GPT-5.6 family: Luna, Terra, Sol — Simon Willison",
        url: "https://simonwillison.net/2026/Jul/9/gpt-5-6/",
      },
      {
        label: "Advancing the price-performance frontier with GPT-5.6 — OpenAI",
        url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/",
      },
    ],
  },

  "gpt-5.6-terra": {
    lede:
      "GPT-5.6 Terra is the mid-tier model in OpenAI's GPT-5.6 family, sitting between flagship Sol and budget Luna. It shipped alongside them on 9 July 2026, after a 26 June preview limited to a small group of partner organizations.\n\nOpenAI's pitch for Terra is GPT-5.5-competitive performance at roughly half the cost of that older flagship — an everyday-default tier rather than a scaled-down Sol.",
    framing:
      "OpenAI frames Terra as the balanced, everyday pick in the family — enough capability for most production traffic at a lower price than Sol, aimed at teams that don't need Sol's top reasoning tier on every call.",
    rollout: [
      {
        date: "2026-06-26",
        text: "Previewed alongside Sol and Luna, limited to a small group of trusted partner organizations.",
      },
      {
        date: "2026-07-09",
        text: "General availability alongside Sol and Luna.",
      },
      {
        date: "2026-07-30",
        text: "OpenAI cuts Terra's price 20%, from $2.50 / $15 to $2 / $12 per 1M input/output tokens; Sol's price holds.",
      },
    ],
    rolloutNote:
      "Terra shipped as part of the three-model GPT-5.6 family, not as a standalone release; Ridge tracks it as its own catalog row, separate from Sol and Luna.",
    claims: [
      "GPT-5.5-competitive performance at roughly half the cost of that model (company-reported).",
      "Positioned as the right default for most production traffic, between Sol's top-tier reasoning and Luna's low-cost tier (company framing).",
    ],
    vendorEvalsNote:
      "OpenAI has published fewer standalone Terra benchmark tables than for Sol and Luna; the GPT-5.5 comparison above is the company's own framing, not a Ridge-verified number.",
    specs: [
      { label: "Model id", value: "gpt-5.6-terra" },
      { label: "Context", value: "1,000,000 tokens" },
      { label: "Max output", value: "128,000 tokens" },
      { label: "Knowledge cutoff", value: "16 February 2026" },
      { label: "Modalities", value: "Text; image input with detail:original to avoid resizing" },
      {
        label: "Tools",
        value: "Programmatic Tool Calling, multi-agent subagent spin-up, prompt cache breakpoints, function calling",
      },
      { label: "Price (current, since 30 Jul 2026)", value: "$2 input / $12 output per 1M tokens" },
      { label: "Price (launch)", value: "$2.50 input / $15 output per 1M tokens (superseded)" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "OpenAI" },
    ],
    whereUsed: ["ChatGPT", "Codex", "OpenAI API", "OpenRouter"],
    sources: [
      {
        label: "GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI",
        url: "https://openai.com/index/gpt-5-6/",
      },
      {
        label: "Advancing the price-performance frontier with GPT-5.6 — OpenAI",
        url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/",
      },
      {
        label: "GPT-5.6 API Price Cut: Luna Falls 80%, Terra Falls 20% — Eden AI",
        url: "https://www.edenai.co/post/openai-cuts-gpt-5-6-api-prices-luna-falls-80-terra-20-sol-holds",
      },
      {
        label: "GPT-5.6 Terra — API Pricing & Benchmarks — OpenRouter",
        url: "https://openrouter.ai/openai/gpt-5.6-terra",
      },
    ],
  },

  "gpt-5.6-luna": {
    lede:
      "GPT-5.6 Luna is the fast, low-cost tier of OpenAI's GPT-5.6 family, positioned below Sol and Terra. It previewed 26 June 2026 with the rest of the family, reached general availability on 9 July 2026, and then got a steep price cut three weeks later.\n\nRidge's catalog price for Luna reflects that post-cut rate, not the July 9 launch price.",
    framing:
      "OpenAI pitches Luna as the fastest, most affordable member of the family — a small model meant to compete on cost-per-token against rivals' cheap tiers while holding up on coding and agentic benchmarks.",
    rollout: [
      {
        date: "2026-06-26",
        text: "Previewed alongside Sol and Terra, limited to a small group of partner organizations.",
      },
      {
        date: "2026-07-09",
        text: "General availability alongside Sol and Terra, at launch pricing of $1 input / $6 output per 1M tokens.",
      },
      {
        date: "2026-07-30",
        text: "OpenAI cuts Luna's price 80%, to $0.20 input / $1.20 output per 1M tokens, attributing the drop to serving-stack optimization (hardware routing, inference software, context caching) rather than a margin call.",
      },
    ],
    rolloutNote:
      "Luna shipped as part of the three-model GPT-5.6 family alongside Sol and Terra; the 30 July price cut applied to Luna and Terra, not Sol.",
    claims: [
      "Fastest, most affordable model in the GPT-5.6 family (company framing).",
      "84.7% on Terminal-Bench 2.1 at launch pricing — within a point of GPT-5.5's 85.6% at a fraction of the price (company-reported).",
      "Company attributes the 30 July price cut to serving-stack optimization, not a margin decision.",
    ],
    vendorEvalsNote:
      "The Terminal-Bench figure above is OpenAI's own number from launch coverage, not a Ridge-verified score. Ridge's own catalog score is the source of truth for this site's Luna ranking.",
    specs: [
      { label: "Model id", value: "gpt-5.6-luna" },
      { label: "Context", value: "1,000,000 tokens" },
      { label: "Max output", value: "128,000 tokens" },
      { label: "Knowledge cutoff", value: "16 February 2026" },
      { label: "Modalities", value: "Text; image input with detail:original to avoid resizing" },
      {
        label: "Tools",
        value: "Programmatic Tool Calling, multi-agent subagent spin-up, prompt cache breakpoints, function calling",
      },
      { label: "Price (current, since 30 Jul 2026)", value: "$0.20 input / $1.20 output per 1M tokens" },
      { label: "Price (launch)", value: "$1 input / $6 output per 1M tokens (superseded)" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "OpenAI" },
    ],
    whereUsed: ["ChatGPT", "Codex", "OpenAI API"],
    sources: [
      {
        label: "GPT-5.6: Frontier intelligence that scales with your ambition — OpenAI",
        url: "https://openai.com/index/gpt-5-6/",
      },
      {
        label: "Advancing the price-performance frontier with GPT-5.6 — OpenAI",
        url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/",
      },
      {
        label: "AI price wars: OpenAI cuts GPT-5.6 Luna prices by 80% — VentureBeat",
        url: "https://venturebeat.com/technology/ai-price-wars-openai-cuts-gpt-5-6-luna-prices-by-80-as-model-competition-shifts-toward-cost",
      },
    ],
  },

  "gemini-3.8-flash": {
    lede:
      "Gemini 3.8 Flash is Google DeepMind's third Flash-tier release in about six weeks, landing three weeks after 3.7 Flash on the same post-training cadence. It is built on top of 3.7 Flash rather than a fresh pretrain, and Google pitches it as the same speed and price tier with a real step up on long-horizon coding and agent tasks.\n\nRidge tracks it as its own row, separate from 3.7 Flash. Google shipped a second, access-gated variant alongside it — Gemini 3.8 Flash Cyber, for vetted cybersecurity defenders — which is a distinct model and not covered by this entry.",
    framing:
      "Google frames 3.8 Flash as \"our best reasoning and coding model yet, at the same speed and low cost\" as its predecessor, aimed squarely at long-running engineering tasks and autonomous agents. The company notes the model now trades tokens for accuracy on hard problems — more reasoning steps and more tool calls per task — rather than chasing a flat speed number.",
    rollout: [
      { date: "2026-08-13", text: "Gemini 3.7 Flash ships (prior Flash row; not this model)." },
      {
        date: "2026-09-02",
        text: "Gemini 3.8 Flash announced and released, alongside the access-gated Gemini 3.8 Flash Cyber variant.",
      },
    ],
    rolloutNote:
      "Google's own post frames this as the third Flash-tier release in roughly six weeks (3.6 Flash, then 3.7 Flash, then 3.8 Flash), all on the same base-price tier with the same introductory-pricing clock.",
    claims: [
      "Outperforms most larger frontier models on DeepSWE v1.1 for complex software-engineering tasks (company-reported).",
      "Exceeds other frontier models on the Vals Finance Agent V2 and Harvey Legal Agent benchmarks (company-reported).",
      "54.9% on HLE-Verified for multi-step reasoning across STEM and professional fields (company-reported).",
      "Meaningful gains in prompt-injection robustness on Gray Swan evaluations (company-reported).",
    ],
    vendorEvalsNote:
      "All of the above are Google's own launch-day benchmark claims, run on Google's suites. Ridge's live catalog score for gemini-3.8-flash is this site's own tracked number and is not restated here.",
    specs: [
      { label: "Model id", value: "gemini-3.8-flash" },
      { label: "Context", value: "1,048,576 tokens input" },
      { label: "Max output", value: "65,536 tokens" },
      { label: "Knowledge cutoff", value: "March 2026 (some domains limited to January 2025)" },
      { label: "Modalities", value: "Text, image, video, audio, PDF in; text out" },
      { label: "Reasoning", value: "Selectable thinking levels: low / medium (default) / high (no minimal tier)" },
      { label: "Tools", value: "Function calling, code execution, file search, URL context, Maps grounding" },
      { label: "Price (intro, through 2026-12-31)", value: "$0.75 input / $3.75 output per 1M tokens" },
      { label: "Price (standard, from 2027-01-01)", value: "$1.50 input / $7.50 output per 1M tokens" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Google DeepMind" },
    ],
    whereUsed: [
      "Gemini API",
      "Google AI Studio",
      "Android Studio",
      "Google Antigravity",
      "Stitch",
      "Gemini Enterprise",
      "Gemini app (Pro/Ultra)",
      "Google Search AI Mode",
      "Google Sheets",
    ],
    sources: [
      {
        label: "Google Blog — Introducing Gemini 3.8 Flash and 3.8 Flash Cyber",
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/",
      },
      {
        label: "Google AI for Developers — Gemini 3.8 Flash model page",
        url: "https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash",
      },
      {
        label: "Google DeepMind — Gemini 3.8 Flash model card",
        url: "https://deepmind.google/models/model-cards/gemini-3-8-flash/",
      },
    ],
  },

  "gemini-3.7-flash": {
    lede:
      "Gemini 3.7 Flash is Google DeepMind's workhorse Flash-tier model for coding, agents, and knowledge work, released in mid-August 2026. Google calls it the family's \"most intelligent workhorse model,\" with gains focused on software-engineering tasks like debugging and issue resolution plus stronger web-development and video-understanding performance.\n\nIt was superseded three weeks later by Gemini 3.8 Flash, which Ridge tracks as a separate row. 3.7 Flash is its own entry, not a stand-in for 3.8.",
    framing:
      "Google positions 3.7 Flash as the next iteration in the Gemini 3 family aimed at coding and agentic workflows at speed-tier pricing, with \"customizable thinking configurations to control the mix of quality, cost, and latency\" rather than a single fixed reasoning setting.",
    rollout: [
      {
        date: "2026-08-13",
        text: "Announced and released. Available via the Gemini API, Google AI Studio, Google Antigravity, and Gemini Enterprise Agent Platform.",
      },
      { date: "2026-09-02", text: "Superseded on the Flash tier by Gemini 3.8 Flash, three weeks later." },
    ],
    claims: [
      "Stronger on coding tasks such as debugging and issue resolution versus the prior Flash release (company-reported).",
      "Improved knowledge-work and web-development performance (company-reported).",
      "Enhanced video understanding across the same 1M-token context window (company-reported).",
    ],
    vendorEvalsNote:
      "These are Google's own launch claims relative to its prior Flash release, not independently verified numbers. Ridge's live catalog score for gemini-3.7-flash is this site's own tracked figure and is not restated here.",
    specs: [
      { label: "Model id", value: "gemini-3.7-flash" },
      { label: "Context", value: "1,000,000 tokens input" },
      { label: "Max output", value: "64,000 tokens" },
      { label: "Knowledge cutoff", value: "March 2026 (some domains limited to January 2025)" },
      { label: "Modalities", value: "Text, image, audio, video in; text out" },
      { label: "Reasoning", value: "Customizable thinking configuration (quality/cost/latency tradeoff)" },
      { label: "Tools", value: "Agentic tool use / function calling" },
      { label: "Price (through 2026-12-31)", value: "$0.75 input / $3.75 output per 1M tokens" },
      { label: "Price (from 2027-01-01)", value: "$1.50 input / $7.50 output per 1M tokens" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Google DeepMind" },
    ],
    whereUsed: ["Gemini API", "Google AI Studio", "Google Antigravity", "Gemini Enterprise", "Gemini app"],
    sources: [
      {
        label: "Google Blog — Introducing Gemini 3.7 Flash",
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/",
      },
      {
        label: "Google DeepMind — Gemini 3.7 Flash model card",
        url: "https://deepmind.google/models/model-cards/gemini-3-7-flash/",
      },
    ],
  },

  "gemini-3.1-pro": {
    lede:
      "Gemini 3.1 Pro is Google DeepMind's current top-tier Pro model, positioned for advanced coding, long-context and multimodal understanding, and algorithmic development. It remains the standing public Pro row because its would-be successor, Gemini 3.5 Pro, has missed repeated ship targets through mid-2026 and stays unreleased.\n\nGoogle's own announcement frames 3.1 Pro as a preview rollout across developer, enterprise, and consumer surfaces simultaneously, ahead of a wider general-availability push.",
    framing:
      "Google calls 3.1 Pro its most advanced model for complex tasks — built for problems \"where a simple answer isn't enough\" — and positions it against its own predecessor, Gemini 3 Pro, on reasoning and multimodal benchmarks rather than against external competitors.",
    rollout: [
      {
        date: "2026-02-19",
        text: "Announced in preview: Gemini API (Google AI Studio), Gemini CLI, Google Antigravity, and Android Studio for developers; Vertex AI and Gemini Enterprise for enterprise customers; Gemini app and NotebookLM (Pro/Ultra) for consumers.",
      },
    ],
    rolloutNote:
      "Google's own post is dated 2026-02-19 and describes 3.1 Pro as a preview rolling out across surfaces at once, with general availability to follow \"to validate these updates.\" Ridge's catalog lists the model's release date as 2026-03-01.",
    claims: [
      "77.1% verified on ARC-AGI-2, more than double Gemini 3 Pro's reasoning score on the same benchmark (company-reported).",
      "Significant gains in agentic tool-use benchmarks over Gemini 3 Pro (company-reported).",
    ],
    vendorEvalsNote:
      "The ARC-AGI-2 figure and other comparisons above are Google's own launch numbers, measured against its prior Gemini 3 Pro, not an independent board. Ridge's live catalog score for gemini-3.1-pro is this site's own tracked figure and is not restated here.",
    specs: [
      { label: "Model id", value: "gemini-3.1-pro" },
      { label: "Context", value: "1,000,000 tokens input" },
      { label: "Max output", value: "64,000 tokens" },
      { label: "Modalities", value: "Text, image, audio, video, and code repositories in; text out" },
      { label: "Reasoning", value: "Deep Think mode available" },
      { label: "Tools", value: "Agentic tool use" },
      { label: "Weights", value: "Closed" },
      { label: "Lab", value: "Google DeepMind" },
    ],
    whereUsed: [
      "Gemini API",
      "Google AI Studio",
      "Gemini CLI",
      "Google Antigravity",
      "Android Studio",
      "Vertex AI",
      "Gemini Enterprise",
      "Gemini app",
      "NotebookLM",
    ],
    sources: [
      {
        label: "Google Blog — Gemini 3.1 Pro: A smarter model for your most complex tasks",
        url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-1-pro/",
      },
      {
        label: "Google DeepMind — Gemini 3.1 Pro model card",
        url: "https://deepmind.google/models/model-cards/gemini-3-1-pro/",
      },
    ],
  },

  "muse-spark-1.3": {
    lede:
      "Muse Spark 1.3 is Meta Superintelligence Labs' fourth Muse Spark release in five months, shipped 2 September 2026 into Muse Code and the Meta Model API. This id is the xhigh tier — the version any developer with a standard API key can actually call, and Meta's target for it is long-horizon agentic coding: staying coherent across a single long thread, asking clarifying questions on ambiguous prompts, and checking in before consequential actions rather than one-shot generation.\n\nxhigh is not the only face of 1.3. Meta also cut a higher-effort \"max\" reasoning tier from the same release (tracked separately on Ridge as muse-spark-1.3-max), gated to a partner preview. Same model generation, two effort tiers — xhigh is the one that's actually GA.",
    framing:
      "Meta pitches 1.3 as a coding-agent efficiency release as much as a capability one: fewer tool calls and fewer tokens per task than 1.2, better handling of messy or conflicting instructions, and self-calibration about when to stop and ask rather than guess. The company's own comparison tables lean on the max tier for the biggest headline deltas, which is a tier most developers can't actually reach through xhigh.",
    rollout: [
      { date: "2026-04", text: "Original Muse Spark debuts." },
      {
        date: "2026-07-09",
        text: "Muse Spark 1.1 ships alongside the Meta Model API's public preview.",
      },
      {
        date: "2026-08-05",
        text: "Muse Spark 1.2 ships, a coding-focused update, alongside the Muse Code beta terminal agent.",
      },
      {
        date: "2026-09-02",
        text: "Muse Spark 1.3 released. xhigh live same-day in Muse Code and the Meta Model API; max held back in partner preview pending additional safety testing.",
      },
    ],
    rolloutNote:
      "1.3 is a ~4-week follow-on to 1.2 (5 August 2026), not a renamed 1.2. Also available via OpenRouter as a third-party route to the same xhigh endpoint.",
    claims: [
      "~20% fewer tool calls and ~25% fewer tokens per coding task than Muse Spark 1.2 (company-reported).",
      "Improved handling of ambiguous or conflicting multi-step instructions without dropping constraints (company-reported).",
      "Trained across multiple agent harnesses for long-horizon coding workflows within a single thread (company-reported).",
      "On Meta's own benchmark table, the max tier scores meaningfully higher than this xhigh tier on some evals (e.g. OSWorld 2.0: 66.9 vs 57.2; GDPval-AA v2: 1,754 vs 1,709 Elo) but not all — xhigh edges max on Terminal-Bench 2.1 (89.2 vs 88.8) (company-reported).",
    ],
    vendorEvalsNote:
      "Benchmark deltas above are Meta's own comparison table between its two 1.3 tiers, not an independent board. Ridge's live catalog scores for muse-spark-1.3 are the source of truth for this site and are not restated here.",
    specs: [
      { label: "Model id", value: "muse-spark-1.3" },
      { label: "Tier", value: "xhigh (broadly available)" },
      { label: "Context", value: "1M tokens" },
      { label: "Modalities", value: "Multimodal in (text, image, video, documents), text out" },
      { label: "Tools", value: "Native tool / function calling, tuned for agentic harnesses" },
      { label: "Price", value: "$1.25 input / $4.25 output per 1M tokens" },
      {
        label: "Contributor tier price",
        value: "$0.10 input / $0.20 output per 1M tokens if you opt in to Meta training on your data",
      },
      { label: "Weights", value: "Closed / proprietary" },
      { label: "Lab", value: "Meta Superintelligence Labs (Meta)" },
    ],
    whereUsed: ["Muse Code", "Meta Model API", "OpenRouter"],
    sources: [
      {
        label: "Meta — Introducing Muse Spark 1.3",
        url: "https://research.meta.ai/blog/introducing-muse-spark-1-3",
      },
      {
        label: "Meta for Developers — Muse Spark model page",
        url: "https://developer.meta.com/ai/models/muse-spark/",
      },
      {
        label: "eesel AI — Muse Spark 1.3 benchmarks, pricing, and what changed",
        url: "https://www.eesel.ai/blog/muse-spark-1-3",
      },
      {
        label: "MarkTechPost — Meta AI Released Muse Spark 1.3",
        url: "https://www.marktechpost.com/2026/09/03/meta-ai-released-muse-spark-1-3-an-agentic-coding-model-that-uses-20-fewer-tool-calls-and-25-fewer-tokens-than-muse-spark-1-2/",
      },
    ],
  },

  "muse-spark-1.3-max": {
    lede:
      "Muse Spark 1.3 max is the higher-effort reasoning tier of the same 2 September 2026 Muse Spark 1.3 release — not a separate model generation, and not the version most developers can actually call. Meta ships it as a partner preview only: the company says it's still completing additional safety testing before opening it more broadly, and as of early September no API provider lists a general endpoint for it.\n\nThe counterpart to this row is muse-spark-1.3-xhigh (tracked on Ridge as muse-spark-1.3), which shipped GA the same day. Same underlying 1.3 release, two effort tiers — max is the one you likely can't get a key for.",
    framing:
      "Meta leans on max for its biggest 1.3 headline numbers, positioning it as the ceiling of what the release can do on hard agentic and computer-use evals. The company's own comparison table is more mixed than that framing suggests: max leads on some evals and xhigh actually edges it on others, so \"max\" isn't a strict upgrade across the board, just a differently-tuned, more expensive-to-run configuration.",
    rollout: [
      {
        date: "2026-09-02",
        text: "Muse Spark 1.3 announced. xhigh ships GA same-day; max is evaluated by Artificial Analysis only through a limited partner preview, gated on additional safety testing.",
      },
      {
        date: "2026-09",
        text: "As of early September, Meta says broader max access is coming \"shortly\"; no listed API provider offers it yet.",
      },
    ],
    rolloutNote:
      "Ridge lists max as status: partner because it has not reached general availability — this is an access-tier gap within the 1.3 release, not a delay of a whole new model version.",
    claims: [
      "Deeper multi-step reasoning and stronger results on select agentic/computer-use evals than the xhigh tier of the same release (company-reported): OSWorld 2.0 66.9 vs xhigh's 57.2; GDPval-AA v2 1,754 vs 1,709 Elo; JobBench 64.9 vs 61.2.",
      "Not a uniform win over xhigh: DeepSearchQA ties at 89.4 and xhigh actually scores higher on Terminal-Bench 2.1 (89.2 vs max's 88.8) (company-reported).",
      "Framed by Meta as still completing additional safety testing ahead of wider release, distinct from a capability limitation.",
    ],
    vendorEvalsNote:
      "These deltas come from Meta's own tier-comparison table, not an independent board — third-party evaluators (e.g. Artificial Analysis) have only been able to test max via a limited partner preview. Ridge's live catalog score for muse-spark-1.3-max is the source of truth for this site and is not restated here.",
    specs: [
      { label: "Model id", value: "muse-spark-1.3-max" },
      { label: "Tier", value: "max (partner preview, not GA)" },
      { label: "Context", value: "1M tokens" },
      { label: "Modalities", value: "Multimodal in (text, image, video, documents), text out" },
      { label: "Tools", value: "Native tool / function calling, tuned for agentic harnesses" },
      {
        label: "Price",
        value: "$1.25 input / $4.25 output per 1M tokens — same list price as the xhigh tier, despite max not being reachable with a standard API key",
      },
      { label: "Weights", value: "Closed / proprietary" },
      { label: "Lab", value: "Meta Superintelligence Labs (Meta)" },
    ],
    whereUsed: [
      "Limited partner preview (select Meta enterprise partners) — not on the general Muse Code or public Meta Model API endpoints as of this writing",
    ],
    sources: [
      {
        label: "Meta — Introducing Muse Spark 1.3",
        url: "https://research.meta.ai/blog/introducing-muse-spark-1-3",
      },
      {
        label: "Meta for Developers — Muse Spark model page",
        url: "https://developer.meta.com/ai/models/muse-spark/",
      },
      {
        label:
          "VentureBeat — Meta says Muse Spark 1.3 has frontier performance, but its best results come from a model developers can't broadly use yet",
        url: "https://venturebeat.com/technology/meta-says-muse-spark-1-3-has-frontier-performance-but-its-best-results-come-from-a-model-developers-cant-broadly-use-yet",
      },
      {
        label: "eesel AI — Muse Spark 1.3 benchmarks, pricing, and what changed",
        url: "https://www.eesel.ai/blog/muse-spark-1-3",
      },
    ],
  },

  "deepseek-v4.1-flash": {
    lede:
      "DeepSeek V4.1 Flash is the first model in DeepSeek's new Causal Encoder–Decoder (CED) architecture family: a 552B-parameter MoE split into a 20-layer causal encoder feeding a 20-layer decoder, with only 8B parameters active on input and 16B active on output. It ships with native multimodal (vision + text) understanding baked into the architecture rather than bolted on.\n\nIt also inherits DeepSeek's outgoing flagship's traffic. Starting 2026-09-14, the `deepseek-v4-pro` API alias stops serving V4 Pro and routes to this model instead, at Flash pricing, until a V4.1-Pro ships. Ridge keeps this as its own catalog row regardless of what a caller's code still asks for by name.",
    framing:
      "DeepSeek pitches V4.1 Flash as a smaller, cheaper model that beats its own prior flagship rather than just approximating it: the company cites tests \"by multiple parties\" putting V4.1-Flash ahead of V4-Pro on performance, cost, speed, and total completion time. The framing leans hard on efficiency — a redesigned KV cache that needs a quarter of the HBM and an eighth of the SSD storage of the prior generation — as the reason a Flash-tier model can absorb Pro-tier traffic.",
    rollout: [
      {
        date: "2026-04-24",
        text: "DeepSeek previews the V4 series (Pro and Flash) with open MIT-licensed weights alongside API access.",
      },
      {
        date: "2026-07-31",
        text: "V4-Flash (the prior generation) exits preview into public API beta as deepseek-v4-flash.",
      },
      {
        date: "2026-09-10",
        text: "V4.1-Flash formally launches. Model id deepseek-flash; native multimodal support; new peak/off-peak pricing takes effect at 04:00 UTC.",
      },
      {
        date: "2026-09-14",
        text: "At 04:00 UTC, deepseek-v4-pro requests begin routing to V4.1-Flash at Flash pricing, continuing until V4.1-Pro ships.",
      },
    ],
    rolloutNote:
      "This release also retires the older V4-Flash generation: the legacy ids deepseek-v4-flash and deepseek-v4-flash-vision-exp are temporarily routed to V4.1-Flash for compatibility rather than serving the old weights.",
    claims: [
      "DeepSeek says tests \"by multiple parties\" put V4.1-Flash ahead of V4-Pro on performance, cost, speed, and total runtime (company-reported).",
      "New KV-cache design needs roughly 1/4 the HBM and 1/8 the SSD storage of the prior generation, per DeepSeek.",
      "Native multimodal (vision + text) understanding is built into the CED architecture rather than added via a separate vision branch.",
    ],
    vendorEvalsNote:
      "The V4.1-Flash-beats-V4-Pro claim comes from DeepSeek's own launch post; Ridge has not yet scored this model on its live board, so no independent Ridge number is available to check it against.",
    specs: [
      { label: "Model id", value: "deepseek-flash" },
      {
        label: "Architecture",
        value: "Causal Encoder–Decoder (CED), 40 layers (20 encoder + 20 decoder), CSA2 KV compression",
      },
      { label: "Parameters", value: "552B MoE total; 8B active on input, 16B active on output" },
      { label: "Context", value: "1M tokens" },
      { label: "Modalities", value: "Multimodal (text + vision) in, text out" },
      { label: "Price (peak, cache miss)", value: "$0.30 input / $1.20 output per 1M tokens" },
      { label: "Price (peak, cache hit)", value: "$0.006 per 1M cached input tokens" },
      { label: "Price (off-peak)", value: "Roughly half the peak rates" },
      { label: "Weights", value: "Open (MIT), published on Hugging Face" },
      { label: "Lab", value: "DeepSeek" },
    ],
    whereUsed: ["DeepSeek API", "DeepSeek app / web", "Hugging Face (open weights)", "OpenRouter"],
    sources: [
      {
        label: "DeepSeek API Docs — DeepSeek-V4.1-Flash: Smarter, Faster, More Efficient",
        url: "https://api-docs.deepseek.com/news/news260910/",
      },
      {
        label: "DeepSeek — Introducing DeepSeek-V4.1-Flash",
        url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/",
      },
      { label: "DeepSeek API Docs — Change Log", url: "https://api-docs.deepseek.com/updates/" },
      {
        label: "Hugging Face — deepseek-ai/DeepSeek-V4.1-Flash",
        url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash",
      },
      {
        label: "TechNode — DeepSeek formally launches V4.1 Flash, routes V4 Pro requests to Flash",
        url: "https://technode.com/2026/09/10/deepseek-formally-launches-v4-1-flash-routes-v4-pro-requests-to-flash/",
      },
    ],
  },

  "deepseek-v4-pro": {
    lede:
      "DeepSeek V4 Pro is the 1.6T-parameter MoE flagship (49B active per token) that left preview for general availability on 2026-08-12/13, built around agent workloads: tool use, multi-step workflows, and a native OpenAI Responses API path tuned for Codex-style integrations.\n\nIts run as the named flagship is short. Barely a month after GA, DeepSeek is phasing the Pro line out in favor of its new architecture: starting 2026-09-14, the deepseek-v4-pro API alias stops serving this model and instead routes to DeepSeek V4.1 Flash at Flash pricing, until a dedicated V4.1-Pro ships. Ridge keeps V4 Pro as its own catalog row and does not fold it into V4.1 Flash's scores.",
    framing:
      "At GA, DeepSeek framed V4 Pro as a production-grade agent upgrade over its April preview build, with selectable reasoning effort and first-class support for tool-calling agent harnesses. Weeks later the company's own framing shifted: its V4.1 Flash launch post describes that smaller, newer-architecture model as beating V4 Pro on performance, cost, speed, and total runtime — the stated reason API traffic is being redirected away from Pro rather than kept on it.",
    rollout: [
      {
        date: "2026-04-24",
        text: "V4 series (Pro and Flash) previewed with open MIT-licensed weights and API access.",
      },
      {
        date: "2026-08-12",
        text: "DeepSeek V4 Pro reaches general availability (build 0813) on app, web (Expert Mode), and API.",
      },
      {
        date: "2026-08-16",
        text: "At 16:00 UTC, new peak/off-peak pricing takes effect, with off-peak rates roughly half of peak.",
      },
      {
        date: "2026-09-14",
        text: "At 04:00 UTC, deepseek-v4-pro requests begin routing to V4.1-Flash at Flash pricing, continuing until V4.1-Pro ships.",
      },
    ],
    rolloutNote:
      "As of this writing, deepseek-v4-pro is a live but sunsetting alias: calls made against it after 2026-09-14 04:00 UTC are actually served by the newer V4.1-Flash weights at V4.1-Flash's price, not by the V4 Pro model described in this entry's specs. DeepSeek says a proper V4.1-Pro is coming later to replace it outright.",
    claims: [
      "GA release delivers \"major agent upgrades with strong production gains\" over the April preview build (company-reported).",
      "Selectable reasoning effort: non-thinking, high, and max modes for different task complexity.",
      "Native OpenAI Responses API support, with the company citing optimization for Codex-style integrations.",
      "DeepSeek's own V4.1-Flash launch post claims that smaller model now beats V4 Pro on performance, cost, speed, and total runtime (company-reported, dated after this GA).",
    ],
    vendorEvalsNote:
      "Ridge's own SWE-bench score for this model is tracked separately in the live catalog and is not restated here. The claim that V4.1-Flash outperforms V4 Pro comes from DeepSeek's own announcement, not from an independent board.",
    specs: [
      { label: "Model id", value: "deepseek-v4-pro (routes to V4.1-Flash after 2026-09-14 04:00 UTC)" },
      { label: "Architecture", value: "MoE with Compressed Sparse Attention / Heavily Compressed Attention" },
      { label: "Parameters", value: "1.6T total MoE; 49B active per token" },
      { label: "Context", value: "1M tokens (up to 384K output tokens)" },
      { label: "Reasoning", value: "Non-thinking, high-effort, and max-effort modes" },
      { label: "Tools", value: "Native tool use; OpenAI Responses API and Anthropic Messages API support" },
      { label: "Price", value: "$1.32 input / $3.96 output per 1M tokens (peak; off-peak roughly half)" },
      { label: "Weights", value: "Open (MIT), published on Hugging Face" },
      { label: "Lab", value: "DeepSeek" },
    ],
    whereUsed: [
      "DeepSeek API",
      "DeepSeek app / web (Expert Mode)",
      "Hugging Face (open weights)",
      "OpenRouter",
      "DeepInfra",
    ],
    sources: [
      {
        label: "DeepSeek API Docs — DeepSeek-V4-Pro GA Release",
        url: "https://api-docs.deepseek.com/news/news260813/",
      },
      { label: "DeepSeek API Docs — Change Log", url: "https://api-docs.deepseek.com/updates/" },
      {
        label: "Unite.AI — DeepSeek Ships V4 Pro as Its Flagship Model Leaves Preview",
        url: "https://www.unite.ai/deepseek-ships-v4-pro-as-its-flagship-model-leaves-preview/",
      },
      {
        label: "DeepSeek API Docs — DeepSeek-V4.1-Flash: Smarter, Faster, More Efficient",
        url: "https://api-docs.deepseek.com/news/news260910/",
      },
      {
        label: "TechNode — DeepSeek formally launches V4.1 Flash, routes V4 Pro requests to Flash",
        url: "https://technode.com/2026/09/10/deepseek-formally-launches-v4-1-flash-routes-v4-pro-requests-to-flash/",
      },
    ],
  },

  "kimi-k3": {
    lede:
      "Kimi K3 is Moonshot AI's flagship open-weight release, a 2.8-trillion-parameter mixture-of-experts model (104B active per token) built for long-horizon coding, agentic workflows, and knowledge work. It shipped with a 1-million-token context window and native multimodal input (text, images, video), and Moonshot has billed it as the largest open-weight model publicly available.\n\nRidge tracks it as an open-weight flagship rather than a budget model — the license is free to self-host but not unconditionally permissive, and the per-token price moved up from Kimi's earlier value positioning to something closer to a premium closed-model rate.",
    framing:
      "Moonshot positions K3 as its most powerful open-source coding model to date, aimed at sustained engineering sessions, large-repo navigation, and terminal-tool orchestration rather than single-turn Q&A. The company's own launch materials cited third-party board results (Arena's Frontend Code leaderboard, Vals AI, Artificial Analysis) rather than only in-house numbers, while also acknowledging K3 trails rivals like Claude Fable 5 and GPT-5.6 Sol on some overall comparisons. The release also landed amid public accusations — including from a White House science and technology policy official — that Moonshot and other Chinese labs trained on distilled outputs from Western frontier models; Moonshot has not conceded the point.",
    rollout: [
      {
        date: "2026-07-16",
        text: "Announced. Moonshot published the model card, technical report, and benchmark claims; full weights promised by July 27.",
      },
      {
        date: "2026-07-22",
        text: "vLLM published a preview post on production-scale Kimi K3 serving support ahead of the public weight drop.",
      },
      {
        date: "2026-07-26",
        text: "Full model weights published on Hugging Face (moonshotai/Kimi-K3), a day ahead of the announced July 27 target.",
      },
    ],
    rolloutNote:
      "Ridge's catalog date (2026-07-16) marks the announcement; the downloadable weights followed about ten days later on Hugging Face under the custom Kimi K3 License.",
    claims: [
      "Moonshot's most powerful open-source coding model to date, and (company-reported) the largest open-weight LLM publicly available at 2.8T parameters.",
      "Company-highlighted third-party results: ahead of Claude Fable 5 on LMArena's Frontend Code leaderboard (1,679 points); second overall behind Fable 5 and ahead of GPT-5.6 Sol on Vals AI; comparable to GPT-5.5 and Claude Opus 4.8 on Artificial Analysis.",
      "Moonshot itself notes K3 remains behind Fable 5 and GPT-5.6 Sol on some overall comparisons, while claiming an edge on selected coding, agentic, and hardware-optimization tests (company-reported).",
      "Built for long-running agent loops: sustained engineering sessions, large-repository navigation, and terminal tool orchestration (company description).",
    ],
    vendorEvalsNote:
      "All benchmark comparisons above are Moonshot's own launch framing, including the third-party leaderboard results it chose to cite. Ridge's live catalog score is this site's own measurement and is not restated here when it disagrees with any vendor-cited number.",
    specs: [
      { label: "Model id", value: "kimi-k3 (moonshotai/Kimi-K3 on Hugging Face)" },
      {
        label: "Architecture",
        value: "Mixture-of-experts, 2.8T total params / 104B activated per token; 896 routed experts (16 selected) + 2 shared",
      },
      { label: "Context", value: "1,048,576 tokens (1M)" },
      {
        label: "Modalities",
        value: "Native multimodal in (text, images, video) via MoonViT-V2 vision encoder; text out",
      },
      {
        label: "Price",
        value: "$3 input (cache-miss) / $0.30 input (cache-hit) / $15 output per 1M tokens — no long-context surcharge",
      },
      {
        label: "License",
        value: "Kimi K3 License (custom, open-weight); separate commercial agreement required above $20M/yr in Model-as-a-Service revenue",
      },
      { label: "Weights", value: "Open — published on Hugging Face 2026-07-26" },
      { label: "Lab", value: "Moonshot AI" },
    ],
    whereUsed: ["Moonshot API (platform.kimi.ai)", "Hugging Face (weights)", "OpenRouter", "vLLM", "SGLang", "Kimi Code CLI"],
    sources: [
      { label: "MoonshotAI/Kimi-K3 (GitHub)", url: "https://github.com/MoonshotAI/Kimi-K3" },
      { label: "moonshotai/Kimi-K3 model card (Hugging Face)", url: "https://huggingface.co/moonshotai/Kimi-K3" },
      {
        label: "Kimi K3 LICENSE (Hugging Face)",
        url: "https://huggingface.co/moonshotai/Kimi-K3/blob/main/LICENSE",
      },
      { label: "Kimi K3 — API Pricing & Benchmarks (OpenRouter)", url: "https://openrouter.ai/moonshotai/kimi-k3" },
      {
        label: "Moonshot AI Launches Kimi K3 (Pulse2)",
        url: "https://pulse2.com/moonshot-ai-launches-kimi-k3-for-advanced-reasoning-coding-and-knowledge-work/",
      },
      {
        label: "Moonshot's Kimi K3 pushes Chinese AI into Fable-level territory (Fortune)",
        url: "https://fortune.com/2026/07/16/moonshots-kimi-k3-pushes-chinese-ai-into-fable-level-territory/",
      },
      {
        label: "A Preview of Production-Scale Kimi K3 Support on vLLM",
        url: "https://vllm.ai/blog/2026-07-22-kimi-k3-preview",
      },
    ],
  },

  "glm-5.3": {
    lede:
      "GLM-5.3 is Zhipu AI's (Z.ai) flagship refresh of the GLM-5 line: the same roughly 753-billion-parameter Mixture-of-Experts base as GLM-5.2, carried forward with a heavier post-training pass rather than a fresh pretrain. Zhipu's own tagline is blunt about the scope — \"Built to Code. Ready for Cyber Defense\" — and the company says the entire jump over 5.2 came from post-training alone.\n\nRidge tracks it as its own row, separate from GLM-5.2 and from the lighter GLM-5.3-Flash sibling that shipped days later under a plain MIT license. The flagship's weights instead carry a bespoke \"glm-5.3\" license.",
    framing:
      "Zhipu positions GLM-5.3 as a coding-and-agent specialist first, cyber-defense second: its own comparison tables lean on Terminal-Bench 3.0, CyberGym, and Agents' Last Exam rather than general knowledge benchmarks. The company also staged the rollout deliberately — subscription access first, metered API and open weights later — which it frames as a safety-review process rather than a supply constraint.",
    rollout: [
      {
        date: "2026-08-14",
        text: "Launched behind GLM Coding Plan subscriptions and the ZCode CLI; no direct metered API yet.",
      },
      {
        date: "2026-08-18",
        text: "Direct token-metered API access went live at $1.40/$4.40 per 1M tokens; listed on OpenRouter the same day.",
      },
      {
        date: "2026-08-26",
        text: "GLM-5.3-Flash launched as a faster, smaller sibling under a plain MIT license.",
      },
      {
        date: "2026-08-28",
        text: "Open weights (753B total parameters) published on Hugging Face under the custom glm-5.3 license, after slipping past Zhipu's own two-week target.",
      },
    ],
    rolloutNote:
      "GLM-5.2's $1.40/$4.40 per-million-token pricing carried over unchanged when 5.3's metered API opened. The flagship's open-weight drop ran later than promised and landed under commercial-revenue-trigger terms, not the plain MIT license used for GLM-5.3-Flash.",
    claims: [
      "50% improvement in coding capability over GLM-5.2, per Zhipu's internal Z.ai Code Bench (company-reported).",
      "Terminal-Bench 3.0 score jumped from 4.6 to 28.3 — a 6.2x gain the company says leads open-source models (company-reported).",
      "CyberGym score of 84.5%, which Zhipu positions above GPT-5.6 Sol and roughly level with Claude Mythos 5 (company-reported).",
      "State-of-the-art claims among open-weight models on Agents' Last Exam (CLI) and several agent/automation suites, including AutomationBench and DeepSWE (company-reported).",
    ],
    vendorEvalsNote:
      "These are Zhipu's own launch benchmarks and comparison tables, labeled as such here. Ridge's live catalog score is this site's own tracked measure and is not restated from a vendor table.",
    specs: [
      { label: "Model id", value: "glm-5.3" },
      { label: "Architecture", value: "Mixture-of-Experts, ~753B total parameters" },
      { label: "Context", value: "1M tokens" },
      { label: "Max output", value: "128K tokens" },
      { label: "Modalities", value: "Text in, text out" },
      { label: "Reasoning", value: "Thinking always on; low / high / max effort tiers (default max)" },
      { label: "Tools", value: "Native function calling / tool use" },
      { label: "Price", value: "$1.40 input / $4.40 output per 1M tokens" },
      {
        label: "Weights",
        value: "Open — custom glm-5.3 license (MIT for the separate GLM-5.3-Flash variant)",
      },
      { label: "Lab", value: "Zhipu AI (Z.ai)" },
    ],
    whereUsed: [
      "Z.ai API",
      "BigModel.cn (China endpoint)",
      "GLM Coding Plan",
      "ZCode CLI",
      "OpenRouter",
      "Claude Code (via Z.ai's Anthropic-compatible endpoint)",
    ],
    sources: [
      { label: "Z.ai Developer Docs — GLM-5.3 Overview", url: "https://docs.z.ai/guides/llm/glm-5.3" },
      { label: "Hugging Face model card — zai-org/GLM-5.3", url: "https://huggingface.co/zai-org/GLM-5.3" },
      { label: "Apidog — What Is GLM-5.3?", url: "https://apidog.com/blog/what-is-glm-5-3/" },
      {
        label: "explainx.ai — GLM-5.3 Launch: Benchmarks, Pricing & Access",
        url: "https://www.explainx.ai/blog/glm-5-3-launch-cyber-defense-benchmarks-august-2026",
      },
    ],
  },

  "qwen-3.8-max": {
    lede:
      "Qwen3.8-Max is Alibaba's largest Qwen release to date: a 2.4-trillion-parameter sparse Mixture-of-Experts model with roughly 95 billion active parameters per token, previewed at WAIC Shanghai in July 2026 and taken to general availability weeks later. It is also the first Max-class Qwen to ship an open-weight sibling, Qwen3.8-2.4T-A95B — though that checkpoint is a trimmed, text-only build, not the full multimodal API model most comparison charts test.\n\nRidge tracks the hosted Qwen3.8-Max row here. A coding-and-agent-focused refresh, Qwen3.8-Max-0902, followed in September and is now the checkpoint most integrations default to.",
    framing:
      "Alibaba markets Qwen3.8-Max as a frontier-class flagship that undercuts closed peers on price while opening its weights for self-hosting — a combination the company leans on hard in its own launch materials. Its internal benchmark tables and arena-style rankings compare it directly against GPT, Claude, and Gemini flagships; those numbers come from Alibaba's own tables, not an independent board.",
    rollout: [
      {
        date: "2026-07-19",
        text: "Previewed at the World AI Conference (WAIC) in Shanghai, without a full benchmark table.",
      },
      {
        date: "2026-08-03",
        text: "General availability announced with full benchmark tables and $2/$6 per-1M-token pricing.",
      },
      {
        date: "2026-08-12",
        text: "Open weights released as Qwen3.8-2.4T-A95B (text-only, 262K native context extensible to ~1.01M) on Hugging Face and ModelScope.",
      },
      {
        date: "2026-09-02",
        text: "Qwen3.8-Max-0902 shipped as a post-training refresh focused on coding and long-horizon agent work; superseded the 0803 checkpoint on OpenRouter by Sept 5.",
      },
    ],
    rolloutNote:
      "The open-weight checkpoint drops vision input and ships with a smaller native context (262K, extensible to ~1.01M) than the hosted Max API's 1M-token default — \"open-weight\" here means that trimmed build, not the multimodal model most benchmark boards cite.",
    claims: [
      "Alibaba positions Qwen3.8-Max as its largest and most capable flagship to date, citing rankings of 5th in Text Arena, 2nd in Vision Arena, and 4th in Frontend Code Arena (company-reported).",
      "OSWorld-Verified score of 86.1, which the company compares favorably against GPT-5.6 Sol Max (83.2), Claude Fable 5 (85.0), and Gemini 3.1 Pro (76.2) (company-reported).",
      "Terminal-Bench 2.1 score of 86.6, ahead of Claude Opus 4.8 and Claude Fable 5 at 84.6, per Alibaba's own comparison table (company-reported).",
      "Claims of autonomously completing a 16-day software engineering project and processing hundred-page documents, full TV series, or 100-hour livestreams (company-reported).",
    ],
    vendorEvalsNote:
      "These are Alibaba's own launch benchmarks and arena rankings, labeled as such here. Ridge's live catalog score is this site's own tracked measure and is not restated from a vendor table.",
    specs: [
      { label: "Model id", value: "qwen-3.8-max (hosted); Qwen3.8-2.4T-A95B (open weights)" },
      {
        label: "Architecture",
        value: "Sparse MoE, 2.4T total parameters, ~95B active per token; hybrid Gated DeltaNet / Gated Attention layers",
      },
      { label: "Context (hosted Max API)", value: "1M tokens (991K max input / 131K max output)" },
      { label: "Context (open weights)", value: "262,144 native, extensible to ~1,010,000" },
      { label: "Modalities", value: "Hosted API: text, image, video in, text out. Open weights: text-only" },
      { label: "Reasoning", value: "Open weights require thinking mode on; hosted API supports thinking and non-thinking modes" },
      { label: "Price", value: "$2 input / $6 output per 1M tokens; $0.25 cached input; 50% batch discount" },
      {
        label: "Weights",
        value: "Open — custom qwen3.8-max license (trimmed, text-only checkpoint vs. the hosted Max API)",
      },
      { label: "Lab", value: "Alibaba (Qwen team)" },
    ],
    whereUsed: ["Alibaba Cloud Model Studio", "DashScope API", "QwenWork", "Hugging Face", "ModelScope", "OpenRouter"],
    sources: [
      {
        label: "Alibaba Cloud Press Room — Alibaba Unveils Qwen3.8-Max",
        url: "https://www.alibabacloud.com/en/press-room/alibaba-unveils-qwen3-8-max",
      },
      {
        label: "Hugging Face model card — Qwen/Qwen3.8-2.4T-A95B",
        url: "https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B",
      },
      {
        label: "MarkTechPost — Alibaba Qwen Releases Qwen3.8-Max",
        url: "https://www.marktechpost.com/2026/08/03/alibaba-qwen-releases-qwen3-8-max/",
      },
      {
        label: "DataCamp — Qwen3.8-Max: Features, Benchmarks, and Pricing",
        url: "https://www.datacamp.com/blog/qwen3-8-max",
      },
    ],
  },
};
