import type { Pick } from "@/lib/data/best";
import { labVar } from "./shell";

const date = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/** One "Best for…" pick: the leader(s) of a single board, who's close behind, and the source. */
export function BestCard({ pick, i = 0, full = false }: { pick: Pick; i?: number; full?: boolean }) {
  const lead = pick.leaders[0];
  const joint = pick.leaders.length > 1;
  return (
    <article id={full ? pick.id : undefined} className={`rx-best rx-in${full ? " full" : ""}${pick.stale ? " stale" : ""}`} style={{ "--d": `${i * 60}ms`, "--c": labVar(lead.model.lab) } as React.CSSProperties}>
      <div className="rx-kicker lbl">{pick.label}{pick.stale && <span className="old">Out of date</span>}</div>
      {full && <p className="q">{pick.question}</p>}
      <div className="win">
        <div className="who">
          {joint && <span className="joint">Joint</span>}
          {pick.leaders.map((l, k) => (
            <a key={l.model.id} href={`/models/${l.model.id}`} style={{ "--c": labVar(l.model.lab) } as React.CSSProperties}>
              <i />{l.model.name}{k < pick.leaders.length - 1 ? <span className="amp">&amp;</span> : null}
            </a>
          ))}
        </div>
        <div className="val rx-num">{lead.value}</div>
      </div>
      {pick.behind.length > 0 && (
        <div className="behind">
          <span className="rx-faint">{full ? "Close behind" : "Next"}</span>
          {(full ? pick.behind : pick.behind.slice(0, 1)).map((b) => (
            <a key={b.model.id} href={`/models/${b.model.id}`}>{b.model.name} <span className="rx-num">{b.value}</span></a>
          ))}
        </div>
      )}
      {full && pick.leaderNote && !pick.stale && <p className="note">{lead.model.name}: {pick.leaderNote}</p>}
      {full && pick.caveat && <p className="cav">{pick.caveat}</p>}
      {full ? (
        <div className="src">
          {pick.href ? <a href={pick.href}>{pick.basis}</a> : <span>{pick.basis}</span>}
          <span>
            {pick.sourceUrl ? <a href={pick.sourceUrl} target="_blank" rel="noreferrer">{pick.sourceName}</a> : pick.sourceName}
            {pick.asOf ? ` · ${date(pick.asOf)}` : ""}
            {` · ${pick.measured} of ${pick.total} measured`}
          </span>
        </div>
      ) : (
        <div className="src short">
          {pick.href ? <a href={pick.href}>{pick.basis}</a> : <span>{pick.basis}</span>}
        </div>
      )}
      {!full && pick.caveat && <a className="flag" href={`/best#${pick.id}`} title={pick.caveat} aria-label={`Caveat: ${pick.caveat}`}>!</a>}
    </article>
  );
}
