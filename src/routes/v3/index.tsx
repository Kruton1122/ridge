import { createFileRoute } from "@tanstack/react-router";
import { Ledger } from "@/components/v3/ledger";
import { Ridgeline } from "@/components/v3/ridgeline";
import { CostScatter } from "@/components/v3/scatter";
import { labVar } from "@/components/v3/shell";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { NEWS } from "@/lib/data/desk";
import { CATALOG_STATS, board, headlines, scatter, unscoredModels } from "@/lib/data/derived";
import { WIRE } from "@/lib/data/wire";

export const Route = createFileRoute("/v3/")({
  component: FrontPage,
  head: () => ({ meta: [{ title: "Ridge — the frontier, scored" }] }),
});

const shortDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function FrontPage() {
  const aa = board("aa-intelligence");
  const top = aa[0];
  const joint = aa.filter((r) => r.score.value === top?.score.value);
  const runner = aa.find((r) => r.score.value < (top?.score.value ?? 0));
  const answers = headlines("promo");
  const frontier = scatter("promo").filter((p) => p.frontier).sort((a, b) => a.dollarPerAa - b.dollarPerAa);
  const news = [...NEWS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
  const wire = [...WIRE].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  return (
    <>
      <div className="rx-wrap">
        <section className="rx-front">
          <div className="rx-in">
            <div className="rx-kicker">The ledger · {SNAPSHOT_LABEL}</div>
            {top && (
              <h1>
                {joint.length > 1 ? (
                  <>
                    <em>{joint.map((j) => j.model.name).join(" and ")}</em> share the top of the ridge at {top.score.value}.
                  </>
                ) : (
                  <>
                    <em>{top.model.name}</em> holds the top of the ridge at {top.score.value}
                    {runner ? <>, {top.score.value - runner.score.value} clear of {runner.model.name}</> : null}.
                  </>
                )}
              </h1>
            )}
            <p className="dek">
              {CATALOG_STATS.models} frontier models from {CATALOG_STATS.labs} labs, measured on {CATALOG_STATS.benchmarks}{" "}
              independent boards. Ridge doesn’t run its own evals and doesn’t estimate: it copies what Artificial Analysis,
              Vals, CursorBench, Arena and Terminal-Bench publish, and links every number back to them.
            </p>
            <p className="rule-note">
              <b>The one rule:</b> every number carries a source and an as-of date, and anything unpublished stays blank.{" "}
              {unscoredModels().length > 0
                ? `${unscoredModels().length} catalogued model${unscoredModels().length === 1 ? " has" : "s have"} no independent score yet — they’re listed anyway.`
                : "Right now every catalogued model has at least one independent score."}
            </p>
          </div>
          <aside className="rx-answers rx-in" style={{ "--d": "120ms" } as React.CSSProperties} aria-label="Quick answers">
            <ul>
              {answers.map((a) => (
                <li key={a.label}>
                  <span className="rx-kicker q">{a.label}</span>
                  <span className="who">
                    {a.model ? <a href={`/v3/models/${a.model.id}`}>{a.model.name}</a> : "—"}
                  </span>
                  <span className="val">{a.value}</span>
                  <span className="sub">{a.sub}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        <section className="rx-sec" id="ridge">
          <div className="rx-sec-head">
            <div>
              <div className="rx-kicker">Fig. 1</div>
              <h2>The ridge</h2>
            </div>
            <p>
              Each line is one lab’s best model to date, stepping up whenever it shipped something better. Release date
              against today’s AA v4.2 score — one ruler, no back-dated numbers. Hover a ridge to isolate it.
            </p>
          </div>
          <Ridgeline />
        </section>

        <section className="rx-sec" id="ledger">
          <div className="rx-sec-head">
            <div>
              <div className="rx-kicker">Table 1</div>
              <h2>The ledger</h2>
            </div>
            <p>Ranked by AA Intelligence Index v4.2. Click any heading to re-sort; click a score for its source.</p>
          </div>
          <Ledger />
        </section>

        <section className="rx-sec" id="value">
          <div className="rx-sec-head">
            <div>
              <div className="rx-kicker">Fig. 2</div>
              <h2>What a point costs</h2>
            </div>
            <p>Mid list price per 1M tokens against AA Index. The dashed line is the frontier: nothing sits both left of it and above it.</p>
          </div>
          <div className="rx-two">
            <CostScatter />
            <ol className="rx-points">
              {frontier.slice(0, 5).map((p, i) => (
                <li key={p.model.id} className="rx-in" style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                  <span className="rx-kicker k">{i === 0 ? "Cheapest point on the frontier" : `Frontier · ${i + 1}`}</span>
                  <a className="w" href={`/v3/models/${p.model.id}`} style={{ color: labVar(p.model.lab) }}>{p.model.name}</a>
                  <span className="v">${p.dollarPerAa.toFixed(2)}</span>
                  <span className="s">AA {p.y} · ${p.x.toFixed(2)} mid per 1M tokens</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rx-sec" id="desk">
          <div className="rx-sec-head">
            <div>
              <div className="rx-kicker">From the desk</div>
              <h2>Notes &amp; wire</h2>
            </div>
            <p>Ridge’s own notes on what moved, and the wire of everything sourced this week.</p>
          </div>
          <div className="rx-desk">
            <div>
              {news.map((n) => (
                <a key={n.id} className="rx-story" href={`/v3/news/${n.id}`}>
                  <span className="rx-kicker">{shortDate(n.date)} · {n.kind}</span>
                  <h3>{n.title}</h3>
                  <p>{n.dek}</p>
                </a>
              ))}
            </div>
            <div className="rx-wire">
              <div className="rx-kicker" style={{ padding: "20px 0 4px" }}>The wire</div>
              {wire.map((w) => (
                <a key={w.id} href={w.url} target="_blank" rel="noreferrer">
                  <span className="d">{shortDate(w.date)}</span>
                  <span>
                    <span className="t">{w.title}</span>
                    <div className="o">{w.outlet}</div>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
