import { createFileRoute } from "@tanstack/react-router";
import { BestCard } from "@/components/v3/bestcard";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { bestPicks } from "@/lib/data/best";

export const Route = createFileRoute("/_site/best")({
  component: Best,
  head: () => ({
    meta: [
      { title: "Best for… — Ridge" },
      { name: "description", content: "The best model for coding, agents, cyber security, value, open weights and more — each pick is the top of one published board, with its source and date." },
    ],
  }),
});

function Best() {
  const picks = bestPicks();
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Quick answers · {SNAPSHOT_LABEL}</div>
        <h1>Best for…</h1>
        <p className="dek">
          Each pick is simply the top of one published board — Ridge never blends boards into a score of its own. Ties
          name every co-leader, and where a board has only measured a few models, the card says so.
        </p>
      </header>
      <div className="rx-best-grid full">
        {picks.map((p, i) => <BestCard key={p.id} pick={p} i={i} full />)}
      </div>
      <p className="rx-table-note" style={{ marginTop: 22 }}>
        “Best” means best on that board, at the effort level the publisher tested. A model missing from a card may simply
        not have been measured yet — see <a className="rx-link" href="/benchmarks">Benchmarks</a> for coverage.
      </p>
    </div>
  );
}
