import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { AA_VERSION, CATALOG_STATS } from "@/lib/data/derived";
import type { LabId } from "@/lib/data/types";

/** Lab colours come from CSS so they re-tune for paper vs night. */
export const labVar = (lab: LabId | undefined) => `var(--lab-${lab ?? "other"})`;

const NAV: { to: string; label: string }[] = [
  { to: "/", label: "Ledger" },
  { to: "/best", label: "Best for" },
  { to: "/models", label: "Models" },
  { to: "/compare", label: "Compare" },
  { to: "/benchmarks", label: "Benchmarks" },
  { to: "/labs", label: "Labs" },
  { to: "/news", label: "News" },
  { to: "/methodology", label: "Method" },
];

type Theme = "night" | "paper";

/** Navy ("night") is the house style; "paper" is the daylight edition. */
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("night");
  useEffect(() => {
    try {
      if (localStorage.getItem("ridge.theme") === "paper") setTheme("paper");
    } catch {
      /* private mode */
    }
  }, []);
  const toggle = () => {
    const next: Theme = theme === "paper" ? "night" : "paper";
    setTheme(next);
    try {
      localStorage.setItem("ridge.theme", next);
    } catch {
      /* private mode */
    }
  };
  return [theme, toggle];
}

function today(): string {
  return new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function Shell({ children }: { children: ReactNode }) {
  const [theme, toggleTheme] = useTheme();
  const [stuck, setStuck] = useState(false);
  const [date, setDate] = useState("");
  const plate = useRef<HTMLDivElement>(null);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setDate(today());
    const el = plate.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="rx" data-theme={theme}>
      <div className="rx-top">
        <div className="rx-wrap">
          <span suppressHydrationWarning>{date || " "}</span>
          <span className="live">
            <i /> Snapshot {SNAPSHOT_LABEL}<span className="wide"> · AA Index {AA_VERSION} · {CATALOG_STATS.models} models</span>
          </span>
        </div>
      </div>

      <header className="rx-plate" ref={plate}>
        <div className="rx-wrap">
          <Link to="/" className="name" aria-label="Ridge front page">
            Ridge<em>.</em>
          </Link>
          <div className="motto">The frontier, scored. Every number sourced, every blank on purpose.</div>
          <div className="rx-rules" />
        </div>
      </header>

      <nav className={`rx-nav${stuck ? " stuck" : ""}`} aria-label="Sections">
        <div className="rx-wrap">
          <Link to="/" className="mini" tabIndex={stuck ? 0 : -1}>
            Ridge
          </Link>
          <div className="links">
            {NAV.map((n) => {
              const on = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <a key={n.to} href={n.to} className={on ? "on" : undefined}>
                  {n.label}
                </a>
              );
            })}
          </div>
          <div className="spacer" />
          <button type="button" className="rx-theme" onClick={toggleTheme} aria-label="Switch paper / night edition">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor" />
            </svg>
            <span>{theme === "paper" ? "Night" : "Daylight"}</span>
          </button>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="rx-foot">
        <div className="rx-wrap cols">
          <div>
            <div className="big">Ridge.</div>
            <p style={{ maxWidth: "34em", marginTop: 12 }}>
              An independent cut of Artificial Analysis, Vals, CursorBench, Arena and Terminal-Bench. Every number links
              to where it was published and the date it was read. Where nobody has published a score, the cell stays
              empty. An empty cell is a finding, not a gap.
            </p>
          </div>
          <div>
            <div className="rx-kicker">Read</div>
            <ul>
              <li><a href="/methodology">How the ledger is built</a></li>
              <li><a href="/changelog">Changelog</a></li>
              <li><a href="/news">News desk</a></li>
            </ul>
          </div>
          <div>
            <div className="rx-kicker">Cite</div>
            <ul>
              <li><a href="/api">API &amp; downloads</a></li>
              <li><a href="/api/ledger.csv">ledger.csv</a></li>
              <li><a href="/llms.txt">llms.txt</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
