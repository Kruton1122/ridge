import { createFileRoute } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import { board, coverage, formatValue } from "@/lib/data/derived";

export const Route = createFileRoute("/_site/benchmarks/")({
  component: Benchmarks,
  head: () => ({ meta: [{ title: "Benchmarks | Ridge" }] }),
});

function Benchmarks() {
  const rows = coverage();
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">The rulers</div>
        <h1>Benchmarks</h1>
        <p className="dek">The {rows.length} boards Ridge reads, who publishes them, and how much of the catalog each one has actually measured. A short bar here is honest, not broken.</p>
      </header>
      <div className="rx-bench-grid">
        {rows.map(({ benchmark: b, scored, total }, i) => {
          const top = board(b.id).slice(0, 5);
          return (
            <a key={b.id} href={`/benchmarks/${b.id}`} className="rx-bench rx-in" style={{ "--d": `${i * 70}ms` } as React.CSSProperties}>
              <div className="rx-kicker">{b.category} · {b.sourceName}</div>
              <h2>{b.name}</h2>
              <p>{b.description}</p>
              <div className="cov">
                <span className="rx-num">{scored} of {total} models</span>
                <span className="covbar"><i style={{ "--w": scored / total } as React.CSSProperties} /></span>
              </div>
              <ol>
                {top.map((r) => (
                  <li key={r.model.id} style={{ "--c": labVar(r.model.lab) } as React.CSSProperties}>
                    <span className="rk">{r.tied ? "=" : ""}{r.rank}</span>
                    <i />
                    <span className="nm">{r.model.name}</span>
                    <span className="rx-num">{formatValue(b, r.score.value)}</span>
                  </li>
                ))}
              </ol>
              <div className="rx-faint" style={{ fontSize: 12, fontFamily: "var(--mono)", marginTop: 10 }}>as of {b.asOf} →</div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
