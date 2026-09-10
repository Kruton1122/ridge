/**
 * Dedicated Ridge admin Better Auth instance.
 *
 * Completely separate from the scaffold Grok-broker auth in `@/lib/auth/*`.
 * Mounted at `/api/admin/auth/*` so it cannot gate public pages or public APIs.
 *
 * Features: email/password (bootstrap) + WebAuthn passkeys via `@better-auth/passkey`.
 * Allowlist: RIDGE_ADMIN_EMAIL (comma-separated). No public signup.
 */
import { betterAuth } from "better-auth";
import { passkey } from "@better-auth/passkey";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import Database from "better-sqlite3";
import { loadAdminEnv } from "./load-env";
import { ADMIN_AUTH_DB_PATH, ensureAdminDataDir } from "./paths";

loadAdminEnv();

const env = (key: string): string | undefined => {
  const v = process.env[key]?.trim();
  return v ? v : undefined;
};

/** Comma-separated admin emails (lowercased). Empty = no one can sign in/up. */
export function adminEmailAllowlist(): string[] {
  const raw = env("RIDGE_ADMIN_EMAIL") ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmailAllowed(email: string): boolean {
  const list = adminEmailAllowlist();
  if (list.length === 0) return false;
  return list.includes(email.trim().toLowerCase());
}

function adminBaseURL(): string {
  return (
    env("RIDGE_ADMIN_BASE_URL") ??
    env("BETTER_AUTH_URL") ??
    "http://127.0.0.1:8098"
  );
}

function adminSecret(): string {
  const secret = env("RIDGE_ADMIN_AUTH_SECRET") ?? env("BETTER_AUTH_SECRET");
  if (!secret) {
    return "ridge-admin-dev-secret-change-me";
  }
  return secret;
}

function rpID(): string {
  const explicit = env("RIDGE_ADMIN_RP_ID");
  if (explicit) return explicit;
  try {
    return new URL(adminBaseURL()).hostname;
  } catch {
    return "localhost";
  }
}

type AdminAuth = ReturnType<typeof buildAuth>;

const globalRef = globalThis as typeof globalThis & {
  __ridgeAdminAuthDb__?: Database.Database;
  __ridgeAdminAuth__?: AdminAuth;
  __ridgeAdminAuthMigrated__?: Promise<void>;
};

function openAuthDb(): Database.Database {
  if (globalRef.__ridgeAdminAuthDb__) return globalRef.__ridgeAdminAuthDb__;
  ensureAdminDataDir();
  const db = new Database(ADMIN_AUTH_DB_PATH);
  db.pragma("journal_mode = WAL");
  globalRef.__ridgeAdminAuthDb__ = db;
  return db;
}

function buildAuth() {
  const baseURL = adminBaseURL();
  const origin = baseURL.replace(/\/+$/, "");
  const localOrigins = [
    "http://127.0.0.1:8098",
    "http://localhost:8098",
    "http://127.0.0.1:8080",
    "http://localhost:8080",
  ];

  return betterAuth({
    appName: "Ridge Admin",
    baseURL,
    basePath: "/api/admin/auth",
    secret: adminSecret(),
    database: openAuthDb(),
    trustedOrigins: Array.from(new Set([origin, ...localOrigins])),
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 12,
    },
    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            if (!isAdminEmailAllowed(user.email)) {
              throw new Error("Email is not on the Ridge admin allowlist");
            }
            return { data: user };
          },
        },
      },
    },
    advanced: {
      cookiePrefix: "ridge-admin",
      useSecureCookies: origin.startsWith("https://"),
    },
    plugins: [
      passkey({
        rpID: rpID(),
        rpName: "Ridge Admin",
        origin,
      }),
      tanstackStartCookies(),
    ],
  });
}

export function getAdminAuth(): AdminAuth {
  if (!globalRef.__ridgeAdminAuth__) {
    globalRef.__ridgeAdminAuth__ = buildAuth();
  }
  return globalRef.__ridgeAdminAuth__;
}

/** Apply Better Auth + passkey schema once per process. */
export async function ensureAdminAuthMigrated(): Promise<void> {
  if (!globalRef.__ridgeAdminAuthMigrated__) {
    globalRef.__ridgeAdminAuthMigrated__ = (async () => {
      const auth = getAdminAuth();
      const ctx = await auth.$context;
      await ctx.runMigrations();
    })();
  }
  await globalRef.__ridgeAdminAuthMigrated__;
}

export async function adminUserCount(): Promise<number> {
  await ensureAdminAuthMigrated();
  const db = openAuthDb();
  const row = db.prepare(`SELECT COUNT(*) AS c FROM user`).get() as { c: number };
  return row.c;
}

export async function getAdminSession(headers: Headers) {
  await ensureAdminAuthMigrated();
  const auth = getAdminAuth();
  const session = await auth.api.getSession({ headers });
  if (!session?.user?.email) return null;
  if (!isAdminEmailAllowed(session.user.email)) {
    await auth.api.signOut({ headers });
    return null;
  }
  return session;
}

/**
 * Create the first admin user when the auth DB is empty.
 * Password bootstrap only — register a passkey after first login.
 */
export async function bootstrapAdminUser(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  await ensureAdminAuthMigrated();
  const email = input.email.trim().toLowerCase();
  if (!isAdminEmailAllowed(email)) {
    return { ok: false, error: "Email is not on RIDGE_ADMIN_EMAIL allowlist" };
  }
  if ((await adminUserCount()) > 0) {
    return { ok: false, error: "Admin user already exists" };
  }
  if (!input.password || input.password.length < 12) {
    return { ok: false, error: "Password must be at least 12 characters" };
  }

  const auth = getAdminAuth();
  const ctx = await auth.$context;
  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing) {
    return { ok: false, error: "User already exists" };
  }
  const hashed = await ctx.password.hash(input.password);
  const user = await ctx.internalAdapter.createUser({
    email,
    name: input.name?.trim() || email.split("@")[0] || "Admin",
    emailVerified: true,
  });
  if (!user) {
    return { ok: false, error: "Failed to create user" };
  }
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: "credential",
    accountId: user.id,
    password: hashed,
  });
  return { ok: true };
}
