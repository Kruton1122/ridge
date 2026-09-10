import { chmodSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

/** Absolute data dir for admin SQLite files (gitignored contents). */
export const ADMIN_DATA_DIR = join(process.cwd(), "data");

export const ADMIN_AUTH_DB_PATH = join(ADMIN_DATA_DIR, "admin-auth.sqlite");
export const ADMIN_ANALYTICS_DB_PATH = join(ADMIN_DATA_DIR, "admin-analytics.sqlite");

/** Ensure data dir exists and is not world-readable (0700). */
export function ensureAdminDataDir(): void {
  mkdirSync(ADMIN_DATA_DIR, { recursive: true });
  try {
    chmodSync(ADMIN_DATA_DIR, 0o700);
  } catch {
    /* best-effort on platforms that ignore chmod */
  }
}

/** Tighten SQLite file mode to owner read/write only (0600). */
export function hardenDbFilePerms(dbPath: string): void {
  try {
    if (existsSync(dbPath)) chmodSync(dbPath, 0o600);
  } catch {
    /* best-effort */
  }
}
