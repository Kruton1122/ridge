import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import type { ReactNode } from "react";
import { RidgeMark } from "@/components/ridge-mark";
import { CommandPalette } from "@/components/new/command-palette";
import { useCommandPalette, useShortcutLabel } from "@/components/new/use-command-palette";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { nextPullLabel } from "@/lib/data/ledger";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Ledger", match: (p: string) => p === "/" },
  { to: "/models", label: "Models", match: (p: string) => p.startsWith("/models") },
  { to: "/compare", label: "Compare", match: (p: string) => p.startsWith("/compare") },
  { to: "/benchmarks", label: "Benchmarks", match: (p: string) => p.startsWith("/benchmarks") },
  { to: "/news", label: "News", match: (p: string) => p.startsWith("/news") },
] as const;

const FOOTER_LINKS = [
  { to: "/methodology", label: "Methodology" },
  { to: "/changelog", label: "Changelog" },
  { to: "/labs", label: "Labs" },
  { to: "/api", label: "API" },
] as const;

/**
 * The snapshot chip. Freshness is the product on a ledger site, so the as-of
 * date stays on screen at every scroll position.
 */
function SnapshotChip({ className }: { className?: string }) {
  return (
    <Link
      to="/methodology"
      className={cn(
        "n-focus n-num inline-flex items-center gap-1.5 rounded border border-n-line-amber bg-n-amber/[0.06] px-2 py-1 text-[11px] text-n-amber transition-colors duration-150 hover:bg-n-amber/[0.12]",
        className,
      )}
      title={`Next scheduled pull ${nextPullLabel()}`}
    >
      <span className="size-1.5 rounded-full bg-n-amber" aria-hidden="true" />
      AA v4.2 · {SNAPSHOT_LABEL}
    </Link>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const palette = useCommandPalette();
  const shortcutLabel = useShortcutLabel();

  return (
    <div className="min-h-dvh bg-n-base text-n-text antialiased">
      <header className="sticky top-0 z-40 border-b border-n-line bg-n-base/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-4 px-4 sm:px-6">
          <Link from="/" to="/" className="n-focus flex shrink-0 items-center gap-2.5">
            <RidgeMark className="size-6 rounded" />
            <span className="font-serif text-[19px] leading-none tracking-tight">Ridge</span>
          </Link>

          <nav
            aria-label="Primary"
            className="-mx-1 flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {NAV.map((item) => {
              const active = item.match(path);
              return (
                <Link
                  key={item.to}
                  from="/"
                  to={item.to}
                  className={cn(
                    "n-focus shrink-0 rounded-md px-2.5 py-1.5 text-[13px] transition-colors duration-150",
                    active
                      ? "bg-n-overlay text-n-text"
                      : "text-n-text-2 hover:bg-n-overlay/60 hover:text-n-text",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <SnapshotChip className="hidden md:inline-flex" />
            <button
              type="button"
              onClick={() => palette.setOpen(true)}
              aria-label="Search Ridge"
              className="n-focus inline-flex h-8 items-center gap-2 rounded-md border border-n-line px-2 text-[12px] text-n-text-3 transition-colors duration-150 hover:border-n-line-2 hover:text-n-text-2"
            >
              <Search className="size-3.5" aria-hidden="true" />
              <kbd className="hidden font-sans text-[11px] sm:inline">{shortcutLabel}</kbd>
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-n-line">
        <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
                <RidgeMark className="size-5 rounded" />
                <span className="font-serif text-[17px] leading-none">Ridge</span>
              </div>
              <p className="mt-3 text-[12.5px] leading-relaxed text-n-text-3">
                An independent cut of Artificial Analysis, Arena+, and Vals. Every number
                on this site carries a source URL and an as-of date. Where a source has
                published nothing, the cell reads —.
              </p>
              <SnapshotChip className="mt-4" />
            </div>

            <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-[13px]" aria-label="Footer">
              {FOOTER_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="n-focus n-tap text-n-text-2 transition-colors duration-150 hover:text-n-text"
                >
                  {item.label}
                </Link>
              ))}
              <a href="/api/ledger.json" className="n-focus n-tap text-n-text-2 hover:text-n-text">
                ledger.json
              </a>
              <a href="/llms.txt" className="n-focus n-tap text-n-text-2 hover:text-n-text">
                llms.txt
              </a>
              <Link
                to="/old"
                className="n-focus n-tap text-n-text-2 transition-colors duration-150 hover:text-n-text"
              >
                Archived site
              </Link>
            </nav>
          </div>

          <p className="mt-10 border-t border-n-line pt-6 text-[11.5px] text-n-text-3">
            Ridge is not affiliated with any lab or benchmark operator. Scores belong to
            their publishers; cite them, not this page. Next scheduled pull{" "}
            <span className="n-num">{nextPullLabel()}</span>.
          </p>
        </div>
      </footer>

      <CommandPalette open={palette.open} onOpenChange={palette.setOpen} />
    </div>
  );
}

/** Standard page container. 1280px for boards, narrower for prose. */
export function Container({
  children,
  className,
  width = "wide",
}: {
  children: ReactNode;
  className?: string;
  width?: "wide" | "prose";
}) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6",
        width === "wide" ? "max-w-[1280px]" : "max-w-[760px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
