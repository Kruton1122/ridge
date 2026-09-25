export const CHANGELOG = [

  {
    date: "2026-09-24",
    title: "Half-week news 24 Sep: UN AI hearing, China CAC probe, opinion refresh",
    items: [
      "New wire: Altman and Amodei call for global AI standards at the UN Security Council. Trump rejects global AI regulation the same week (ABC News).",
      "New wire and desk note: China's CAC probes DeepSeek and Moonshot after Anthropic's distillation allegations (Decrypt, citing The Information). It follows Anthropic's 10 September threat report.",
      "Public-opinion read for 24 September. First ratings: Opus 5.5 at 4 stars; GPT-6 Sol, GPT-6 Luna, and Grok 4.7 at 3. Earlier ratings hold, with notes updated to 24 September.",
      "Snapshot and score as-of dates moved to 24 September. No board scores changed in this update.",
    ],
  },


  {
    date: "2026-09-23",
    title: "News: METR Opus 5.5 eval, price-war desk, ChatGPT Voice on GPT-6",
    items: [
      "New wire: METR's predeployment evaluation of Claude Opus 5.5 finds a modest step over Fable 5.1 on AI R&D and full automation unlikely. It estimates about 1.5× development acceleration, with caveats. The work was unpaid, and Anthropic could review the text. Source: https://metr.org/blog/2026-09-22-claude-opus-5-5/",
      "New desk note: cheaper flagships arrived the day after Amodei's call to pace the frontier, with commentary from The Register (23 Sep) and Simon Willison (22 Sep). No score changes.",
      "New wire: ChatGPT Voice now runs on Astra, Sol, and Luna, with plugins and Work support. Source: https://x.com/OpenAI/status/2102808325742322002",
    ],
  },


  {
    date: "2026-09-23",
    title: "Vals Terminal-Bench 2.1: GPT-6 Sol 83.15, Luna 73.03",
    items: [
      "Added GPT-6 Sol Terminal-Bench 2.1 at 83.15 from Vals AI, as of 23 September (max effort, #6 of 73, ±1.30). Sources: https://www.vals.ai/models/openai_gpt-6-sol and https://x.com/ValsAI/status/2102629857972932819.",
      "Added GPT-6 Luna Terminal-Bench 2.1 at 73.03 from Vals AI, as of 23 September (max effort, #22 of 73, ±1.72). Sources: https://www.vals.ai/models/openai_gpt-6-luna and https://x.com/ValsAI/status/2102874058811678893.",
      "Sol and Luna AA, Arena, CursorBench, and SWE-bench scores unchanged. Opus unchanged. Snapshot moved to 23 September. Model summaries, the GPT-6 Sol and Luna news items, and llms.txt updated.",
    ],
  },


  {
    date: "2026-09-23",
    title: "SWE-Together full-model bypass audit (zhuokaiz)",
    items: [
      "New wire and desk note: Zhuokai Zhao's full 12-model tool-call audit of SWE-Together after the Grok 4.7 sandbox bypass. 67 re-runs on a hardened sandbox, 0 leaks, small pass@1 shifts. Source: https://x.com/zhuokaiz/status/2102825912471527738 (~2:22 PM ET).",
      "The live togetherbench.com pass@1 figures match the posted after column. SWE-Together is not a Ridge board column, so board scores are unchanged.",
      "llms.txt updated with the audit.",
    ],
  },

  {
    date: "2026-09-22",
    title: "Board scores: Opus 5.5, GPT-6 Sol and Luna from first-party sources",
    items: [
      "Claude Opus 5.5: AA Intelligence 58 (AA model page), CursorBench 57.8 (cursor.com), Arena Elo 1532 (OpenLM Arena+), Terminal-Bench 2.1 87.64 (Vals, high, #1). No SWE-bench score.",
      "GPT-6 Sol: AA Intelligence 48 (AA model page), Arena Elo 1509 (OpenLM; separate from GPT-5.6 Sol). No CursorBench, Terminal-Bench, or SWE-bench score.",
      "GPT-6 Luna: AA Intelligence 37 (AA model page). No Arena, CursorBench, Terminal-Bench, or SWE-bench score.",
      "Model summaries, the Opus 5.5 and GPT-6 Sol/Luna news items, and llms.txt updated.",
    ],
  },

  {
    date: "2026-09-22",
    title: "Claude Opus 5.5 and GPT-6 Sol/Luna added (no scores yet)",
    items: [
      "Added Claude Opus 5.5 ($4/$20, released 22 September), GPT-6 Sol ($2/$10), and GPT-6 Luna ($0.10/$0.50). No scores or ratings at launch.",
      "GPT-5.6 Sol, GPT-5.6 Luna, and Claude Opus 5 keep their own rows. Their summaries now point to the new models.",
      "New wire and desk notes on both launches, from the Anthropic and OpenAI posts. Vendor CursorBench, Terminal-Bench 4.0, and DeepSWE figures are cited as launch context only.",
      "Snapshot moved to 22 September. llms.txt notes the three launches.",
    ],
  },




  {
    date: "2026-09-21",
    title: "Grok 4.7 launch-day X reception (@notjazii qualitative scoreboard)",
    items: [
      "New wire and desk note on @notjazii's qualitative 8/8 scoreboard for Grok 4.7 (jazii.dev). Explicitly not a poll; modest engagement. Source: https://x.com/notjazii/status/2102108793266172378 (~2:52 PM ET).",
      "It matches the AA token-usage complaint from that afternoon (81k vs 36k on 4.6). Reception only; the graphic does not change any score.",
      "Added a pointer to this note from the Grok 4.7 launch items. Board scores and ratings unchanged.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Afternoon news: B.C. OpenAI suit and AGMAI math advisory",
    items: [
      "Afternoon news update. The Grok 4.7 launch was already covered; no board scores or ratings changed.",
      "New wire and desk note: British Columbia files in California against OpenAI over the Tumbler Ridge shooting (failure-to-notify and unsafe-product claims). Sources: BC Government and CBC. Separate from the Buist suit.",
      "New wire and desk note: the independent AGMAI math advisory group (agmai.org) forms after an OpenAI request. Its first task is coordinating the release of math results OpenAI attributes to an internal model. No model is named.",
      "llms.txt notes both stories.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Vals Terminal-Bench 2.1: Grok 4.7 at 76.03",
    items: [
      "Added Grok 4.7 Terminal-Bench 2.1 at 76.03 from Vals AI, as of 21 September (xhigh, #14 of 67). Sources: https://vals.ai/ (Grok 4.7 suite report) and https://x.com/valsai/status/2102086608476590432.",
      "New wire and desk note on the Vals suite eval. The Vals Index of 54.15 is suite context, not an AA, Arena, or CursorBench score. No SWE-bench Verified score, because Vals stopped new runs and the Grok 4.7 report omits it.",
      "Updated the Grok 4.7 summary and launch note so Terminal-Bench is no longer shown as empty.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Arena+ Elo: Grok 4.7 at 1507",
    items: [
      "Added Grok 4.7 Arena Elo 1507 from Arena+, as of 21 September. Grok 4.6 stays at 1507.",
      "Updated the Grok 4.7 summary and launch items. AA Intelligence 46 and CursorBench 46.3 are sourced separately. No Vals SWE-bench score.",
      "Vals no longer runs SWE-bench Verified on new model releases (benchmark page updated 1 September), so Grok 4.7 has no SWE-bench score.",
      "Source: https://openlm.ai/chatbot-arena/. OpenLM's AAII figure of 47 is not used; the Artificial Analysis score of 46 is the one of record.",
    ],
  },

  {
    date: "2026-09-21",
    title: "CursorBench 4.0: Grok 4.7 at 46.3 (xhigh)",
    items: [
      "Added Grok 4.7 CursorBench 46.3 from Cursor, as of 21 September, at xhigh / Extra High (best published; Grok has no max run). Cursor.com's first-party table confirms the 46.3 shown in SpaceXAI's launch chart.",
      "Updated the Grok 4.7 summary and launch items. AA 46 is sourced separately. Arena Elo, Vals SWE-bench, and Terminal-Bench 2.1 had no score at the time.",
      "Source: https://cursor.com/cursorbench.",
    ],
  },

  {
    date: "2026-09-21",
    title: "AA Index: Grok 4.7 at 46 (high)",
    items: [
      "Added Grok 4.7 AA Intelligence 46 from Artificial Analysis, as of 21 September, using the high variant (xhigh also 46). Context stays 500K and price stays $2/$6.",
      "Arena Elo, Vals SWE-bench, CursorBench, and Terminal-Bench 2.1 had no score at the time. The Terminal-Bench 4.0 inside AA Index v4.3.2 is an AA component, not a Ridge Terminal-Bench score.",
      "Source: https://artificialanalysis.ai/leaderboards/models.",
    ],
  },

  {
    date: "2026-09-21",
    title: "Grok 4.7 added (no scores yet)",
    items: [
      "Added Grok 4.7 (xAI, released 21 September, $2/$6). No scores or rating at launch.",
      "Updated the Grok 4.6 rating note now that 4.7 has shipped. The two stay separate rows.",
      "New wire and desk note from the SpaceXAI launch post (https://x.com/spacexai/status/2102069815225586149). The vendor chart is cited as context only: its Terminal-Bench 4.0 is not the board's Terminal-Bench 2.1, and DeepSWE is not Vals SWE-bench.",
      "llms.txt notes the launch.",
    ],
  },

  {
    date: "2026-09-21",
    title: "Half-week news: Muse connectors, Buist suit, Gemini breakout, opinion hold",
    items: [
      "New wire: Buist v Anthropic, a Sherman Act section 1 class action over an alleged AI slowdown pact (Fortune, CourtListener). Allegations only.",
      "New wire: Google discloses that Gemini reached three real firms during a May Irregular eval and says the model stopped (Reuters, WSJ, CNBC). It does not affect the 3.8 Flash row.",
      "New wire: developers can now build Muse connectors (Zuckerberg on X, RuntimeWire). An agent platform story, separate from Spark ratings.",
      "New wire: Plugin4Shell, a zero-click SHA-pin bypass affecting Claude Code, Codex, Copilot, and Gemini CLI (Air Security).",
      "New wire: Reuters' narrative recap of the safety cascade.",
      "New desk notes: the 21 September opinion read, a safety roundup, and Muse connectors. Ratings unchanged; notes and as-of dates refreshed.",
      "The morning score update set the snapshot to 21 September and refreshed AA scores (Luna 38 to 37, V4.1 Flash 40 to 39).",
    ],
  },



  {
    date: "2026-09-18",
    title: "Wire + short desk: Grok Voice Transcribe 2.0",
    items: [
      "New wire and short desk note on Grok Voice Transcribe 2.0: opt-in speech-to-text, 1.0 stays the default, flat $0.10/$0.20 pricing, and separate from Think Fast 2.0. The accuracy claim is the vendor's, with no public 1.0-to-2.0 benchmark. No board changes.",
    ],
  },


  {
    date: "2026-09-17",
    title: "Desk + wire: Grok Bot Galaxy",
    items: [
      "New wire and desk note on xAI's Grok Bot Galaxy in SF and on livestream, built around Palmer, Tan, and Sadanani's 72-hour blank-slate company build. The showcase had not happened yet. Grok Bot is the agent product, not chat Grok. No board changes.",
    ],
  },

  {
    date: "2026-09-17",
    title: "Wire: SpaceX startup-data talks",
    items: [
      "New wire: informal SpaceX/SpaceXAI talks about buying customer and operations data from troubled or defunct startups for AI training. A deal may not happen (Bloomberg, TNW). An earlier outlet's 'plans' framing is corrected to 'discussions'.",
    ],
  },

  {
    date: "2026-09-17",
    title: "Desk + wire: TypeSafe Jev; Astra Enigma claim",
    items: [
      "New wire and desk note: TypeSafe opens early access to Jev, its first System One model (from Almeida's blog). No text generation; typed decisions with probabilities. Skeptical reviews included. No board changes.",
      "New wire and short desk note: Carter Leffen's claim that Astra Extra High agents cracked the Enigma message MVUEH, covered by The Decoder. Independent verification pending. No board changes.",
    ],
  },

  {
    date: "2026-09-14",
    title: "Half-week news: Grok 4.8 ladder, Pro→Flash live, opinion stars",
    items: [
      "New wire: Microsoft's provisional MAI code of conduct (CNBC, Reuters). No autonomous goals, no concealed reasoning, human control, and outside input now, with training changes from 2027. Also added to the pacing desk note.",
      "New wire: RUM's ~$13.7B Maysville GPU deal is reportedly with Anthropic (MarketWatch, The Information; Reuters on the unnamed 8-K). Neither company has confirmed it.",
      "New wire: Latham & Watkins buys Nvidia servers to customize open-weight models in-house instead of relying only on closed clouds (FT).",
      "New wire: Trump on Truth Social says the only AI guardrail needed is a strong President and names Anthropic's Dario (from a screenshot; no public URL found). Also added to the pacing desk note.",
      "New wire: DoD says ~90% of classified AI workloads will be off Anthropic by month-end (DefenseScoop). The story is a usage dispute and a supply-chain risk designation, not a data exposure.",
      "New wire and desk note: Musk says Grok 4.8 is 2.5T on a new C++ stack and puts 4.7 near Opus 5, not Fable. No board row.",
      "New wires: DeepSeek's Pro-to-Flash routing goes live at 04:00 UTC; OpenAI on rethinking skills and AGENTS.md for Astra; Design Arena puts Spark 1.3 first on Website.",
      "Public-opinion read for 14 September. Spark xhigh moves from 3 to 4 stars, and DeepSeek V4.1 Flash gets its first rating at 4. Notes refreshed for Fable, Astra, Opus, Sol, Grok 4.6, Kimi, and 3.8 Flash. Spark max, V4 Pro, and thinly discussed rows stay unrated.",
      "New wire, also added to the pacing desk note: China's MFA spokesperson Guo Jiakun calls the US CEO pacing chorus fearmongering (CNBC, BBC).",
    ],
  },

  {
    date: "2026-09-13",
    title: "Desk + wire: Sep 10 threat intel, Live-1, Agents, Flash AA, SWE-2",
    items: [
      "New desk note and wire on Anthropic's September 2026 threat report (Alibaba/Tongyi distillation, Moonshot relays, DeepSeek 12.1M exchanges, API-key theft). A security story, separate from the pacing essay.",
      "New desk note on GPT-Live-1, full-duplex voice in the API at $0.05/min, with OpenAI's benchmarks. New wire on the OpenAI Agents API public beta the same morning.",
      "Updated the DeepSeek V4.1 Flash note for AA Index 40 and Arena 1503. New wires on AA's V4.1 Flash score and Cognition's SWE-2 launch.",
      "Snapshot and llms.txt moved to 13 September.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Altman IPO delay folded into pacing",
    items: [
      "Added Altman's Fortune interview to the pacing desk note: a 2026 IPO would be ill-advised amid safety work. New wire with Fortune as the primary source.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Altman matches embedded evaluators",
    items: [
      "Updated the pacing desk note: Altman agrees on pacing and says OpenAI will commit to independent evaluators with employee-like access. Same-day endorsements are now Musk and Altman.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Amodei paces the frontier (Musk agrees)",
    items: [
      "New policy desk note on Dario Amodei's essay We Must Pace the Frontier, with Musk's reply \"Dario is right.\"",
      "Matching wire item. No board changes.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Wire: AA Devin Fusion on Coding Agent Index",
    items: [
      "New wire from Artificial Analysis: Devin Fusion is the first multi-model coding agent on the Coding Agent Index. Fable 5.1 plus SWE-2 scores 62; Astra plus SWE-2 scores 59. Coding Agent Index only; no board change.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Desk + wire: Grok 4.7 still cooking (Musk)",
    items: [
      "New rumor desk note on Musk's 11 September reply (~17:22 UTC): Grok 4.7 needs a few more days, with a suspected RL length penalty, early aborts, and weak self-checking.",
      "Matching wire item. No board row or scores for Grok 4.7.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Gemini 3.1 Pro — map Preview board scores to GA catalog id",
    items: [
      "Mapped AA Intelligence 30 and Vals SWE-bench 78.8 (both boards still label the model Preview) onto Gemini 3.1 Pro. Kept Arena Elo 1504 (listed as plain Gemini-3.1-Pro).",
      "Added aliases so Preview-labeled source rows match the GA model.",
      "Summary notes GA since Feb 2026, while AA and SWE-bench still used the Preview label as of 11 September.",
    ],
  },

  {
    date: "2026-09-11",
    title: "CursorBench 4.0 board column",
    items: [
      "Added CursorBench 4.0 as a fifth board column from cursor.com/cursorbench (first-party Cursor harness; not comparable to CursorBench 3.x).",
      "Seeded 10 published max or best-effort scores (Fable 5.1 51.8 … Sonnet 5 34.1). Composer 2.5 is omitted because it is not on the board. No gaps were filled with estimates.",
      "Snapshot and llms.txt moved to 11 September. CursorBench scores are updated by hand from the vendor page for now.",
    ],
  },

  {
    date: "2026-09-10",
    title: "Filled missing scores from source boards",
    items: [
      "Added missing scores from the 10 September source pull: Sonnet 5 (AA 38 / Arena Thinking 1485 / SWE 79.6), GLM-5.3 (45 / 1505 / 95.4), plus Astra Arena 1520, Spark 1.3 Arena 1507, Terra AA 42 + SWE 95.4, Qwen3.8 Max AA 40, 3.7/3.8 Flash SWE, Grok 4.5 AA 39, V4 Pro AA 36 + Arena 1502, Luna AA 38 + Arena 1451.",
      "The daily update can now add a missing score for a listed model, with the same name-matching safeguards.",
      "Left empty where no clear source row existed: DeepSeek V4.1 Flash, Muse Spark 1.3 max Arena, Gemini 3.1 Pro AA and SWE (Preview-only at the time), Terminal-Bench, and Fable 5.1 SWE. Fixed out-of-date summaries for Sonnet, GLM, Qwen, Terra, 3.7 Flash, Grok, and Luna.",
    ],
  },
  {
    date: "2026-09-10",
    title: "Fixed scores corrupted by a bad name match",
    items: [
      "Tightened name matching in the daily update: exact names and aliases first, weak fuzzy matches rejected, and large jumps held back without a confident match.",
      "Restored Arena Elo and SWE-bench scores after a bad 10 September update (e.g. Fable 5.1 1520←1178, Opus SWE 97←76.4). AA best-variant scores kept.",
      "Arena side rows (style-control, deprecated, Claude-1/2) are now ignored. DeepSeek V4 Pro keeps Verified 96.4 over a lower Pro listing.",
    ],
  },
  {
    date: "2026-09-10",
    title: "DeepSeek V4.1 Flash added",
    items: [
      "Added DeepSeek V4.1 Flash (API deepseek-flash): GA, open-weight MIT, 1M context, peak list $0.30 / $1.20, off-peak half, cache-hit pricing in the summary.",
      "No AA, Arena, or Vals scores yet because the 10 September source pull had no Flash listing. DeepSeek V4 Pro kept; its summary notes the 14 September routing to Flash.",
      "New wires: launch, API pricing and routing, Hugging Face weights, WorkBuddy/CodeBuddy and OpenCode partners, and the API release note.",
      "New desk note on V4.1 Flash. Snapshot and llms.txt moved to 10 September. No public-opinion rating yet.",
    ],
  },
  {
    date: "2026-09-08",
    title: "Half-week news + public-opinion pass",
    items: [
      "New wires: AA v4.3 methodology, NVIDIA and Hugging Face, Jensen Huang on Astra, Mythos on the Cyber Weapon Index, and Vellum's Terminal-Bench 4.0 cliff.",
      "Public-opinion read for 8 September: Fable, Astra, and K3 at 4 stars; a mixed 3-star baseline elsewhere; Spark max unrated.",
      "Ratings come from public posts on X. None are estimated.",
      "Model summaries aligned to the live AA board (53/53/…). Scores still come from the daily source pull.",
    ],
  },
  {
    date: "2026-09-08",
    title: "Daily source pull: score refresh",
    items: [
      "aa-intelligence: Fable 5.1 57->53, Astra 55->53, Opus 5 54->51, Fable 5 53->50, Spark max 53->48, Sol 51->47.",
      "arena-elo: Fable 5.1 1516->1520, 3.8 Flash 1503->1505, Grok 4.5 1505->1504.",
      "Scores from the daily pull of AA, Arena+, and Vals.",
    ],
  },
  {
    date: "2026-09-07",
    title: "Monday cut — Astra in, Index rebased",
    items: [
      "GPT-6 Astra added at AA v4.2 55 max ($10 / $50).",
      "Intelligence Index moved from v4.1.1 (~60s scale) to v4.2. Fable 5.1 66 → 57 is a ruler change, not a drop.",
      "Spark split: public xhigh 52, partner max 53. Old v4.1.1 rows were 61 and 62.",
      "Gemini 3.8 Flash list price recorded as $1.50 / $7.50 with promo $0.75 / $3.75 through 31 Dec.",
    ],
  },
  {
    date: "2026-09-02",
    title: "Seed — 3.8 Flash and Spark 1.3",
    items: [
      "Gemini 3.8 Flash and Muse Spark 1.3 landed. v4.1.1 composite: Fable 5.1 66, Spark xhigh 61.",
    ],
  },
];
