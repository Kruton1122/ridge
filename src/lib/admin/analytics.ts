/**
 * First-party traffic analytics (SQLite).
 * Public beacon writes hits; admin stats endpoints read aggregates.
 */
import Database from "better-sqlite3";
import { loadAdminEnv } from "./load-env";
import { ADMIN_ANALYTICS_DB_PATH, ensureAdminDataDir } from "./paths";

loadAdminEnv();

export type AnalyticsHit = {
  path: string;
  referrer: string | null;
  referrerHost: string | null;
  language: string | null;
  screen: string | null;
  country: string | null;
  userAgent: string | null;
  ts: number;
};

export type StatsPayload = {
  generatedAt: number;
  ranges: {
    h24: RangeStats;
    d7: RangeStats;
  };
  recent: AnalyticsHit[];
  cloudflare: {
    configured: boolean;
    note: string;
  };
};

type RangeStats = {
  pageviews: number;
  topPaths: { path: string; count: number }[];
  topReferrers: { host: string; count: number }[];
  topCountries: { country: string; count: number }[];
  hourly: { hour: string; count: number }[];
};

const globalRef = globalThis as typeof globalThis & {
  __ridgeAdminAnalyticsDb__?: Database.Database;
};

function openDb(): Database.Database {
  if (globalRef.__ridgeAdminAnalyticsDb__) return globalRef.__ridgeAdminAnalyticsDb__;
  ensureAdminDataDir();
  const db = new Database(ADMIN_ANALYTICS_DB_PATH);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS hits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ts INTEGER NOT NULL,
      path TEXT NOT NULL,
      referrer TEXT,
      referrer_host TEXT,
      language TEXT,
      screen TEXT,
      country TEXT,
      user_agent TEXT
    );
    CREATE INDEX IF NOT EXISTS hits_ts_idx ON hits(ts);
    CREATE INDEX IF NOT EXISTS hits_path_idx ON hits(path);
    CREATE INDEX IF NOT EXISTS hits_referrer_host_idx ON hits(referrer_host);
    CREATE INDEX IF NOT EXISTS hits_country_idx ON hits(country);
  `);
  globalRef.__ridgeAdminAnalyticsDb__ = db;
  return db;
}

function hostFromReferrer(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const u = new URL(referrer);
    return u.host || null;
  } catch {
    return null;
  }
}

/** Normalize path: strip query/hash, cap length, drop obvious junk. */
export function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  let path = raw.trim();
  if (!path.startsWith("/")) return null;
  const q = path.indexOf("?");
  if (q >= 0) path = path.slice(0, q);
  const h = path.indexOf("#");
  if (h >= 0) path = path.slice(0, h);
  if (path.length > 300) path = path.slice(0, 300);
  // Ignore admin/beacon/noise
  if (path.startsWith("/admin")) return null;
  if (path.startsWith("/api/t")) return null;
  if (path.startsWith("/api/admin")) return null;
  if (path.startsWith("/__grok")) return null;
  if (path.startsWith("/.")) return null;
  return path || "/";
}

export function recordHit(input: {
  path: string;
  referrer?: string | null;
  language?: string | null;
  screen?: string | null;
  country?: string | null;
  userAgent?: string | null;
  ts?: number;
}): boolean {
  const path = normalizePath(input.path);
  if (!path) return false;
  const referrer =
    typeof input.referrer === "string" && input.referrer.trim()
      ? input.referrer.trim().slice(0, 500)
      : null;
  const db = openDb();
  db.prepare(
    `INSERT INTO hits (ts, path, referrer, referrer_host, language, screen, country, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.ts ?? Date.now(),
    path,
    referrer,
    hostFromReferrer(referrer),
    typeof input.language === "string" ? input.language.slice(0, 32) : null,
    typeof input.screen === "string" ? input.screen.slice(0, 32) : null,
    typeof input.country === "string" ? input.country.slice(0, 8) : null,
    typeof input.userAgent === "string" ? input.userAgent.slice(0, 300) : null,
  );
  return true;
}

function topN(
  db: Database.Database,
  column: "path" | "referrer_host" | "country",
  since: number,
  limit: number,
): { key: string; count: number }[] {
  const nullLabel = column === "referrer_host" ? "(direct)" : column === "country" ? "(unknown)" : "(none)";
  const rows = db
    .prepare(
      `SELECT COALESCE(NULLIF(${column}, ), ?) AS key, COUNT(*) AS count
       FROM hits
       WHERE ts >= ?
       GROUP BY key
       ORDER BY count DESC
       LIMIT ?`,
    )
    .all(nullLabel, since, limit) as { key: string; count: number }[];
  return rows;
}

function hourlyBuckets(db: Database.Database, since: number, hours: number): { hour: string; count: number }[] {
  const rows = db
    .prepare(
      `SELECT strftime(%Y-%m-%dT%H:00:00Z, ts / 1000, unixepoch) AS hour, COUNT(*) AS count
       FROM hits
       WHERE ts >= ?
       GROUP BY hour
       ORDER BY hour ASC`,
    )
    .all(since) as { hour: string; count: number }[];
  // Fill gaps for a continuous chart
  const map = new Map(rows.map((r) => [r.hour, r.count]));
  const out: { hour: string; count: number }[] = [];
  const start = Date.now() - hours * 3600_000;
  for (let i = 0; i < hours; i++) {
    const t = new Date(start + i * 3600_000);
    t.setUTCMinutes(0, 0, 0);
    // Normalize to YYYY-MM-DDTHH:00:00Z
    const hour = `${t.toISOString().slice(0, 13)}:00:00Z`;
    out.push({ hour, count: map.get(hour) ?? 0 });
  }
  return out;
}

function rangeStats(db: Database.Database, sinceMs: number, hours: number): RangeStats {
  const pageviews = (
    db.prepare(`SELECT COUNT(*) AS c FROM hits WHERE ts >= ?`).get(sinceMs) as { c: number }
  ).c;
  return {
    pageviews,
    topPaths: topN(db, "path", sinceMs, 20).map((r) => ({ path: r.key, count: r.count })),
    topReferrers: topN(db, "referrer_host", sinceMs, 20).map((r) => ({ host: r.key, count: r.count })),
    topCountries: topN(db, "country", sinceMs, 20).map((r) => ({ country: r.key, count: r.count })),
    hourly: hourlyBuckets(db, sinceMs, hours),
  };
}

export function getStats(): StatsPayload {
  const db = openDb();
  const now = Date.now();
  const recent = db
    .prepare(
      `SELECT ts, path, referrer, referrer_host AS referrerHost, language, screen, country, user_agent AS userAgent
       FROM hits
       ORDER BY ts DESC
       LIMIT 50`,
    )
    .all() as AnalyticsHit[];

  const cfToken = process.env.CLOUDFLARE_ANALYTICS_TOKEN?.trim();
  return {
    generatedAt: now,
    ranges: {
      h24: rangeStats(db, now - 24 * 3600_000, 24),
      d7: rangeStats(db, now - 7 * 24 * 3600_000, 7 * 24),
    },
    recent,
    cloudflare: {
      configured: Boolean(cfToken),
      note: cfToken
        ? "CLOUDFLARE_ANALYTICS_TOKEN is set; GraphQL Analytics API integration is stubbed for a later pass."
        : "Optional Cloudflare Analytics API not configured. First-party beacon is the MVP source of truth.",
    },
  };
}

export function analyticsReady(): boolean {
  try {
    openDb();
    return true;
  } catch {
    return false;
  }
}
