import { createFileRoute } from "@tanstack/react-router";
import { NEWS, isFresh } from "@/lib/data/desk";
import { WIRE } from "@/lib/data/wire";

export const Route = createFileRoute("/_site/news/")({
  component: News,
  head: () => ({ meta: [{ title: "News | Ridge" }] }),
});

const fmt = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

function News() {
  const notes = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const wire = [...WIRE].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = notes;
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">The desk</div>
        <h1>News</h1>
        <p className="dek">Ridge’s own notes on what moved on the boards, and the wire of everything sourced around them. Notes link to live scores, so they stay current after the fact.</p>
      </header>
      <div className="rx-desk" style={{ paddingTop: 20 }}>
        <div>
          {lead && (
            <a className="rx-story lead rx-in" href={`/news/${lead.id}`}>
              <span className="rx-kicker">{fmt(lead.date)} · {lead.kind}{isFresh(lead.date) ? " · new" : ""}</span>
              <h3>{lead.title}</h3>
              <p>{lead.dek}</p>
              {lead.pull && <blockquote className="rx-pull">{lead.pull}</blockquote>}
            </a>
          )}
          {rest.map((n, i) => (
            <a key={n.id} className="rx-story rx-in" href={`/news/${n.id}`} style={{ "--d": `${Math.min(i, 8) * 40}ms` } as React.CSSProperties}>
              <span className="rx-kicker">{fmt(n.date)} · {n.kind}{isFresh(n.date) ? " · new" : ""}</span>
              <h3>{n.title}</h3>
              <p>{n.dek}</p>
            </a>
          ))}
        </div>
        <div className="rx-wire">
          <div className="rx-kicker" style={{ padding: "20px 0 4px" }}>The wire · {wire.length} items</div>
          {wire.map((w) => (
            <a key={w.id} href={w.url} target="_blank" rel="noreferrer">
              <span className="d">{fmt(w.date).replace(/ \d{4}$/, "")}</span>
              <span><span className="t">{w.title}</span><div className="o">{w.outlet} · {w.beat}</div></span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
