import { Outlet, createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/new/shell";

/** Archive of the 2026-09-10 design, replaced by v3 on 2026-10-03. Links inside it lead to the live site. */
export const Route = createFileRoute("/v2")({
  component: ArchiveLayout,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
});

function ArchiveLayout() {
  return (
    <SiteShell>
      <div className="border-b border-n-line bg-n-overlay px-4 py-2.5 text-center text-[12.5px] text-n-text-2">
        Archived design (September 2026). Numbers are live, but links lead to the current site.{" "}
        <a href="/" className="text-n-amber hover:underline">Go to the current Ridge</a>
      </div>
      <Outlet />
    </SiteShell>
  );
}
