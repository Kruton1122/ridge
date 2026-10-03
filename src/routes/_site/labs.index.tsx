import { createFileRoute } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import { labStats } from "@/lib/data/derived";

export const Route = createFileRoute("/_site/labs/")({
  component: Labs,
  head: () => ({ meta: [{ title: "Labs — Ridge" }] }),
});

function Labs() {
  const labs = labStats("promo");
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Who builds the frontier</div>
        <h1>Labs</h1>
        <p className="dek">{labs.length} labs, ordered by their best AA Index score. Each page shows that lab’s ridge, every model it has on the ledger, and where its cheapest point sits.</p>
      </header>
      <div className="rx-labs">
        {labs.map((l, i) => (
          <a key={l.lab} href={`/labs/${l.lab}`} className="rx-lab rx-in" style={{ "--c": labVar(l.lab), "--d": `${i * 50}ms` } as React.CSSProperties}>
            <span className="pos rx-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="nm"><i />{l.name}</span>
            <span className="cell"><span className="rx-kicker">Best</span><b className="rx-num">{l.bestAa ? l.bestAa.score.value : "—"}</b><span className="rx-faint">{l.bestAa?.model.name ?? "no AA row"}</span></span>
            <span className="cell"><span className="rx-kicker">Models</span><b className="rx-num">{l.models.length}</b><span className="rx-faint">{l.scored} scored · {l.openWeights} open</span></span>
            <span className="cell"><span className="rx-kicker">Cheapest point</span><b className="rx-num">{l.cheapestPerAa ? `$${l.cheapestPerAa.dollarPerAa.toFixed(2)}` : "—"}</b><span className="rx-faint">{l.cheapestPerAa?.model.name ?? "needs price + score"}</span></span>
            <span className="go" aria-hidden="true">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
