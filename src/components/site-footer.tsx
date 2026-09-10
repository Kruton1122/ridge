import { Link } from "@tanstack/react-router";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>Ridge · seed {SNAPSHOT_LABEL}. Cite the source URL and the as-of date.</p>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-fg">
            Current ledger
          </Link>
          <Link to="/old/source" className="hover:text-fg">
            For models
          </Link>
          <a href="/api/v1/leaderboard" className="hover:text-fg">
            JSON
          </a>
          <a href="/llms.txt" className="hover:text-fg">
            llms.txt
          </a>
        </nav>
      </div>
    </footer>
  );
}
