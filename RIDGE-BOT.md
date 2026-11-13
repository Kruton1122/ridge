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

- **2026-10-16, CI workflow and data check (Colton approved; workflow shipped after the Pi gh
  token gained the `workflow` scope):** new `scripts/check-data.mjs` plus `scripts/check-data.test.mjs`, an npm script `check:data`, and a read-only hook in
  `scripts/daily-briefing.sh` that adds "DATA CHECK FAILED: ..." to the notify line only when the
  check errors (it never blocks the run). `check-data` transpiles the `src/lib/data/*.ts` files
  with the repo's `typescript` into a temp dir, so it needs no Node flags and writes nothing in
  the repo. It fails on duplicate model, board, wire, desk and changelog entries, scores for a
  missing model or board, a model on a missing lab, non-numeric or out-of-range scores, more than
  two decimals, undated or future dates, a trusted-access value used as a public score (GPT-6 Sol
  AA Cyber 69, or a note that quotes the cell value), and malformed voice rows. Dates that
  disagree with a board header only warn. `lint` is not blocking because it already fails on main
  (`src/lib/app-data/client.server.ts:214`, `no-empty`). `npm test` is left out of CI: 16 of the
  template's tests fail in a clean checkout. `.github/workflows/ci.yml` runs on push and pull_request (Node 22; `npm ci`, `check:data`, the
  check-data tests, `typecheck`, a NON-blocking `lint`, `build`, fake env, empty `DATABASE_URL`).
  It was held back for one push because the Pi's gh token lacked the `workflow` scope; local branch
  `ci-data-check` on Frank and `/workspace/ci-data-check.bundle` on the box are spare copies.

---

## 2026-10-17: dated-snapshot gate in the score matcher (DeepSeek V4.1 Flash 1017)

DeepSeek replaced V4.1 Flash with `DeepSeek-V4.1-Flash-1017` behind the same API name and price. Ridge keeps ONE row (`deepseek-v4.1-flash`), but no board had scored 1017 yet and `match_model` strips a trailing 4-digit date, so an old-build row and a 1017 row would have matched the same model and the "keep the higher value" rule would have mixed them.

- `scripts/apply-briefing-staging.py` has `SNAPSHOT_GATES`. For a gated model, a scraped row counts only if its own name or variant text carries the tag (`1017`). Untagged rows are skipped (not claimed, not re-dated). Tagged rows apply normally, and `snapshot_note()` swaps the stale-build note text for `1017 snapshot`.
- The six existing scores on the row carry the note `September checkpoint, before the 1017 update`. Values were not changed or blanked.
- Caveat: if a board later re-runs the model WITHOUT putting 1017 in the name, the gate skips it and the row stays on the September numbers until someone edits it by hand. That is deliberate (blank or stale-and-labelled beats a guess).
- When boards score 1017 and the old build is no longer listed, drop the gate entry and the stale notes.
- Dry-run test: `RIDGE_PULL_PATH=/tmp/pull.json python3 scripts/apply-briefing-staging.py --dry-run` with one tagged and one untagged row; the log lines start `snapshot gate:`.

## 2026-10-18: StepFun and Xiaomi labs, Step 5 Preview and MiMo-V2.6-Pro, open-weights pick

Two new labs (`stepfun`, `xiaomi`) and two rows (`step-5-preview`, `mimo-v2.6-pro`), added across `types.ts`, `colors.ts`, `LABS`, the `--lab-*` CSS vars (CSS_REV 6) and `LAB_THEME`. Xiaomi is pink `#FF4FA3` on purpose: its own orange is taken by Alibaba and Mistral. StepFun is cyan `#00E5D8` (AA uses the same).

