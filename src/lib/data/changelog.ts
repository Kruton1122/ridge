export const CHANGELOG = [
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
