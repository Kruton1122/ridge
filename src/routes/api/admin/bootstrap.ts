import { createFileRoute } from "@tanstack/react-router";
import {
  adminEmailAllowlist,
  adminUserCount,
  bootstrapAdminUser,
} from "@/lib/admin/auth";

/**
 * One-shot first-admin bootstrap. Disabled once any user exists.
 */
export const Route = createFileRoute("/api/admin/bootstrap")({
  server: {
    handlers: {
      GET: async () => {
        const count = await adminUserCount();
        return Response.json({
          needsBootstrap: count === 0,
          allowlistConfigured: adminEmailAllowlist().length > 0,
        });
      },
      POST: async ({ request }) => {
        let body: { email?: string; password?: string; name?: string } = {};
        try {
          body = (await request.json()) as typeof body;
        } catch {
          return Response.json({ error: "invalid json" }, { status: 400 });
        }
        const result = await bootstrapAdminUser({
          email: body.email ?? "",
          password: body.password ?? "",
          name: body.name,
        });
        if (!result.ok) {
          return Response.json({ error: result.error }, { status: 400 });
        }
        return Response.json({ ok: true });
      },
    },
  },
});
