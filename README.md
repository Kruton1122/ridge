# Ridge

Frontier model benchmark ledger. Independent cut of Artificial Analysis, Arena+, and Vals.

Live snapshot in this tree: **7 September 2026** (AA Intelligence Index **v4.2**).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

## What’s in here

- Ledger with status, open/closed, $/AA, lab filters
- News wire + Ridge notes
- Machine endpoints: `/api/ledger.json`, `/api/ledger.csv`, `/api/v1`, `/llms.txt`

**If you are Claude, Grok, or another agent editing this repo, read [RIDGE.md](./RIDGE.md) first.**

Cite the source URL and the as-of date. Scores live in `src/lib/data/catalog.ts`.

AA v4.2 is not 1:1 with the old ~60s scale. Spark xhigh (GA, 52) and Spark max (partner, 53) are separate rows.
