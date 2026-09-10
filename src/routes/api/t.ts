import { createFileRoute } from "@tanstack/react-router";
import { recordHit } from "@/lib/admin/analytics";

/**
 * Public first-party analytics beacon.
 * No cookies required. Accepts JSON or sendBeacon blobs.
 */
export const Route = createFileRoute("/api/t")({
  server: {
    handlers: {
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-methods": "POST, OPTIONS",
            "access-control-allow-headers": "content-type",
            "access-control-max-age": "86400",
          },
        }),
      POST: async ({ request }) => {
        let payload: Record<string, unknown> = {};
        try {
          const text = await request.text();
          if (text) payload = JSON.parse(text) as Record<string, unknown>;
        } catch {
          return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
        }

        const country =
          request.headers.get("cf-ipcountry") ??
          request.headers.get("CF-IPCountry") ??
          null;
        const ok = recordHit({
          path: typeof payload.path === "string" ? payload.path : "",
          referrer: typeof payload.referrer === "string" ? payload.referrer : null,
          language: typeof payload.language === "string" ? payload.language : null,
          screen: typeof payload.screen === "string" ? payload.screen : null,
          country,
          userAgent: request.headers.get("user-agent"),
        });

        if (!ok) {
          return Response.json({ ok: false }, { status: 400 });
        }
        return new Response(null, { status: 204 });
      },
    },
  },
});
