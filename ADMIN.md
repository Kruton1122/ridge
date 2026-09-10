# Ridge Admin — traffic dashboard

Owner-only dashboard at **`/admin`** (no public nav link). Shows first-party
web traffic stats and a live-ish “where traffic comes from” feed.

This system is **owned separately** from the Ridge Bot scrape pipeline. It does
not touch `catalog.ts`, `desk.ts`, `changelog.ts`, `llms.txt`, or briefing
scripts.

## What you get

| Route | Access | Purpose |
|---|---|---|
| `POST /api/t` | Public | Tiny pageview beacon (no cookies) |
| `/admin/login` | Public | Passkey-first sign-in (+ password fallback / bootstrap) |
| `/admin` | Admin session | Traffic charts / tables (“Ridge Ops”) |
| `/api/admin/stats` | Admin session | JSON aggregates |
| `/api/admin/bootstrap` | Public (empty DB only) | Create first allowlisted admin — disabled after |
| `/api/admin/auth/*` | Better Auth | Dedicated admin auth (not Grok broker) |

Public contracts stay public: `/api/ledger.json`, `/api/v1`, `/llms.txt`.

## Auth model

Dedicated **Better Auth** instance (not the scaffold Grok-broker auth in
`src/lib/auth/`):

- **Passkeys / WebAuthn** via `@better-auth/passkey` (preferred after bootstrap)
- **Email + password** for first-user bootstrap and fallback (scrypt via Better Auth)
- Allowlist: `RIDGE_ADMIN_EMAIL` (comma-separated). No public signup.
- Cookie prefix: `ridge-admin` · base path: `/api/admin/auth`
- Cookies: **HttpOnly**, **Secure** (https), **SameSite=Strict**
- CSRF / origin checks: Better Auth `originCheck` + `formCsrf` on state-changing routes

## Hardening (summary)

| Control | Behavior |
|---|---|
| Rate limit + lockout | `/api/admin/auth/*` sensitive POSTs and `/api/admin/bootstrap` — per IP (+ email when present). ~5 failures / 15 min → 429 + lockout; soft volume cap; progressive delay on repeated fails. Counters in `admin-auth.sqlite` (`auth_rate_limit`). Optional `RIDGE_ADMIN_RATE_WINDOW_MS` (≥5s) for tests. |
| Uniform failures | Login / bootstrap errors do not reveal whether an email exists. |
| Password policy | ≥12 chars; small common-password blocklist on bootstrap. |
| Bootstrap | Disabled once any admin user exists. |
| DB file perms | `data/` → `0700`; `admin-*.sqlite` → `0600` (best-effort on open). |
| Security headers | `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy: no-referrer`, `Cache-Control: no-store`, COOP, Permissions-Policy on admin API + `/admin` HTML. |

**Do not** permanently lock yourself out while testing rate limits — use a
non-allowlisted test email, or wipe `auth_rate_limit` rows, or temporarily set
`RIDGE_ADMIN_RATE_WINDOW_MS=10000` and restart `ridge.service`.

## Bootstrap (Pi)

1. Create `/home/pi/ridge/.env` (gitignored) from `.env.example`:

```bash
cd /home/pi/ridge
cp .env.example .env
# edit: RIDGE_ADMIN_EMAIL, RIDGE_ADMIN_AUTH_SECRET, RIDGE_ADMIN_BASE_URL, RIDGE_ADMIN_RP_ID
```

2. Restart the hot-reload service so Node picks up env (Vite loads `.env` for the
   server process):

```bash
sudo systemctl restart ridge.service
```

3. Open `https://ridgebench.com/admin/login` (or local `http://127.0.0.1:8098/admin/login`).
4. When the auth DB is empty, the form **creates the first allowlisted admin**
   and signs you in. Password ≥ 12 chars.
5. On `/admin`, click **Add passkey**. Prefer passkey thereafter.

SQLite files (gitignored):

- `data/admin-auth.sqlite` — users, sessions, passkeys, rate-limit counters
- `data/admin-analytics.sqlite` — pageview hits

## Beacon

Public pages under the `_app` layout load `AnalyticsBeacon`, which POSTs to
`/api/t` with path, referrer, language, and screen. The server adds timestamp,
`User-Agent`, and `CF-IPCountry` when Cloudflare sends it. Admin routes are not
beaconed.

## Cloudflare Analytics API (optional, later)

If `CLOUDFLARE_ANALYTICS_TOKEN` is set, the stats payload notes that the GraphQL
Analytics API is available for a future integration. First-party beacon remains
the MVP source of truth.

## Security notes

- Do not link `/admin` from the public shell.
- Do not commit `.env` or `data/*.sqlite`.
- Do not reuse the Grok-broker Better Auth for admin — keep this path dedicated
  so the public site stays ungated.
- Prefer passkeys; treat password as break-glass.
