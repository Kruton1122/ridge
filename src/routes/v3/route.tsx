import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AnalyticsBeacon } from "@/components/admin/analytics-beacon";
import { Shell } from "@/components/v3/shell";
import v3Css from "@/styles/ridge-v3.css?url";

/** Ridge v3 preview ("almanac" design). Reads the catalog only; writes nothing. */
export const Route = createFileRoute("/v3")({
  component: V3Layout,
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
    links: [
      { rel: "stylesheet", href: v3Css },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400..800&family=Geist+Mono:wght@400..600&display=swap",
      },
    ],
  }),
});

function V3Layout() {
  return (
    <Shell>
      <AnalyticsBeacon />
      <Outlet />
    </Shell>
  );
}
