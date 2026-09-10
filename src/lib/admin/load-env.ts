/**
 * Load gitignored `/home/pi/ridge/.env` into process.env for admin secrets.
 * Vite only auto-exposes VITE_* to the client; server admin code needs this.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const LOADED = Symbol.for("ridge.admin.env.loaded");

export function loadAdminEnv(): void {
  const g = globalThis as typeof globalThis & { [LOADED]?: boolean };
  if (g[LOADED]) return;
  g[LOADED] = true;
  try {
    const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env) || process.env[key] === "") {
        process.env[key] = value;
      }
    }
  } catch {
    /* no .env yet — bootstrap docs cover creating one */
  }
}
