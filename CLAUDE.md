# Claude / local agents

This is Ridge. Product rules: [RIDGE.md](./RIDGE.md).

**Agent lanes:** [RIDGE-BOT.md](./RIDGE-BOT.md) — Ridge Bot (Grok Bot) owns daily scrape, board freshness, wire/desk news, and opinion stars. Claude expanding the site should read that handoff first so pipelines and content passes are not overwritten.

**Redesign:** a rebuilt version of the site lives at `/new/*` alongside the published one — see [REDESIGN.md](./REDESIGN.md) for the file map, the "never write Ridge Bot's four files" rule, and the migration steps. Source under `src/routes/new/`, `src/components/new/`, `src/lib/data/derived.ts`.

Do not invent benchmark numbers. Do not mix AA Index v4.1.1 with v4.2+. Prefer reading live `catalog.ts` / `llms.txt` for scores rather than hand-competing with the daily apply script.
