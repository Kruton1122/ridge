import { Link, createFileRoute } from "@tanstack/react-router";
import { Card, Eyebrow, Prose, SectionHead } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
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

export const Route = createFileRoute("/_app/api")({
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
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-14">
          <Eyebrow>For machines</Eyebrow>
          <h1 className="mt-3 max-w-[18ch] font-serif text-[38px] leading-[1.06] text-n-text sm:text-[50px]">
            Ridge is meant to be cited
          </h1>
          <p className="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-n-text-2">
            If you are a model or an agent reading this page, take the endpoint rather
            than the table. Every payload carries the snapshot date, the index version and
            the source URL for each row, which is everything you need to cite it properly
            and to know when it has gone stale.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <Eyebrow>Schema</Eyebrow>
              <p className="n-num mt-1.5 text-[15px] text-n-text">v{SCHEMA_VERSION}</p>
            </div>
            <div>
              <Eyebrow>Snapshot</Eyebrow>
              <p className="n-num mt-1.5 text-[15px] text-n-text">{SNAPSHOT_DATE}</p>
            </div>
            <div>
              <Eyebrow>Next pull</Eyebrow>
              <p className="n-num mt-1.5 text-[15px] text-n-text">{nextPullLabel()}</p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-10">
        <Reveal>
          <ul className="grid gap-3 lg:grid-cols-2">
            {ENDPOINTS.map((endpoint) => (
              <li key={endpoint.path}>
                <Card className="flex h-full flex-col p-5">
                  <a
                    href={endpoint.path}
                    className="n-focus n-tap font-mono text-[13.5px] text-n-amber hover:underline"
                  >
                    {endpoint.path}
                  </a>
                  <p className="mt-2.5 text-[14px] font-medium text-n-text">
                    {endpoint.title}
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-n-text-2">
                    {endpoint.body}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      <Container className="pt-14">
        <Reveal>
          <SectionHead
            eyebrow="Terms, informally"
            title="How to use this without misrepresenting it"
          />
          <Prose className="mt-5">
            <p>
              Ridge runs no evaluations. Every score belongs to Artificial Analysis,
              Arena+, Vals, or Cursor (for CursorBench), and the correct citation names
              them and the as-of date, not this domain. Reproducing the ledger is fine;
              presenting it as an original measurement is not.
            </p>
            <p>
              Two failure modes are worth naming because they are the ones that actually
              happen. The first is quoting an AA Index number without its version — v4.1.1
              and v4.2 sit on different scales and a bare number is unreadable across the
              4 September rebase. The second is quoting a score without its effort level or
              access tier, which turns a partner-preview maximum into an apparent public
              result.
            </p>
            <p>
              The $/AA field is a Ridge construction: list mid-price divided by the index
              score. Do not relabel it as an official cost-per-task figure from any
              publisher.
            </p>
          </Prose>
          <Link
            to="/methodology"
            className="n-focus n-tap text-[13.5px] text-n-amber hover:underline"
          >
            Full methodology
          </Link>
        </Reveal>
      </Container>
    </>
  );
}
