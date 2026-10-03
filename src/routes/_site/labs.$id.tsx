import { createFileRoute, notFound } from "@tanstack/react-router";
import { Ledger } from "@/components/v3/ledger";
import { Ridgeline } from "@/components/v3/ridgeline";
import { labVar } from "@/components/v3/shell";
import { NEWS } from "@/lib/data/desk";
import { labStats } from "@/lib/data/derived";
import type { LabId } from "@/lib/data/types";

export const Route = createFileRoute("/_site/labs/$id")({
  component: Lab,
  loader: ({ params }) => {
    if (!labStats().some((l) => l.lab === params.id)) throw notFound();
    return null;
  },
  head: ({ params }) => ({ meta: [{ title: `${labStats().find((l) => l.lab === params.id)?.name ?? "Lab"} — Ridge` }] }),
});

function Lab() {
  const { id } = Route.useParams();
  const all = labStats("promo");
  const l = all.find((x) => x.lab === id)!;
  const place = all.findIndex((x) => x.lab === id) + 1;
  const ids = new Set(l.models.map((m) => m.id));
  const news = NEWS.filter((n) => n.models.some((m) => ids.has(m))).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  return (
    <div className="rx-wrap" style={{ "--c": labVar(l.lab) } as React.CSSProperties}>
      <header className="rx-model-head rx-in">
        <div className="eyebrow rx-kicker"><i />Lab · {place === 1 ? "leads the ledger" : `${place} of ${all.length} by best score`}</div>
        <h1>{l.name}</h1>
        <p className="dek">
          {l.models.length} model{l.models.length === 1 ? "" : "s"} on the ledger, {l.scored} with an AA Index score
          {l.bestAa ? `; best is ${l.bestAa.model.name} at ${l.bestAa.score.value}` : ""}
          {l.openWeights ? `; ${l.openWeights} open-weight` : ""}.
        </p>
      </header>
      <section className="rx-sec">
        <div className="rx-sec-head"><div><div className="rx-kicker">Fig. 1</div><h2>{l.name}’s ridge</h2></div><p>Best model to date by release, on the same axes as the front page.</p></div>
        <Ridgeline only={l.lab as LabId} />
      </section>
      <section className="rx-sec">
        <div className="rx-sec-head"><div><div className="rx-kicker">Table 1</div><h2>Every {l.name} model</h2></div></div>
        <Ledger fixedLab={l.lab as LabId} />
      </section>
      {news.length > 0 && (
        <section className="rx-sec">
          <div className="rx-sec-head"><div><div className="rx-kicker">From the desk</div><h2>Recent notes</h2></div></div>
          <div>
            {news.map((n) => (
              <a key={n.id} className="rx-story" href={`/news/${n.id}`}>
                <span className="rx-kicker">{n.date} · {n.kind}</span>
                <h3>{n.title}</h3>
                <p>{n.dek}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