- Best for open weights (`best.ts`, `fromBoard("open")`) is the top AA Index among rows with `license === "open-weight"`. Adding MiMo (AA 46, MIT) changes the pick from GLM-5.3 (45) to MiMo-V2.6-Pro. Step 5 Preview is 44 (open-weight, StepFun Model License 1.0) and does not lead.
- Found while checking the pick: `qwen-3.8-max` was marked `open-weight`, which put it in a tie with GLM-5.3 at 45. AA flags the hosted Qwen3.8 Max (0902) `isOpenWeights: false`; the open release is a separate checkpoint (Qwen3.8-2.4T-A95B, AA 40, not tracked). Set to `proprietary`. Rule of thumb: the license field follows AA's `isOpenWeights` flag for the exact API model Ridge scores.
- MiMo caveat: Hugging Face has `MiMo-V2.6-Pro-RL` and `-MOPD` (MIT), no repo named `MiMo-V2.6-Pro`, and Xiaomi does not say which checkpoint the API serves. AA flags the API model as open weights. Documented in the dossier and summary.
- Cyber pick: MiMo 56 ties Grok 4.7 (56 rounded), so Best for cyber now shows both co-leaders (the existing tie rule).
- `bestValue()` in `best.ts` now formats `$/AA point` with three decimals under ten cents. MiMo ($0.014) and Haiku 5.5 ($0.007) both rounded to `$0.01` and were shown as a tie. Other pages still show two decimals.
- Scrape matcher: added `mimo` to `BRANDS`, aliases `step-5` / `step 5` for Arena+'s name, BOARD_WATCH and known_extra entries. Dry-run with 13 decoy names (MiMo-V2.6-Flash, V2.5-Pro, V2-Pro, V2-Flash, Ultraspeed, Step-3, Step-3.5-Flash, Step-5-Turbo, Step 5 Preview Non-reasoning, ...) left all of them unmatched. A bare `MiMo-V2.6` would match the Pro row by "contains" and is stopped only by the safety delta limits.
- Release dates: Step 5 Preview 2026-09-20 (StepFun's post; AA says 18 Sept). MiMo-V2.6-Pro 2026-09-22 (Xiaomi changelog, Beijing time; AA and the HF repo say 21 Sept).
- The Step card's TB4 33.3 equals AA's own Terminal-Bench 4.0 figure, not Vals' (31.82), so the Vals number is the board value.

## 2026-10-19: half-week news pass (manual rerun)

- The scheduled "Ridge half-week news" run failed this morning ("Activity task failed") and was rerun by hand the same day, following the 15 Oct pattern.
- Daily scrape 19 Oct committed on its own: the snapshot gate let the 1017 rows through for AA Index (45) and Vals TB4 (31.82). The DeepSeek summary, dossier (`abouts.ts`) and profile watch line now say which scores are 1017. AA Cyber and Harvey still list only the September build; when they add 1017, update those three spots again.
- Stars: MiMo-V2.6-Pro 4, Step 5 Preview 3, Beam 1.0 3. Muse Spark Open left unrated on purpose (posts were about license strings and hardware, not results). The "Step 5 is #2 on OpenRouter" post came from a StepFun-side account, so it was not counted.
- Not wired: the Claude Fable 5.5 rumor (still unconfirmed), and X news-feed items on Claude Mythos 5 and Cowork skills that were not checked against a primary source.

## 2026-10-19: MiniMax lab, MiniMax M3.1 Flash

- New lab `minimax` (types, colors #EB3568 as on AA, CSS vars, LAB_THEME; CSS_REV 7) and row `minimax-m3.1-flash`. Only AA Index 42 is on the board.
- License: proprietary. MiniMax's blog says weights later and AA marks it proprietary, but the text-generation docs table already says "open-weight". Flip to open-weight only when weights are on Hugging Face (that would also put it in the open-weights pick at 42, below MiMo 46).
- Arena: the 1588 is Code Arena WebDev, not the openlm.ai text board behind Arena+, so prose only. Same rule for Muse Wonder Full's WebDev 1726.
- Matcher: `minimax` added to BRANDS, BOARD_WATCH and known_extra entries. No bare "minimax m3.1" alias, so a future M3.1 Pro does not collide (dry-run: MiniMax-M3.1-Pro scores 44, M3/M3.2 version-mismatch; a bare "MiniMax-M3.1" contain-matches at 90, below the 95 high-confidence bar, so it would need review).
- Nemotron 3.5 Super VL (26) and Bolt (21) are wire only. AA's "top US open-weight" line predates its Beam (30) and Muse Spark Open (39) scores, so it is not repeated.

## 2026-10-19: site review fixes (Colton gave full control of the site, UI included)

- Ledger: SWE-bench Verified column hidden (`HIDDEN` in `components/v3/ledger.tsx`); data still on model pages, /benchmarks (with a note) and CSV. Column headers have `title` tooltips and a legend under the table (column names come from BENCHMARKS, orange = best in column, `=N` = tie), plus a link to /benchmarks. Hero spells out "Artificial Analysis Intelligence Index v4.3.2".
- Tables: `.rx-table-wrap` now scrolls sideways at every width, aligned to the column, and table headers are no longer sticky (a sticky header inside an overflow box covers row 1). Measured with headless Chrome at 1280 / 820 / 390: before, the homepage document was 1402px wide at 1280; after, no page overflows at any of the three widths.
- `$ / point`: new `perPoint()` in `derived.ts`, three decimals everywhere (ledger, homepage, model pages, /labs, scatter tooltip, /best).
- Best for: the Coding (Vals SWE-bench) card is removed; it only ever crowned Opus 5 because Vals stopped adding models. Coding is covered by "Coding in an editor" (CursorBench) and "Agents & terminal" (TB 4.0). Cards stack name over value, "Next" is now "Runner-up", the "!" is a visible "Read the caveat" link, and `plainNote()` in `best.ts` strips scrape config ("best effort/variant: ...", "best listed row") from leader notes.
- Boot splash removed (`BootCover` no longer rendered in `__root.tsx`; the component file stays unused). Inner pages get a smaller "Ridge." plate (`.rx-plate.inner`). `--ink-3` raised to #8a9cae (night) and #56697c (daylight) for contrast. Changelog added to the top nav.
- Lab name: xAI is now SpaceXAI in LABS and the three Grok rows (AA's creator name and the lab's own posts). Lab id stays `xai`. Voice model names are AA's own strings (checked on AA's page), so they were left as they are.
- /methodology: the "the rest" sentence is now computed from CATALOG_STATS.
- Public copy: recent changelog entries (10 to 19 Oct) and one desk line no longer say matcher, wires, Arena+ column or daily scrape. Going forward use "daily score update", "news item", "article", "on the ledger". /news "new" badge now means within a day of the snapshot, not seven days.
- Model pages: unscored boards collapse into one "Not scored yet on ..." line; archived boards say "(no longer adding models)".

## 2026-10-20: speech model news and AA's new tests (news items only)

- Voxtral 3 and Ming-3.0-tts are speech to text / text to speech, not speech to speech, so they are not on /voice. No catalog rows.
- Voxtral 3: no weights on Hugging Face (latest mistralai Voxtral repos predate it), so treated as API-only; Mistral says self-deployment is available. Product names vary on Mistral's own pages (Voxtral TTS 3 / Voxtral Speech 3 / Mini TTS 3; API id voxtral-mini-tts-3-0).
- Ming-3.0-tts: HF repos were created 22 Sep 2026, but the README dates the release to Oct 2026 and the GitHub repo was created 19 Oct; AA posted 20 Oct. News item dated 19 Oct. AA's Controlled Voice Elo moved from 1,069 (its Ming post) to 1,068 (its Voxtral post), so copy says "about 1,068".
- HealthBench, HealthBench Professional and AA-PersonalityBench are not board columns. Top HealthBench figures checked on AA's pages.

## 2026-10-20: daily score update committed (07:30 briefing run)

- Verified against sources: MiniMax M3.1 Flash AA 43 (was 42), Arena+ 1500 (row "Minimax-M3.1-Flash"), Vals TB4 25.25 (#22 of 51); Gemini 4 Argon (High) Harvey LAB 3.9% (#10 of 28, 3.82 halluc/task). Rest of the diff is rank renumbering (TB4 50 to 51, Harvey 27 to 28) and asOf bumps.
- Fixes before commit: scraper dropped the MiniMax AA note prefix ("reasoning, default max effort"), restored; dropped Argon "20.8% before the hallucination gate" because the pre-gate figure is not in AA page HTML and could not be checked.
- Gates held: DeepSeek V4.1 Flash September-checkpoint rows kept 10-17/10-06 dates and notes; GPT-6 Sol Daybreak Blue note intact. DeepSeek Harvey note still says "#15 of 27" (dated 10-17, frozen by the gate).


## 2026-10-21: ModelWatch leads (news items only)

- Wire: OpenAI GPT-6 Astra, GPT-6.1 Sol and GPT-6 Luna in private preview on Google Cloud Model Garden. Checked against the OpenAI and Google Cloud posts. Distribution only, no score changes.
- Wire: HeyGen Voice Turbo first on AA's Controlled Voice TTS arena. Checked against AA's X post and HeyGen's API changelog. Text to speech, so not on /voice.
- Skipped: Sage-A1.5 (vendor scores only, not a Ridge row), NVIDIA GTC Berlin batch and Cohere Rerank 5 (retrievers and non-LLM models), Qwen3.6-27B (shipped in April). OpenAI's Oct 23 shutdowns (o1, o3-mini, o4-mini, gpt-4-turbo) need no note: none of those models are on the board.
- Left the uncommitted 07:30 daily scrape edits (catalog, desk, voice, llms.txt) out of this commit.

## 2026-10-21: daily score update committed (07:30 briefing run)

- Verified against sources: Beam 1.0 Vals TB4 4.04% (new row, #45 of 52); Vals TB4 now lists 52 models, so every TB4 rank note moved from "of 51" to "of 52" and Gemini 3.1 Pro went from #45 to #46. AA speech to speech: Arena Elo moved for 21 existing Voice rows (all match AA's page), and two new rows, Eleven Realtime v1 Max and Eleven Realtime v1 Mini, named as AA writes them, with reasoning, dynamics, task success and time to first audio checked against AA's data.
- Unchanged scores: AA Intelligence, Arena+, Harvey and the rest are date bumps only. Board asOf bumps: arena-elo, swe-bench, terminal-bench-4, aa-cyber, harvey-lab-aa, aa-robotics. Archived Terminal-Bench 2.1 was not bumped.
- Reverted before commit (same as 20 Oct): the scraper again dropped the MiniMax M3.1 Flash AA note prefix ("reasoning, default max effort"), restored; and it re-added "20.8% before the hallucination gate" to Gemini 4 Argon's Harvey note, removed because the figure is not on AA's Harvey page.
- ~~TODO: fix the scraper so these two notes stop recurring.~~ Done 2026-10-21, see below.

## 2026-10-21: score-note guards for the daily scrape

- New `scripts/note-guards.json`, read by both `apply-briefing-staging.py` and `check-data.mjs`. `protectedPrefixes` lists text a note must keep at its start (MiniMax M3.1 Flash AA: "reasoning, default max effort"). `bannedFragments` lists note text the scraper must never write, for one model or a whole board (Gemini 4 Argon Harvey: "before the hallucination gate").
- `apply-briefing-staging.py`: new `guard_note()` runs on every updated and every newly inserted score note, after the other note rules. It drops banned segments and puts back a missing protected prefix.
- `check-data.mjs`: fails with an error if a score note lacks its protected prefix or contains banned text. New test in `check-data.test.mjs` covers both.
- Dry run against today's pull: 0 rows would change, so both notes stay as committed.
- ~~Open question for Colton~~ (closed 2026-10-21): Colton said Argon should match the other Harvey rows. See below.

## 2026-10-21: Gemini 4 Argon Harvey note gets its ungated figure back

- Colton OK'd it: the 20.8% comes from AA's own Harvey page data (ungatedAverageAllPass 0.2083 beside Argon's 3.82 hallucinations per task), and 17 other Harvey rows already show the same figure. Note is now "variant: high; #10 of 28; 3.82 material hallucinations per task; 20.8% before the hallucination gate", worded like the others.
- Removed the Argon entry from `scripts/note-guards.json`; `bannedFragments` is now empty but stays available. The MiniMax protected-prefix guard is unchanged.

## 2026-10-22: half-week news and opinion pass

- Wire: Ling-3.1-flash-1019 (AA 44, no public API or weights yet, so no row), Claude Duet (runs only on Opus 5.5), OpenAI misalignment report on a Sol agent and an Astra agent weakening monitoring, PHP2Shell (GPT-5.6 Sol and Gemini 4 Argon helped find it). Each checked against the primary page.
- Desk: halfweek-opinion-1022. Stars: MiniMax M3.1 Flash opens at 3. All others hold; notes refreshed for Opus 5.5, GPT-6.1 Sol, Grok 4.7 and Gemini 4 Argon. X log: logs/news-pass-x-20261022.txt (x namespace, no Grok Build).
- Skipped for weak sourcing or off-board: Sol-billed-as-Astra quota claim (user report only, mentioned as such), Opus 5.5 nerf claims (no Anthropic word), Gemini 4 Carbon on Arena (rumor), Ornith-1.5-122B and other vendor-only scores, DeepSeek Search.
- Committed only these hunks; the uncommitted 07:30 daily scrape edits (catalog scores, desk isFresh, voice, llms.txt snapshot) are left as they were. Note: that scrape bumps the archived terminal-bench board asOf to 2026-10-22, which check-data warns about.

## 2026-10-22: daily score update and archived Terminal-Bench 2.1 freeze

- Daily scrape (6b1b56f), checked against AA's speech to speech page data: Eleven Realtime v1 Max now has AA's quality index 77.3 and agentic 47.6%; Eleven Realtime v1 Mini 64.4 and 46.8%; Gemini 3.8 Live index 76.0 to 74.5 (rows re-ordered by index). No catalog score values or notes changed; the rest is date bumps (arena-elo, swe-bench, terminal-bench-4, aa-cyber, harvey-lab-aa, aa-robotics, snapshot, desk freshness, voice asOf). Nothing reverted.
- Root cause of the archived TB 2.1 board drifting: its asOf was `SNAPSHOT_DATE`, so every snapshot bump re-dated it. Pinned it to "2026-10-06", its last Vals score.
- `apply-briefing-staging.py`: `archived_boards()` reads boards named "(archived)"; `apply_bucket` skips them, and the script refuses to write if an archived board's block or scores would change.
- `check-data.mjs`: an archived board with an asOf newer than its latest score is now an error, not a warning. Tests updated, plus a new failing-case test.
- Pushed with today's half-week pass dc33193.

## 2026-10-22: Recursive Flint news item (ModelWatch lead)

- Wire: Recursive Flint, checked against Recursive's post, the Hugging Face card (39.8B total, about 2.5B active, Apache 2.0) and Richard Socher's X post. Vendor scores (TB 2.1 54.9%, SWE-bench Verified 74.2%, SWE-bench Pro v2 89.7%) are in prose only as Recursive's claims, with the 89.7% flagged as unusually high and unchecked. No board row; archived TB 2.1 untouched. AA, Vals (TB4, SWE), OpenLM and cursor.com do not list Flint as of 22 Oct.
- Skipped: iFlytek Spark X2.6. The big model is closed with no benchmarks; only a 4B base model has open weights. Not Ridge material.

## 2026-10-23: daily scrape and ModelWatch leads

- Scrape 23 Oct: checked. Only change besides dates is Vals Terminal-Bench 4.0 growing from 52 to 54 models, so rank notes moved; no score values changed.
- Wire: Kimi K3.1 Pro (Moonshot blog and X post). Moonshot's TB 4.0 65.7% is in prose as its claim. Not listed on AA, Vals (TB4, SWE), OpenLM, Harvey LAB-AA or cursor.com, so no row. Matcher check: "Kimi K3.1 Pro", "Kimi K3.1 Pro (max)", "Kimi K3.1 Pro Highspeed" and "kimi-k3.1-pro" all return no match, so the scraper will neither pick it up nor misfile it under Kimi K3; it needs a catalog row (with aliases) once a board lists it.
- MiniMax M3.1 Flash: weights confirmed on Hugging Face (ungated, MXFP8). License field set to open-weight; summary now spells out the MiniMax Community License (non-commercial base grant, credit and notice for commercial use, written permission above $20M yearly revenue, prohibited uses). Summary's stale "AA 42" and "no Arena+/Vals" text fixed; AA score stays 43. Wire item added.
- AA Cyber: DeepSeek V4.1 Flash row was the September build (41). AA's Cyber Index page now shows 1017 at 57; row updated to 57 (1017 snapshot) and model summary adjusted. Short wire item added. Today's 07:30 scrape did not have the 1017 cyber row yet.
- Wire: AA Coding Agent Index v2.0, AA's numbers only, no board.
- Skipped: Ling 3.1 Flash 1019 (covered 22 Oct, nothing new), Nemotron Bolt E4B and CritPt v2 (not Ridge material).

## 2026-10-23 (evening): Kimi K3.1 Pro scores

- New row kimi-k3.1-pro (proprietary until weights ship by 4 Nov; Arena+ lists Modified MIT, AA not open-weight yet). Scores, all dated 23 Oct: AA Intelligence 55 (AA page 55.09), AA Cyber 64 (64.07, 0% refusals on all three evals), Arena+ 1519. Aliases added so the scraper matches "Kimi K3.1 Pro" / "Kimi-K3.1-Pro" / "kimi-k3-1-pro"; Kimi K3 still matches only K3.
- Not listed: Vals Terminal-Bench 4.0, Harvey LAB-AA (model in AA's picker, no score), cursor.com/cursorbench; no K3.1 Pro Highspeed anywhere. AA Coding Agent Index has no K3.1 entry found. AA's own TB 4.0 figure (67.2%) is not the Vals board, so not entered.
- Wire item kimi-k3-1-pro-1023 updated with the three scores and linked to the new row.

## 2026-10-26: daily scrape and half-week news pass

- Scrape 26 Oct: checked. New Vals Terminal-Bench 4.0 row for Kimi K3.1 Pro, 63.64% (#3 of 55, Mini-SWE-agent); Haiku 5.5 Harvey LAB-AA row now max 0.6 (#20 of 28), checked against AA's page; other changes are rank notes and dates. Kimi K3.1 Pro summary and the kimi-k3-1-pro-1023 wire item updated to mention the Vals score.
- Wire: Kimi K3.1 Pro third on Vals TB4; OpenAI training-environment red team (models: []); Nanbeige4.3-33B (vendor claims in prose only; not on AA, Vals, Arena+ or OpenLM, so no row).
- Desk: halfweek-opinion-1026. Stars: Kimi K3.1 Pro opens at 3 (asOf 26 Oct); all others hold. X log in logs/news-pass-x-20261026.txt.
- Skipped for weak sourcing: GPT-6.1 Terra Copilot rumor, Argon FrontierCS 2 / RSI-Inference and account-warning claims, Claude Code departures, Kimi AA-3D (still collecting votes), Kimi 1T rumor, Muse Spark Open AA-AgentPerf, off-lane releases.
- Note: `npm test` glob fails under Frank's Node 20 (`scripts/**/*.test.mjs` not expanded; `--experimental-strip-types` unsupported). Ran `node --test scripts/*.test.mjs`: 194 pass, 16 fail, all in template/og/app-env tests, none in data checks. check:data 0 errors, typecheck and build clean.

## 2026-10-26 (afternoon): Mirendil Fern 0.1

- Wire mirendil-fern-0-1-1026 (models: []). Checked against mirendil.com/news/introducing-fern/ (published 26 Oct, 8:00 am PT) and @mirendil launch post. Vendor figures in prose only: SWE-Bench Verified 73.4, TB 4.0 6.1 (OpenCode, 1 attempt), RULER at 10M 100 single-needle / 45 multi-hop (base model, 20 examples at 10M). Not on AA, Vals, Arena+ or cursor.com/cursorbench; no row, Mirendil not added to lab lists.
- Wire + desk openai-science-results-1026 (models: []), from Colton link to @danintheory. Checked against openai.com/index/building-scientific-understanding-with-academic-communities/ (26 Oct). Confirmed public in github.com/openai/math: preprints The-Exponential-Time-Hypothesis-is-False-October-25-2026 and Local-smoothing-for-the-Euclidean-wave-equation-October-25-2026, lean/ComparatorChallenges/LocalSmoothing.lean. Reactions used: @rrwilliams 2114833319431209352, 2114835554177261953, 2114891838377320784; @wtgowers 2114846058622718221. Physics materials not released. All OpenAI claims; no board or catalog change.
- Dropped from the ModelWatch lead: founders' former labs, CEO name, $200M seed and investors (not on Mirendil's pages checked).

## 2026-10-27: GPT-6.1 Terra, Ling-3.1-flash-1019, Genie 4

- Daily score update (07:30 pull): snapshot dates to 27 Oct; Vals TB4 now 56 models after GPT-6.1 Terra entered at #10, so ranks from #10 down shift one. No value changes.
- Row gpt-6.1-terra (OpenAI, released 2026-10-26, /, 1M context per AA). Filled: AA Intelligence Index 48 (max; raw 48.106), Vals TB4 49.5 (#10 of 56, raw 49.495, ties Muse Wonder). Blank: Arena+ (not on openlm.ai), CursorBench (not on cursor.com), AA Cyber, Harvey LAB-AA, AA-Robotics. Sources: @OpenAI launch posts, @ArtificialAnlys 2114781865811063259, artificialanalysis.ai/models/gpt-6-1-terra, vals.ai TB4. Vendor claims in prose only (Agents' Last Exam parity with GPT-6 Astra at 1/10 price per token, 3x faster). Vals Index 60.17% seen on vals.ai/models/openai_gpt-6.1-terra; no Ridge board, not used. No earlier copy called Terra a rumor, so no correction note.
- New lab inclusionai (inclusionAI, Ant Group; #8B5CF6 / light #6D28D9; CSS_REV 9). Row ling-3.1-flash-1019: HF inclusionAI/Ling-3.1-flash-1019, MIT, not gated, created 2026-10-27 05:46 UTC; AA isOpenWeights true, release 2026-10-22, bash.30/bash.90. Filled: AA 44 (raw 43.897). Everything else blank. Arena+ row "Ling-3.1-flash" is the predecessor and must not match this row; no bare "ling 3.1 flash" alias, "ling" not added to BRANDS (would hit Inkling/Starling). README figures are inclusionAI claims, prose only.
- Wire genie-4-1027 (models: []). deepmind.google blog, 27 Oct. Dropped from the lead: "about 2-minute sessions" (not on DeepMind's page).
- Skipped per brief: MAI-Image-2.7, Code2Video-AA, AA v5, Mistral Large 4 weights, Fable 5.5.

## 2026-10-27 (afternoon): Liquid AI LFM3

- Wire liquid-lfm3-1027 (models: []). Checked against liquid.ai/blog/lfm3 (dated 27 Oct), Hugging Face LiquidAI repos (LFM3-1.7B, -Base, -VL-2B, -Audio-2B, -Omni-2B, d1-2B, d1-Omni-2B all public, license lfm1.0) and liquid.ai/lfm-license (LFM Open License v1.0, Apache-2.0-based, free commercial use under $10M revenue). Vendor figures in prose only. Not on AA (no LFM3 on its models list), Vals, Arena+, CursorBench, AA Cyber, Harvey, AA-Robotics or /voice; no row.
- Dropped from the X post: "#1 on the Pareto frontier of device intelligence" (Pipette) and "14 processor classes" wording (blog says 14 device and backend combinations used in architecture search). Not on Liquid's blog as stated.

## 2026-10-28: AA Intelligence Index v5.0

- Checked live on artificialanalysis.ai: methodology page and leaderboard both say "Intelligence Index v5.0"; article artificialanalysis.ai/articles/artificial-analysis-intelligence-index-v5 (27 Oct). New: FrontierCode 2.0, Terminal-Bench-Science 0.1. Upgraded: HLE-Diamond (replaces HLE), AA-Omniscience v1.1, CritPt v2 hard subset. Kept: AA-Briefcase v1.1, AutomationBench-AA, GDP.pdf, Terminal-Bench 4.0. Removed: GDPval-AA v2.1, SciCode, AA-LCR v1.1. 60% private/held-out.
- Switch, following the TB 2.1 precedent: board `aa-intelligence` stays the live headline id (renamed "AA Intelligence Index v5.0"); old rows copied to new board `aa-intelligence-v4` "AA Intelligence Index v4.3.2 (archived)", asOf pinned 2026-10-27, skipped by the scrape. BOARD_ORDER_HINT gets it last.
- v5.0 rows for 25 models, from the leaderboard SSR table via scripts/briefing.py parse_aa_index (best listed row per model, dated 2026-10-28). Snapshot gates held: DeepSeek V4.1 Flash 1017 (32) and Ling 1019 (29) accepted by tag. Blank on v5.0 (not on AA's v5 board): claude-opus-5, claude-fable-5, claude-sonnet-5, gpt-6-sol, gpt-5.6-sol, gpt-5.6-terra, gpt-5.6-luna, grok-4.6, grok-4.5, kimi-k3, muse-spark-1.3, muse-spark-1.3-max, gemini-3.7-flash, gemini-3.1-pro.
- Apply dry-run after the switch: 0 aa-intelligence value changes, so the daily scrape now feeds v5.0 into the live column.
- buildLedger keeps unscored models (rank null, AA null) so /api/ledger still lists all 39; ledger index label now read off the board name. 20 summary mentions relabelled "AA Intelligence Index v4.3.2 N" where N matched the archived value.
- New check in check-data.mjs: live AA board must carry a version and not be archived, no second live "Intelligence Index v" board, llms.txt Index and Headline lines must match the live version, ledger.ts must not hard-code a version.
- Best for: open weights MiMo-V2.6-Pro (46) -> DeepSeek V4.1 Flash + GLM-5.3 (32, tie). Smartest and value leaders unchanged (Opus 5.5; Haiku 5.5).
- Wire aa-intelligence-index-v5-1028; desk aa-index-v5-1028 (X reaction from a 15-post search, 28 Oct). methodology rule two gets a v5 line. llms.txt Index line, headline top 10, board columns updated.

*Last updated 2026-10-29 by Ridge Bot (Grok Bot); half-week news pass.*

## 2026-10-28 (afternoon): Gemini 4 Carbon

- New row `gemini-4-carbon`, status `partner` (not `preview` like Argon at launch): no public API, cyber defenders and Fairwind partners only. Price $4 / $20 standard, $2 / $10 introductory.
- Scores: AA v5.0 59 (high, #1), Arena+ 1528 (#1), Vals TB4 63.13 (#4 of 57; other TB4 notes renumbered to "of 57"). Blank: CursorBench, AA Cyber, Harvey LAB-AA, AA-Robotics. SEC-bench Pro, ExploitGym and CWE-bench are Google claims, prose only.
- Best for: `fromBoard` adds a not-generally-available caveat when the leader is gated. Smartest and People's pick now Carbon.
- Ledger: "max" tag only when the AA note says max (it used to show on every partner row).
- Scrape: BOARD_WATCH, aliases and a "carbon" frontier marker in briefing.py; SNAPSHOT_GATES entry in apply-briefing-staging.py requires "carbon" in the scraped name so Argon rows never land on Carbon. New `labelNote: False` gate option skips appending the label to the note. Dry run accepted AA "Gemini 4 Carbon".
- Arena+ refresh: Argon 1523, Astra 1525.
- When Carbon goes GA: switch status to ga and add CursorBench / AA Cyber when they post.

## 2026-10-29: half-week news pass

- Wires: anthropic-3sat-eth-1027, giotto-alto-solo-1027 (no row: no weights, not on AA, vendor-only scores), anthropic-s1-ipo-1026, axiom-cfsg-lean-1026.
- Desk: halfweek-opinion-1029 and anthropic-eth-1027.
- Stars: GPT-6.1 Terra opens at 3 (asOf 2026-10-29). Opus 5.5 holds 5 with a refreshed note. Astra 4, Sol 3, Argon 3, Grok 4.7 3, Kimi K3.1 Pro 3 hold. Gemini 4 Carbon stays unrated while partner-only.
- Fix: the daily scrape regenerated the llms.txt headline and dropped Carbon's partner caveat. parse_models in scripts/apply-briefing-staging.py now reads each row's status, and build_headline appends "partner access only, not generally available" for partner rows, so the caveat survives future scrapes.
- Includes the 29 Oct daily scrape (snapshot 2026-10-29, Arena Opus 1512, Kimi 1512).
- X log: logs/news-pass-x-20261029.txt.

## 2026-10-29 (afternoon): Mistral Large 4 open weights, Phonic 1

- `mistral-large-4`: license open-weight, status ga (dropped preview), price $0.70 / $2.10 (cached $0.07) per mistral.ai. AA v5.0 26 (high) per artificialanalysis.ai/models/mistral-large-4; AA Cyber 51 (cyberIndex 50.89 on AA Cyber page, high). Arena+ 1448, TB4 27.78, Harvey 3.1 left as preview-build scores; CursorBench blank (not listed). About, profile, summary and aliases updated.
- Best open weights unchanged (DeepSeek V4.1 Flash / GLM-5.3 at 32).
- Voice: reran scripts/voice-s2s.py; Phonic 1 (High) #1 at 87.1, Grok Voice 3.0 86.9. Rerun also refreshed other AA cells (e.g. Grok Voice 3.0 arena Elo 1064 -> 1059).
- Wires: mistral-large-4-open-1029, phonic-1-s2s-1029. Fish Audio Drama 3 skipped (TTS, not speech to speech).

## 2026-10-30: AA HLE-Diamond wire

- Lead from ModelWatch, verified against AA X posts 2115989388689813945 / 2115989392695374188 (effort chart reply) / 2115989394717130801 and artificialanalysis.ai/evaluations/hle-diamond.
- Wire aa-hle-diamond-1029. Numbers used: Opus 5.5 42 -> 68 at ~35x cost/task; Astra 45 -> 64 at 11x; Carbon (high) 69.1, Opus 5.5 (max) 67.9; Kimi K3.1 Pro 37 top open weights. Dropped: GPT-6.1 Sol (max) 76% reasoning / 41% knowledge (not in AA posts or page text).
- No new board or columns. Skipped Pika H3 Flex and Utopai X (video, off-lane) and Qwen4 (not released).
- Includes the 30 Oct daily scrape (snapshot 2026-10-30; TB4 now 58 models, ranks renumbered).

## 2026-10-31: Astra for Law price, SenseNova-Loop-9B

- Leads from ModelWatch. Verified gpt-6-astra-law on developers.openai.com/api/docs/pricing (Legal model configurations, $10 / $50 / $1 cached, promo at least through 2026-12-31; FedRAMP +10% from 2026-11-01 on the same page). Correction to the lead: OpenAI did announce Astra for Law on 2026-09-17 (openai.com/index/astra-for-law); no API model card. No row: no independent score, not on Harvey LAB-AA.
- SenseNova-Loop-9B-Preview verified on the HF card (Apache 2.0, ~9B total / ~14.6B inference params, 32 distinct layers, layers [4,28) looped twice, 56 executions, 262,144 training context) and SenseTime X post 2116151078219858346. Correction to the lead: the post claims wins over Qwen3.5-27B on WorkBuddy, RaccoonPPT and AutomationBench, not "Qwen3.5-9B on 7 of 8". Third-party TB 2.1 40.45 ignored. No row (no AA score), not small-model eligible.
- Wires: openai-astra-law-api-price-1031, sensenova-loop-9b-1030.
- Skipped: AA-Omniscience v1.1 (covered in aa-intelligence-index-v5-1028), SenseNova 6.8 Code2Video and Hyperflow H3 (video).
- Includes the 31 Oct daily scrape (snapshot date only, no score changes).
- CI for 2c565c2 (run 41100702888) finished green.

## 2026-11-01: GPT-Rosalind-6, DiffuSpace Clover

- Leads from ModelWatch. GPT-Rosalind-6 verified on deploymentsafety.openai.com/gpt-rosalind-6 (published 2026-10-30) and help.openai.com model release notes. Confirmed: same weights as GPT-6 Astra, no added training or post-training; trusted access only; Work, Codex, API (gpt-6-rosalind), not Chat; two-week Enterprise Admin Preview, off by default; High Bio/Chem (below Critical), Critical Cyber via Astra's assessment, below High AI Self-Improvement. Notes on the lead: Critical Cyber is inherited from Astra, not separately evaluated; access rules continue GPT-Rosalind-5.5's; Rosalind Discovery stays on 5.5. No list price beyond pointers to the pricing pages. No openai.com announcement post used. No row.
- Clover-35B-A3B-Preview verified on the HF card and HF API (license apache-2.0, base_model Qwen/Qwen3.6-35B-A3B, 35B params, ~3B active, 131,072 context, block_size 32, BF16 ~69GB). Note on the lead: HF repo created 2026-10-24; the Oct 30 posting date is not shown on the card. SOTA claim vendor-only. No row.
- Wires: openai-rosalind-6-1030, diffuspace-clover-35b-1030.
- Includes the 1 Nov daily scrape (snapshot date only, no score changes).

## 2026-11-02: half-week news pass

- Wires: grok-claude-text-watermark-1031, claude-ultra-plan-1030, anthropic-automated-em-redteam-1030, ai-training-optout-robots-1030, epoch-glm-firefox-patch-gap-1029, openai-misalignment-monitoring-1029, openai-model-spec-values-1029, gemini-computer-use-ga-1030, deepseek-superagent-prototype-1031 (research prototype, no row).
- Desk: halfweek-opinion-1102 and safety-week-1102.
- Stars: all hold. Opus 5.5 5, Astra 4, Terra, Sol, Argon, Grok 4.7 and Kimi K3.1 Pro 3. Gemini 4 Carbon stays unrated while partner-only; Mistral Large 4 stays unrated (thin X signal). No note changes.
- Skipped: Qwen4 next-week reports (unconfirmed), GPT-6.2 Astra / Mythos 5.5 / Fable 5.5 / GLM-5.5 leaks, expected-launch lists, vendor-only Nace and Articul8 claims, video models, OpenAI Private Intelligence (no primary source), Kimi K3.1 Pro weights (not out). OpenAI Pro limit doubling is cited from BleepingComputer because help.openai.com is behind a JS wall.
- X sentiment: Grok Build on Frank was not signed in (needs a human to run grok login --device-code), so X search used the x-namespace fallback. X log: logs/news-pass-x-20261102.txt.
- Includes the 2 Nov daily scrape (dates only: snapshot 2026-11-02, isFresh, voice asOf) and the untracked .prettierignore.
- Checks: check:data 0 errors (2 old warnings), typecheck and build pass; node --test 194 pass, 16 template tests fail under Node 20 as before.
- Build now writes .vercel/output (vercel preset in vite.config.ts); added .vercel to .gitignore so build output stays out of git.

## 2026-11-02: ModelWatch leads, LongCat-2.5, Hydrogen-1.0, LifeVal

- LongCat-2.5 verified on longcat.ai blog (dated 2026-11-01), API changelog (2026-11-02), API docs (1M context, 128K output) and @Meituan_LongCat post. Corrections to the lead: the $0.30 / $1.20 promo price, 10M free tokens and "weights later" were not found on any primary page, so they are left out. "Between Opus 4.8 and Opus 5" is the lead's reading of Meituan's table, not a Meituan claim. Not on AA or OpenLM Arena. No row.
- Hydrogen-1.0 verified on the HF card (753B, MIT, gated, GLM-5.3 base, 1M context, NVFP4/MXFP4 repos) and blog. Correction: 38.3% / 33.3% / 93.0% appear only in chart images, not in text, so the wire says only that it beats Astra on FSR and roughly matches Kimi K3 on GPQA, as the blog says. Also on ModelScope and a NeuroSpark API. No board score. No row.
- LifeVal verified at openai.com/index/lifeval (2 Nov). Internal benchmark, no public set or leaderboard; wire only, no board.
- Wires: meituan-longcat-2-5-1102, deep-principle-hydrogen-1-1102, openai-lifeval-1102.

## 2026-11-03: ModelWatch lead, Sarvam Prism

- Verified on the @SarvamAI launch post, sarvam.ai/blogs/sarvam-prism, the HF card sarvamai/prism (Apache 2.0) and docs.sarvam.ai. All core lead facts hold. The INR 4 per 1M input price is confirmed on Sarvam's docs (output INR 0). Added detail: LoRA fine-tune of Sarvam 105B MoE, FP8 only, about 120GB on one GPU. No board score. No row.
- Kimi K3.1 Pro weights: not on moonshotai HF as of 2026-11-03 13:50 ET (newest repo Kimi-K3, 2 Sept). Row left alone.
- Wire: sarvam-prism-1103. Snapshot-date changes from the daily scrape included.

## 2026-11-04: ModelWatch leads, Kimi K3.1 Pro weights, Tencent Hy4

- Kimi K3.1 Pro weights verified on HF (moonshotai/Kimi-K3.1-Pro, repo created 2026-11-02 UTC, files total 1.56TB, 2.8T / 104B active, 1M context, MXFP4 weights / MXFP8 activations), LICENSE file (Kimi K3.1-Pro License: MaaS businesses over $20M 12-month revenue need a separate agreement; attribution above 100M MAU or $20M monthly revenue), AA model page (open weights, commercial use restricted, Intelligence Index 46 on v5.0.1, #1 of 25 open large) and vLLM day-0 blog. Row flipped to open-weight, summary rewritten. AA v5 cell was already 46, unchanged; v4.3.2 55 stays on the archived board. Best open weights now Kimi K3.1 Pro (46), was DeepSeek V4.1 Flash / GLM-5.3 (32); card is computed in best.ts. Old desk pieces left as dated history.
- apply-briefing-staging.py only rewrites s(...) score calls and the snapshot date; it never touches license, so it will not revert the flag.
- Tencent Hy4 verified on tencent.com (4 Nov). Corrections to the lead: the post gives no 770B / 49B or 1M context figures, so they are dropped; it adds Hermes, ima and WeCom; "admits it trails top closed models" is not in the post (only biology lab design trails frontier models), so it is reworded. Ridge had no Hy4 Preview row. No independent score, no row.
- Wires: kimi-k3-1-pro-weights-1104, tencent-hy4-1104. Includes the 4 Nov daily scrape (snapshot dates).

## 2026-11-05: half-week news pass

- Wires: tencent-hy4-scores-1105 (AA v5 35, Vals TB4 39.39 #15 of 60; row held until weights, parameter count and license land), baidu-ernie-5-5-flash-base-1105 (base model, no row), openai-linux-root-exploits-1104, cognition-swe-2-flash-1104 (vendor scores, weights closed, no row), webai-twil-8b-1104 (8.8B, non-commercial, not on AA, no row), semianalysis-gdpx-1102 (not a board), anthropic-s1a-acceleration-1102, anthropic-flashprove-1102, anthropic-message-threads-1102.
- Desk: halfweek-opinion-1105 and trust-week-1105.
- Stars: all hold. Claude Sonnet 5.5 stays at 3 but its note is refreshed (asOf 2026-11-05) on sourced posts calling it underrated. Gemini 4 Carbon stays unrated.
- llms.txt: news lines for Hy4 scores, ERNIE-5.5-Flash-Base, SWE-2 Flash, TwIL-8B, OpenAI Linux pipeline, GDPx.
- Skipped: Astra 6.2 / GPT-6.2 price-cut and Codex-receipt posts (unconfirmed rumor), "Argon routing to Carbon" speculation, OpenAI Images 2.6 (off-lane), Nemotron 3.5 Super (not in this window), Andon Vending-Bench Carbon claim (date and source not verified), Pierre acquisition (minor).
- GDPx figures come from the leaderboard at gdpx.semianalysis.com, not X reposts. S-1/A quotes checked against the SEC filing text.
- X sentiment: Grok Build on Frank still not signed in (needs a human to run grok login --device-code), so X search used the x-namespace fallback. Logs: logs/news-pass-x-20261105.txt, logs/news-pass-grok-20261105.txt.
- Includes the 5 Nov daily scrape (snapshot 2026-11-05, score asOf dates, voice asOf).

## 2026-11-06: GPT-6 Cyber, Nanbeige AA 20, Inkling 2 Small, VIALS-AA, Ling-3.2, Kanana, Ripple

- GPT-6 Cyber verified on openai.com/index/introducing-gpt-6-cyber (select approved Daybreak Red customers on API and Codex; expand to all Daybreak Red soon; Critical vs High for GPT-5.6 Cyber; ExploitGym 48.5% vs 32.1%; 948 Linux exploits and 81 Firefox bugs; livestream is on openai.com/cyber-at-the-frontier, 12 Nov 10:00 AM PT) and developers.openai.com/api/docs/models/gpt-6-cyber.md (1,050,000 context, 128,000 max output, $20 / $100 / $2 cached). Astra 42.4% verified on openai.com/index/gpt-6-astra, not on the Cyber post, so the wire labels it that way. No row.
- Nanbeige4.3-33B AA 20 verified on artificialanalysis.ai/models/nanbeige4-3-33b (open weights, Apache 2.0, 33B, 524k context) and HF config max_position_embeddings 524288. New lab nanbeige and row; other boards blank. Oct 25 wire said 512K and no row.
- Inkling 2 Small verified on thinkingmachines.ai/news/inkling-2-small (594B / 17B, vision, Tinker now, Apache 2.0 weights next week after safety tests) and AA model page plus launch article (Intelligence Index 31, proprietary, $0.30 / $1.00, 1M context). New lab thinkingmachines and proprietary row. No Inkling Small row exists; SWE-2 Flash wire already named that earlier model as the base. Does not count for Best open weights (still Kimi K3.1 Pro at 46).
- Ling-3.2-flash verified on Ant changelog (5 Nov, 560B / 25B, 1M, image/text/video, free two weeks) and model page. Lead's $0.30 / 1M input was not on those pages, so it was dropped. Weights not published. No independent score, no row. Matcher now excludes 3.2 names from ling-3.1-flash-1019 and gates inkling-2-small on an "Inkling 2" tag.
- VIALS-AA verified on AA article and eval page: Carbon (high) 64%, Astra (max) 63%, Opus 5.5 (max, with fallback) 61%, Kimi K3.1 Pro (max) 45%. Wire only, no board.
- Kanana-2-v-decide verified on HF (3.67B, Kanana Open License, decision model, weights 6 Nov) and Kakao tech post. Short wire, no row.
- Ripple-65B Preview verified on ricursive.com/ripple and HF ricursiveAI/Ripple-65B-Preview (not ricursive/Ripple-65B-Preview). Dense 65B, Apache 2.0, 12T tokens, 1M context, Together / GMI Cloud / OpenRouter / Fireworks. Terminal-Bench 2.1 80.52 is Ricursive's claim; AA page 404, no row. Ridge has beam-1.0; Ricursive's 80.1 comparison is Reflection's own figure already labelled as a claim on that row.
- Skipped: GPT-6.2 Astra/Sol rumors, Qwen4 teasers, Cosmos 3 Nano.
- Includes the 6 Nov daily scrape (snapshot 2026-11-06, score asOf dates, voice asOf, desk isFresh).

## 2026-11-07: Arete-27B and BioBasicsBench (wires only)

- Duplicate check: no Arete or BioBasicsBench text in the repo at 06456fa. Live https://ridgebench.com/news (fetched 7 Nov) lists 206 wire items, newest VIALS-AA, and neither name. Live header already reads snapshot 7 November 2026, 42 models. GitHub main is still snapshot 6 November with the same 42 rows. This pass does not touch catalog, scores, stars, Best for, desk, voice or the daily scrape files.
- Arete-27B verified on nousresearch.com/arete (blog date is only "November 2026"), the HF card NousResearch/Arete-27B, the HF API (`createdAt` 2026-11-06T19:31:28.000Z, `gated` false, `private` false, `cardData.license` apache-2.0, `base_model` Qwen/Qwen3.8-27B, 18 `model-*-of-00018.safetensors` shards) and raw/main/LICENSE (Apache License 2.0). SFT only, teacher Inkling, about 52.8 million tokens. Wire uses the thinking-off, temperature 0 table: fact mean 2.32 to 2.98 out of 5, any propaganda 22% to 0.9%. The blog's summary sentence rounds 0.9% to 1%. Judge is Grok 4.7 on Nous's rubric. Omitted on purpose: the provisional thinking-on row (2 of 5 runs), Hermes Bench, and Nous's Terminal-Bench 2.1 70 vs 67, which Nous says is not comparable to the official leaderboard. No debiasing claim, no row. Qwen3.8-27B is not the catalog's Qwen 3.8 Max row, so `models` stays empty.
- BioBasicsBench verified on openai.com/index/measuring-how-ai-agents-handle-wet-lab-science, dated 6 November 2026. 100 tasks with Ligo. xhigh mean reward: GPT-6 Astra 66.7%, GPT-5.6 Sol 43.8% (that row is GPT-5.6 Sol, not GPT-6 Sol), five attempts per task, partial rubric credit. Article examples: Astra picks the wrong colony-PCR lanes, keeps a darker-vacuole rule after seeing lighter ones, and overcounts one plate by about 12%. Task review (Ligo, plus an outside wet-lab scientist) is not a replication of the scores. The article text has no dataset download or license, so the wire does not call the set open. No board. Wire links the existing gpt-6-astra and gpt-5.6-sol rows only.
- Wires: nous-arete-27b-1106, openai-biobasicsbench-1106. Changelog 2026-11-07. llms.txt news lines added. Snapshot line left at 2026-11-06.

## 2026-11-09: half-week news pass

- Wires: metr-anthropic-rd-acceleration-1105 (METR blog, read in full), vals-index-sonnet-5-5-1105 (vals.ai Vals Index page, updated 11/5, not a Ridge board), anthropic-agent-memory-dreaming-1106 (anthropic.com/research/components-of-agent-memory), meta-muse-specialized-models-1106 (research.meta.ai, vendor numbers, no row), openai-hacktron-1106 (openai.com plus WebProNews for the July SSO backstory and bounty figures), anthropic-ipo-valuation-1107 (CNBC; FT figures via The Decoder, labelled as investor reports), openai-next-astra-sol-rumor-1104 and qwen-4-teaser-1106 (rumor beat, ArtificialWatch; no rows).
- Desk: halfweek-opinion-1109 and metr-week-1109.
- Stars: all hold, no notes changed. X signal was thin (tier lists, one account's repeated Sol/Astra/Terra WebGL side-by-sides, GPT-6.2 rumor posts). Opus 5.5 motion-design PDF promo posts discounted as spam again. Gemini 4 Carbon stays unrated.
- Skipped: Gemini Omni 1.2 Flash (video, off-lane), Seedream 5.5 (image, off-lane), Claude Code cloud-session env setup (minor), OpenAI/FMF safeguard framework (no primary URL checked), Xbow GPT-6 Cyber test and Visa shopper test as wires (X posts only; Visa mentioned in desk as reported on X), Grok API watermark (already covered 31 Oct), Grok Bot usage limits (product, not model).
- AA: third-party sites now cite AA Index v5.0.1 with decimals (Carbon 60.0, Opus 59.1). Ridge's daily scrape already carries Carbon 60 / Opus 59 / Astra 57 from artificialanalysis.ai; no manual score edits in this pass.
- X sentiment: Grok Build on Frank still not signed in (needs a human to run grok login --device-code), so the x-namespace fallback was used. Logs: logs/news-pass-x-20261109.txt, logs/news-pass-grok-20261109.txt.
- Includes the 9 Nov daily scrape (snapshot 2026-11-09, score asOf dates, voice asOf, desk isFresh).

## 2026-11-09: Muse Ember, Spark 1.3 max on v5, Decision Index v2

- New row `muse-ember` (Meta, proprietary, released 2026-11-09, API id muse-ember-1.0). Only AA Intelligence Index v5.0 36 at max (page decimal 36.021, rounds to 36). Price $0.10 / $0.50, cached input $0.004 (AA cache discount 96%), context 1,048,576, up to 512K output from Meta's post. Parameters null on AA and absent from Meta's post. No open-weight tag. Cursor, Arena, Vals TB 4.0/2.1, Cyber, Harvey, Robotics left blank. Meta's xhigh chart point, AutomationBench-AA 37.8, Coding Agent Index 46, FrontierCode 2.0-AA 27.2, GDP.pdf 22.8, Terminal-Bench 4.0 40.9 (mini-swe-agent, not Vals), Agents' Last Exam, PSI, OSWorld and PerceptionBench stay in prose as Meta's claims.
- AA's model page labels the index v5.0.1. The nine evals are the same ones Ridge's live board calls v5.0 (AA-Briefcase v1.1, AutomationBench-AA, GDP.pdf, FrontierCode 2.0, Terminal-Bench 4.0, Terminal-Bench-Science 0.1, CritPt v2 hard subset, AA-Omniscience v1.1, HLE-Diamond). The board name stays v5.0. `parse_aa_index` on the live leaderboard accepts Muse Ember (max) at 36.
- `muse-spark-1.3-max` filled with AA v5.0 37 (page decimal 36.617, displayed 37). AA marks the release deprecated and still scores it, at $2.39 per Index task (page text; JSON cost 2.386). `muse-spark-1.3` (xhigh) left blank: the xhigh object has `intelligenceIndex` null. Summary on the max row no longer quotes the archived 48.
- Matcher: display name "Muse Ember" / slug `muse-ember` land on the new row with no code change. Slug `muse-spark-1-3` did not. Version tokens split "1-3" into 1 and 3, so they miss 1.3, and the max gate also wants the word max, which the slug does not contain. `score_confidence` now maps that exact slug to `muse-spark-1.3-max` and `muse-spark-1-3-xhigh` to `muse-spark-1.3`. Display names "Muse Spark 1.3" plus a max or xhigh note were already landing on the right row. Spark 1.3 is not in the current leaderboard SSR table (deprecated models are off it), so today's scrape would not have delivered the 37. `BOARD_WATCH` includes `muse-ember`.
- Best for, computed, no new rule: Smartest stays Gemini 4 Carbon (60). Open weights stays Kimi K3.1 Pro (46). Newest entry is Muse Ember at 36. Best value is a tie at $0.008 per point (mid of $0.10 and $0.50, divided by 36) with Claude Haiku 5.5. The Best for card names every co-leader. The four cards above the ledger still show one value name, Haiku, because that headline keeps the first of a tie. No extra caveat: the existing line is still "Mid list price ÷ AA score." Haiku's higher rate above 100K tokens, and AA's $0.14 vs Meta's about $0.41 per Index task, are in the Ember summary and the wire, not a new ranking rule.
- Wires only for Decision Index v2 (8 Nov). No Decision column. Leaderboard model record for Mammoth 27B (`baseten_mammoth-27b`) has creatorName and hostName "Base Labs". The article lede says Baseten once and the results say Base Labs; the wire uses Base Labs. Scores used are the article's integers, which match the leaderboard rounded half-up: Drex Max v1.1 73.39, GLiDE v1.2 72.83, Mammoth 72.45, Haiku 5.5 (max) 77.08, Luna (max) 76.36. Cost and time from the same records: Drex $102.15 per 1M tasks and 275 ms, Luna $1,530 and 11.34 s. No third-party decimals in the public copy.
- Desk `muse-ember-1109` added after the ledger commit. Luna's list price was rechecked on AA's GPT-6 Luna (max) page: $0.10 / $0.50, same sticker as Ember, and the catalog already had that price from OpenAI's 22 Sept launch. Haiku is $0.10 / $0.50 only up to 100K tokens, then $0.50 / $2.50. Spark 1.3 max is $1.25 / $4.25 per million tokens (about 12.5x Ember on input and 8.5x on output), so the desk does not say it costs more than ten times as much per token. The $2.39 vs $0.14 line is AA's per-task cost. Luna's live AA score is 28, so 36 is eight points over it. No new stars.
- Live on main at 2598bd1.

## 2026-11-09: Claude Fable 5.2

- New row `claude-fable-5.2` (Anthropic, proprietary, released 2026-11-09, API id `claude-fable-5-2`). No parameter field on the model type, and Anthropic does not give a count, so the summary says the count is not disclosed. Price $8 / $40. Cache reads $0.20, 5-minute cache writes $10, 1-hour cache writes $16, batch $4 / $20, all in the summary because the catalog price object is only input and output. Fast mode is a note on the same row (`speed` set to fast, no beta header, $16 / $80), not a second row. Context 1,000,000, max output stated as 128K. Mythos 5.2 is named in the summary as the same model for the Life Sciences and Cyber Verification Programs. It is not an alias, so a Mythos-only scrape does not land on this row. No separate Mythos row and no fast-mode row.
- Only score filled: Vals Terminal-Bench 4.0 65.15, dated 2026-11-09, source https://www.vals.ai/benchmarks/terminal-bench-4. Note: Mini-SWE-agent, effort high, tied #1 of 63 with Opus 5.5, 17 of 198 attempts (8.59%) served by Opus 5 or Opus 4.8. The model page states the 17 fallbacks and 8.59%. It does not give a second score that counts fallbacks as failures, so that clause is omitted. The board page's first sentence calls the 65.15% a tie for first. The HTML rank column numbers Fable 1 and Opus 2 at the same score. The note follows the tie. `tb4_note` only rewrites the `#N of M` token, so a later scrape that still ranks Fable 1 leaves the tie wording intact.
- Left blank on purpose: AA Intelligence Index v5.0, archived v4.3.2, Arena+, CursorBench, AA Cyber, Harvey LAB-AA, AA-Robotics, SWE-bench, Terminal-Bench 2.1. Anthropic's own tables (FrontierCode, Terminal-Bench-Science, HLE, and the rest) are not AA's and are not score cells. Vals Index 71.31% (#1 of 36 on the model page) is in the wire only.
- Fable 5.1 is unchanged, including its v4.3.2 summary. Opus 5.5's Terminal-Bench 4.0 note still says #1 of 61. Other Terminal-Bench 4.0 notes still say of 61. The live table is 63 rows, and several ranks below the new tie have moved, including Muse Ember at 39.39, which this pass does not add. A full re-rank belongs to the next TB4 scrape.
- Checked 9 Nov: anthropic.com/claude-fable-and-mythos-5-2, platform pricing, models overview (now lists Amazon Bedrock ID `anthropic.claude-fable-5-2`; Claude Platform on AWS, both Google Cloud listings, and Microsoft Foundry have `claude-fable-5-2`), release notes for 9 Nov (fast mode, `speed: "fast"`, no beta header), vals.ai Terminal-Bench 4.0 and the Fable 5.2 model page. The Vals line that max effort ranks about 7th at nearly 3x the cost was not on those pages, so the wire does not say it.
- `BOARD_WATCH` includes `claude-fable-5.2`. Version tokens already separate 5.2 from 5.1 and from Fable 5, so the matcher needed no new gate. The row is after Muse Ember in `MODELS`. Both are dated 2026-11-09, and the newest-entry card keeps the first of a date tie, which stays Ember.
- Best for agents and terminal, computed, now names Fable 5.2 and Opus 5.5 together at 65.15. Smartest stays Gemini 4 Carbon. No new stars. No desk piece. Wire `claude-fable-5-2-1109` links to Anthropic. The Vals URL is in the blurb, the score source, the changelog, and llms.txt.
- Live on main at 9779825.

## 2026-11-10: daily scrape commit

- Commits the 10 Nov 07:30 daily scrape as the base for the next content PR (snapshot 2026-11-10, score asOf dates, voice asOf with scores unchanged, desk isFresh).
- New cells, checked live 10 Nov: Claude Fable 5.2 AA Intelligence Index v5.0 65 (max, Default Fallback; xhigh 62, high 62, medium 56, low 54), first of 98 reasoning models; Arena+ 1538, first; Harvey LAB-AA 7.2 (max), #6 of 33. Inkling-2-Small Arena+ 1493. Muse Ember Vals Terminal-Bench 4.0 39.39 (#16 of 63).
- Rank redos only: Terminal-Bench 4.0 notes now of 63, Harvey LAB-AA notes now of 33; values unchanged. Opus 5.5 TB4 note keeps Vals' #2 token (tb4_note rewrites it) but says it is the same 65.15 as Fable 5.2, a tie for first.
- llms.txt AA headline renumbered with Fable 5.2 first; Muse Spark 1.3 max drops off the top 12.
- Not in this commit (content PR to follow): Gemini 4 Carbon GA (10 Nov) status, summary and llms note, which still say partner access; CursorBench rows for Fable 5.2 (60.0 max) and Carbon (60.4 high); Fable 5.2 summary text; Fable 5.1 opinion note; Best for changelog lines.

## 2026-11-10: content pass (Fable scores, Carbon GA, LongCat weights, Robotics 2.5)

- Started from the scrape commit above. Publication stays with Frank, then the Pi. This pass does not merge.
- Claude Fable 5.2 summary now carries the scores that landed in the scrape plus CursorBench. Cells: AA v5.0 65 (max, already on the row), Arena+ 1538, Harvey LAB-AA 7.2 (#6 of 33), Vals TB4 65.15 tied #1 with Opus 5.5. New cell: CursorBench 60.0, source Cursor, asOf 2026-11-10, note "max effort". Cursor's page also lists extra high 56.3, high 56.9, medium 54.8, low 53.2, and $32.79 per task at max. AA Cyber and AA-Robotics stay blank. Sources: https://cursor.com/cursorbench https://artificialanalysis.ai/leaderboards/models https://openlm.ai/chatbot-arena/ https://artificialanalysis.ai/evaluations/harvey-lab-aa https://www.vals.ai/benchmarks/terminal-bench-4
- Gemini 4 Carbon status partner to ga. List price stays $4 / $20, same as Argon. Intro price is prose only ($2 / $10 through 30 Nov, then $4 / $20 from 1 Dec; caching $0.10 then $0.20, implicit only; batch $1 / $5 then $2 / $10). No promoPricing field, so Argon was not given one either. AA cell stays 60 high (page decimals high 60.03, medium 58.26, low 54.22; the cell stays the rounded 60). New CursorBench cell 60.4, note "high (best published). Carbon has no max run". Cursor also lists medium 60.1 and low 58.6. Google's blog says Carbon is first on CursorBench. That sentence is labelled as Google's claim. The cell is from Cursor's page. Summary, llms.txt headline, and the 28 Oct model paragraph no longer say partner access or AA 59 / TB4 #4 of 57. Sources: https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/ https://ai.google.dev/gemini-api/docs/pricing https://cursor.com/cursorbench
- The sentence about losing first on AA to Carbon, and almost nobody being able to use Carbon, was on Claude Opus 5.5's publicOpinionNote, not Fable 5.1. Fable 5.1's note is still the October line about Fable 5.5 demos. The false clauses were removed from the Opus note. asOf stays 2026-10-29. No new star and no new opinion scrape.
- Wires: claude-fable-5-2-scores-1110 (score-landing wires already exist, so this is its own item rather than only a desk line), gemini-4-carbon-ga-1110, meituan-longcat-2-5-weights-1110, gemini-robotics-2-5-1110. Desk: fable-carbon-1110. Changelog 2026-11-10. llms.txt news lines for the Fable scores, Carbon GA, LongCat weights and Robotics 2.5.
- LongCat-2.5: no catalog row. HF meituan-longcat/LongCat-2.5 is public, gated false, license mit. config.json max_position_embeddings 524288. Meituan post (tech.meituan.com, 10 Nov) says 1.6T total, about 48B active, 1M context. Card Terminal-Bench 4.0 38.5 and Terminal-Bench 2.1 88.4 are unmarked in-house scores. AA, Arena+ and Vals were not re-scraped for a LongCat row in this pass. The user check said they do not list it, and no row was added.
- Gemini Robotics 2.5: no row. DeepMind blog, Carolina Parada. Claims kept as DeepMind's: 30 to 100 percent higher success, 20 to 30 percent faster, 96 percent pick-and-pack with Apollo 2 at Kecskemet and Sindelfingen. Not entered on AA-Robotics.
- Harvey LAB-AA, Claude Haiku 5.5: the board text says best effort setting. The live table (10 Nov) lists Xhigh 2.8% at rank 20 of 33, hallucinations 1.61 per task, above max 0.6% at rank 25. The chart-default model object is max and is the only one with ungatedAverageAllPass (4.4%). The xhigh row does not publish that figure, so the note omits it instead of copying the max row's 4.4%. Cell is now 2.8, note "variant: xhigh; #20 of 33; 1.61 material hallucinations per task". parse_aa_lab only read the harveyLab object, so the next apply would have put 0.6 back. It now also emits an HTML-table row when that base name and effort are not already on an object. The match ignores case and a trailing ", Default Fallback", so "Claude Sonnet 5.5 (max)" and "Claude Sonnet 5.5 (Max, Default Fallback)" are one setting. Matching the full string was wrong: the table copy stores the rounded percent as its decimal, apply sorts by rounded score then that decimal, and the rounded decimal wins when the true value rounds up. That would have rewritten Fable 5.1 (6.4 vs 6.389), Opus 5.5 (4.2 vs 4.167) and Sonnet 5.5 (2.8 vs 2.778), dropping the pre-gate percent and turning "variant: max" into "variant: max with fallback". With the effort match those three stay on the unrounded object. Fable 5.2's medium, high, low and xhigh rows are not on the object, so they are parsed, but each scores below its max row and the cell does not move. The only catalog change on the 10 Nov page is Haiku 5.5, from max 0.6 to xhigh 2.8. Covered by scripts/briefing_lab_test.py.
- CursorBench board asOf stays 2026-09-11. The standing check:data warning (a score dated after the board asOf) remains. trump-ai-guardrails-0914 was not touched.
- Best for, computed on this commit's parent before these edits: Smartest Fable 5.2 65. People's pick Fable 5.2 1538. Coding in an editor Opus 5.5 57.8%, marked out of date (missing Fable 5.2, Carbon, Astra, GPT-6.1 Sol). Agents Fable 5.2 and Opus 5.5 at 65.15%. Cyber Kimi K3.1 Pro 64, out of date. Legal Muse Wonder Full 13.1%. Open weights Kimi K3.1 Pro 46. Value Haiku 5.5 and Ember $0.008. Front page five: agents, legal, people, open, value.
- Best for after: Coding in an editor is Carbon 60.4%, then Fable 60.0%, then Opus 57.8%. The card is no longer out of date (Astra and GPT-6.1 Sol still missing). Front page five: ide, agents, legal, people, open. Value is sixth, so it leaves the front row and stays on /best. Cyber stays out of date. Smartest, people's pick, agents, legal, open weights and value leaders are unchanged from the parent.

## 2026-11-11: daily scrape commit and ModelWatch drop (Qwen4-Max, Gemini Decision 1, ERNIE 5.5 Flash, Agent Arena)

- Daily scrape 2026-11-11 committed on its own: dates only (SNAPSHOT, score asOf, voice asOf, desk isFresh, llms snapshot). Checked that no score value changed. Arena+ re-checked at about 1:50 PM ET: no change since the 07:30 scrape. Vals TB4 still updated 11/9. CursorBench unchanged. No new fills.
- Qwen4-Max Preview verified on the Alibaba Cloud Model Studio page (updated 11 Nov) and the Qwen X post (Nov 10, 9:01 PM ET). Window 10:00 11 Nov to 24:00 25 Nov UTC+8, frozen, retired after. AA model page 404, not on AA leaderboard, Arena+, Vals or CursorBench. No row, per the no-independent-score rule. Wire alibaba-qwen4-max-preview-1111.
- Gemini Decision 1 verified on blog.google and AA's Decision Index v2.1 page JSON: indexScore 65.98, 13th of 22 rows, 9th of 18 decision models, costPerTaskUsd 0.000345, 211 ms. Drex Max v1.1 72.62, GLiDE v1.2 72.52, Elephant 9B 66.39, Jev 1.14 66.23, Haiku 5.5 max 76.49, Luna max 75.67 (the Nov 8 v2 wire had Haiku 77). OpenRouter/Vercel are rolling out per Google, not listed on OpenRouter's model API at check. Wire gemini-decisions-api-1111, no row.
- ERNIE 5.5 Flash Preview verified on ernie.baidu.com (English says Apache 2.0 soon; Chinese says weights by 25 Nov, no license named), benchmark table image (TB4 46.5 with Claude Code 2.1.246 harness, AutomationBench 61.9, SpreadsheetBench V2 36.4), Qianfan pricing doc (updated 10 Nov: peak list 0.002 / 0.008 yuan per 1K, off-peak half, promo half), OpenRouter baidu/ernie-5.5-flash-preview:free, Arena battle-mode post 11 Nov 10 AM ET. Not on HF yet (baidu author list). Text only per the release page. Wire baidu-ernie-5-5-flash-preview-1111, no row.
- Agent Arena verified on lmarena.ai/leaderboard/agent (11 Nov, 59 models): Fable 5.2 max 30.35% +/- 3.93, 4,731 sessions, $7.34; Opus 5.5 max 19.52%; Carbon high 16.98% preliminary; Fable 5.1 max 14.82% (#5). Arena's X post lists #1 as Fable 5.1 in one line, a typo. Wire arena-agent-fable-5-2-1111.
- Desk qwen4-ernie-previews-1111. Reaction lines re-checked against the posts before shipping: @cedric_chee 2120409763645399216 (UI improved, agent mode burns usage limits, DeepSeek V4.1 Flash ahead on 3D), @Bhavani_00007 2120542843081297965 (slow through Claude Code and other harnesses, fast in Qoder), @sonuv_dev 2120389773965578403 (voxel pagoda took an hour, maker found it painfully slow, slight gain over DeepSeek V4.1 Flash), @rewind02 2120537313469964394 and @AmControo 2120515503428882615 (limited-time 80% discount in Qoder). Draft said the pagoda was widely shared; cut, since the post had about 1.3K views.
- Skipped as off-lane: MiniMax H3-Image, AlphaGenome 2, Runway Praxis-1, ACE Music v1. Rumors noted, not shipped: GPT-6.2 Astra/Sol for 13 Nov, Google Hydrogen, Baidu World 12 Nov.

## 2026-11-12: half-week news pass

- Includes the 12 Nov 07:30 daily scrape (snapshot 2026-11-12, score asOf dates, voice asOf, desk isFresh, llms snapshot). Checked before editing: dates only, no score value changed.
- Wires: aa-mka-benchmark-1110 (AA article read in full: Fable 5.2 max 57%, Carbon high 54%, Opus 5.5 max 53% Climb WSR; $31.97 / $6.29 / $1.11 per task), livebench-fable-5-2-1111 (livebench.ai page "last updated 11 November", release 2026-11-06 on the 2.0 scale), aa-endpoint-accuracy-v1-1-1109 (AA article read in full), anthropic-ipo-price-range-1110 (anthropic.com roadshow post for share counts and range; CNBC for 18/19 Nov dates, retail share, $1.405T, $64.35B, $26B placement, $81B run-rate, all labelled as CNBC), xai-grok-4-8-soft-rollout-1110 (Musk posts 2120088070443655190 and 2120099798078656909 read through the X API; rumor beat like grok-48-ladder-0914; no xAI page, rollout not confirmed by xAI as of 12 Nov), openai-yang-mills-lean-release-1110 (KITP 3rd statement PDF dated 9 Nov plus Scientific American 11 Nov).
- Desk: halfweek-opinion-1112.
- Stars: claude-fable-5.2 first rating 4. gemini-4-carbon first rating 3 (was unrated while access was limited; GA since 10 Nov and hands-on posts now exist). claude-opus-5.5 holds at 5, note refreshed, asOf 2026-11-12. All other stars and notes hold.
- Skipped: GPT-6.2 Astra/Sol (still rumor; existing wire openai-next-astra-sol-rumor-1104), Runway Praxis-1, PAN 2, AlphaGenome 2, MiniMax H3-Image (off-lane), Meta Muse watch/email features and Mistral Studio agents (product, not model), DeepSeek V4-Flash API beta (secondary source only), TSMC stakes and Fractile round (no primary checked), third-party leaderboards (Village atlas, AI Pro League) for any number, vendor partner scores (Zapier, Shortcut) as opinion signal. OpenAI's cyber livestream and Baidu World are later on 12 Nov.
- X sentiment: Grok Build on Frank still not signed in (needs a human to run grok login --device-code), so the X API fallback was used, as on 5 and 9 Nov.

## 2026-11-12: Gemini 4 Hydrogen row and Fable 5.2 AA-Robotics fill

- ModelWatch Nov 12 drop, verified against primary sources, then shipped.
- Gemini 4 Hydrogen verified on Google's 12 November posts (introducing-gemini-4-hydrogen and the developer post), the Gemini API pricing page and model docs (id gemini-4-hydrogen, stable). Flat $1.50 / $7.50 per 1M tokens across the 1M context, cached input $0.075, implicit only, free tier on the API. Thinking levels low, medium, high (default) and xhigh. Inputs text, image, video, audio/speech and PDF; output text. Available in AI Studio, the Gemini API, Gemini for business, the Gemini app, Google Search, and Antigravity for paid Pro and Ultra. Orchestrator in Antigravity confirmed by Google; its Terminal-Bench success, quota and speed figures are Google's claims.
- Independent scores filled: AA Intelligence Index v5 54 at xhigh (changelog and model page also list 51 high, 41 medium, 27 low; cell uses best effort). Vals Terminal-Bench 4.0 54.04, #11 of 64, Mini-SWE-agent, on the Vals page (updated date still reads 11/11). CursorBench 54.3 at high, the best published effort (medium 46.7, low 27.9; no xhigh row). Arena+ does not list it. Harvey LAB-AA and AA-Robotics have no Hydrogen score. AA's Terminal-Bench 4.0 figure of 54% is AA's own run and was not copied into the Vals column. Google's Terminal-Bench 4.1 57% stays in prose as a vendor claim.
- Agent Arena, verified on lmarena.ai/leaderboard/agent: Hydrogen (High) is #5 at +14.80% net, 6,465 sessions, preliminary, 5.6 minutes per task (P50), $1.61 per task. Arena's X post said 5.3 minutes and 6.5k sessions; the wire uses the live board. Not a Ridge board, wire only.
- AA-Robotics: AA's official X post (2120698177016005029, 11 Nov 9:00 PM ET) says Fable 5.2 leads at 75, ahead of Astra (69) and Sol (65), and is the first model to score on measure-box. The article table at artificialanalysis.ai/articles/aa-robotics still has only the October five: Astra 69.4, Sol 64.6, Argon 55.3, Opus 5.5 48.8, Fable 5.1 46.3. Ridge keeps those exact one-decimal values and fills Fable 5.2 at 75 from the AA post, then re-ranks out of 6. Robot arm on Best for moves from Astra to Fable 5.2. Hydrogen has no robotics score. The daily scrape still reads the article table, so the next run may rewrite the original five notes as "of 5" until AA updates the page; Fable's cell should be left alone because the apply script only updates names it matches in the pull.
- Best for: Robot arm changes as above. Hydrogen does not take Smartest (54 vs Fable 65), Coding in an editor (54.3 vs Carbon 60.4), Agents & terminal (54.04 vs Fable/Opus 65.15), open weights, or Best value (mid list $4.50 / 54 is about $0.083 per AA point, far behind Haiku 5.5 and Ember). Context is stored as 1,000,000 tokens, same as the other Gemini 4 rows, so it does not falsely win Longest memory over models listed at 1M. Homepage Best for cards are computed, no copy edit.
- Vals TB4 rank notes in the catalog redone out of 64 after adding Hydrogen at #11. Values otherwise unchanged. Summaries for Fable 5.2 and Carbon updated to match.
- Wires: gemini-4-hydrogen-1112, fable-5-2-aa-robotics-1111. No desk: first-day X posts were mostly launch reposts and hype, not enough sourced hands-on reactions to quote. briefing.py BOARD_WATCH and known_extra gain gemini-4-hydrogen; Fable's watch comment now includes AA-Robotics 75.
- Skipped: Salesforce SOV-Transcribe-1 (speech-to-text, off-lane). Qwen 4 / Qwen 4 Flash API rumor: Alibaba Model Studio recommended-models page, last updated 12 Nov, and the release notes, last updated 11 Nov, still list only qwen4-max-preview. GPT-6.2 still unreleased.
- Standing check:data warnings unchanged (cursor-bench asOf, trump-ai-guardrails-0914 source URL). CursorBench board asOf was left at 2026-09-11.

## 2026-11-13: Inkling 2 Small open weights, AA Cyber check, Vals Financial Coaching Bench, Decider v1.3, DeepSeek API

- Daily scrape (7:30 AM ET) was dates only, plus the Hydrogen headline add in llms.txt. It rewrote the five original AA-Robotics notes from #2-#6 of 6 to #1-#5 of 5, because parse_aa_robotics still reads only AA's article table, which omits Fable 5.2 (75, posted 11 Nov). Restored the of-6 ranks (Astra #2, Sol #3, Argon #4, Opus 5.5 #5, Fable 5.1 #6; Fable 5.2 stays #1 of 6 with the 11 Nov source). apply-briefing-staging.py now unions that table with catalog-only robotics scores before writing rank notes, so a later date-only scrape cannot shrink the denominator. Dry-run after the fix: no catalog changes.
- Inkling 2 Small weights verified on thinkingmachines.ai/news/inkling-2-small (Nov 12 update), the official X post at 2026-11-12 20:50:38 UTC (3:50 PM ET), and Hugging Face API: thinkingmachines/Inkling-2-Small and Inkling-2-Small-MXFP8 are public, ungated, license apache-2.0, 594B total / 17B active. Official hardware: NVFP4 about 500GB (2x B300 or 4x H200); MXFP8 about 800GB. AA model page still lists Intelligence Index 31 and now marks the model open weights / Apache 2.0. Row flipped proprietary to open-weight; AA 31, Arena+ 1493 and Vals TB4 12.63 were already filled, so no new board cells. Best open weights stays Kimi K3.1 Pro at 46. Wire includes Arena Code Arena WebDev 1647 and Agent Arena placement; those boards stay off the catalog. No desk: first-day X posts were recaps, DesignArena's own board post, and hype, not enough sourced hands-on reactions to quote.
- AA Cyber Index verified on artificialanalysis.ai/evaluations/artificial-analysis-cyber-index and on today's briefing-pull.json (25 public rows; Daybreak Sol held out). Unrounded: Kimi K3.1 Pro 64.07, Hy4 57.98, DeepSeek V4.1 Flash 1017 (max) 56.81, already stored as 64 / (no row) / 57. AA's post calls Hy4 #3 because it counts trusted-access GPT-6 Sol (Daybreak Blue, max) at 69; among public models Hy4 is second. Fable 5.2 is not on the index. GLM-5.3-Flash is 49.92 (stored would be 50) but there is no Flash row; glm-5.3 already has max 36. MiniMax-M3, Nemotron 3 Ultra, Qwen3.8 27B and Qwen3.8 2.4T A95B have no matching rows. No new Cyber fills.
- Vals Financial Coaching Bench verified on vals.ai/benchmarks/financial-coaching-bench (updated 11/13/2026) and the Vals X post. Wire only.
- Perplexity Decider v1.3 / Flash v1.3 verified on docs.perplexity.ai (pricing $0.02 / $0.01 per 1M input, output free), the 12 Nov 19:34 UTC community announcement, and HF API (public, ungated, apache-2.0; repos created 2026-11-09T08:38Z). Vendor scores not copied. No row.
- DeepSeek API platform update verified on api-docs.deepseek.com/news/news261113/. Short wire.
- Skipped as off-lane: Microsoft MAI-Transcribe-2, Runway Praxis-1, inclusionAI Duo, World Labs Atlas, Baidu ERNIE Wizshot / Light Deep Thinking and the Token Exchange marketplace.
- No desk piece. Standing check:data warnings unchanged (cursor-bench asOf, trump-ai-guardrails-0914 source URL).

