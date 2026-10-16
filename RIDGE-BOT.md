# Ridge Bot — ownership & handoff

**Ridge Bot** is the Grok Bot agent that maintains [ridgebench.com](https://ridgebench.com) on this Pi.

- Repo: `/home/pi/ridge` (remote `github.com/Kruton1122/ridge`)
- Live: Cloudflare tunnel → nginx → `ridge.service` (Vite dev on **8098** (no build/deploy); **HMR disabled** via `RIDGE_DISABLE_HMR` so public browsers do not full-reload on every save)
- Product rules still live in [`RIDGE.md`](./RIDGE.md) (AA index versions, don’t invent numbers, edit map). Read that before any board edit.
- `CLAUDE.md` points at `RIDGE.md` for product rules; **this file** is who-does-what between agents.
- **Operator notes go in `/home/frank/ridge-private/SCRATCHPAD.md`** (outside the repo, never published, not in git). Never put working notes, reminders, TODOs, log paths, commit hashes, or instructions to editors/agents in desk, wire, catalog (summaries, opinion notes, score notes), changelog, or `llms.txt` copy. Everything in those files renders to readers.

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
| CursorBench 4.0 column | `catalog.ts` `cursor-bench` + `BOARD_ORDER_HINT` in `derived.ts` | **Owned board column.** Refresh scores from https://cursor.com/cursorbench when Cursor updates. First-party harness; **not comparable to 3.x**. No auto-scrape yet (page is JS/RSC) — TODO: best-effort parse later if stable. Do not invent blanks. |
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

## Admin dashboard (not Ridge Bot)

`/admin` traffic analytics + dedicated admin auth live in `src/lib/admin/*`,
`src/routes/admin/*`, and `src/routes/api/admin/*` / `src/routes/api/t.ts`.
Documented in [`ADMIN.md`](./ADMIN.md). **Out of scope for Ridge Bot** unless
the owner asks — do not gate public APIs or touch briefing pipeline files for it.

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

---

## 2026-09-10 — redesign is now the live site (read this)

The redesign shipped at `/`. The previous site is archived at `/old`.
Contract: [`REDESIGN.md`](./REDESIGN.md). `/new/*` redirects to the new URLs.
`/source` redirects to `/api` (the docs page). JSON/CSV endpoints are unchanged.

**Nothing about the daily routine changes.** The one thing worth knowing:

- The live site **reads** `catalog.ts`, `desk.ts`, `changelog.ts` and `llms.txt`
  and **writes none of them**. Keep writing them exactly as now — a scrape lands
  on the site with no second edit.
- `publicOpinion*`, `WireItem` and `NewsItem` shapes are all still read and
  rendered. Don't remove them.
- Renaming or removing a `Model` field will break the site at typecheck. Run
  `npm run typecheck` before committing a schema change. Adding a field is safe.
- Read-only helper: `src/lib/data/derived.ts`. Not Ridge Bot's lane.
- **You do not need to touch any component to add data.** A new score, a new
  model, a whole new benchmark, or a model from a new lab all reshape the site
  from `catalog.ts` alone — a new benchmark gets its own ledger column, sort
  option, homepage card, detail page, dossier row and coverage bar automatically.
  The one exception: a brand-new `LabId` needs adding to the union in `types.ts`
  plus a color in `colors.ts`; `npm run typecheck` will point at every place.
- `src/lib/data/ledger.ts` and `src/routes/api/**` were deliberately left alone —
  the JSON/CSV contract is unchanged.

**Infra fix worth knowing about:** nginx was returning 403 for
`/node_modules/.vite/deps/*` because its dotfile guard (`location ~ /\.`) matched
the `.vite` segment. React never loaded over the public hostname, so *nothing on
ridgebench.com hydrated* — every button on the live site was dead while working
fine on `127.0.0.1:8098`. The guard is now `location ~ /\.(?!vite/)`. If you ever
test Ridge, test through nginx (`127.0.0.1:8099` with a `Host:` header) or the
public URL — localhost bypasses the proxy and hides this whole class of bug.

Three pre-existing bugs on the **published** site were fixed in this pass:

1. `src/routes/news.tsx` was the parent of `news.$id.tsx` with no `<Outlet />`, so
   every desk-article URL served the news list instead. Renamed to
   `news.index.tsx`; all nine articles now reach readers. If you ever rename a
   route, check `src/routeTree.gen.ts` afterwards — the incremental codegen left a
   dangling reference and needed a dev-server restart to regenerate cleanly.
2. `src/lib/data/profiles.ts` no longer contains any benchmark number. It had been
   quoting the 7 Sept board on live model pages days after the scrape moved on.
   Scores belong in `catalog.ts`, which you own; profiles now carries only voice
   and caveats. **Please keep numbers out of that file** — it has no way to stay
   fresh.
3. **The daily apply matcher itself corrupted scores it should have skipped.**
   Weak fuzzy matches in `scripts/apply-briefing-staging.py` let a low-confidence
   Arena/SWE row overwrite a good one — the 07:30 cron on 2026-09-10 dropped
   Fable 5.1's Arena Elo from 1520 to 1178 and Opus 5's SWE-bench from 97 to
   76.4. Fixed: exact/alias matches are preferred, a model is "claimed" by its
   first confident match so a later weak row cannot overwrite it, non-main Arena
   rows (style-control, deprecated, ancient Claude-1/2) are skipped outright, and
   any fuzzy match moving a score past a per-benchmark delta ceiling without high
   confidence is rejected and logged instead of applied — see `safety_skips` in
   the script's dry-run output. **Inserts are now enabled**: when a scrape row
   confidently matches a catalog model that has no SCORES row yet, apply writes
   an INSERT (still skips unmatched / ambiguous / non-main Arena / low-confidence
   fuzzy). "X Thinking" may map to model X when aliased or the Thinking strip
   matches the base name. Full write-up: `CHANGELOG` entry "Fix briefing
   apply fuzzy-match score corruption" in `src/lib/data/changelog.ts`. If a
   future correction looks like a score swung far outside its normal
   week-to-week range, check `matchWhy` / the safety-skip log before assuming
   the source moved that much.

## 2026-10-07: Ridge Bot edits in Claude's files (with Colton's OK)

Colton approved these small edits in Claude-owned files when Terminal-Bench 4.0
became a board column. Nothing else in Claude's files was touched.

- `src/lib/data/derived.ts`: `BOARD_ORDER_HINT` gained `"terminal-bench-4"`,
  placed just before the archived `"terminal-bench"` (Terminal-Bench 2.1).
- `src/lib/data/best.ts`: the "Agents & terminal" pick now reads
  `terminal-bench-4` instead of the archived TB 2.1 board.
- `src/components/v3/ledger.tsx`: the TB 2.1 column header label changed from
  "Term" to "TB 2.1" so it reads clearly next to "TB 4.0".

Left alone: `src/routes/v2/benchmarks.index.tsx` still says "Five boards, five
publishers" in prose. It is a legacy page and the count is not a one-line
hardcode, so the copy is Claude's call.

## 2026-10-09: Ridge Bot edit in best.ts (with Colton's OK)

- `src/lib/data/best.ts`: new "Legal agent" pick (`fromBoard("legal", "harvey-lab-aa", ...)`),
  placed after "Cyber security", same pattern as "Agents & terminal". It reads the
  Harvey LAB-AA v1.1 board added in 3460108, with a one-line caveat about the
  hallucination gate. Nothing else in Claude's files was touched.
- `src/routes/_site/index.tsx` (Colton chose five cards): the homepage "Best for"
  list now includes `"legal"` after `"cyber"`, and the cap went from four to five
  cards (`.slice(0, 5)`; comment updated). With SWE-bench skipped as out of date, the
  homepage shows Coding in an editor, Agents & terminal, Cyber security, Legal agent,
  and People's pick. No CSS change: `.rx-best-grid` stays four columns on desktop
  (so the fifth card wraps to a second row), two below 1000px, one below 560px.
- Follow-up (Colton OK): five cards now fit one row on wide desktop. `src/styles/ridge-v3.css`
  gained `.rx-best-grid.five` (five columns), added to the existing 1000px (two columns)
  and 560px (one column) media rules; the homepage grid adds the `five` class only when it
  has exactly five picks. `/best` (`.rx-best-grid.full`) is unchanged.

- **2026-10-13, `src/lib/data/best.ts` (Claude's file, Colton approved):** Legal agent card caption
  changed from "...so even the leader clears fewer than one task in ten." to "...so scores here run
  much lower than on most boards." The old line broke when Muse Wonder Full hit 13.1% on Harvey
  LAB-AA; the new one names no threshold. Caption text only, no logic change.

- **2026-10-14, Voice board (Colton approved building it, Claude's UI files included):**
  new route `src/routes/_site/voice.tsx` (reuses `.rx-table` / `.rx-page-head` styles, no new CSS),
  one nav line in `src/components/v3/shell.tsx` (`/voice`, after Benchmarks), regenerated
  `src/routeTree.gen.ts`. Data lives in `src/lib/data/voice.ts`, generated by
  `scripts/voice-s2s.py` from https://artificialanalysis.ai/speech-to-speech; voice models are
  not in catalog.ts and never appear in the text ledger. `scripts/daily-briefing.sh` runs the
  voice scrape after apply; it refuses to write if AA's header changes or <10 rows parse.

- **2026-10-15, AA Cyber trusted-access note:** `parse_aa_cyber` in `scripts/briefing.py` now appends the "AA also lists ... trusted-access version ... Ridge does not count it" sentence to the public model note, built from AA's skipped trusted row (e.g. GPT-6 Sol Daybreak Blue 69). Before this, each daily apply wiped the hand-written sentence.

- **2026-10-15, AA-Robotics v0.1 board (Colton approved, UI files included):** new benchmark
  `aa-robotics` (5 scores) in catalog.ts, `robotics` field and `aa_robotics` CSV column in
  ledger.ts, `BOARD_ORDER_HINT` in `src/lib/data/derived.ts` now lists aa-cyber, harvey-lab-aa,
  aa-robotics after the older boards (so the new column sits last), and a "Robot arm" pick in
  `src/lib/data/best.ts` (shows on /best only; the homepage picks list in `index.tsx` is
  unchanged at five cards). The ledger header needs no edit: it takes `short` ("Robotics") from
  the benchmark. Scrape: `parse_aa_robotics` in `scripts/briefing.py` reads AA's article table
  (https://artificialanalysis.ai/articles/aa-robotics); the apply script handles `aa-robotics`
  like Harvey LAB-AA.

- **2026-10-16, Reflection AI lab and Beam 1.0 (Colton asked for a new lab "as was done for Mistral"):**
  new lab id `reflection` (lime #CDE048) in `types.ts` (LabId), `colors.ts`, `catalog.ts` LABS and
  `profiles.ts` motif. Claude's files touched, minimally: `src/styles/ridge-v3.css` gets
  `--lab-reflection` (#cde048 dark, #76900a light) next to `--lab-mistral`, and
  `src/routes/_site/route.tsx` bumps `CSS_REV` 4 to 5 so browsers refetch the stylesheet. Lab counts
  on the site are computed from the catalog, so nothing else changed. Beam 1.0 (`beam-1.0`) has AA
  Index 30 and AA Cyber 34 only; price is blank because Reflection has published none. The scrape
  matcher resolves "Beam 1.0", "Reflection Beam" and "Beam-1.0-501B-A23B" to it, and `BOARD_WATCH`
  lists it.

- **2026-10-16, CI workflow and data check (Colton approved; workflow file PENDING a
  workflow-scope token):** new `scripts/check-data.mjs` plus `scripts/check-data.test.mjs`, an npm script `check:data`, and a read-only hook in
  `scripts/daily-briefing.sh` that adds "DATA CHECK FAILED: ..." to the notify line only when the
  check errors (it never blocks the run). `check-data` transpiles the `src/lib/data/*.ts` files
  with the repo's `typescript` into a temp dir, so it needs no Node flags and writes nothing in
  the repo. It fails on duplicate model, board, wire, desk and changelog entries, scores for a
  missing model or board, a model on a missing lab, non-numeric or out-of-range scores, more than
  two decimals, undated or future dates, a trusted-access value used as a public score (GPT-6 Sol
  AA Cyber 69, or a note that quotes the cell value), and malformed voice rows. Dates that
  disagree with a board header only warn. `lint` is not blocking because it already fails on main
  (`src/lib/app-data/client.server.ts:214`, `no-empty`). `npm test` is left out of CI: 16 of the
  template's tests fail in a clean checkout. The workflow file is NOT on main. `.github/workflows/ci.yml` (push and pull_request; Node 22;
  `npm ci`, `check:data`, the check-data tests, `typecheck`, a NON-blocking `lint`, `build`, fake
  env, empty `DATABASE_URL`) waits on local branch `ci-data-check` on Frank (bundle kept at
  `/workspace/ci-data-check.bundle` on the box). The Pi's gh token has scopes gist, read:org and
  repo but not `workflow`, so GitHub would refuse the push. Push the branch's file once the Pi
  token has the `workflow` scope.

---

*Last updated 2026-10-16 by Ridge Bot (Grok Bot); data check shipped; CI workflow pending a workflow-scope token.*
