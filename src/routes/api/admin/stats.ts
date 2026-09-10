import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@/lib/admin/analytics";
import { getAdminSession } from "@/lib/admin/auth";
import { withAdminSecurityHeaders } from "@/lib/admin/security";

export const Route = createFileRoute("/api/admin/stats")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await getAdminSession(request.headers);
        if (!session) {
          return withAdminSecurityHeaders(
            Response.json({ error: "Unauthorized" }, { status: 401 }),
          );
        }
        return withAdminSecurityHeaders(Response.json(getStats()));
      },
    },
  },
});
