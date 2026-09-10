/**
 * Admin security helpers: client IP, helmet-ish headers, common-password blocklist.
 */

/** Tiny built-in blocklist — keep short; Better Auth still hashes with scrypt. */
const COMMON_PASSWORDS = new Set(
  [
    "password",
    "password123",
    "password1234",
    "password12345",
    "123456789012",
    "1234567890123",
    "qwertyuiopas",
    "qwertyuiopasdf",
    "letmeinletmein",
    "adminadmin12",
    "adminpassword",
    "changeme1234",
    "iloveyou1234",
    "welcome12345",
    "monkeymonkey1",
    "dragondragon1",
    "mastermaster1",
    "loginlogin12",
    "abc123abc123",
    "passw0rdpass",
    "ridgebench12",
    "ridgebench123",
    "ridgeadmin12",
    "ridgeadmin123",
  ].map((s) => s.toLowerCase()),
);

export function isCommonPassword(password: string): boolean {
  const p = password.trim().toLowerCase();
  if (COMMON_PASSWORDS.has(p)) return true;
  // Obvious keyboard runs / repeats of length >= 12
  if (/^(.)\1{11,}$/.test(p)) return true;
  if (/^(0123456789|9876543210)+$/.test(p)) return true;
  return false;
}

export function clientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip")?.trim();
  if (cf) return cf.slice(0, 64);
  const xff = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (xff) return xff.slice(0, 64);
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 64);
  return "unknown";
}

export const ADMIN_SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cache-Control": "no-store",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Cross-Origin-Opener-Policy": "same-origin",
};

export function withAdminSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries(ADMIN_SECURITY_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** Uniform login failure copy — never reveal whether the email exists. */
export const GENERIC_AUTH_FAILURE = "Invalid email or password";

export function genericAuthJson(status = 401): Response {
  return withAdminSecurityHeaders(
    Response.json({ error: GENERIC_AUTH_FAILURE }, { status }),
  );
}
