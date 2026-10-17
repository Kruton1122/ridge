# Claude / local agents

This is Ridge. Product rules: [RIDGE.md](./RIDGE.md).

**Agent lanes:** [RIDGE-BOT.md](./RIDGE-BOT.md) — Ridge Bot (Grok Bot) owns daily scrape, board freshness, wire/desk news, and opinion stars. Claude expanding the site should read that handoff first so pipelines and content passes are not overwritten.

**Site:** the redesign is the live site (`src/routes/_app/`, `src/components/new/`, `src/lib/data/derived.ts`). The previous site is archived at `/old`. Contract: [REDESIGN.md](./REDESIGN.md). Never write Ridge Bot's four pipeline files.

Do not invent benchmark numbers. Do not mix AA Index v4.1.1 with v4.2+. Prefer reading live `catalog.ts` / `llms.txt` for scores rather than hand-competing with the daily apply script.

## Working guidelines (Ridge)

Four habits for every edit, by hand or by bot. They favour care over speed; for a typo, use judgment.

**1. Think first, state assumptions.** Before changing data or code, say what you think the task is, which source you will use, and what you are unsure of. If a name, variant, date or build could mean two things, say so and ask rather than pick one quietly. Never invent a score; a blank beats a guess.

**2. Simplest thing that works.** Do the smallest change that does the job. No new options, helpers or columns nobody asked for. If a short edit and a clever rewrite both work, ship the short edit.

**3. Touch only what the task needs.** Every changed line should trace back to the request. Leave nearby rows, wording, formatting and old dead code alone, and match the existing style. Mention anything else you spot instead of fixing it. Remove only what your own change left unused.

**4. Decide the check first, then run it.** Name how you will know it worked before you start, and do not call it done until it has run:
- Data or copy: `npm run check:data`.
- Any code or data file: `npm run typecheck`.
- After pushing: the GitHub Actions run on `main` passes.
- User-facing change: load the live page and confirm the new text is there.
