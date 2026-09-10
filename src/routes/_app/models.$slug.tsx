import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Minus } from "lucide-react";
import {
  Blank,
  Card,
  Eyebrow,
  LabDot,
  Prose,
  RankBadge,
  SectionHead,
  SourceLine,
  StatusPill,
  Tag,
} from "@/components/new/bits";
import { BarBoard, PriceScatter, ScoreRow } from "@/components/new/charts";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { getModel } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import { benchmarksWithScores, dossier, money, moneyPair } from "@/lib/data/derived";
import { LAB_THEME, profileFor } from "@/lib/data/profiles";
import { isFresh } from "@/lib/data/desk";

export const Route = createFileRoute("/_app/models/$slug")({
  component: ModelPage,
  head: ({ params }) => {
    const model = getModel(params.slug);
    return {
      meta: [
        { title: model ? `${model.name} — Ridge` : "Model not found — Ridge" },
        {
          name: "description",
          content: model?.summary ?? "This model is not in the current Ridge snapshot.",
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Container width="prose" className="py-24">
      <h1 className="font-serif text-[32px] text-n-text">Not in this snapshot</h1>
      <p className="mt-3 text-[14px] text-n-text-2">
        Ridge has no catalog row under that id. It may have been renamed, or it may
        never have had one.
      </p>
      <Link to="/models" className="n-focus n-tap text-[13.5px] text-n-amber hover:underline">
        Every model on the ledger
      </Link>
    </Container>
  ),
});

function ModelPage() {
  const { slug } = Route.useParams();
  const data = dossier(slug);
  if (!data) throw notFound();

  const { model } = data;
  const color = modelColor(model);
  const profile = profileFor(model);
  const theme = LAB_THEME[model.lab];

  return (
    <>
      {model.status !== "ga" ? (
        <div className="border-b border-n-line-amber bg-n-amber/[0.07]">
          <Container className="py-2.5">
            <p className="text-[12.5px] text-n-amber">
              {model.status === "partner"
                ? "Partner preview. This row is not what a normal API key reaches — cite the access status alongside the number."
                : model.status === "preview"
                  ? "Preview access. The public row may move when this reaches general availability."
                  : "Promotional pricing is live on this row. The list price is shown alongside it below."}
            </p>
          </Container>
        </div>
      ) : null}

      <section
        className="border-b border-n-line"
        style={{ background: `linear-gradient(180deg, ${color}14, transparent 70%)` }}
      >
        <Container className="py-10 sm:py-14">
          <div className="flex flex-wrap items-center gap-2.5">
            <LabDot model={model} className="size-2" />
            <Link
              to="/labs/$id"
              params={{ id: model.lab }}
              className="n-focus n-tap text-[12px] uppercase tracking-[0.14em] hover:underline"
              style={{ color }}
            >
              {model.labName}
            </Link>
            <span aria-hidden="true" className="text-n-text-3">
              ·
            </span>
            <span className="text-[12px] uppercase tracking-[0.14em] text-n-text-3">
              {profile.epithet}
            </span>
            <StatusPill status={model.status} />
            {model.license === "open-weight" ? <Tag>Open weights</Tag> : null}
          </div>

          <h1 className="mt-4 font-serif text-[40px] leading-[1.05] text-n-text sm:text-[52px]">
            {model.name}
          </h1>

          <p className="mt-4 max-w-[68ch] text-[15px] leading-relaxed text-n-text-2">
            {model.summary}
          </p>

          {/* The three numbers a reader came for, each with a denominator. */}
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
            <div>
              <Eyebrow>AA Intelligence</Eyebrow>
              {data.aa ? (
                <>
                  <p className="n-num mt-2 text-[32px] leading-none text-n-text">
                    {data.aa.value}
                  </p>
                  <RankBadge className="mt-2" rank={data.aa.rank} of={data.aa.of} tied={data.aa.tied} />
                </>
              ) : (
                <>
                  <p className="mt-2 text-[32px] leading-none">
                    <Blank />
                  </p>
                  <p className="mt-2 text-[11px] text-n-text-3">Not yet scored</p>
                </>
              )}
            </div>
            <div>
              <Eyebrow>Price per 1M</Eyebrow>
              <p className="n-num mt-2 text-[32px] leading-none text-n-text">
                {model.pricing ? money(model.pricing.inputPerM) : <Blank />}
                {model.pricing ? (
                  <span className="text-n-text-3"> / {money(model.pricing.outputPerM)}</span>
                ) : null}
              </p>
              <p className="mt-2 text-[11px] text-n-text-3">
                {model.promoPricing
                  ? `Promo ${moneyPair(model.promoPricing.inputPerM, model.promoPricing.outputPerM)} until ${model.promoPricing.until}`
                  : "List, input / output"}
              </p>
            </div>
            <div>
              <Eyebrow>Cost per index point</Eyebrow>
              <p className="n-num mt-2 text-[32px] leading-none text-n-text">
                {data.dollarPerAa != null ? `$${data.dollarPerAa.toFixed(2)}` : <Blank />}
              </p>
              {data.dollarPerAaRank ? (
                <RankBadge
                  className="mt-2"
                  rank={data.dollarPerAaRank.rank}
                  of={data.dollarPerAaRank.of}
                  tied={data.dollarPerAaRank.tied}
                />
              ) : (
                <p className="mt-2 text-[11px] text-n-text-3">Needs a score and a price</p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Specifications */}
      <Container className="pt-12">
        <Reveal>
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
            <Card className="p-5">
              <Eyebrow>Specification</Eyebrow>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[13.5px]">
                {[
                  ["Released", model.released],
                  ["Weights", model.license === "open-weight" ? "Open" : "Proprietary"],
                  ["Access", model.status.toUpperCase()],
                  [
                    "Context window",
                    model.contextTokens ? `${model.contextTokens.toLocaleString()} tokens` : null,
                  ],
                  [
                    "List price",
                    model.pricing
                      ? `${money(model.pricing.inputPerM)} in / ${money(model.pricing.outputPerM)} out per 1M`
                      : null,
                  ],
                  [
                    "Promotional price",
                    model.promoPricing
                      ? `${moneyPair(model.promoPricing.inputPerM, model.promoPricing.outputPerM)} through ${model.promoPricing.until}`
                      : null,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="contents">
                    <dt className="whitespace-nowrap text-n-text-3">{label}</dt>
                    <dd className="n-num text-n-text-2">{value ?? <Blank />}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 border-t border-n-line pt-4">
                <Eyebrow>Catalog id and aliases</Eyebrow>
                <p className="mt-2 font-mono text-[12px] leading-relaxed text-n-text-2">
                  {model.id}
                </p>
                <p className="mt-1.5 font-mono text-[11.5px] leading-relaxed text-n-text-3">
                  {model.aliases.join(" · ")}
                </p>
                <p className="mt-3 text-[11.5px] leading-relaxed text-n-text-3">
                  Aliases exist so a fuzzy match in the daily scrape cannot fold this row
                  onto a different version. {theme.motif}
                </p>
              </div>
            </Card>

            <Card className="p-5">
              <Eyebrow>Cited scores</Eyebrow>
              <p className="mt-2 text-[12.5px] leading-relaxed text-n-text-3">
                Each line carries the publisher and the date it was read. Where a
                publisher has no row, Ridge prints a dash instead of an estimate.
              </p>
              <div className="mt-4">
                {benchmarksWithScores().map((benchmark) => (
                  <ScoreRow
                    key={benchmark.id}
                    benchmarkId={benchmark.id}
                    modelId={model.id}
                  />
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      </Container>

      {/* Derived reads — computed live so a scrape cannot leave them stale. */}
      {data.strengths.length > 0 || data.watch.length > 0 ? (
        <Container className="pt-12">
          <Reveal>
            <SectionHead
              eyebrow="Read from the board"
              title="What the numbers say"
              sub="Computed from the catalog at page load rather than written by hand, so these lines move when the daily pull moves."
            />
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              <Card className="p-5">
                <Eyebrow>In its favour</Eyebrow>
                {data.strengths.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {data.strengths.map((fact) => (
                      <li key={fact.text} className="flex gap-2.5">
                        <Check
                          className="mt-0.5 size-3.5 shrink-0 text-n-up"
                          aria-hidden="true"
                        />
                        <div className="min-w-0">
                          <p className="text-[13.5px] leading-snug text-n-text-2">
                            {fact.text}
                          </p>
                          {fact.source ? (
                            <SourceLine className="mt-1" {...fact.source} />
                          ) : null}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-[13px] text-n-text-3">
                    Nothing on this board puts this row in a top three yet.
                  </p>
                )}
              </Card>

              <Card className="p-5">
                <Eyebrow>Read with care</Eyebrow>
                {data.watch.length > 0 ? (
                  <ul className="mt-4 flex flex-col gap-3">
                    {data.watch.map((fact) => (
                      <li key={fact.text} className="flex gap-2.5">
                        <Minus
                          className="mt-0.5 size-3.5 shrink-0 text-n-down"
                          aria-hidden="true"
                        />
                        <p className="text-[13.5px] leading-snug text-n-text-2">
                          {fact.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-[13px] text-n-text-3">
                    Full coverage on every board Ridge tracks, at general availability,
                    on list pricing.
                  </p>
                )}
              </Card>
            </div>
          </Reveal>
        </Container>
      ) : null}

      {/* Public opinion — Ridge Bot's field, rendered only when sourced. */}
      {model.publicOpinionStars != null ? (
        <Container className="pt-12">
          <Reveal>
            <Card className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-4">
                <Eyebrow>Public opinion</Eyebrow>
                <p
                  className="text-[19px] leading-none tracking-[0.15em] text-n-amber"
                  aria-label={`${model.publicOpinionStars} out of 5`}
                >
                  {"★".repeat(model.publicOpinionStars)}
                  <span className="text-n-text-3/40">
                    {"★".repeat(5 - model.publicOpinionStars)}
                  </span>
                </p>
              </div>
              {model.publicOpinionNote ? (
                <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-n-text-2">
                  {model.publicOpinionNote}
                </p>
              ) : null}
              {model.publicOpinionAsOf ? (
                <p className="n-num mt-2 text-[11.5px] text-n-text-3">
                  Scraped {model.publicOpinionAsOf}. Stars are set only where the public
                  conversation is thick enough to defend, and left blank otherwise.
                </p>
              ) : null}
            </Card>
          </Reveal>
        </Container>
      ) : null}

      {/* Where it sits */}
      {data.aa ? (
        <Container className="pt-12">
          <Reveal>
            <SectionHead
              eyebrow="Position"
              title="Against the field"
              sub="The same cost-and-capability chart as the board, with this row ringed."
            />
            <Card className="mt-6 p-4 sm:p-6">
              <PriceScatter highlightId={model.id} />
            </Card>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {benchmarksWithScores()
                .filter((b) => data.scores.some((s) => s.benchmark.id === b.id))
                .map((benchmark) => (
                  <Card key={benchmark.id} className="p-4 sm:p-5">
                    <Link
                      to="/benchmarks/$id"
                      params={{ id: benchmark.id }}
                      className="n-focus n-tap font-serif text-[17px] text-n-text hover:text-n-amber"
                    >
                      {benchmark.name}
                    </Link>
                    <div className="mt-3">
                      <BarBoard
                        benchmarkId={benchmark.id}
                        limit={8}
                        highlightId={model.id}
                        showSource={false}
                      />
                    </div>
                  </Card>
                ))}
            </div>
          </Reveal>
        </Container>
      ) : null}

      {/* Siblings */}
      {data.siblings.length > 0 ? (
        <Container className="pt-12">
          <Reveal>
            <SectionHead
              eyebrow={model.labName}
              title="Other rows from the same lab"
              sub="Versions are kept as separate ids on purpose. Collapsing one onto another is how a board publishes a wrong number with a straight face."
            />
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {data.siblings.map((sibling) => (
                <li key={sibling.id}>
                  <Link
                    to="/models/$slug"
                    params={{ slug: sibling.id }}
                    className="n-focus block"
                  >
                    <Card interactive className="p-3.5">
                      <div className="flex items-center gap-2">
                        <LabDot model={sibling} />
                        <span className="min-w-0 flex-1 truncate text-[13.5px] text-n-text">
                          {sibling.name}
                        </span>
                      </div>
                      <p className="n-num mt-1.5 text-[11.5px] text-n-text-3">
                        Released {sibling.released}
                      </p>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      ) : null}

      {/* Coverage in the desk and wire */}
      {data.news.length > 0 || data.wire.length > 0 ? (
        <Container className="pt-12">
          <Reveal>
            <SectionHead eyebrow="Coverage" title="Where this model comes up" />
            <div className="mt-6 grid gap-3 lg:grid-cols-2">
              {data.news.map((item) => (
                <Link
                  key={item.id}
                  to="/news/$id"
                  params={{ id: item.id }}
                  className="n-focus block"
                >
                  <Card interactive className="h-full p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {isFresh(item.date) ? <Tag tone="new">New</Tag> : null}
                      <Tag>Desk</Tag>
                      <span className="n-num text-[11px] text-n-text-3">{item.date}</span>
                    </div>
                    <h3 className="mt-2.5 font-serif text-[17px] leading-snug text-n-text">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-n-text-2">
                      {item.dek}
                    </p>
                  </Card>
                </Link>
              ))}
              {data.wire.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="n-focus block"
                >
                  <Card interactive className="h-full p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag>Wire</Tag>
                      <span className="n-num text-[11px] text-n-text-3">
                        {item.date} · {item.outlet}
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[14px] font-medium leading-snug text-n-text">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-n-text-2">
                      {item.blurb}
                    </p>
                  </Card>
                </a>
              ))}
            </div>
          </Reveal>
        </Container>
      ) : null}

      {/* Changelog */}
      {data.changelog.length > 0 ? (
        <Container className="pt-12">
          <Reveal>
            <SectionHead eyebrow="History on this site" title="Cuts that touched this row" />
            <ol className="mt-6 flex flex-col divide-y divide-n-line border-y border-n-line">
              {data.changelog.map((entry) => (
                <li key={`${entry.date}-${entry.title}`} className="py-4">
                  <p className="n-num text-[11.5px] text-n-text-3">{entry.date}</p>
                  <p className="mt-1 text-[14px] font-medium text-n-text">{entry.title}</p>
                  <ul className="mt-2 flex flex-col gap-1.5 text-[13px] leading-relaxed text-n-text-2">
                    {entry.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span aria-hidden="true" className="text-n-text-3">
                          —
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      ) : null}

      <Container className="pt-12">
        <Reveal>
          <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
            <Prose className="text-[13.5px]">
              <p className="text-n-text-2">
                Put this row against another and the differences resolve faster than any
                single page can show them.
              </p>
            </Prose>
            <Link
              to="/compare"
              search={{ ids: model.id }}
              className="n-focus inline-flex items-center gap-2 rounded-md border border-n-line-amber bg-n-amber/10 px-3.5 py-2 text-[13px] text-n-amber transition-colors duration-150 hover:bg-n-amber/[0.16]"
            >
              Compare {model.shortName}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </Card>
        </Reveal>
      </Container>
    </>
  );
}
