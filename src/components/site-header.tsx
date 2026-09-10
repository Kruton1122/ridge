import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RidgeMark } from "@/components/ridge-mark";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/old", label: "Ledger" },
  { to: "/old/news", label: "News" },
  { to: "/old/source", label: "For models" },
] as const;

export function SiteHeader({ current }: { current?: "home" | "news" | "source" }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const showBack = path !== "/old" && path !== "/old/";

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/80 backdrop-blur-md">
      <div className="border-b border-border/80 bg-raised/80 px-4 py-1.5 text-center text-[11px] text-muted sm:px-6">
        Archived September 2026 site.{" "}
        <Link to="/" className="text-primary hover:underline">
          Current ledger
        </Link>
      </div>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {showBack ? (
            <Link to="/old" className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg">
              <ArrowLeft className="size-4" />
              Ledger
            </Link>
          ) : null}
          <Link to="/old" className="flex items-center gap-2.5 text-fg">
            <RidgeMark className="size-6 shrink-0 rounded-md" />
            <span className="font-serif text-[1.35rem] tracking-tight">Ridge</span>
          </Link>
        </div>
        <nav className="flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const active =
              (item.to === "/old" && current === "home") ||
              (item.to === "/old/news" && current === "news") ||
              (item.to === "/old/source" && current === "source");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm",
                  active ? "bg-raised text-fg" : "text-muted hover:text-fg",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
