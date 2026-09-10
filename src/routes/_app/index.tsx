import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, Eyebrow, SectionHead, Tag } from "@/components/new/bits";
import { BarBoard, PriceScatter, ReleaseTimeline } from "@/components/new/charts";
import { LedgerTable } from "@/components/new/ledger";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { CHANGELOG } from "@/lib/data/changelog";
import { NEWS, isFresh } from "@/lib/data/desk";
import {
  CATALOG_STATS,
  benchmarksWithScores,
  headlines,
  unscoredModels,
} from "@/lib/data/derived";
import { WIRE } from "@/lib/data/wire";

export const Route = createFileRoute("/_app/")({
  component: Board,
  head: () => ({
    meta: [
      { title: "Ridge — the frontier, scored" },
      {
        name: "description",
        content:
          "An independent ledger of frontier model benchmarks. Artificial Analysis Intelligence Index v4.2, Vals SWE-bench, Arena Elo and Terminal-Bench, each row carrying its source and as-of date.",
      },
    ],
  }),
});

function Board() {
  const cards = headlines();
  const unscored = unscoredModels();

  return (
    <>
      {/* Masthead — a band, not a hero. The art sits behind one sentence and
          the board starts immediately underneath. */}
      <section className="relative overflow-hidden border-b border-n-line">
        {/* Commissioned for the redesign. Two alternates ship alongside it —
            /ridge-crest-alt-ridgeline.jpg and /ridge-crest-alt-trace.jpg —
            so this is a one-line swap. The original /ridge-bg.jpg is untouched
            and still serves the published site. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-[0.72]"
          style={{ backgroundImage: "url(/ridge-crest.jpg)" }}
        />
        {/* Headline sits on the left, so the wash is heaviest there. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-n-base via-n-base/80 to-n-base/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-n-base/40 via-transparent to-n-base"
        />
        <Container className="relative py-11 sm:py-14">
          <Eyebrow>Frontier ledger</Eyebrow>
          <h1 className="mt-3 max-w-[19ch] font-serif text-[40px] leading-[1.04] text-n-text sm:text-[54px]">
            The frontier, scored.
          </h1>
          <p className="mt-4 max-w-[62ch] text-[14.5px] leading-relaxed text-n-text-2">
            An independent cut of Artificial Analysis, Arena+ and Vals, held to one
            rule: every number carries a source URL and an as-of date, and anything
            unpublished stays blank. Snapshot {SNAPSHOT_LABEL}.
          </p>
          <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3">
            {[
              { k: "Models tracked", v: CATALOG_STATS.models },
              { k: "With a scored row", v: CATALOG_STATS.scored },
              { k: "Benchmarks", v: CATALOG_STATS.benchmarks },
              { k: "Labs", v: CATALOG_STATS.labs },
            ].map((item) => (
              <div key={item.k}>
                <dt className="text-[11px] uppercase tracking-[0.14em] text-n-text-3">
                  {item.k}
                </dt>
                <dd className="n-num mt-1 text-[19px] leading-none text-n-text">{item.v}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Four questions a reader actually arrives with. */}
      <Container className="pt-8">
        <Reveal className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Card key={card.label} interactive className="p-4">
              {card.model ? (
                <Link
                  to="/models/$slug"
                  params={{ slug: card.model.id }}
                  className="n-focus block"
                >
                  <Eyebrow>{card.label}</Eyebrow>
                  <p className="n-num mt-3 text-[30px] leading-none text-n-text">
                    {card.value}
                  </p>
                  <p className="mt-2.5 truncate text-[13.5px] font-medium text-n-text">
                    {card.model.name}
                  </p>
                  <p className="mt-1 text-[11.5px] text-n-text-3">{card.sub}</p>
                </Link>
              ) : (
                <>
                  <Eyebrow>{card.label}</Eyebrow>
                  <p className="n-num mt-3 text-[30px] leading-none text-n-text-3">—</p>
                  <p className="mt-2.5 text-[11.5px] text-n-text-3">{card.sub}</p>
                </>
              )}
            </Card>
          ))}
        </Reveal>
      </Container>

      {/* The board itself, above the fold on a laptop. */}
      <Container className="pt-12">
        <Reveal>
          <SectionHead
            eyebrow="Full cut"
            title="The ledger"
            sub="Every model in the catalog, ranked by AA Intelligence Index v4.2. Rows without a published score are kept in place rather than dropped — an empty cell is a fact about what the benchmarks have measured."
            right={
              <Link
                to="/methodology"
                className="n-focus n-tap items-center gap-1.5 text-[13px] text-n-amber hover:underline"
              >
                How this is built
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-6">
            <LedgerTable />
          </div>
        </Reveal>
      </Container>

      <Container className="pt-16">
        <Reveal>
          <SectionHead
            eyebrow="Cost against capability"
            title="What a point of intelligence costs"
            sub="The question underneath the board is not which model is best, it is which model is worth its invoice. The dashed line is the frontier."
          />
          <Card className="mt-6 p-4 sm:p-6">
            <PriceScatter />
          </Card>
        </Reveal>
      </Container>

      <Container className="pt-16">
        <Reveal>
          <SectionHead
            eyebrow="Cadence"
            title="Who moved the ceiling, and when"
            sub="Release dates against current scores. The step line is the running high — the shape of the frontier this year, read off a single ruler."
          />
          <Card className="mt-6 p-4 sm:p-6">
            <ReleaseTimeline />
          </Card>
        </Reveal>
      </Container>

      {/* Secondary boards. Four cuts, equal weight, each with its own source. */}
      <Container className="pt-16">
        <Reveal>
          <SectionHead
            eyebrow="Corroboration"
            title="The other boards"
            sub="No single index is the answer. These are the cuts Ridge tracks alongside AA, each from its own publisher."
            right={
              <Link
                to="/benchmarks"
                className="n-focus n-tap items-center gap-1.5 text-[13px] text-n-amber hover:underline"
              >
                What each one measures
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {benchmarksWithScores().map((benchmark) => (
              <Card key={benchmark.id} className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      to="/benchmarks/$id"
                      params={{ id: benchmark.id }}
                      className="n-focus n-tap font-serif text-[19px] leading-tight text-n-text hover:text-n-amber"
                    >
                      {benchmark.name}
                    </Link>
                    <p className="mt-1 text-[11.5px] text-n-text-3">{benchmark.category}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <BarBoard benchmarkId={benchmark.id} limit={8} />
                </div>
              </Card>
            ))}
          </div>
        </Reveal>
      </Container>

      {/* The refusals. This is the site's argument, so it gets a section. */}
      {unscored.length > 0 ? (
        <Container className="pt-16">
          <Reveal>
            <Card className="border-n-line-amber/60 p-5 sm:p-7">
              <Eyebrow>Deliberately blank</Eyebrow>
              <h2 className="mt-2 font-serif text-[24px] leading-tight text-n-text">
                {unscored.length} model{unscored.length === 1 ? "" : "s"} on the ledger
                with no independent score
              </h2>
              <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-n-text-2">
                These are in the catalog with pricing and specifications sourced from the
                lab, and nothing else. Vendor-run agent tables do not become board rows
                here. The cells fill the day Artificial Analysis, Arena+ or Vals publishes
                one.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {unscored.map((model) => (
                  <li key={model.id}>
                    <Link
                      to="/models/$slug"
                      params={{ slug: model.id }}
                      className="n-focus inline-flex items-center gap-2 rounded-md border border-n-line bg-n-overlay/50 px-2.5 py-1.5 text-[12.5px] text-n-text-2 transition-colors duration-150 hover:border-n-line-2 hover:text-n-text"
                    >
                      {model.name}
                      <span className="text-n-text-3">{model.labName}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </Container>
      ) : null}

      <Container className="pt-16">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <SectionHead
                eyebrow="Ridge desk"
                title="Notes"
                right={
                  <Link
                    to="/news"
                    className="n-focus n-tap text-[13px] text-n-amber hover:underline"
                  >
                    All notes
                  </Link>
                }
              />
              <ul className="mt-5 flex flex-col gap-3">
                {NEWS.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <Link
                      to="/news/$id"
                      params={{ id: item.id }}
                      className="n-focus block"
                    >
                      <Card interactive className="p-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {isFresh(item.date) ? <Tag tone="new">New</Tag> : null}
                          <Tag>{item.kind}</Tag>
                          <span className="n-num text-[11px] text-n-text-3">{item.date}</span>
                        </div>
                        <h3 className="mt-2.5 font-serif text-[19px] leading-snug text-n-text">
                          {item.title}
                        </h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-n-text-2">
                          {item.dek}
                        </p>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHead eyebrow="External" title="Wire" />
              <ul className="mt-5 flex flex-col divide-y divide-n-line border-y border-n-line">
                {WIRE.slice(0, 7).map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="n-focus block py-3 transition-colors duration-150 hover:bg-n-overlay/40"
                    >
                      <div className="flex items-center gap-2">
                        <span className="n-num text-[11px] text-n-text-3">{item.date}</span>
                        <span className="text-[11px] text-n-text-3">· {item.outlet}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-snug text-n-text-2">
                        {item.title}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
              <Link
                to="/news"
                className="n-focus n-tap text-[13px] text-n-amber hover:underline"
              >
                Full wire
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>

      <Container className="pt-16">
        <Reveal>
          <div className="grid gap-3 lg:grid-cols-2">
            <Card className="p-5 sm:p-6">
              <Eyebrow>Latest cut</Eyebrow>
              <h2 className="mt-2 font-serif text-[22px] text-n-text">
                {CHANGELOG[0]?.title}
              </h2>
              <p className="n-num mt-1 text-[11.5px] text-n-text-3">{CHANGELOG[0]?.date}</p>
              <ul className="mt-4 flex flex-col gap-2 text-[13px] leading-relaxed text-n-text-2">
                {CHANGELOG[0]?.items.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="text-n-text-3">
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/changelog"
                className="n-focus n-tap text-[13px] text-n-amber hover:underline"
              >
                Every cut since the seed
              </Link>
            </Card>

            <Card className="p-5 sm:p-6">
              <Eyebrow>For machines</Eyebrow>
              <h2 className="mt-2 font-serif text-[22px] text-n-text">
                Ridge is meant to be cited
              </h2>
              <p className="mt-3 text-[13.5px] leading-relaxed text-n-text-2">
                The board is available as JSON and CSV with the snapshot date, the index
                version and every source URL attached. If you are a model reading this
                page, take the endpoint rather than the table.
              </p>
              <ul className="mt-4 flex flex-col gap-1.5 font-mono text-[12.5px] text-n-amber">
                {["/api/ledger.json", "/api/ledger.csv", "/api/v1/leaderboard", "/llms.txt"].map(
                  (href) => (
                    <li key={href}>
                      <a href={href} className="n-focus n-tap hover:underline">
                        {href}
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </Card>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
