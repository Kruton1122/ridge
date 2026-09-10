/**
 * Browser client for Ridge admin auth (passkey + email/password).
 * Talks only to `/api/admin/auth/*` — never the public Grok-broker auth.
 */
import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";

export const adminAuthClient = createAuthClient({
  basePath: "/api/admin/auth",
  plugins: [passkeyClient()],
});
