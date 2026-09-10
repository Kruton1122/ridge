# Claude / local agents

This is Ridge. Product rules: [RIDGE.md](./RIDGE.md).

**Agent lanes:** [RIDGE-BOT.md](./RIDGE-BOT.md) — Ridge Bot (Grok Bot) owns daily scrape, board freshness, wire/desk news, and opinion stars. Claude expanding the site should read that handoff first so pipelines and content passes are not overwritten.

**Site:** the redesign is the live site (`src/routes/_app/`, `src/components/new/`, `src/lib/data/derived.ts`). The previous site is archived at `/old`. Contract: [REDESIGN.md](./REDESIGN.md). Never write Ridge Bot's four pipeline files.

Do not invent benchmark numbers. Do not mix AA Index v4.1.1 with v4.2+. Prefer reading live `catalog.ts` / `llms.txt` for scores rather than hand-competing with the daily apply script.
