/**
 * Sliding-window rate limit + failure lockout for admin auth endpoints.
 * Counters live in admin-auth.sqlite (table auth_rate_limit).
 *
 * Defaults: 5 failures / 15 min → lockout; soft cap on request volume.
 * Override window via RIDGE_ADMIN_RATE_WINDOW_MS (tests / emergency).
 */
import Database from "better-sqlite3";
import { ADMIN_AUTH_DB_PATH, ensureAdminDataDir, hardenDbFilePerms } from "./paths";
import { withAdminSecurityHeaders } from "./security";

const DEFAULT_WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 5;
const MAX_REQUESTS = 40;
const LOCKOUT_MS = 15 * 60_000;

type RateRow = {
  key: string;
  fails: number;
  hits: number;
  window_start: number;
  locked_until: number;
  updated_at: number;
};

const globalRef = globalThis as typeof globalThis & {
  __ridgeAdminRateDb__?: Database.Database;
};

function windowMs(): number {
  const raw = process.env.RIDGE_ADMIN_RATE_WINDOW_MS?.trim();
  if (raw && /^\d+$/.test(raw)) {
    const n = Number(raw);
    if (n >= 5_000 && n <= 3_600_000) return n;
  }
  return DEFAULT_WINDOW_MS;
}

function lockoutMs(): number {
  return Math.max(windowMs(), LOCKOUT_MS);
}

function openRateDb(): Database.Database {
  if (globalRef.__ridgeAdminRateDb__) return globalRef.__ridgeAdminRateDb__;
  ensureAdminDataDir();
  const db = new Database(ADMIN_AUTH_DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS auth_rate_limit (
      key TEXT PRIMARY KEY,
      fails INTEGER NOT NULL DEFAULT 0,
      hits INTEGER NOT NULL DEFAULT 0,
      window_start INTEGER NOT NULL,
      locked_until INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS auth_rate_limit_locked_idx ON auth_rate_limit(locked_until);
  `);
  hardenDbFilePerms(ADMIN_AUTH_DB_PATH);
  globalRef.__ridgeAdminRateDb__ = db;
  return db;
}

function getRow(db: Database.Database, key: string): RateRow | undefined {
  return db.prepare(`SELECT * FROM auth_rate_limit WHERE key = ?`).get(key) as
    | RateRow
    | undefined;
}

function upsert(db: Database.Database, row: RateRow): void {
  db.prepare(
    `INSERT INTO auth_rate_limit (key, fails, hits, window_start, locked_until, updated_at)
     VALUES (@key, @fails, @hits, @window_start, @locked_until, @updated_at)
     ON CONFLICT(key) DO UPDATE SET
       fails = excluded.fails,
       hits = excluded.hits,
       window_start = excluded.window_start,
       locked_until = excluded.locked_until,
       updated_at = excluded.updated_at`,
  ).run(row);
}

function freshRow(key: string, now: number): RateRow {
  return {
    key,
    fails: 0,
    hits: 0,
    window_start: now,
    locked_until: 0,
    updated_at: now,
  };
}

function rollWindow(row: RateRow, now: number): RateRow {
  if (now - row.window_start >= windowMs()) {
    return {
      ...row,
      fails: 0,
      hits: 0,
      window_start: now,
      locked_until: row.locked_until > now ? row.locked_until : 0,
      updated_at: now,
    };
  }
  return row;
}

export type RateLimitDecision = {
  allowed: boolean;
  retryAfterSec: number;
  delayMs: number;
  reason?: string;
};

function decide(keys: string[]): RateLimitDecision {
  const db = openRateDb();
  const now = Date.now();
  let worst: RateLimitDecision = { allowed: true, retryAfterSec: 0, delayMs: 0 };

  for (const key of keys) {
    let row = rollWindow(getRow(db, key) ?? freshRow(key, now), now);
    if (row.locked_until > now) {
      const retryAfterSec = Math.max(1, Math.ceil((row.locked_until - now) / 1000));
      if (!worst.allowed && worst.retryAfterSec >= retryAfterSec) continue;
      worst = {
        allowed: false,
        retryAfterSec,
        delayMs: 0,
        reason: "locked",
      };
      continue;
    }
    if (row.hits >= MAX_REQUESTS || row.fails >= MAX_FAILURES) {
      row = {
        ...row,
        locked_until: now + lockoutMs(),
        updated_at: now,
      };
      upsert(db, row);
      worst = {
        allowed: false,
        retryAfterSec: Math.ceil(lockoutMs() / 1000),
        delayMs: 0,
        reason: row.fails >= MAX_FAILURES ? "failures" : "volume",
      };
      continue;
    }
    const delayMs = Math.min(3_200, row.fails > 0 ? 200 * 2 ** (row.fails - 1) : 0);
    if (delayMs > worst.delayMs) {
      worst = { allowed: true, retryAfterSec: 0, delayMs };
    }
  }
  return worst;
}

/** Record a request attempt (increments hits). Call after decide() when allowed. */
export function recordAuthHit(keys: string[]): void {
  const db = openRateDb();
  const now = Date.now();
  for (const key of keys) {
    let row = rollWindow(getRow(db, key) ?? freshRow(key, now), now);
    row = { ...row, hits: row.hits + 1, updated_at: now };
    upsert(db, row);
  }
}

/** Record an authentication failure (increments fails; may lock). */
export function recordAuthFailure(keys: string[]): void {
  const db = openRateDb();
  const now = Date.now();
  for (const key of keys) {
    let row = rollWindow(getRow(db, key) ?? freshRow(key, now), now);
    const fails = row.fails + 1;
    row = {
      ...row,
      fails,
      updated_at: now,
      locked_until: fails >= MAX_FAILURES ? now + lockoutMs() : row.locked_until,
    };
    upsert(db, row);
  }
}

/** Clear counters after a successful sign-in. */
export function clearAuthRate(keys: string[]): void {
  const db = openRateDb();
  const stmt = db.prepare(`DELETE FROM auth_rate_limit WHERE key = ?`);
  for (const key of keys) stmt.run(key);
}

export function rateLimitKeys(ip: string, email?: string | null): string[] {
  const keys = [`ip:${ip || "unknown"}`];
  const e = email?.trim().toLowerCase();
  if (e) keys.push(`email:${e}`);
  return keys;
}

export function rateLimitResponse(decision: RateLimitDecision): Response {
  return withAdminSecurityHeaders(
    Response.json(
      {
        error: "Too many attempts. Try again later.",
        retryAfterSec: decision.retryAfterSec,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.max(1, decision.retryAfterSec)),
        },
      },
    ),
  );
}

export async function enforceAuthRateLimit(input: {
  ip: string;
  email?: string | null;
}): Promise<{ ok: true; keys: string[]; delayMs: number } | { ok: false; response: Response }> {
  const keys = rateLimitKeys(input.ip, input.email);
  const decision = decide(keys);
  if (!decision.allowed) {
    return { ok: false, response: rateLimitResponse(decision) };
  }
  recordAuthHit(keys);
  if (decision.delayMs > 0) {
    await new Promise((r) => setTimeout(r, decision.delayMs));
  }
  return { ok: true, keys, delayMs: decision.delayMs };
}

/** Test helper — wipe rate-limit rows (does not touch users/sessions). */
export function resetAuthRateLimits(): void {
  openRateDb().exec(`DELETE FROM auth_rate_limit`);
}
