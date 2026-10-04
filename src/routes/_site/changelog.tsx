import { createFileRoute } from "@tanstack/react-router";
import { Linkify } from "@/components/v3/linkify";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { CHANGELOG } from "@/lib/data/changelog";
import { nextPullLabel } from "@/lib/data/ledger";

export const Route = createFileRoute("/_site/changelog")({
  component: Changelog,
  head: () => ({ meta: [{ title: "Changelog | Ridge" }] }),
});

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function Changelog() {
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Audit trail</div>
        <h1>Changelog</h1>
        <p className="dek">Every number that has moved on this ledger, and why. Current snapshot {SNAPSHOT_LABEL}; next scheduled pull <span className="rx-num">{nextPullLabel()}</span>.</p>
      </header>
      <ol className="rx-log">
        {CHANGELOG.map((e, i) => (
          <li key={`${e.date}-${e.title}`} className={i === 0 ? "latest" : undefined}>
            <time className="rx-num">{fmt(e.date)}</time>
            <div>
              <h2>{e.title}</h2>
              <ul>{e.items.map((it) => <li key={it}><Linkify text={it} /></li>)}</ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
