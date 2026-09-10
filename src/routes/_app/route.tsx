import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AnalyticsBeacon } from "@/components/admin/analytics-beacon";
import { SiteShell } from "@/components/new/shell";

export const Route = createFileRoute("/_app")({
  component: NewLayout,
});

function NewLayout() {
  return (
    <SiteShell>
      <AnalyticsBeacon />
      <Outlet />
    </SiteShell>
  );
}
