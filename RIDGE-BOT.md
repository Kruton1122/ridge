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
