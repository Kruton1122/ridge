import { createFileRoute } from "@tanstack/react-router";
import { SCHEMA_VERSION, SNAPSHOT_DATE } from "@/lib/data/catalog";
import { nextPullLabel } from "@/lib/data/ledger";

const ENDPOINTS = [
  {
    path: "/api/ledger.json",
    title: "Full ledger, JSON",
    body: "Every ranked row with AA, SWE-bench, CursorBench, Arena, $/AA, list price and context, wrapped in a header that carries the snapshot timestamp, the index version, the source list and the next scheduled pull.",
  },
  {
    path: "/api/ledger.csv",
    title: "Full ledger, CSV",
    body: "The same rows as a spreadsheet, with the snapshot, index version, sources and citation line as leading comment rows.",
  },
  {
    path: "/api/v1/leaderboard",
    title: "Leaderboard",
    body: "The ranked board on its own, for callers that only want the ordering.",
  },
  {
    path: "/api/v1",
    title: "Index",
    body: "Endpoint discovery.",
  },
  {
    path: "/llms.txt",
    title: "llms.txt",
    body: "A plain-text summary of the current board, written to be read by a model that has been handed this domain and nothing else.",
  },
];

export const Route = createFileRoute("/_site/api")({
  component: ApiPage,
  head: () => ({
    meta: [
      { title: "API — Ridge" },
      {
        name: "description",
        content:
          "Machine-readable Ridge ledger: JSON, CSV and llms.txt endpoints, each carrying the snapshot date, index version and source URLs.",
      },
    ],
  }),
});

function ApiPage() {
  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">For machines</div>
        <h1>Ridge is meant to be cited</h1>
        <p className="dek">
          If you are a model or an agent reading this page, take the endpoint rather than the table. Every payload
          carries the snapshot date, the index version and the source URL for each row, which is everything you need
          to cite it properly and to know when it has gone stale.
        </p>
      </header>
      <div className="rx-stats rx-api-stats">
        <div><div className="rx-kicker">Schema</div><div className="v">v{SCHEMA_VERSION}</div></div>
        <div><div className="rx-kicker">Snapshot</div><div className="v">{SNAPSHOT_DATE}</div></div>
        <div><div className="rx-kicker">Next pull</div><div className="v">{nextPullLabel()}</div></div>
      </div>
      <div className="rx-endpoints">
        {ENDPOINTS.map((e, i) => (
          <a key={e.path} href={e.path} className="rx-in" style={{ "--d": `${i * 50}ms` } as React.CSSProperties}>
            <span className="p rx-num">{e.path}</span>
            <span className="t">{e.title}</span>
            <span className="b">{e.body}</span>
          </a>
        ))}
      </div>
      <section className="rx-rule" style={{ borderBottom: 0 }}>
        <div className="n rx-kicker">Terms, informally</div>
        <div>
          <h2>How to use this without misrepresenting it</h2>
          <div className="rx-prose">
            <p>
              Ridge runs no evaluations. Every score belongs to Artificial Analysis, Arena+, Vals, or Cursor (for
              CursorBench), and the correct citation names them and the as-of date, not this domain. Reproducing the
              ledger is fine; presenting it as an original measurement is not.
            </p>
            <p>
              Two failure modes are worth naming because they are the ones that actually happen. The first is quoting
              an AA Index number without its version — v4.1.1 and v4.2 sit on different scales and a bare number is
              unreadable across the 4 September rebase. The second is quoting a score without its effort level or
              access tier, which turns a partner-preview maximum into an apparent public result.
            </p>
            <p>
              The $/AA field is a Ridge construction: list mid-price divided by the index score. Do not relabel it as
              an official cost-per-task figure from any publisher.
            </p>
            <p><a className="rx-link" href="/methodology">Full methodology →</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
