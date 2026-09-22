export const CHANGELOG = [

  {
    date: "2026-09-22",
    title: "Board fills: Opus 5.5 / GPT-6 Sol Luna from first-party sources",
    items: [
      "claude-opus-5.5: aa-intelligence 58 (AA model page), cursor-bench 57.8 (cursor.com), arena-elo 1532 (OpenLM Arena+), terminal-bench 87.64 (Vals TB 2.1 high #1). SWE blank.",
      "gpt-6-sol: aa-intelligence 48 (AA model page), arena-elo 1509 (OpenLM; distinct from gpt-5.6-sol). No CursorBench / TB / SWE.",
      "gpt-6-luna: aa-intelligence 37 (AA model page). Arena / CursorBench / TB / SWE blank.",
      "Updated model summaries, desk/wire opus-55-0922 and gpt6-sol-luna-0922, and llms.txt news/headline. SNAPSHOT_DATE already 2026-09-22.",
    ],
  },

  {
    date: "2026-09-22",
    title: "Claude Opus 5.5 + GPT-6 Sol/Luna catalog (blank board seats)",
    items: [
      "Catalog MODELS: add claude-opus-5.5 ($4/$20, released 2026-09-22), gpt-6-sol ($2/$10), gpt-6-luna ($0.10/$0.50). No SCORES rows. No publicOpinionStars.",
      "Keep gpt-5.6-sol / gpt-5.6-luna / claude-opus-5 rows; update summaries so the new SKUs are not confused with predecessors.",
      "Wire + desk opus-55-0922 (Anthropic news + X) and gpt6-sol-luna-0922 (OpenAI index + X). Vendor CursorBench / TB 4.0 / DeepSWE cited as context only.",
      "SNAPSHOT_DATE / SNAPSHOT_LABEL / isFresh asOf → 2026-09-22. llms.txt notes the three ships.",
    ],
  },




  {
    date: "2026-09-21",
    title: "Grok 4.7 launch-day X reception (@notjazii qualitative scoreboard)",
    items: [
      "Wire + desk grok47-reception-0921 from https://x.com/notjazii/status/2102108793266172378 (~2:52 PM ET). Qualitative 8/8 scoreboard (jazii.dev); explicitly not a poll; modest engagement.",
      "Notes alignment with afternoon AA token-usage chatter (81k vs 36k on 4.6). Reception only; no board fills from the graphic.",
      "Optional one-line early-reception pointer on grok-47-0921 launch desk/wire. Catalog scores and publicOpinionStars untouched. SNAPSHOT stays 2026-09-21.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Afternoon X scrape: B.C. OpenAI suit + AGMAI math advisory",
    items: [
      "Ad-hoc Grok Build X scrape since ~09:50 ET (log: logs/news-pass-grok-20260921-pm.txt). Grok 4.7 launch swarm already desked; no new Ridge board cells; stars SKIP.",
      "Wire + desk bc-openai-tumbler-0921: B.C. California filing vs OpenAI over Tumbler Ridge shooting (failure-to-notify / unsafe product claims). Primary BC Gov + CBC. Separate from Buist.",
      "Wire + desk openai-agmai-0921: independent AGMAI math advisory (agmai.org) after OpenAI ask; current task is release coordination for claimed internal-model math results. No SKU / no board invent.",
      "llms.txt news line notes the two afternoon policy/labs wires. No catalog score edits.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Vals Terminal-Bench 2.1: Grok 4.7 at 76.03",
    items: [
      "Added grok-4.7 terminal-bench 76.03, Vals AI, as of 2026-09-21; note xhigh / #14 of 67 / Terminal-Bench 2.1. Source: https://vals.ai/ (Grok 4.7 suite report) + https://x.com/valsai/status/2102086608476590432.",
      "Wire + desk vals-grok47-0921. Vals Index 54.15 is suite context only; do not paste into AA / Arena / CursorBench. SWE-bench Verified stays blank (Vals stopped new runs; Grok 4.7 report omits SWE).",
      "Updated grok-4.7 summary and patched grok-47-0921 launch copy so Terminal-Bench is no longer described as blank.",
    ],
  },


  {
    date: "2026-09-21",
    title: "Arena+ Elo: Grok 4.7 at 1507",
    items: [
      "Added grok-4.7 arena-elo 1507, Arena+, as of 2026-09-21; Grok 4.6 arena-elo 1507 remains unchanged.",
      "Updated the Grok 4.7 summary plus grok-47-0921 desk/wire. AA Intelligence 46 and CursorBench 46.3 remain separately sourced; Vals SWE-bench stays blank.",
      "Vals says it no longer runs SWE-bench Verified on new model releases (benchmark page updated 2026-09-01), so no Grok 4.7 SWE value is invented.",
      "Source: https://openlm.ai/chatbot-arena/. OpenLM's AAII 47 is not used; the Artificial Analysis AA Intelligence 46 row remains authoritative.",
    ],
  },

  {
    date: "2026-09-21",
    title: "CursorBench 4.0: Grok 4.7 at 46.3 (xhigh)",
    items: [
      "Added grok-4.7 cursor-bench 46.3, Cursor, as of 2026-09-21; xhigh / Extra High (best published; Grok has no max run). Cursor.com's first-party table confirms the 46.3 cell shown in SpaceXAI's launch chart.",
      "Updated the Grok 4.7 summary plus grok-47-0921 desk/wire. AA 46 high/xhigh remains separately sourced; Arena Elo, Vals SWE-bench, and Ridge Terminal-Bench 2.1 remain blank.",
      "Source: https://cursor.com/cursorbench. No Arena, Vals, or Terminal-Bench score invented.",
    ],
  },

  {
    date: "2026-09-21",
    title: "AA Index: Grok 4.7 at 46 (high)",
    items: [
      "Added grok-4.7 aa-intelligence 46, Artificial Analysis, as of 2026-09-21; note uses the high variant (xhigh also 46). Context remains 500K and price remains $2/$6.",
      "Arena Elo, Vals SWE-bench, CursorBench, and Ridge Terminal-Bench 2.1 stay blank. AA Index v4.3.2's Terminal-Bench 4.0 is an internal AA component, not a Ridge Terminal-Bench score.",
      "Source: https://artificialanalysis.ai/leaderboards/models. No other Grok 4.7 board cells invented.",
    ],
  },

  {
    date: "2026-09-21",
    title: "Catalog: Grok 4.7 ships (blank board seats)",
    items: [
      "Catalog MODELS: add grok-4.7 (name Grok 4.7, lab xAI, released 2026-09-21, $2/$6, aliases). No SCORES rows (AA / Arena / Vals SWE / CursorBench / Terminal-Bench blank). No publicOpinionStars.",
      "Update grok-4.6 publicOpinionNote: 4.7 shipped; keep rows separate (was unshipped 4.7).",
      "Wire + desk grok-47-0921 from SpaceXAI X post https://x.com/spacexai/status/2102069815225586149. Vendor chart cited in copy only; TB 4.0 != board TB 2.1; DeepSWE != Vals; vendor CB != Cursor.com yet.",
      "SNAPSHOT stays 2026-09-21; isFresh asOf already 2026-09-21. llms.txt notes the ship.",
    ],
  },

  {
    date: "2026-09-21",
    title: "Half-week news: Muse connectors, Buist suit, Gemini breakout, opinion hold",
    items: [
      "Wire buist-antitrust-0919 (Fortune/CourtListener): Buist v Anthropic Sherman section 1 slowdown class action; allegations only.",
      "Wire gemini-breakout-0918 (Reuters/WSJ/CNBC): Gemini May Irregular eval hit three real firms; Google says stopped; not Flash board invent.",
      "Wire muse-connectors-0918 (Zuck X / RuntimeWire): developer Muse connectors; agent platform != Spark stars.",
      "Wire plugin4shell-0917 (Air Security): zero-click SHA-pin bypass on Claude Code/Codex/Copilot/Gemini CLI.",
      "Wire reuters-ten-days-0919: narrative wrap on the safety cascade.",
      "Desk halfweek-opinion-0921 + safety-cluster-0921 + muse-connectors-0918. publicOpinionStars unchanged; notes/asOf refreshed from logs/news-pass-grok-20260921.txt.",
      "Morning briefing already set SNAPSHOT / isFresh asOf to 2026-09-21 and AA as-of refreshes (Luna 38 to 37, V4.1 Flash 40 to 39).",
    ],
  },



  {
    date: "2026-09-18",
    title: "Wire + short desk: Grok Voice Transcribe 2.0",
    items: [
      "Wire + short desk grok-transcribe-2-0918: STT 2.0 opt-in; 1.0 default; $0.10/$0.20 flat; != Think Fast 2.0; vendor accuracy claim, no public 1-to-2 bench. isFresh asOf -> 2026-09-18. No catalog/SNAPSHOT.",
    ],
  },


  {
    date: "2026-09-17",
    title: "Desk + wire: Grok Bot Galaxy",
    items: [
      "Wire + desk grok-bot-galaxy-0917: xAI Galaxy SF+livestream; Palmer/Tan/Sadanani 72h blank-slate build; showcase still landing; Bot != chat Grok. No catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-17",
    title: "Wire: SpaceX startup-data talks",
    items: [
      "Wire spacex-startup-data-0917 (Bloomberg; TNW): informal SpaceX/SpaceXAI talks on buying troubled/defunct startup customer+ops data for AI; may not deal. Squawk plans framing corrected. No desk/catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-17",
    title: "Desk + wire: TypeSafe Jev; Astra Enigma claim",
    items: [
      "Wire + desk typesafe-jev-0917: TypeSafe System One / Jev early access (Almeida blog). No string gen; typed decisions + probs. Skeptical caveats. No catalog/SNAPSHOT.",
      "Wire + short desk astra-enigma-0917: Leffen Astra Extra High agent claim on Enigma MVUEH; Decoder coverage; verification pending. No catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-14",
    title: "Half-week news: Grok 4.8 ladder, Pro→Flash live, opinion stars",
    items: [
      "Wire microsoft-mai-conduct-0914 (CNBC/Reuters): provisional MAI code of conduct; no autonomous goals / conceal CoT; human control; consult then train from 2027. Short fold into pace-frontier-0912. No catalog/SNAPSHOT.",
      "Wire anthropic-rum-compute-0914 (MarketWatch/The Information; Reuters on unnamed 8-K): RUM ~$13.7B Maysville GPU deal reportedly Anthropic; neither confirmed. Caveat. No desk/catalog/SNAPSHOT.",
      "Wire latham-sovereign-ai-0913 (FT): Latham Nvidia servers to customize open-weight in-house vs closed cloud. Industry beat. No desk/catalog/SNAPSHOT.",
      "Wire trump-ai-guardrails-0914 (Truth Social screenshot; no public URL): President as AI guardrails; names Dario/Anthropic; criminal/regulatory power; China-wins framing. Folded into pace-frontier-0912. No catalog/SNAPSHOT.",
      "Wire anthropic-dod-restrict-0914 (DefenseScoop): ~90% classified AI off Anthropic by month-end; usage fight / supply-chain risk, not Polymarket data-exposure framing. No desk/catalog/SNAPSHOT.",
      "Wire + desk grok-48-ladder-0914 (Musk X: 4.8 2.5T/C++ stack; 4.7 ≈ Opus 5 not Fable). No catalog row.",
      "Wire ds-pro-route-live-0914 (DeepSeek Pro→Flash routing live 04:00 UTC). Wire openai-astra-skills-0911 + design-arena-spark-0909.",
      "Desk halfweek-opinion-0914. Catalog: Spark xhigh 3→4★; DeepSeek V4.1 Flash first fill 4★; refreshed notes/asOf for Fable/Astra/Opus/Sol/Grok4.6/Kimi/3.8Flash. Skipped Spark max, V4 Pro, thin rows. SNAPSHOT already 2026-09-14.",
      "Wire + desk fold china-pace-pushback-0914: China MFA Guo Jiakun rejects US CEO pacing chorus as fearmongering (CNBC/BBC). Folded into pace-frontier-0912. No catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-13",
    title: "Desk + wire: Sep 10 threat intel, Live-1, Agents, Flash AA, SWE-2",
    items: [
      "Desk controversy anthropic-threat-intel-0910 + matching wire from Anthropic Sep 2026 threat report (Alibaba/Tongyi, Moonshot relay, DeepSeek 12.1M, API-key theft). Security beat; not pace-frontier.",
      "Desk release gpt-live-1-0910 (full-duplex API voice; $0.05/min; OpenAI benches cited). Wire openai-agents-api-0910 public beta same morning.",
      "Updated ds-v41-flash-desk for AA Index 40 / Arena 1503 (model row already present). Wire aa-ds-v41-flash. Wire cognition-swe-2-0910 (launch; distinct from aa-devin-fusion).",
      "Snapshot / llms.txt / isFresh asOf → 2026-09-13. No new Flash catalog row. Skipped: Financial Services, RubyGems attribution, Cursor Projects.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Altman IPO delay folded into pacing",
    items: [
      "pace-frontier-0912: Altman tells Fortune 2026 IPO ill-advised amid safety; fold into pacing desk. Wire openai-ipo-delay-0912 (Fortune primary; Polymarket alert). No catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Altman matches embedded evaluators",
    items: [
      "pace-frontier-0912: Altman QT agrees on pacing; OpenAI will commit to independent evaluators with employee-like access. Same-day cosigns now Musk + Altman. models +gpt-6-astra. No catalog/SNAPSHOT.",
    ],
  },

  {
    date: "2026-09-12",
    title: "Desk + wire: Amodei paces the frontier (Musk agrees)",
    items: [
      "Desk policy pace-frontier-0912 from Dario essay We Must Pace the Frontier; Musk QT \"Dario is right.\"",
      "Wire same id, beat policy. models: claude-fable-5.1, claude-opus-5, grok-4.6. No catalog/SNAPSHOT bump.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Wire: AA Devin Fusion on Coding Agent Index",
    items: [
      "Wire aa-devin-fusion from Artificial Analysis X post: first multi-model coding agent; Fable 5.1+SWE-2 62, Astra+SWE-2 59. Coding Agent Index only; no desk, catalog, or SNAPSHOT bump.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Desk + wire: Grok 4.7 still cooking (Musk)",
    items: [
      "Desk rumor grok-47-cook from Elon 11 Sept ~17:22 UTC reply: few more days; suspected RL length penalty; early abort; weak self-check.",
      "Wire blurb same source. models: grok-4.6 only. No catalog row, no invented board scores, SNAPSHOT_DATE untouched.",
    ],
  },

  {
    date: "2026-09-11",
    title: "Gemini 3.1 Pro — map Preview board scores to GA catalog id",
    items: [
      "Mapped AA Intelligence 30 and Vals SWE-bench 78.8 (boards still label Preview) onto catalog id gemini-3.1-pro; kept Arena Elo 1504 (plain Gemini-3.1-Pro).",
      "Expanded aliases for preview variants so apply-briefing-staging can match Preview-named scrape rows to the GA id.",
      "Summary notes GA since Feb 2026; AA/SWE still publish under Preview label as of 11 Sept.",
    ],
  },

  {
    date: "2026-09-11",
    title: "CursorBench 4.0 board column",
    items: [
      "Added CursorBench 4.0 (`cursor-bench`) as a fifth ledger board column from cursor.com/cursorbench (first-party Cursor harness; not comparable to CursorBench 3.x).",
      "Seeded 10 max/best-effort published rows (Fable 5.1 51.8 … Sonnet 5 34.1). Composer 2.5 omitted (not in catalog). No invented blanks filled.",
      "Snapshot / llms.txt / isFresh asOf → 2026-09-11. Scrape remains manual from the vendor page for now.",
    ],
  },

  {
    date: "2026-09-10",
    title: "Fill blank score coverage + enable briefing inserts",
    items: [
      "Seeded missing SCORES from 2026-09-10 briefing-pull: Sonnet 5 (AA 38 / Arena Thinking 1485 / SWE 79.6), GLM-5.3 (45 / 1505 / 95.4), plus Astra Arena 1520, Spark 1.3 Arena 1507, Terra AA 42 + SWE 95.4, Qwen3.8 Max AA 40, 3.7/3.8 Flash SWE, Grok 4.5 AA 39, V4 Pro AA 36 + Arena 1502, Luna AA 38 + Arena 1451.",
      "apply-briefing-staging.py now INSERTs matched catalog models missing a SCORES row (keeps claim-on-first-match, fuzzy safety rails, non-main Arena skips). Thinking→base when aliased; max-model gate also reads scraped title.",
      "Left blank: deepseek-v4.1-flash (no clear V4.1 Flash row), muse-spark-1.3-max Arena (no explicit max row), gemini-3.1-pro AA/SWE (Preview-only in pull), Terminal-Bench, Fable 5.1 SWE from Fable 5. Fixed stale Sonnet/GLM/Qwen/Terra/3.7/Grok/Luna summaries.",
    ],
  },
  {
    date: "2026-09-10",
    title: "Fix briefing apply fuzzy-match score corruption",
    items: [
      "Hardened apply-briefing-staging matching: prefer exact/alias, reject weak fuzzy, claim model on first good match, safety-rail large Arena/SWE/AA jumps without high-confidence name match.",
      "Restored Arena Elo and SWE-bench after bad 2026-09-10 apply (e.g. Fable 5.1 1520←1178, Opus SWE 97←76.4). AA best-variant tops kept (scrape max/high).",
      "Skipped Arena non-main rows (style-control / deprecated / Claude-1/2). DeepSeek V4 Pro keeps Verified 96.4 over lower Pro slug.",
    ],
  },
  {
    date: "2026-09-10",
    title: "DeepSeek V4.1 Flash — new catalog id",
    items: [
      "Added deepseek-v4.1-flash (API deepseek-flash): GA, open-weight MIT, 1M context, peak list $0.30 / $1.20; off-peak half; cache-hit noted in summary.",
      "No AA / Arena / Vals score rows yet — briefing scrape 2026-09-10 had no Flash listing. deepseek-v4-pro kept; summary notes 14 Sept routing to Flash.",
      "Wire: launch, API pricing/routing, HF weights, WorkBuddy/CodeBuddy + OpenCode partners, API news note.",
      "Desk: ds-v41-flash-desk. Snapshot / llms.txt / isFresh asOf → 2026-09-10. publicOpinionStars left unset (no Grok Build scrape this pass).",
    ],
  },
  {
    date: "2026-09-08",
    title: "Half-week news + public-opinion pass",
    items: [
      "Wire: AA v4.3 methodology, NVIDIA↔Hugging Face, Jensen on Astra, Mythos CWI, Vellum TB 4.0 cliff.",
      "Desk: halfweek-opinion-0908 — Fable/Astra/K3 at 4★; mixed 3★ baseline elsewhere; Spark max skipped.",
      "publicOpinionStars set from Grok Build X scrape (logs/news-pass-grok-20260908.txt). No invented stars.",
      "Catalog summaries aligned to live AA board (53/53/…) — scores still owned by daily pipeline.",
    ],
  },
  {
    date: "2026-09-08",
    title: "Daily scrape - sourced score refresh",
    items: [
      "aa-intelligence: Fable 5.1 57->53, Astra 55->53, Opus 5 54->51, Fable 5 53->50, Spark max 53->48, Sol 51->47.",
      "arena-elo: Fable 5.1 1516->1520, 3.8 Flash 1503->1505, Grok 4.5 1505->1504.",
      "Scores sourced from daily briefing scrape (AA / Arena+ / Vals).",
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
