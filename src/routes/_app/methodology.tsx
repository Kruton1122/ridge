import { Link, createFileRoute } from "@tanstack/react-router";
import { Card, Eyebrow, Prose, SectionHead, SourceLine } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { CATALOG_STATS, benchmarksWithScores, coverage } from "@/lib/data/derived";
import { LEDGER_SOURCES, nextPullLabel } from "@/lib/data/ledger";

export const Route = createFileRoute("/_app/methodology")({
  component: Methodology,
  head: () => ({
    meta: [
      { title: "Methodology — Ridge" },
      {
        name: "description",
        content:
          "How the Ridge ledger is built: which sources it reads, what it refuses to publish, why index versions are never mixed, and what $/AA does and does not mean.",
      },
    ],
  }),
});

function Methodology() {
  const rows = coverage();

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-14">
          <Eyebrow>How this is built</Eyebrow>
          <h1 className="mt-3 max-w-[16ch] font-serif text-[38px] leading-[1.06] text-n-text sm:text-[50px]">
            Methodology
          </h1>
          <p className="mt-5 max-w-[68ch] text-[15px] leading-relaxed text-n-text-2">
            Ridge is a ledger, not a benchmark. It runs no evaluations of its own. Every
            score on this site was published by someone else, and the entire value of the
            site is that it says who, and when, on every row.
          </p>
        </Container>
      </section>

      <Container className="pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-12">
            <Reveal>
              <SectionHead eyebrow="Rule one" title="Nothing gets invented" />
              <Prose className="mt-5">
                <p>
                  If Artificial Analysis, Arena+ or Vals has not published a number for a
                  model, the cell reads — and stays that way. Not a zero, not an estimate
                  interpolated from a neighbouring model, not a figure lifted from the
                  lab's own launch post. Vendor-run agent tables are marketing with a
                  y-axis; they do not become board rows here.
                </p>
                <p>
                  This is why the ledger looks sparser than it could. Of{" "}
                  {CATALOG_STATS.models} models in the catalog, {CATALOG_STATS.scored}{" "}
                  carry a score on at least one board. The rest are listed with sourced
                  pricing and specifications and nothing else, because that is genuinely
                  all anyone has published about them.
                </p>
              </Prose>
            </Reveal>

            <Reveal>
              <SectionHead
                eyebrow="Rule two"
                title="Two rulers never share a bar"
                sub="The single most common way a benchmark site publishes something false."
              />
              <Prose className="mt-5">
                <p>
                  Artificial Analysis rebased its Intelligence Index from v4.1.1 to v4.2
                  on 4 September 2026 — AA-Briefcase and GDP.pdf added, a saturated GPQA
                  Diamond dropped, private held-out weight raised to 40%. Scores across
                  the whole board fell by roughly ten points overnight.
                </p>
                <p>
                  Nothing got worse. The instrument changed. A model reading 66 in August
                  and 53 in September is the same model measured two ways, and a chart
                  that draws a line between those two points is telling a story that did
                  not happen. Ridge does not draw that line, does not average the two, and
                  does not put them on one bar. Every chart on this site that spans time
                  is plotted entirely on v4.2.
                </p>
                <p>
                  The same discipline applies to effort levels. A score measured at max
                  effort and a score measured at high effort are different measurements of
                  different things, and they stay in separate rows with the variant noted.
                </p>
              </Prose>
            </Reveal>

            <Reveal>
              <SectionHead
                eyebrow="Rule three"
                title="A new version is a new row"
                sub="Grok 4 is not Grok 4.6. Spark xhigh is not Spark max."
              />
              <Prose className="mt-5">
                <p>
                  Every model keeps its own catalog id and a list of aliases. The aliases
                  exist for exactly one reason: the daily scrape matches scraped names
                  against the catalog by fuzzy match, and without version-aware aliases a
                  fuzzy match will happily fold a 46 belonging to an older Grok onto the
                  row for a newer one. That collapse has happened on this site before. The
                  alias lists are the fix.
                </p>
                <p>
                  It follows that the same underlying model published at two access tiers
                  gets two rows. Muse Spark 1.3 has a public xhigh row and a partner-preview
                  max row, and they carry different numbers. Quoting the max figure as
                  though a normal API key reaches it is a mistake the site is built to
                  prevent.
                </p>
              </Prose>
            </Reveal>

            <Reveal>
              <SectionHead
                eyebrow="Rule four"
                title="$/AA is a shelf tag, not an invoice"
              />
              <Prose className="mt-5">
                <p>
                  The $/AA column is list input price plus list output price, halved, then
                  divided by the AA Intelligence Index score. That is a Ridge construction
                  and nothing more. It is not Artificial Analysis's cost-per-task figure,
                  which is measured against real token counts on real evaluation runs and
                  is a far better number if you can get it.
                </p>
                <p>
                  The midpoint assumption is the weak part. Averaging input and output
                  price flatters anything with a wide spread between the two, and most
                  agentic workloads are output-heavy. Read $/AA as a way of sorting the
                  board, not as a forecast of your bill.
                </p>
              </Prose>
            </Reveal>

            <Reveal>
              <SectionHead
                eyebrow="The pipeline"
                title="What runs, and when"
              />
              <Prose className="mt-5">
                <p>
                  A scraper runs every morning against the published leaderboards, writes
                  what it found to a staging file, and a second pass applies it to the
                  catalog. That second pass can only update score rows that already exist —
                  it is not allowed to create a model. Adding a model to the catalog is a
                  deliberate act with a source attached, which is why a launch can appear
                  in the news section days before it appears on the board.
                </p>
                <p>
                  Where the scrape and a source disagree, the source wins and the
                  disagreement gets written down. The changelog is not decoration; it is
                  the audit trail for every number that has moved.
                </p>
              </Prose>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/changelog"
                  className="n-focus rounded-md border border-n-line px-3.5 py-2 text-[13px] text-n-text-2 transition-colors duration-150 hover:border-n-line-2 hover:text-n-text"
                >
                  Read the changelog
                </Link>
                <Link
                  to="/api"
                  className="n-focus rounded-md border border-n-line px-3.5 py-2 text-[13px] text-n-text-2 transition-colors duration-150 hover:border-n-line-2 hover:text-n-text"
                >
                  Machine endpoints
                </Link>
              </div>
            </Reveal>

            <Reveal>
              <SectionHead eyebrow="If you cite this" title="Cite the publisher, not the page" />
              <Prose className="mt-5">
                <p>
                  Ridge holds no scores of its own, so a citation that stops at this site
                  is a citation of a middleman. Take the source URL and the as-of date
                  printed beside the number and cite those. If a figure here disagrees with
                  the publisher's live page, the publisher is right and this snapshot is
                  stale — the next pull is {nextPullLabel()}.
                </p>
              </Prose>
            </Reveal>
          </div>

          <aside className="flex flex-col gap-3">
            <Card className="p-5">
              <Eyebrow>This snapshot</Eyebrow>
              <p className="n-num mt-2 text-[19px] text-n-text">{SNAPSHOT_LABEL}</p>
              <dl className="mt-4 flex flex-col gap-2.5 text-[12.5px]">
                {[
                  ["Models in catalog", CATALOG_STATS.models],
                  ["With a scored row", CATALOG_STATS.scored],
                  ["Benchmarks tracked", CATALOG_STATS.benchmarks],
                  ["Labs represented", CATALOG_STATS.labs],
                  ["Distinct source URLs", CATALOG_STATS.sources],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between gap-4">
                    <dt className="text-n-text-3">{label}</dt>
                    <dd className="n-num text-n-text-2">{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <Card className="p-5">
              <Eyebrow>Boards read</Eyebrow>
              <ul className="mt-3 flex flex-col gap-3">
                {benchmarksWithScores().map((benchmark) => (
                  <li key={benchmark.id}>
                    <Link
                      to="/benchmarks/$id"
                      params={{ id: benchmark.id }}
                      className="n-focus n-tap text-[13px] text-n-text-2 hover:text-n-amber"
                    >
                      {benchmark.name}
                    </Link>
                    {/* SourceLine is inline-flex; force a block so it does not
                        run on from the benchmark name above it. */}
                    <SourceLine
                      className="mt-0.5 flex w-fit"
                      name={benchmark.sourceName}
                      url={benchmark.sourceUrl}
                      asOf={benchmark.asOf}
                    />
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <Eyebrow>Coverage</Eyebrow>
              <ul className="mt-3.5 flex flex-col gap-3">
                {rows.map((row) => (
                  <li key={row.benchmark.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[12.5px] text-n-text-2">
                        {row.benchmark.short}
                      </span>
                      <span className="n-num shrink-0 text-[11.5px] text-n-text-3">
                        {row.scored}/{row.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-[4px] overflow-hidden rounded-full bg-n-overlay">
                      <div
                        className="n-bar h-full rounded-full bg-n-amber/70"
                        style={{ width: `${(row.scored / row.total) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5">
              <Eyebrow>Upstream</Eyebrow>
              <ul className="mt-3 flex flex-col gap-2 text-[12.5px]">
                {LEDGER_SOURCES.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="n-focus n-tap text-n-text-2 hover:text-n-amber"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </>
  );
}
