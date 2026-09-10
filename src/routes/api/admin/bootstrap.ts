import { createFileRoute } from "@tanstack/react-router";
import {
  adminEmailAllowlist,
  adminUserCount,
  bootstrapAdminUser,
} from "@/lib/admin/auth";
import {
  clearAuthRate,
  enforceAuthRateLimit,
  recordAuthFailure,
} from "@/lib/admin/rate-limit";
import { clientIp, withAdminSecurityHeaders } from "@/lib/admin/security";

/**
 * One-shot first-admin bootstrap. Disabled once any user exists.
 */
export const Route = createFileRoute("/api/admin/bootstrap")({
  server: {
    handlers: {
      GET: async () => {
        const count = await adminUserCount();
        return withAdminSecurityHeaders(
          Response.json({
            needsBootstrap: count === 0,
            allowlistConfigured: adminEmailAllowlist().length > 0,
          }),
        );
      },
      POST: async ({ request }) => {
        const ip = clientIp(request);
        let body: { email?: string; password?: string; name?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return withAdminSecurityHeaders(
            Response.json({ error: "invalid json" }, { status: 400 }),
          );
        }

        const gate = await enforceAuthRateLimit({
          ip,
          email: body.email ?? null,
        });
        if (!gate.ok) return gate.response;

        // Fast-path: already bootstrapped → uniform deny (no email enumeration).
        if ((await adminUserCount()) > 0) {
          recordAuthFailure(gate.keys);
          return withAdminSecurityHeaders(
            Response.json({ error: "Bootstrap unavailable" }, { status: 400 }),
          );
        }

        const result = await bootstrapAdminUser({
          email: body.email ?? "",
          password: body.password ?? "",
          name: body.name,
        });
        if (!result.ok) {
          recordAuthFailure(gate.keys);
          return withAdminSecurityHeaders(
            Response.json({ error: result.error }, { status: 400 }),
          );
        }
        clearAuthRate(gate.keys);
        return withAdminSecurityHeaders(Response.json({ ok: true }));
      },
    },
  },
});
