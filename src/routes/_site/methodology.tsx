import { createFileRoute } from "@tanstack/react-router";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { CATALOG_STATS, benchmarksWithScores, coverage } from "@/lib/data/derived";
import { LEDGER_SOURCES, nextPullLabel } from "@/lib/data/ledger";

export const Route = createFileRoute("/_site/methodology")({
  component: Methodology,
  head: () => ({
    meta: [
      { title: "Methodology — Ridge" },
      { name: "description", content: "How the Ridge ledger is built: which sources it reads, what it refuses to publish, why index versions are never mixed, and what $/AA does and does not mean." },
    ],
  }),
});

const RULES: { n: string; title: string; sub?: string; body: (React.ReactNode)[] }[] = [
  {
    n: "Rule one",
    title: "Nothing gets invented",
    body: [
      <>If Artificial Analysis, Arena+, Vals, or Cursor has not published a number for a model on a board we track, the cell reads — and stays that way. Not a zero, not an estimate interpolated from a neighboring model, not a figure lifted from a lab launch post. CursorBench 4.0 is the one first-party harness we carry as its own column, labeled as Cursor’s; other vendor-run agent tables stay off the board.</>,
      <>This is why the ledger looks sparser than it could. Of {CATALOG_STATS.models} models in the catalog, {CATALOG_STATS.scored} carry a score on at least one board. The rest are listed with sourced pricing and specifications and nothing else, because that is genuinely all anyone has published about them.</>,
    ],
  },
  {
    n: "Rule two",
    title: "Two rulers never share a bar",
    sub: "The single most common way a benchmark site publishes something false.",
    body: [
      <>Artificial Analysis rebased its Intelligence Index from v4.1.1 to v4.2 on 4 September 2026 — AA-Briefcase and GDP.pdf added, a saturated GPQA Diamond dropped, private held-out weight raised to 40%. Scores across the whole board fell by roughly ten points overnight.</>,
      <>Nothing got worse. The instrument changed. A model reading 66 in August and 53 in September is the same model measured two ways, and a chart that draws a line between those two points is telling a story that did not happen. Ridge does not draw that line, does not average the two, and does not put them on one bar. Every chart on this site that spans time is plotted entirely on v4.2.</>,
      <>The same discipline applies to effort levels. A score measured at max effort and a score measured at high effort are different measurements of different things, and they stay in separate rows with the variant noted.</>,
    ],
  },
  {
    n: "Rule three",
    title: "A new version is a new row",
    sub: "Grok 4 is not Grok 4.6. Spark xhigh is not Spark max.",
    body: [
      <>Every model keeps its own catalog id and a list of aliases. The aliases exist for exactly one reason: the daily update matches source names against the catalog by fuzzy match, and without version-aware aliases a fuzzy match will happily fold a 46 belonging to an older Grok onto the row for a newer one. That collapse has happened on this site before. The alias lists are the fix.</>,
      <>It follows that the same underlying model published at two access tiers gets two rows. Muse Spark 1.3 has a public xhigh row and a partner-preview max row, and they carry different numbers. Quoting the max figure as though a normal API key reaches it is a mistake the site is built to prevent.</>,
    ],
  },
  {
    n: "Rule four",
    title: "$/AA is a shelf tag, not an invoice",
    body: [
      <>The $/AA column is list input price plus list output price, halved, then divided by the AA Intelligence Index score. That is a Ridge construction and nothing more. It is not Artificial Analysis’s cost-per-task figure, which is measured against real token counts on real evaluation runs and is a far better number if you can get it.</>,
      <>The midpoint assumption is the weak part. Averaging input and output price flatters anything with a wide spread between the two, and most agentic workloads are output-heavy. Read $/AA as a way of sorting the board, not as a forecast of your bill.</>,
    ],
  },
  {
    n: "The pipeline",
    title: "What runs, and when",
    body: [
      <>A scraper runs every morning against the published leaderboards, writes what it found to a staging file, and a second pass applies it to the catalog. That second pass can only update score rows that already exist — it is not allowed to create a model. Adding a model to the catalog is a deliberate act with a source attached, which is why a launch can appear in the news section days before it appears on the board.</>,
      <>Where the scrape and a source disagree, the source wins and the disagreement gets written down. The <a className="rx-link" href="/changelog">changelog</a> is not decoration; it is the audit trail for every number that has moved. Machine-readable copies live at the <a className="rx-link" href="/api">API page</a>.</>,
    ],
  },
  {
    n: "If you cite this",
    title: "Cite the publisher, not the page",
    body: [
      <>Ridge holds no scores of its own, so a citation that stops at this site is a citation of a middleman. Take the source URL and the as-of date printed beside the number and cite those. If a figure here disagrees with the publisher’s live page, the publisher is right and this snapshot is stale — the next pull is {nextPullLabel()}.</>,
    ],
  },
];

function Methodology() {
  const cov = coverage();
  const stats: [string, number][] = [
    ["Models in catalog", CATALOG_STATS.models],
    ["With a scored row", CATALOG_STATS.scored],
    ["Benchmarks tracked", CATALOG_STATS.benchmarks],
    ["Labs represented", CATALOG_STATS.labs],
    ["Distinct source URLs", CATALOG_STATS.sources],
  ];
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">How this is built</div>
        <h1>Methodology</h1>
        <p className="dek">Ridge is a ledger, not a benchmark. It runs no evaluations of its own. Every score on this site was published by someone else, and the entire value of the site is that it says who, and when, on every row.</p>
      </header>
      <div className="rx-method">
        <div>
          {RULES.map((r, i) => (
            <section key={r.n} className="rx-rule rx-in" style={{ "--d": `${Math.min(i, 3) * 60}ms` } as React.CSSProperties}>
              <div className="n rx-kicker">{r.n}</div>
              <div>
                <h2>{r.title}</h2>
                {r.sub && <p className="sub">{r.sub}</p>}
                <div className="rx-prose">{r.body.map((p, k) => <p key={k}>{p}</p>)}</div>
              </div>
            </section>
          ))}
        </div>
        <aside className="rx-side">
          <div className="box">
            <div className="rx-kicker">This snapshot</div>
            <div className="big rx-num">{SNAPSHOT_LABEL}</div>
            <dl>{stats.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className="rx-num">{v}</dd></div>)}</dl>
          </div>
          <div className="box">
            <div className="rx-kicker">Boards read · coverage</div>
            <ul className="boards">
              {benchmarksWithScores().map((b) => {
                const c = cov.find((x) => x.benchmark.id === b.id);
                return (
                  <li key={b.id}>
                    <a href={`/benchmarks/${b.id}`}>{b.name}</a>
                    <span className="rx-faint">{b.sourceName} · {b.asOf}{c ? ` · ${c.scored}/${c.total}` : ""}</span>
                    {c && <span className="covbar"><i style={{ "--w": c.scored / c.total } as React.CSSProperties} /></span>}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="box">
            <div className="rx-kicker">Upstream</div>
            <ul className="up">{LEDGER_SOURCES.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a></li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
