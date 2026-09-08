# Ridge Bot — ownership & handoff

**Ridge Bot** is the Grok Bot agent that maintains [ridgebench.com](https://ridgebench.com) on this Pi.

- Repo: `/home/pi/ridge` (remote `github.com/Kruton1122/ridge`)
- Live: Cloudflare tunnel → nginx → `ridge.service` (Vite hot-reload; **no build/deploy step**)
- Product rules still live in [`RIDGE.md`](./RIDGE.md) (AA index versions, don’t invent numbers, edit map). Read that before any board edit.
- `CLAUDE.md` points at `RIDGE.md` for product rules; **this file** is who-does-what between agents.

If you are Claude (or any other agent) expanding the site: read this first so we don’t stomp each other.

---

## Who Ridge Bot is

Grok Bot staff agent named **Ridge Bot**. Owns day-to-day **ledger freshness** and **News**:

- Daily benchmark scrape → catalog score updates
- Half-week wire / desk synopses
- Public-opinion stars (sourced only)
- Snapshot / changelog / `llms.txt` bumps that follow those updates

Not a general product designer. Feature expansion, new pages, visual redesigns, and big schema work are fair game for Claude — coordinate via this doc and Prefer **additive** PRs over rewriting Ridge Bot’s pipelines.

---

## What Ridge Bot touches (owned)

| Area | Paths / systems | Notes |
|---|---|---|
| Daily scrape + apply | `scripts/briefing.py`, `scripts/daily-briefing.sh`, `scripts/apply-briefing-staging.py`, `logs/briefing-*.json` | Cron: `/etc/cron.d/ridge-briefing` → `30 7 * * *` runs `daily-briefing.sh`. **Prefer editing the scripts, not the cron.d file.** |
| Board scores & snapshot | `src/lib/data/catalog.ts` (`SNAPSHOT_*`, `SCORES`, matched `MODELS` fields like `publicOpinion*`) | `aa-intelligence` from **artificialanalysis.ai only** — never OpenLM’s AAII column. |
| Freshness helpers | `src/lib/data/desk.ts` (`isFresh` default asOf) | Bump when the calendar moves with a real update. |
| Monday/delta copy | `src/lib/data/changelog.ts` | Short sourced entries. |
| Machine-readable summary | `public/llms.txt` | Keep headline list aligned with catalog after board changes. |
| News wire | `src/lib/data/wire.ts` | Curated external headlines. |
| Ridge desk essays | `src/lib/data/desk.ts` `NEWS` | Original Ridge notes / synopses. |
| Opinion stars UI contract | `publicOpinionStars` / `Note` / `AsOf` on `Model` in `types.ts`; render in `src/routes/models.$slug.tsx` | Stars only when set; never invent. |
| Half-week cadence | Ridge Bot routine **Mon & Thu 9:00 America/New_York** | Uses Grok Build on the Pi (`/home/pi/.grok/bin/grok`) for X/public chatter when needed. Logs under `logs/news-pass-grok-*.txt`. |

### Daily pipeline (do not bypass casually)

1. `briefing.py` scrapes OpenLM Arena, Vals SWE-bench, Artificial Analysis Index → `logs/briefing-pull.json` (+ notify state).
2. `apply-briefing-staging.py` fuzzy-matches names → updates existing score rows only (no auto-creating models).
3. Optional: `RIDGE_COMMIT=1` / `RIDGE_PUSH=1` for git; default is working-tree only (hot-reload).

Manual:

```bash
cd /home/pi/ridge
python3 scripts/briefing.py
python3 scripts/apply-briefing-staging.py --dry-run
python3 scripts/apply-briefing-staging.py
```

---

## What Ridge Bot does **not** touch (leave for Claude / humans)

Unless the owner explicitly asks Ridge Bot:

| Leave alone | Why |
|---|---|
| Major UI / new routes / redesign | Product expansion — Claude’s lane |
| Scaffold leftovers (auth, PWA, multiplayer, etc.) | `RIDGE.md`: don’t build on them unless asked |
| `src/components/*` beyond tiny opinion-star display tweaks | Avoid merge fights with feature work |
| `src/styles.css`, brand assets, OG images | Design lane |
| nginx, Cloudflare tunnel, `ridge.service` unit, ports | Infra; Vite listens on **8098** today |
| `/etc/cron.d/*` edits | Triggers homelab integrity monitor — if you must change cron.d, run `sudo /home/pi/scripts/homelab-integrity.sh init` after |
| Inventing scores, stars, or unsourced “Top N” | Hard rule |
| Mixing AA v4.1.1 (~60s) with v4.2+ (~50s) on one bar | Hard rule |
| Overwriting old model ids (`grok-4` vs `grok-4.6`, Spark xhigh vs max) | New versions = new ids |
| Scheduling `monday-pull.sh` unattended | Higher invent risk; Ridge Bot / human review first |
| Force-push, history rewrite, secrets in repo | Never |

`scripts/monday-pull.sh` + `monday-prompt.txt` still exist for optional Grok CLI board pulls — **not cron’d**. Prefer the Python daily pipeline for scores.

---

## What Claude (or others) should own when expanding

Safe lanes for site growth:

- New pages, components, layout, charts, filters, API shape improvements
- Performance, type refactors, tests
- Adding **new** data fields/UI that don’t break Ridge Bot’s scrape → apply contract
- Docs that don’t contradict `RIDGE.md` / this file

When Claude needs board numbers: **read** `catalog.ts` / `/api/ledger.json` / `llms.txt` — don’t hand-edit competing score rows on the same day as a scrape without coordinating.

If Claude changes `Model` / `WireItem` / `NewsItem` shapes: keep Ridge Bot’s fields (`publicOpinion*`, wire/desk shapes) working, or ping the owner so Ridge Bot can adapt `apply-briefing-staging.py` and the news pass.

---

## Added / changed in the 2026-09-08 Ridge Bot handoff commit

### Automation
- **Fixed** `briefing.py`: header skip bug (Arena #1 was dropping Fable); AA SSR scrape; writes `logs/briefing-pull.json`
- **Fixed** `daily-briefing.sh`: Grok fallback `--cwd` + `--always-approve`; runs apply after scrape
- **New** `scripts/apply-briefing-staging.py`: safe catalog apply from staging (`--dry-run`; no commit unless env set)

### Ledger / news content
- Snapshot → **2026-09-08**; AA scores refreshed from artificialanalysis.ai (not OpenLM AAII)
- `desk.ts` / `wire.ts` / `changelog.ts` / `public/llms.txt` updated for that board + half-week news pass
- Wire highlights from the first news pass: AA v4.3 note, NVIDIA↔Hugging Face, Jensen/Astra, Mythos CWI, 3.8 Flash TB4 cliff
- Desk: `halfweek-opinion-0908`

### Opinion stars
- Optional `publicOpinionStars` / `publicOpinionNote` / `publicOpinionAsOf` on `Model`
- Dossier UI on `models.$slug.tsx` (amber stars only when set)
- First sourced fill (Grok Build X log `logs/news-pass-grok-20260908.txt`): Fable 5.1 / Astra / Kimi K3 = 4; Opus 5 / Spark xhigh / Sol / Grok 4.6 / Gemini 3.8 Flash = 3; Spark max skipped

### Unchanged on purpose
- `/etc/cron.d/ridge-briefing` schedule (still 7:30am)
- systemd / nginx / tunnel
- No unattended `monday-pull`

---

## Coordination checklist

Before Claude ships a big Ridge PR:

1. Read `RIDGE.md` + this file.
2. Don’t rewrite `scripts/briefing.py` / `apply-briefing-staging.py` without a note here.
3. Don’t delete `publicOpinion*` fields or wire/desk entrypoints.
4. Prefer feature branches; Ridge Bot often commits straight on the Pi `main` working tree for hot-reload — pull/rebase before editing.
5. After touching cron.d or `ridge.service`: `sudo /home/pi/scripts/homelab-integrity.sh init`.

Before Ridge Bot does a wide content pass:

1. `git pull` / check for Claude feature branches.
2. Leave component/route experiments alone; stick to data files + scrape scripts.
3. Never invent numbers or stars.

---

*Last updated 2026-09-08 by Ridge Bot (Grok Bot).*
