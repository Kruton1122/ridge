import { createFileRoute, notFound } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import { MODELS, getBenchmark } from "@/lib/data/catalog";
import { board, formatValue } from "@/lib/data/derived";

export const Route = createFileRoute("/v3/benchmarks/$id")({
  component: Bench,
  loader: ({ params }) => {
    if (!getBenchmark(params.id)) throw notFound();
    return null;
  },
  head: ({ params }) => ({ meta: [{ title: `${getBenchmark(params.id)?.name ?? "Benchmark"} — Ridge` }] }),
});

function Bench() {
  const { id } = Route.useParams();
  const b = getBenchmark(id)!;
  const rows = board(id);
  const missing = MODELS.filter((m) => !rows.some((r) => r.model.id === m.id));
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">{b.category} · published by {b.sourceName} · as of {b.asOf}</div>
        <h1>{b.name}</h1>
        <p className="dek">{b.description}</p>
        <p style={{ marginTop: 14 }}><a className="rx-link" href={b.sourceUrl} target="_blank" rel="noreferrer">The live board at {b.sourceName} →</a></p>
      </header>
      <section className="rx-sec">
        <div className="rx-sec-head">
          <div><div className="rx-kicker">{rows.length} of {MODELS.length} catalogued models</div><h2>The board</h2></div>
          <p>Competition ranking: equal scores share a rank, because the publisher didn’t separate them.</p>
        </div>
        <ol className="rx-board">
          {rows.map((r, i) => (
            <li key={r.model.id} style={{ "--c": labVar(r.model.lab), "--i": Math.min(i, 30), "--w": r.share } as React.CSSProperties}>
              <span className="rk rx-num">{r.tied ? "=" : ""}{r.rank}</span>
              <a className="nm" href={`/v3/models/${r.model.id}`}><i />{r.model.name}<span>{r.model.labName}</span></a>
              <span className="bar"><b /></span>
              <a className="v rx-num" href={r.score.sourceUrl} target="_blank" rel="noreferrer" title={`as of ${r.score.asOf}`}>{formatValue(b, r.score.value)}</a>
            </li>
          ))}
        </ol>
      </section>
      {missing.length > 0 && (
        <section className="rx-sec">
          <div className="rx-sec-head">
            <div><div className="rx-kicker">Blanks, on purpose</div><h2>Not on this board</h2></div>
            <p>{b.sourceName} hasn’t published a row for these. Ridge leaves them blank rather than estimate.</p>
          </div>
          <div className="rx-sib" style={{ marginTop: 16 }}>
            {missing.map((m) => <a key={m.id} href={`/v3/models/${m.id}`}>{m.name}</a>)}
          </div>
        </section>
      )}
    </div>
  );
}
