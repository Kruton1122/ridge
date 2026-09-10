import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/new/shell";

export const Route = createFileRoute("/_app")({
  component: NewLayout,
});

function NewLayout() {
  return (
    <SiteShell>
      <Outlet />
    </SiteShell>
  );
}
