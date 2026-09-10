import { mkdirSync } from "node:fs";
import { join } from "node:path";

/** Absolute data dir for admin SQLite files (gitignored contents). */
export const ADMIN_DATA_DIR = join(process.cwd(), "data");

export const ADMIN_AUTH_DB_PATH = join(ADMIN_DATA_DIR, "admin-auth.sqlite");
export const ADMIN_ANALYTICS_DB_PATH = join(ADMIN_DATA_DIR, "admin-analytics.sqlite");

export function ensureAdminDataDir(): void {
  mkdirSync(ADMIN_DATA_DIR, { recursive: true });
}
