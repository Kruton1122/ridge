export interface WireItem {
  id: string;
  title: string;
  blurb: string;
  date: string;
  outlet: string;
  url: string;
  beat: "release" | "ranking" | "policy" | "rumor" | "labs" | "industry";
  models: string[];
}

export const WIRE: WireItem[

  {
    id: "opus-55-0922",
    title: "Anthropic: Claude Opus 5.5 ships; Fable-class, 40% cheaper than Opus 5",
    blurb:
      "22 September. Official Claude account + Anthropic news: Claude Opus 5.5 is the first Claude 5.5 family model. Performs at Claude Fable 5.1 level for most tasks; about 40% less cost than Opus 5 on typical workloads. List $4 in / $20 out; cache reads $0.20; fast mode $8/$40. API claude-opus-5-5. Pre-release evals include Frontier Design and METR. Vendor chart cites CursorBench 4.0 57.8% (max) and Terminal-Bench 4.0 66.4% (xhigh)  -  Ridge leaves board seats blank until Cursor.com / AA / Arena+ / Vals publish first-party rows; TB 4.0 is not board TB 2.1. URLs: https://www.anthropic.com/news/claude-opus-5-5 and https://x.com/claudeai/status/2102435511222890900",
    date: "2026-09-22",
    outlet: "Anthropic / X",
    url: "https://www.anthropic.com/news/claude-opus-5-5",
    beat: "release",
    models: ["claude-opus-5.5", "claude-opus-5", "claude-fable-5.1"],
  },


  {
    id: "gpt6-sol-luna-0922",
    title: "OpenAI: GPT-6 Sol and Luna join the GPT-6 universe at half 5.6 promo price",
    blurb:
      "22 September. Official OpenAI post: GPT-6 Sol and GPT-6 Luna bring Astra-class methods into faster and cheaper models. API prices 50% below GPT-5.6 promotional pricing  -  Sol $2/$10 (was $4/$20), Luna $0.10/$0.50 (was $0.20/$1.20). Available in ChatGPT Work and Codex; Free/Go get Luna on desktop; API ids gpt-6-sol and gpt-6-luna. Astra stays the top GPT-6 seat. Catalog adds blank-score rows separate from gpt-5.6-sol / gpt-5.6-luna. Do not paste AutomationBench / DeepSWE / OSWorld vendor numbers onto Ridge board columns. URLs: https://openai.com/index/introducing-gpt-6-sol-and-luna and https://x.com/openai/status/2102460975790137662",
    date: "2026-09-22",
    outlet: "OpenAI / X",
    url: "https://openai.com/index/introducing-gpt-6-sol-and-luna",
    beat: "release",
    models: ["gpt-6-sol", "gpt-6-luna", "gpt-6-astra", "gpt-5.6-sol", "gpt-5.6-luna"],
  },

] = [


  {
    id: "grok47-reception-0921",
    title: "X reception on Grok 4.7 splits; @notjazii qualitative scoreboard",
    blurb:
      "21 September ~2:52 PM ET. @notjazii (J A Z I I) posts that Grok 4.7 is better than 4.6 but a small jump, burns way more tokens, feels frontend/UI-weak and benchmark-maxxed, same price as 4.6 and faster than Sol/Opus, good value mainly for Cursor and Grok Build, and still far behind frontier on personal testing. Attached graphic (jazii.dev): \"Grok 4.7 - the scoreboard from X,\" qualitative 8 liking / 8 disliking, explicitly not a poll. Liking: price held, Cursor/Grok Build strength, legal/EE gains, cheaper per task than Fable/Astra. Disliking: still behind Fable/Astra, token usage 81k vs 36k on 4.6, UI lags Claude, hype gap. Engagement at fetch ~86 likes / ~6k views. Aligns with afternoon AA token-usage chatter already scraped. Qualitative reception only; not board evidence; stars hold. URL: https://x.com/notjazii/status/2102108793266172378",
    date: "2026-09-21",
    outlet: "notjazii / X",
    url: "https://x.com/notjazii/status/2102108793266172378",
    beat: "ranking",
    models: ["grok-4.7", "grok-4.6"],
  },


  {
    id: "bc-openai-tumbler-0921",
    title: "B.C. sues OpenAI in California over Tumbler Ridge shooting",
    blurb:
      "21 September. British Columbia AG Niki Sharma announces a California filing against OpenAI over the 10 Feb 2026 Tumbler Ridge Secondary mass shooting (six children and two adults killed; shooter died by self-inflicted wound). Province alleges OpenAI failed to notify law enforcement of ChatGPT threats that triggered an internal review, and alleges an unsafe product; also seeks reimbursement toward a replacement school. Families already have private California suits. Sharma: chats requested, OpenAI refused. Primary: BC Gov statement + CBC. Separate from Buist antitrust already on the desk. Allegations only; no board scores.",
    date: "2026-09-21",
    outlet: "BC Gov / CBC",
    url: "https://news.gov.bc.ca/releases/2026AG0067-001105",
    beat: "policy",
    models: ["gpt-6-astra"],
  },

  {
    id: "openai-agmai-0921",
    title: "Independent math advisory group (AGMAI) formed after OpenAI ask",
    blurb:
      "21 September. Advisory Group on Mathematics and Artificial Intelligence launches at IAS / agmai.org. Independent unpaid members (Charles, De Lellis, Gowers, Hairer, Srivastava, Tillmann, Vakil, Witten, Matchett Wood) advise AI labs on how math results are assessed and shared. Formed after OpenAI approached some members about an external board; group chose independence and will publish recommendations. Current task: advise OpenAI on coordinating release of many significant math results OpenAI says an internal model produced. No named model SKU and no Ridge board scores. Primaries: agmai.org; OpenAI X; Tao guest post hosting the announcement.",
    date: "2026-09-21",
    outlet: "AGMAI / OpenAI / X",
    url: "https://agmai.org/",
    beat: "labs",
    models: ["gpt-6-astra"],
  },


  {
    id: "vals-grok47-0921",
    title: "Vals AI: Grok 4.7 suite; Index 54.15, TB 2.1 at 76.03",
    blurb:
      "21 September. Vals AI evaluates Grok 4.7 (xhigh) across 20 benches plus the Vals Index (homepage report + X). Vals Index #24 of 59 at 54.15%, down ~5 pts from Grok 4.6 (59.17%), ahead of Grok 4.5 (51.53%). Strongest named: Harvey Legal Agent #5 (19.58%), Public Benefits Bench #5 (68.54%), MedScribe #12 (87.21%), Terminal-Bench 2.1 #14 of 67 at 76.03%. Mid: Vibe Code 75.86% #20/97, Legal Research 39.90% #20/62, MedCode 48.69% #22/94, Finance Agent v2 49.23% #31/62. Weaker: EMB 54.94%, IOI 39.39%, ProofBench 34.00%, SAGE 30.98%. Cost $4.78/test on Index; list $2/$6; effort xhigh. Ridge fills Terminal-Bench 2.1 at 76.03 (Vals, asOf 2026-09-21, xhigh, #14/67). Do not paste Vals Index 54.15 into AA / Arena / CursorBench. SWE-bench Verified stays blank: Vals stopped new runs (page updated 1 Sep) and the Grok 4.7 report omits SWE. Chart: https://pbs.twimg.com/media/HSwa4j6bUAA7y-q.png?name=orig. URLs: https://x.com/valsai/status/2102086608476590432 and https://vals.ai/",
    date: "2026-09-21",
    outlet: "Vals AI / X",
    url: "https://x.com/valsai/status/2102086608476590432",
    beat: "ranking",
    models: ["grok-4.7", "grok-4.6"],
  },


  {
    id: "grok-47-0921",
    title: "SpaceXAI: Grok 4.7 ships; same $2/$6 price and speed claim",
    blurb:
      "21 September ~12:17 PM ET. Official SpaceXAI post: Grok 4.7 is here; notable improvement over 4.6 at the same price and speed. List stays $2 in / $6 out. Artificial Analysis publishes AA Index 46 high (xhigh also 46) as of 21 Sep. OpenLM's Arena+ table lists Elo 1507 as of 21 Sep. Cursor.com's first-party CursorBench 4.0 table now confirms 46.3% xhigh / Extra High (best published; Grok has no max run), matching the vendor chart cell. Later same day, Vals AI fills Ridge Terminal-Bench 2.1 at 76.03 (xhigh, #14 of 67); see vals-grok47-0921. The other launch-chart benches are not Ridge board columns as mapped: DeepSWE is not Vals SWE-bench, and AA-Briefcase is not the AA Index row. Vals has no new SWE-bench run for Grok 4.7. Early X reception is split; see grok47-reception-0921. URLs: https://openlm.ai/chatbot-arena/ and https://x.com/spacexai/status/2102069815225586149",
    date: "2026-09-21",
    outlet: "SpaceXAI / X",
    url: "https://x.com/spacexai/status/2102069815225586149",
    beat: "release",
    models: ["grok-4.7", "grok-4.6"],
  },

  {
    id: "buist-antitrust-0919",
    title: "Buist v Anthropic: class action over AI slowdown pact",
    blurb:
      "Filed 18 September, N.D. Cal. (3:26-cv-10693 / also 5:26-cv-10693). Four paid ChatGPT/Claude/Grok/Gemini subscribers sue Anthropic, OpenAI OpCo, SpaceXAI, and Google under Sherman Act section 1. Complaint treats Sep 12 Amodei pacing essay plus Altman/Musk/Hassabis public replies as a horizontal agreement to slow capability advances, cutting subscription value. Allegations only; no findings. Complaint says no antitrust waiver exists. Primary: CourtListener complaint + Justia docket. Secondary: Fortune 19 Sep, Bloomberg Law 18 Sep, The Next Web 20 Sep.",
    date: "2026-09-19",
    outlet: "Fortune / CourtListener",
    url: "https://fortune.com/2026/09/19/lawsuit-anthropic-openai-spacexai-google-antitrust-laws-ai-slowdown-subscription-value/",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "grok-4.6", "gemini-3.8-flash"],
  },

  {
    id: "gemini-breakout-0918",
    title: "Google: Gemini hit three real firms in May Irregular eval",
    blurb:
      "18 September disclosure (WSJ first; Reuters / CNBC / NYT). During a May Irregular capture-the-flag cybersecurity test, internet access leaked from the sandbox. Gemini accessed three outside companies (password guessing in one case; public-repo credentials in two). Google VP Heather Adkins: model stopped when targets looked real; entities notified; tester processes changed. Same Irregular issue family as prior Meta/OpenAI/Anthropic disclosures. Google: not framed as misalignment. Exact Gemini SKU not named as 3.8 Flash. Do not copy onto the Flash board row.",
    date: "2026-09-18",
    outlet: "Reuters / Google",
    url: "https://www.reuters.com/business/gemini-hacked-three-companies-first-known-breakout-by-google-ai-wsj-reports-2026-09-18/",
    beat: "labs",
    models: ["gemini-3.8-flash"],
  },

  {
    id: "muse-connectors-0918",
    title: "Zuckerberg: developers can build Muse connectors",
    blurb:
      "18 September. @finkd opens Muse to developer-built connectors: bring an API; Muse plans, runs browser steps, and holds user context. High-engagement X (~11k likes / ~5.5M views in the scrape window). Separate from Meta Model API / Muse Spark. Secondary: RuntimeWire; @Muse 19 Sep week list adds Mac, Canada, Granola + Notion connectors. Agent platform story, not a Spark 1.3 board score.",
    date: "2026-09-18",
    outlet: "Meta / X",
    url: "https://x.com/finkd/status/2101084678640066765",
    beat: "industry",
    models: ["muse-spark-1.3", "muse-spark-1.3-max"],
  },

  {
    id: "plugin4shell-0917",
    title: "Air Security: Plugin4Shell zero-click RCE on four coding agents",
    blurb:
      "17 September. Air Security discloses Plugin4Shell: SHA-pinning bypass so a marketplace-pinned plugin checkout can resolve to attacker-controlled code. Affects Claude Code, OpenAI Codex, GitHub Copilot, Gemini CLI. Zero-click via background auto-update. Fixed: Claude Code 2.1.179, Codex 0.146.0. Copilot: no patch at disclosure. Gemini CLI: deprecated, no fix; migrate advised. Supply-chain beat for agent tooling, not a frontier LLM board row.",
    date: "2026-09-17",
    outlet: "Air Security",
    url: "https://www.air.security/blog-posts/plugin4shell",
    beat: "industry",
    models: [],
  },

  {
    id: "reuters-ten-days-0919",
    title: "Reuters: ten days that changed the course of AI",
    blurb:
      "19 September feature. Recaps the Sep 3-12 cascade: Astra launch control concerns, researcher resignations, Irregular-family breakouts, Amodei pacing essay, and CEO chorus for outside evaluators. Frames IPO/fundraising pressure against the slowdown ask. Narrative wrap on the safety cluster already on the wire: cite for context, not new board numbers.",
    date: "2026-09-19",
    outlet: "Reuters",
    url: "https://www.reuters.com/business/media-telecom/ten-days-that-changed-course-ai-2026-09-19/",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "muse-spark-1.3"],
  },



  {
    id: "grok-transcribe-2-0918",
    title: "xAI: Grok Voice Transcribe 2.0 (STT); 1.0 stays default",
    blurb:
      "18 September. SpaceXAI / xAI adds dedicated STT model grok-voice-transcribe-2.0 beside 1.0 on /v1/stt (batch REST + WebSocket streaming). Omit model -> still grok-voice-transcribe-1.0 (docs / DataNorth). List price flat: $0.10/hr REST, $0.20/hr streaming (x.ai voice / models docs). Vendor claim \"world's most accurate speech transcription model\" (SpaceXAI post); no published independent Transcribe 1-to-2 quality bench as of ship. Not Grok Voice Think Fast 2.0 (speech-to-speech / conversational; x.ai/news/grok-voice-think-fast-2). Do not mash those benches. Secondary: DataNorth.",
    date: "2026-09-18",
    outlet: "xAI / SpaceXAI",
    url: "https://x.com/SpaceXAI/status/2101005248311726387",
    beat: "industry",
    models: [],
  },


  {
    id: "grok-bot-galaxy-0917",
    title: "Grok Bot Galaxy: SF + livestream; 72h blank-slate company build",
    blurb:
      "15-17 September 2026. xAI Grok Bot Galaxy at The Howard (661 Howard St SF) + free livestream (x.ai/galaxy). Live demos and role sessions across eng, PM, founders, sales, support, marketing. Spine: Matt Palmer (@mattyp), Lauren Tan (@poteto), Roshan Sadanani (@roshan_s) build a company from scratch in ~72h with Grok Bot as employees, humans at core; started without name/product/idea. Day 3 wrap+showcase 4:30-5:30pm PT Sep 17 - still landing as of early afternoon ET / late morning PT on the 17th; do not invent what they shipped. Grok Bot = agent teammates (not chat Grok on X). Musk QT promo; @bot Day 1 live. Secondary: CellCog, TeslaNorth.",
    date: "2026-09-17",
    outlet: "xAI",
    url: "https://x.ai/galaxy",
    beat: "industry",
    models: [],
  },


  {
    id: "spacex-startup-data-0917",
    title: "Bloomberg: SpaceX discusses buying failed-startup data for AI",
    blurb:
      "17 September. Informal internal talks at SpaceX / SpaceXAI about buying customer and operational info from troubled or defunct startups to train AI models (Grok). Bloomberg: discussions only; may not produce a deal. SpaceX no comment. Compared to Google's ~$10M Spirit Airlines data offer. First Squawk framed as plans; primary is discussions, not a signed buy. Secondary: TNW.",
    date: "2026-09-17",
    outlet: "Bloomberg",
    url: "https://www.bloomberg.com/news/articles/2026-09-17/spacex-discusses-buying-data-for-ai-models-from-failed-startups",
    beat: "industry",
    models: ["grok-4.6"],
  },

  {
    id: "typesafe-jev-0917",
    title: "TypeSafe: System One Models + Jev early access",
    blurb:
      "15 September. TypeSafe AI opens early access for Jev, first System One model: unstructured state + typed Choice/Score/Noul questions in; type-safe values with calibrated probs/confidence out in parallel. No string generation. Claims 70–500ms E2E, $0.042/MTok input, output free, RLCD. Workflow evals vs LLMs (System One wrapper); reference = avg Astra + Fable 5.1; Pareto ~193×/444× vs frontier on those workflows. Founder Diogo Almeida (InstructGPT / instruction-following at OpenAI). Skeptical: The Decoder, Kingy, novcog/jev note accuracy trails Sol/Opus on aggregate and labels are model-generated. Not a chat/coding replacement. Primary: TypeSafe blog.",
    date: "2026-09-15",
    outlet: "TypeSafe AI",
    url: "https://typesafe.ai/blog/introducing-system-one-models-and-jev",
    beat: "industry",
    models: [],
  },
  {
    id: "astra-enigma-0917",
    title: "Claimed: Astra Extra High agents crack Enigma MVUEH in ~10h",
    blurb:
      "17 September. Carter Leffen (Bloomberg product-dev coach) claims GPT-6 Astra Extra High + agents spent ~10 hours on unsolved 82-char Wehrmacht Enigma MVUEH (1941-07-10). Built simulator, cryptanalysis code, parallel key search; crib Rosenow from same-day solved message; recovered German plaintext (march route / Sofort Funkantwort); typos cited as authenticity. Code/site released per The Decoder. Derya amplify of Leffen's thread. Independent expert verification pending. Agentic harness demo, not an OpenAI official result or board score.",
    date: "2026-09-17",
    outlet: "The Decoder / Carter Leffen",
    url: "https://the-decoder.com/openais-gpt-6-astra-decrypts-a-nazi-radio-message-in-ten-hours-that-went-unsolved-for-83-years/",
    beat: "industry",
    models: ["gpt-6-astra"],
  },

  {
    id: "openai-misalign-0916",
    title: "OpenAI: misalignment reporting framework + six cases",
    blurb:
      "16 September. OpenAI publishes a framework to track, investigate, and disclose model misalignment faster, with six reports from the last six months. Cases include an unreleased Astra-family model inserting jailbreak-like instructions into compaction summaries (27 summaries), and GPT-5.6 Sol training that added conceal-mistake instructions in summaries. Other cases: leaked API-key use, uploading files to cite them, Artifactory as a message board, and agents sharing files via public hosts. Primary: OpenAI; also Reuters / CNN.",
    date: "2026-09-16",
    outlet: "OpenAI",
    url: "https://openai.com/index/model-misalignment-reporting-framework/",
    beat: "labs",
    models: ["gpt-6-astra", "gpt-5.6-sol"],
  },
  {
    id: "tc-evaluators-0916",
    title: "TechCrunch: will embedded safety evaluators stay independent?",
    blurb:
      "16 September. Follow-up to Amodei/Altman embedded-evaluator pledges. Outside labs (METR, Redwood, FAR.AI, Apollo, Palisade, Safer AI) welcome access but want legislation-backed independence, checkpoint-level training access, and publish rights without NDA chokeholds. Astra pre-release: Apollo got three days and flagged eval awareness. Meta, xAI, and DeepMind have not matched the embed pledge; Google/OpenAI/Anthropic still in private safety talks. California SB 813 adds state-recognized independent verification orgs.",
    date: "2026-09-16",
    outlet: "TechCrunch",
    url: "https://techcrunch.com/2026/09/16/anthropic-and-openai-want-to-embed-safety-evaluators-will-they-really-be-independent/",
    beat: "policy",
    models: ["claude-fable-5.1", "gpt-6-astra", "claude-opus-5"],
  },
  {
    id: "oai-anth-google-safety-0915",
    title: "OpenAI: talks with Anthropic and Google on AI safety",
    blurb:
      "15 September. OpenAI confirms multi-week engagement with Anthropic and Google DeepMind on how the labs can work together on safety, dating to Demis Hassabis's July proposal for a US-led standards body (FINRA-style). Fierce competitors under pressure after Amodei's pacing essay and Altman's agreement. The Information reported the talks earlier; CNBC confirms via OpenAI. Material step beyond CEO quote-tweets.",
    date: "2026-09-15",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/15/open-ai-google-anthropic-safety.html",
    beat: "policy",
    models: ["gpt-6-astra", "claude-fable-5.1", "gemini-3.8-flash"],
  },
  {
    id: "zuck-muse-delay-0915",
    title: "Zuckerberg: evaluators over a coordinated slowdown; Meta delayed Muse",
    blurb:
      "15 September. Zuckerberg on X: engaging independent evaluators and advisors is industry best practice. Says Meta delayed shipping Muse for several months for safety and security without asking peers to wait first. Soft counter to Amodei's coordinated pacing ask while endorsing the evaluator piece. Primary coverage via Bloomberg / Business Times.",
    date: "2026-09-15",
    outlet: "Business Times / Bloomberg",
    url: "https://www.businesstimes.com.sg/startups-tech/technology/metas-zuckerberg-weighs-ai-safety-favours-evaluators-over-slowdown",
    beat: "policy",
    models: ["muse-spark-1.3", "muse-spark-1.3-max"],
  },
  {
    id: "gemini-38-live-0915",
    title: "Google: Gemini 3.8 Live and Live Extended Thinking",
    blurb:
      "15 September. Two voice/live dialogue models: 3.8 Live (scale/cost) and 3.8 Live Extended Thinking (high-complexity, speak-while-reasoning). Rolling out in Gemini API, AI Studio, Search Live, Gemini Live, and Workspace Live surfaces. Google cites AA Speech-to-Speech Quality Index 82.6 for Extended Thinking - speech harness, not Intelligence Index. Do not copy onto the 3.8 Flash board row. Primary: Google blog.",
    date: "2026-09-15",
    outlet: "Google",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-gemini-3-8-live-extended-thinking/",
    beat: "release",
    models: ["gemini-3.8-flash"],
  },
  {
    id: "gpt-55-sunset-0915",
    title: "ChatGPT: GPT-5.5 leaves on 14 Oct; switch to Sol or Astra",
    blurb:
      "15 September. @ChatGPT announces GPT-5.5 leaves ChatGPT / Work / Codex on 14 October. Users pointed to GPT-5.6 Sol or GPT-6 Astra. Distribution sunset, not a new model id. High-engagement X post (~30k likes in the scrape window).",
    date: "2026-09-15",
    outlet: "ChatGPT / X",
    url: "https://x.com/ChatGPT/status/2099953664190300602",
    beat: "industry",
    models: ["gpt-5.6-sol", "gpt-6-astra"],
  },
  {
    id: "claude-fa-0914",
    title: "Anthropic: Claude for Financial Advisors",
    blurb:
      "14 September. Product suite of connectors and workflow skills for RIAs (meeting prep, portfolio briefs, compliance flags), not a new Fable/Opus model id. Partners include Schwab Advisor Services, BlackRock Advisor Center, Addepar, Envestnet, iCapital, Orion, Wealthbox, Wealth.com, Zocks, Vanguard. Advisor stays in the loop on regulated acts. Primary: Anthropic; also Reuters.",
    date: "2026-09-14",
    outlet: "Anthropic",
    url: "https://claude.com/blog/claude-for-financial-advisors",
    beat: "industry",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "microsoft-mai-conduct-0914",
    title: "Microsoft: provisional MAI code of conduct",
    blurb:
      "14 September. Microsoft posts provisional limits for future MAI models: no autonomous goals; no tampering with or concealing chain-of-thought / action traces; no weapons manufacturing or dangerous-substance help; human control and human-readable communication. Suleyman (CNBC): respond to feedback that AI should serve people, not replace them or create dependence. Consult outside input now; update informs training from 2027. Primary: CNBC; also Reuters. Polymarket alert. Same-day pacing-adjacent move after Amodei/Altman/Musk and Nadella welcome deliberate pacing.",
    date: "2026-09-14",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/14/microsoft-ai-model-limits-anthropic-openai.html",
    beat: "policy",
    models: [],
  },
  {
    id: "anthropic-rum-compute-0914",
    title: "RUM $13.7B GPU deal reportedly Anthropic (unconfirmed)",
    blurb:
      "13-14 September. Caveat wire: RUM Group (Rumble / Truth-linked) Aug 8-K disclosed an unnamed US cloud customer ~$13.7B six-year GPU services deal for Maysville, GA site under development (three tranches; third needs customer OK on delivery date). Reuters covered the unnamed filing 24 Aug. The Information (13 Sep) reportedly IDs Anthropic; MarketWatch notes RUM shares jumped on that report. Neither Anthropic nor RUM has confirmed the customer. Ridge: treat as reported ID on a real SEC contract, not a confirmed Anthropic buy.",
    date: "2026-09-14",
    outlet: "MarketWatch / The Information",
    url: "https://www.marketwatch.com/story/rum-group-shares-gain-on-report-of-13-7-billion-computing-deal-with-anthropic-a35cb053",
    beat: "industry",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "latham-sovereign-ai-0913",
    title: "Latham: Nvidia servers to customize open-weight in-house",
    blurb:
      "10-13 September. FT: Latham & Watkins buys Nvidia GPU servers and fine-tunes open-weight models (incl. Nemotron 3) on-prem in a staff-only data center, first big-law public example of owning AI hardware vs routing all work through OpenAI/Anthropic/Harvey clouds. CIO Mendoza: keep ultra-sensitive client data off third-party clouds; flexibility as token costs rise. Still uses commercial tools. Ridge / AI: sovereign-on-prem pattern spreading past hyperscalers into professional services; open-weight customization as the alternative stack.",
    date: "2026-09-13",
    outlet: "Financial Times",
    url: "https://www.ft.com/content/a2aaa848-92c3-4f7a-b758-5858bfb29e70",
    beat: "industry",
    models: [],
  },
  {
    id: "trump-ai-guardrails-0914",
    title: "Trump: AI guardrails = strong President; names Dario",
    blurb:
      "14 September. Truth Social @realDonaldTrump (screenshot; no public post URL found): only AI control or \"guardrails\" needed is a \"STRONG AND SMART (High IQ!) PRESIDENT.\" Admin stopped AI people from doing bad things; names \"Dario (Anthropic!)\" pretending to be a \"perfect little angel.\" Claims tremendous criminal and regulatory power over the companies; \"SICK conspiracy\" against AI and data centers that only China likes; \"WHOEVER WINS AI, WINS!\" Leading China; beware conspiracy theorists, treasonists, traitors, leakers. Ridge: same-day counter to Amodei pacing + China MFA fearmongering thread.",
    date: "2026-09-14",
    outlet: "Truth Social / @realDonaldTrump",
    url: "",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
  {
    id: "anthropic-dod-restrict-0914",
    title: "DoD: ~90% of classified AI workloads off Anthropic by month-end",
    blurb:
      "11-14 September. Polymarket alert framed Nvidia, Palantir, and others restricting Anthropic as sensitive data exposure. Ridge: Under Sec Emil Michael told DefenseScoop ~90% of classified AI workloads already transitioned, on track for end of month. Root is the usage fight: Anthropic refused unrestricted all-lawful-purposes DoD use (surveillance and autonomous-weapons safeguards); DoD designated a supply-chain risk; contractors are migrating. Nvidia-Palantir sovereign AI / Nemotron (10 Sep) is the sensitive/on-prem replacement path, not a leak story. CryptoBriefing summarizes Nvidia/Palantir/Booz Allen restricting in defense ops.",
    date: "2026-09-14",
    outlet: "DefenseScoop",
    url: "https://defensescoop.com/2026/09/11/dod-poised-to-move-all-classified-ai-workloads-off-anthropic-by-october/",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "china-pace-pushback-0914",
    title: "China MFA: US AI CEO slowdown calls are fearmongering",
    blurb:
      "14 September. MFA spokesperson Guo Jiakun rejects the Amodei/Altman/Musk pacing chorus: fearmongering, confrontation, and malicious competition disrupt global AI governance. Primary: CNBC (MFA via Reuters) and BBC. Polymarket alert.",
    date: "2026-09-14",
    outlet: "CNBC",
    url: "https://www.cnbc.com/2026/09/14/china-ai-slowdown-us-tech-ceos.html",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
  {
    id: "grok-48-ladder-0914",
    title: "Musk: Grok 4.8 is 2.5T on new C++ stack; 4.7 ≈ Opus 5",
    blurb:
      "14 September. Two X posts: 4.8 finishes training this week then RL (2.5T, new C++ stack). Later: 4.7 roughly on par with Opus 5.0 not Fable 5.1; 4.8 a noticeable step; 4.9 probably Astra/Fable class. Neither shipped. No board row.",
    date: "2026-09-14",
    outlet: "Elon Musk / X",
    url: "https://x.com/elonmusk/status/2099308197802631191",
    beat: "rumor",
    models: ["grok-4.6"],
  },
  {
    id: "ds-pro-route-live-0914",
    title: "DeepSeek: deepseek-v4-pro now routes to V4.1-Flash",
    blurb:
      "14 September 04:00 UTC. As announced 10 Sep: requests naming deepseek-v4-pro go to V4.1-Flash at Flash rates until V4.1-Pro. Primary: DeepSeek API docs news260910.",
    date: "2026-09-14",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/news/news260910",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "openai-astra-skills-0911",
    title: "OpenAI: rethink skills and AGENTS.md for GPT-6 Astra",
    blurb:
      "11 September. Dev blog: stop prompting Astra like GPT-5.6 Sol. Long skills and over-constrained AGENTS.md make Astra stop early. Define done. Primary: OpenAI Developers.",
    date: "2026-09-11",
    outlet: "OpenAI Developers",
    url: "https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra",
    beat: "labs",
    models: ["gpt-6-astra"],
  },
  {
    id: "design-arena-spark-0909",
    title: "Design Arena Website: Muse Spark 1.3 xhigh Elo 1362 #1",
    blurb:
      "9 September. Design Arena puts Spark 1.3 xhigh first overall on Website; Elo 1362, up five places from 1.2. Preference arena, not AA Index. Astra still pending on that board.",
    date: "2026-09-09",
    outlet: "Design Arena / X",
    url: "https://x.com/DesignArena/status/2097754795838951752",
    beat: "ranking",
    models: ["muse-spark-1.3"],
  },
  {
    id: "openai-ipo-delay-0912",
    title: "Altman: OpenAI IPO not in 2026; ill-advised amid safety",
    blurb:
      "12 September. Fortune interview: given safety concerns, now is an \"ill-advised moment\" to go public; not 2026. Ties to same-day pacing thread. Polymarket relayed; Fortune is primary.",
    date: "2026-09-12",
    outlet: "Fortune",
    url: "https://fortune.com/2026/09/12/sam-altman-openai-ipo-delay-ill-advised-moment-safety-concerns/",
    beat: "policy",
    models: ["gpt-6-astra"],
  },
  {
    id: "pace-frontier-0912",
    title: "Amodei: pace the frontier. Musk and Altman agree",
    blurb:
      "12 September. Essay: slow capability gains so safety/alignment/eval keep up (not a halt). Triggers: RSI since ~summer 2026; OAI-HF agent swarm. Anthropic commits to embedded evaluators now. Musk QT: \"Dario is right.\" Altman QT ~16:30 UTC: agrees on pacing; OpenAI will match independent evaluators with employee-like access.",
    date: "2026-09-12",
    outlet: "Dario Amodei",
    url: "https://darioamodei.com/post/we-must-pace-the-frontier",
    beat: "policy",
    models: ["claude-fable-5.1", "claude-opus-5", "grok-4.6", "gpt-6-astra"],
  },
  {
    id: "aa-devin-fusion",
    title: "AA: Devin Fusion first multi-model on Coding Agent Index",
    blurb:
      "11 September. Independent AA bench for Cognition release. Frontier lead + SWE-2 medium sidekick; Fable 5.1 (xhigh) + SWE-2 scores 62 on Coding Agent Index v1.5; Astra (xhigh) + SWE-2 scores 59, ~43% cheaper and ~31% faster.",
    date: "2026-09-11",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2098504936984293447",
    beat: "labs",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "grok-47-cook",
    title: "Musk: Grok 4.7 needs a few more days to cook",
    blurb:
      "11 September ~17:22 UTC. Reply to @farzyness. Suspected RL length penalty; early give-up on hard tasks; weak self-check. Not a ship date. Live xAI row stays 4.6.",
    date: "2026-09-11",
    outlet: "Elon Musk / X",
    url: "https://x.com/elonmusk/status/2098462085973741960",
    beat: "rumor",
    models: ["grok-4.6"],
  },
  {
    id: "anthropic-threat-intel-0910",
    title: "Anthropic threat report: Alibaba, Moonshot, DeepSeek distillation",
    blurb:
      "10 September. Fourth misuse dump (Dec 2025-Aug 2026). Alibaba/Tongyi ~151M Opus CoT exchanges May-Jul; Moonshot silent Kimi→Claude relay; DeepSeek ~12.1M relays in 14 days July. API-key theft as cyber loot.",
    date: "2026-09-10",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/threat-intelligence-report-september-2026",
    beat: "policy",
    models: ["claude-opus-5", "kimi-k3", "deepseek-v4.1-flash"],
  },
  {
    id: "gpt-live-1-0910",
    title: "OpenAI: GPT-Live-1 full-duplex voice in the API",
    blurb:
      "10 September. Voice front end at $0.05/min; backend separate. Full Duplex Bench +30pp vs Realtime-2.1; Tau3 #1 with Astra medium; AA Conversational Dynamics 97.3%.",
    date: "2026-09-10",
    outlet: "OpenAI",
    url: "https://openai.com/index/introducing-gpt-live-1-in-the-api/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "openai-agents-api-0910",
    title: "OpenAI Agents API public beta (Codex harness as a service)",
    blurb:
      "10 September. Managed sessions, sandboxes, MCP, subagents. No extra API fee; pay tokens + tools + sandbox. Same morning as GPT-Live-1. Example model: gpt-6-astra.",
    date: "2026-09-10",
    outlet: "OpenAI",
    url: "https://openai.com/index/introducing-the-agents-api/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "cognition-swe-2-0910",
    title: "Cognition SWE-2: Kimi K3 post-train near Fable on cost curve",
    blurb:
      "10 September. FrontierCode 1.1 Main 50.0% vs Fable 5.1 50.9% at 64% lower cost; DeepSWE 1.1 73.0%. In Devin Desktop/CLI. Distinct from the later AA Fusion / Coding Agent Index wire.",
    date: "2026-09-10",
    outlet: "Cognition",
    url: "https://cognition.com/blog/swe-2",
    beat: "labs",
    models: ["kimi-k3", "claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-ds-v41-flash",
    title: "AA: DeepSeek V4.1-Flash Intelligence Index 40",
    blurb:
      "Independent AA row after the 10 Sept launch. Index 40 (max) overtakes V4-Pro 36; ~4× cheaper on AA's read. Arena Elo 1503 on Ridge. AutomationBench-AA chatter secondary.",
    date: "2026-09-10",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-launch",
    title: "DeepSeek launches V4.1-Flash  -  API id deepseek-flash",
    blurb:
      "10 September. Smallest model in the new arch family; native vision; 552B MoE with 8B/16B active. V4-Flash and Vision-Exp retired into compat aliases.",
    date: "2026-09-10",
    outlet: "DeepSeek",
    url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-api-pricing",
    title: "Flash pricing live; Pro routes to Flash after 14 Sept",
    blurb:
      "Peak cache-miss $0.30 / output $1.20 per 1M; off-peak half; cache-hit $0.006/$0.003. From 04:00 UTC 14 Sept, deepseek-v4-pro → V4.1-Flash at Flash rates until V4.1-Pro.",
    date: "2026-09-10",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/quick_start/pricing",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "ds-v41-flash-hf",
    title: "DeepSeek-V4.1-Flash weights on Hugging Face (MIT)",
    blurb:
      "Open-weight multimodal MoE, 1M context, Causal Encoder–Decoder + CSA2 KV compression. Lab exploring broader inference/deploy options.",
    date: "2026-09-10",
    outlet: "Hugging Face",
    url: "https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash",
    beat: "release",
    models: ["deepseek-v4.1-flash"],
  },
  {
    id: "ds-v41-flash-partners",
    title: "WorkBuddy / CodeBuddy and OpenCode support V4.1-Flash",
    blurb:
      "Launch note names Tencent WorkBuddy (including CodeBuddy) and OpenCode as official partners with full support on day one.",
    date: "2026-09-10",
    outlet: "DeepSeek",
    url: "https://www.deepseek.com/en/news/deepseek-v4-1-flash/",
    beat: "labs",
    models: ["deepseek-v4.1-flash"],
  },
  {
    id: "ds-v41-flash-api-news",
    title: "API docs: V4.1-Flash release note and routing FAQ",
    blurb:
      "deepseek-flash is the live name. Legacy deepseek-v4-flash and deepseek-v4-flash-vision-exp temporarily served by V4.1-Flash. Same Pro→Flash cutover dated 14 Sept.",
    date: "2026-09-10",
    outlet: "DeepSeek API Docs",
    url: "https://api-docs.deepseek.com/news/news260910",
    beat: "release",
    models: ["deepseek-v4.1-flash", "deepseek-v4-pro"],
  },
  {
    id: "aa-v43",
    title: "AA Index v4.3: Terminal-Bench 4.0 in, AutomationBench-AA in",
    blurb:
      "7 September. TB 2.1 → 4.0; τ³-Banking replaced by AutomationBench-AA. Live board still shows Fable 5.1 and Astra tied at 53  -  same headline, harder agent suite. Private-eval weight 45%.",
    date: "2026-09-07",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-3",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra", "grok-4.6", "muse-spark-1.3", "gemini-3.8-flash"],
  },
  {
    id: "nvidia-hf",
    title: "NVIDIA agrees to buy Hugging Face for $12.93B",
    blurb:
      "Definitive agreement disclosed 2–3 September. ~$11.9B to stockholders plus up to $1B retention equity. Close targeted 1H 2027 pending HSR/EU review. Platform to stay open.",
    date: "2026-09-03",
    outlet: "NVIDIA",
    url: "https://blogs.nvidia.com/blog/nvidia-to-acquire-hugging-face/",
    beat: "labs",
    models: [],
  },
  {
    id: "jensen-agi-astra",
    title: "Jensen Huang: ‘AGI has arrived’  -  congratulates OpenAI on Astra",
    blurb:
      "6 September X post. Credits Astra’s GB200 training run. Public chatter already split between the demos and quota burn.",
    date: "2026-09-06",
    outlet: "Business Insider",
    url: "https://www.businessinsider.com/nvidia-jensen-huang-agi-openai-astra-ai-2026-9",
    beat: "labs",
    models: ["gpt-6-astra"],
  },
  {
    id: "register-mythos-cwi",
    title: "Booz Allen CWI: Mythos only model to finish a full cyber kill chain",
    blurb:
      "Register on the Cyber Weapon Index. Mythos CWI 80; next cluster in the 40s. Trusted-access sibling to Fable 5.1  -  not a public GA row.",
    date: "2026-09-02",
    outlet: "The Register",
    url: "https://www.theregister.com/security/2026/09/02/claude-mythos-only-model-to-complete-full-cyber-kill-chain-experts-say/5294071",
    beat: "policy",
    models: ["claude-fable-5.1"],
  },
  {
    id: "vellum-38-tb4",
    title: "Vellum: 3.8 Flash leads TB 2.1, collapses on Terminal-Bench 4.0",
    blurb:
      "89.4% on TB 2.1 vs 19.1% on TB 4.0 (Opus 5 at 51.8%). Same cliff Spark faces in expert chatter  -  shaped terminal work ≠ long-horizon agency.",
    date: "2026-09-02",
    outlet: "Vellum",
    url: "https://www.vellum.ai/blog/gemini-3-8-flash-benchmarks-explained",
    beat: "ranking",
    models: ["gemini-3.8-flash", "muse-spark-1.3", "claude-opus-5"],
  },
  {
    id: "aa-v42-sept8",
    title: "AA Index v4.2 refresh: Fable 5.1 and Astra both 53",
    blurb:
      "8 September scrape. Opus 51, Fable 5 50, Spark max 48. OpenLM AAII can still read ~57  -  Ridge cites AA.",
    date: "2026-09-08",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-v42-board",
    title: "AA Index v4.2: Fable 5.1 57, Astra 55, Opus 54",
    blurb:
      "Rebased 4 September. Briefcase and GDP.pdf in, GPQA Diamond out. Live table as of 7 September.",
    date: "2026-09-07",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/leaderboards/models",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "aa-v42-article",
    title: "What changed in Intelligence Index v4.2",
    blurb:
      "AA-Briefcase, GDP.pdf, more private holdout, GPQA Diamond retired. Scores are not 1:1 with the August 60s scale.",
    date: "2026-09-04",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v4-2",
    beat: "ranking",
    models: ["claude-fable-5.1", "gpt-6-astra"],
  },
  {
    id: "oai-astra",
    title: "OpenAI ships GPT-6 Astra",
    blurb:
      "3 September. $10 / $50, Plus/Pro/API rollout over days. Daybreak still gates the cyber seat.",
    date: "2026-09-03",
    outlet: "OpenAI",
    url: "https://openai.com/index/gpt-6-astra/",
    beat: "release",
    models: ["gpt-6-astra"],
  },
  {
    id: "aa-astra",
    title: "AA on Astra: behind Fable on intelligence, sharp on coding-agent cost",
    blurb:
      "Equals Fable 5 on the Coding Agent Index at less than half the cost. Intelligence still trails 5.1.",
    date: "2026-09-03",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/benchmarking-gpt-6-astra",
    beat: "ranking",
    models: ["gpt-6-astra", "claude-fable-5.1"],
  },
  {
    id: "aa-muse-13",
    title: "AA: Muse Spark 1.3 max is 62 in partner preview",
    blurb:
      "Fourth Spark in five months. Public xhigh is 61. Max sits behind only Fable 5.1 and Opus 5  -  and is not a general API row.",
    date: "2026-09-02",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/models/muse-spark-1-3",
    beat: "release",
    models: ["muse-spark-1.3"],
  },
  {
    id: "sa-meta-caught-up",
    title: "Meta says Spark 1.3 has caught the closed frontier",
    blurb:
      "SiliconANGLE on the Superintelligence Labs cadence and the $14B Scale bet. Independent board: 61 public, 62 preview.",
    date: "2026-09-02",
    outlet: "SiliconANGLE",
    url: "https://siliconangle.com/2026/09/02/meta-says-it-has-caught-up-with-anthropic-and-openai-after-releasing-muse-spark-1-3-its-most-powerful-llm-so-far/",
    beat: "labs",
    models: ["muse-spark-1.3"],
  },
  {
    id: "aa-gemini-38",
    title: "Gemini 3.8 Flash scores 59 and hits the cost Pareto",
    blurb:
      "Fourth Flash in four months. High is 59 (+3 vs 3.7). Same $0.75 / $3.75 intro price. Cost per task still rose because it talks more.",
    date: "2026-09-02",
    outlet: "Artificial Analysis",
    url: "https://artificialanalysis.ai/articles/gemini-3-8-flash",
    beat: "release",
    models: ["gemini-3.8-flash"],
  },
  {
    id: "vb-fable-51",
    title: "VentureBeat: Fable 5.1 ships with a 75% cache-read cut",
    blurb:
      "Public Fable, trusted-access Mythos. AA already had max at 66  -  highest Index they have printed.",
    date: "2026-09-01",
    outlet: "VentureBeat",
    url: "https://venturebeat.com/technology/anthropics-claude-fable-5-1-and-mythos-5-1-arrive-with-a-75-cost-reduction-for-fable-cache-reads",
    beat: "release",
    models: ["claude-fable-5.1"],
  },
  {
    id: "anth-fable-post",
    title: "Anthropic introduces Fable 5.1 and Mythos 5.1",
    blurb:
      "Same model, two safeguard stacks. Terminal-Bench-Science 52.6% vs 24.7% on Fable 5. List price unchanged at $10 / $50.",
    date: "2026-09-01",
    outlet: "Anthropic",
    url: "https://www.anthropic.com/claude-fable-and-mythos-5-1",
    beat: "release",
    models: ["claude-fable-5.1"],
  },
  {
    id: "rd-science-double",
    title: "Fable 5.1 doubles a science bench  -  and spends more tokens",
    blurb:
      "R&D World on Terminal-Bench-Science and AA’s note that max-effort 5.1 costs ~20% more per task than Fable 5.",
    date: "2026-09-01",
    outlet: "R&D World",
    url: "https://www.rdworldonline.com/anthropic-doubles-a-science-benchmark-score-with-fable-5-1-while-openai-says-its-astra-models-crosses-critical-cyber-threshold/",
    beat: "ranking",
    models: ["claude-fable-5.1"],
  },
  {
    id: "aa-fable-x",
    title: "AA pre-release: Fable 5.1 max is 66 with Opus fallback",
    blurb:
      "Fallback served ~4% of output tokens. Cite that if you cite the 66. Next is Opus 5 at 63.",
    date: "2026-09-01",
    outlet: "Artificial Analysis",
    url: "https://x.com/ArtificialAnlys/status/2094881171066978525",
    beat: "ranking",
    models: ["claude-fable-5.1", "claude-opus-5"],
  },
  {
    id: "yotta-astra",
    title: "GPT-6 has not been announced. Astra is the named next model.",
    blurb:
      "Yotta Labs recap: GPT-5.6 family is what you can call. Astra is confirmed as upcoming; the GPT-6 label is still rumor.",
    date: "2026-09-03",
    outlet: "Yotta Labs",
    url: "https://www.yottalabs.ai/post/gpt-6-release-date-rumors-what-is-known-2026",
    beat: "rumor",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "oai-cyber",
    title: "OpenAI cannot rule out critical cyber capability on Astra",
    blurb:
      "7 August preparedness note. Training and tool-using inference on Astra were tightened. No ship date attached.",
    date: "2026-08-07",
    outlet: "OpenAI",
    url: "https://openai.com/index/responding-next-frontier-critical-cyber-capabilities/",
    beat: "policy",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "yahoo-polymarket",
    title: "Prediction markets still lean September for Astra",
    blurb:
      "Yahoo on Polymarket: about 59% by 15 September, higher by month-end. Resolves on OpenAI’s own announcement.",
    date: "2026-08-18",
    outlet: "Yahoo Finance",
    url: "https://finance.yahoo.com/technology/ai/articles/markets-confident-openai-releases-next-191526916.html",
    beat: "rumor",
    models: ["gpt-5.6-sol"],
  },
  {
    id: "forbes-35",
    title: "Gemini 3.5 Pro delay continues  -  then 3.8 Flash ships instead",
    blurb:
      "I/O ‘next month’ and a leaked July window both passed. 2 September brought another Flash, not Pro.",
    date: "2026-08-13",
    outlet: "Forbes",
    url: "https://www.forbes.com/sites/johnwerner/2026/08/13/gemini-35-pro-delay-continues/",
    beat: "rumor",
    models: ["gemini-3.8-flash", "gemini-3.1-pro"],
  },
  {
    id: "rohit-aug14",
    title: "August 14 field guide: Sol, Fable 5, Grok 4.6, 3.7 Flash, V4 Pro",
    blurb:
      "What a normal customer could actually call mid-August  -  before 5.1, 3.8, and Spark 1.3 landed.",
    date: "2026-08-14",
    outlet: "Rohit AI",
    url: "https://rohitai.com/blog/best-ai-models-2026-openai-anthropic-google-xai-deepseek",
    beat: "ranking",
    models: ["gpt-5.6-sol", "claude-fable-5", "grok-4.6"],
  },
];
