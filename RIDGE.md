# Ridge — agent brief

Read this before editing. The site is a **frontier LLM ledger**, not a generic dashboard.

Live site: https://ridgebench.com  
Public repo: https://github.com/Kruton1122/ridge
Owner runs it locally with `npm install && npm run dev` (port **8080**).

## What Ridge is

- Headline board: **Artificial Analysis Intelligence Index v4.2** (rebased 4 Sept 2026).
- Also shows: Vals SWE-bench, **CursorBench 4.0** (first-party; not comparable to 3.x), Arena Elo, Terminal-Bench.
- News tab = curated external wire + original Ridge notes.
- Machine-readable: `/api/ledger.json`, `/api/ledger.csv`, `/api/v1`, `/llms.txt`.
- Voice: short, sourced, no vendor slogans. Always cite **source URL + as-of date**.

## Do not invent numbers

If AA / Vals / Arena / a lab post has not published a score, leave `—`.  
Do not mix **v4.1.1 (~60s scale)** with **v4.2 (~50s scale)** on one bar.  
Fable 5.1 going 66 → 57 was a **ruler change**, not a model collapse.

Spark is two models on purpose:

| id | row | AA v4.2 | status |
|---|---|---|---|
| `muse-spark-1.3` | xhigh public | 52 | GA |
| `muse-spark-1.3-max` | max | 53 | Partner preview |

v4.1.1 was 61 / 62. Keep that only in notes.

## Stack

TanStack Start + React 19 + Tailwind v4 + Vite.  
App code is under `src/`. Scaffold leftovers (auth, PWA, multiplayer) exist; **don’t build features on them** unless asked.

## Where to edit

| Change | File |
|---|---|
| Models, prices, AA/SWE/CursorBench/Arena/TB scores, snapshot date | `src/lib/data/catalog.ts` |
| Ridge essays | `src/lib/data/desk.ts` |
| External headlines | `src/lib/data/wire.ts` |
| Model page voice | `src/lib/data/profiles.ts` |
| Ledger rows, $/AA, next-pull | `src/lib/data/ledger.ts` |
| Monday delta copy | `src/lib/data/changelog.ts` |
| Lab hex colors | `src/lib/data/colors.ts` |
| Types (`status`, `promoPricing`) | `src/lib/data/types.ts` |
| Homepage | `src/routes/_app/index.tsx` |
| News list / article | `src/routes/_app/news.index.tsx`, `src/routes/_app/news.$id.tsx` |
| Model dossier | `src/routes/_app/models.$slug.tsx` |
| Ledger UI (sort, lab filter, promo toggle) | `src/components/new/ledger.tsx` |
| Archived 2026-09 site | `src/routes/old/*` (`/old`) |
| AA-style bars | `src/components/score-bars.tsx` |
| Theme tokens | `src/styles.css` |
| Tab icon | `public/favicon.svg` + `src/components/ridge-mark.tsx` |
| OG / X cards | `public/og.jpg` (1200×630), `public/x-banner.jpg` (1200×264) |
| llms.txt | `public/llms.txt` |

After catalog edits, also bump:

- `SNAPSHOT_DATE` / `SNAPSHOT_LABEL` in `catalog.ts`
- `CHANGELOG` in `changelog.ts`
- `public/llms.txt`
- `isFresh(..., asOf)` default in `desk.ts` if the calendar moved

## Status + pricing

`Model.status`: `ga` | `preview` | `partner` | `promo`  
`pricing` = list. `promoPricing = { inputPerM, outputPerM, until }` for dated intros (Gemini 3.8 Flash promo through **2026-12-31**).  
`$/AA` = `((in+out)/2) / AA` — Ridge proxy, **not** AA cost-per-task. Don’t relabel it as official.

## Current headline board (7 Sept 2026, v4.2)

1. Fable 5.1 — 57 max+fallback  
2. GPT-6 Astra — 55 max — shipped 3 Sept, $10 / $50  
3. Opus 5 — 54 max  
4. Fable 5 — 53  
5. Spark max — 53 partner  
6. Spark xhigh — 52 GA  
7. Sol max / Grok 4.6 high — 51  
9. Kimi K3 — 50 open  
10. Gemini 3.8 Flash high — 47  

Astra aliases must include `gpt-6`, `astra`, `gpt-6-astra`.  
Never collapse **Grok 4** (old ~46) onto **Grok 4.6**.

## Monday update ritual

1. Pull AA leaderboard + any new model cards.  
2. Add new models as new `id`s (don’t overwrite a previous version).  
3. Replace only the `aa-intelligence` rows you can source on **v4.2**.  
4. Leave SWE / Arena / TB alone unless that source moved.  
5. Write a changelog entry and a Desk note.  
6. Do not draw sparklines across index versions.

## Public Vite / HMR

`ridge.service` runs Vite **dev** on 8098 behind nginx. **HMR is off by default** (`RIDGE_DISABLE_HMR=1` in the unit; `vite.config.ts` sets `server.hmr: false` unless `RIDGE_DISABLE_HMR=0`). Leaving HMR on full-reloaded every open ridgebench.com tab on each save.

## Owned board columns

| id | name | source | refresh |
|---|---|---|---|
| `aa-intelligence` | AA Intelligence Index v4.2 | artificialanalysis.ai | daily briefing scrape |
| `swe-bench` | SWE-bench Verified | vals.ai | daily briefing scrape |
| `cursor-bench` | CursorBench **4.0** | cursor.com/cursorbench | **manual** from vendor page for now (JS/RSC payload; no auto-scrape yet) |
| `arena-elo` | Arena Elo | openlm.ai | daily briefing scrape |
| `terminal-bench` | Terminal-Bench 2.1 | AA / Vellum | mostly static; leave unless sourced |

CursorBench is first-party Cursor. Do not invent rows; do not backfill 3.x numbers onto the 4.0 column.

## Things we already refused to fake

- MCP Atlas / SWE Atlas columns (no scores yet for 5.1 / 1.3 / Astra)  
- Full t/s and max-output columns (incomplete AA set)  
- Cached / contributor price matrices except dated Gemini promo  

## Commands

```bash
npm install
npm run dev          # http://localhost:8080
npm run typecheck
```

API smoke:

```bash
curl -s localhost:8080/api/ledger.json | head
curl -s localhost:8080/api/v1/leaderboard
```

## Product tone

Navy `#07111C`, amber `#E8B86D`, lab colors in `colors.ts`.  
Newsreader + Source Sans. Particle ridge background `public/ridge-bg.jpg`.  
Don’t turn it back into a yellow-R generic card.
