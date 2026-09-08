# Ridge — run it locally

Needs Node 22+ (20 is usually fine).

```bash
unzip ridge-local.zip
cd ridge-local
npm install
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080).

## What you have

- Ledger, News, model pages, `/api/ledger.json`, `/api/ledger.csv`, `/llms.txt`
- Snapshot date is baked into `src/lib/data/catalog.ts` — edit that file to change scores

## Notes

- `npm run dev` binds `0.0.0.0:8080` (see `package.json`). Change the port there if 8080 is taken.
- Auth / PWA scripts are leftover from the Grok app-builder scaffold. You can ignore them for a local ledger.
- Do not commit `node_modules`.
