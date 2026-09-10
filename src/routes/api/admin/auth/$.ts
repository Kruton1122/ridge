import { createFileRoute } from "@tanstack/react-router";
import { ensureAdminAuthMigrated, getAdminAuth } from "@/lib/admin/auth";
import {
  clearAuthRate,
  enforceAuthRateLimit,
  recordAuthFailure,
} from "@/lib/admin/rate-limit";
import {
  clientIp,
  GENERIC_AUTH_FAILURE,
  withAdminSecurityHeaders,
} from "@/lib/admin/security";

/**
 * Better Auth catch-all for Ridge admin: /api/admin/auth/*
 * Rate-limits password sign-in / sensitive POSTs; passkeys share soft volume cap.
 */
function pathOf(request: Request): string {
  try {
    return new URL(request.url).pathname;
  } catch {
    return "";
  }
}

function isSensitiveAuthPost(request: Request): boolean {
  if (request.method !== "POST" && request.method !== "PUT" && request.method !== "PATCH") {
    return false;
  }
  const p = pathOf(request);
  return (
    p.includes("/sign-in") ||
    p.includes("/sign-up") ||
    p.includes("/forget-password") ||
    p.includes("/reset-password") ||
    p.includes("/change-password") ||
    p.includes("/request-password")
  );
}

async function peekEmail(request: Request): Promise<string | null> {
  try {
    const clone = request.clone();
    const ct = clone.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      const body = (await clone.json()) as { email?: unknown };
      return typeof body.email === "string" ? body.email : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function normalizeFailureBody(response: Response): Promise<Response> | Response {
  if (response.status !== 401 && response.status !== 400 && response.status !== 403) {
    return withAdminSecurityHeaders(response);
  }
  // Rewrite body to a uniform message for sign-in style failures
  return (async () => {
    let data: Record<string, unknown> = {};
    try {
      data = (await response.clone().json()) as Record<string, unknown>;
    } catch {
      return withAdminSecurityHeaders(response);
    }
    const message =
      typeof data.message === "string"
        ? data.message
        : typeof data.error === "string"
          ? data.error
          : "";
    const looksAuthFail =
      /invalid|password|email|credential|unauthorized|not found|user/i.test(message) ||
      response.status === 401;
    if (!looksAuthFail) return withAdminSecurityHeaders(response);
    const headers = new Headers(response.headers);
    headers.set("content-type", "application/json");
    return withAdminSecurityHeaders(
      new Response(
        JSON.stringify({
          ...data,
          message: GENERIC_AUTH_FAILURE,
          error: GENERIC_AUTH_FAILURE,
        }),
        { status: response.status, headers },
      ),
    );
  })();
}

async function handle({ request }: { request: Request }) {
  await ensureAdminAuthMigrated();
  const ip = clientIp(request);
  let rateKeys: string[] | null = null;

  if (isSensitiveAuthPost(request)) {
    const email = await peekEmail(request);
    const gate = await enforceAuthRateLimit({ ip, email });
    if (!gate.ok) return gate.response;
    rateKeys = gate.keys;
  }

  const auth = getAdminAuth();
  let response: Response;
  try {
    response = await auth.handler(request);
  } catch {
    if (rateKeys) recordAuthFailure(rateKeys);
    return withAdminSecurityHeaders(
      Response.json({ error: GENERIC_AUTH_FAILURE }, { status: 401 }),
    );
  }

  if (rateKeys) {
    if (response.ok) {
      clearAuthRate(rateKeys);
    } else if (response.status === 401 || response.status === 403 || response.status === 400) {
      recordAuthFailure(rateKeys);
    }
  }

  return normalizeFailureBody(response);
}

export const Route = createFileRoute("/api/admin/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
      OPTIONS: handle,
    },
  },
});
