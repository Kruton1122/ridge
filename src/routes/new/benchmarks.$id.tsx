import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Card,
  Eyebrow,
  LabDot,
  RankBadge,
  SectionHead,
  SourceLine,
  StatusPill,
} from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { MODELS, getBenchmark } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import { board, formatValue } from "@/lib/data/derived";

export const Route = createFileRoute("/new/benchmarks/$id")({
  component: BenchmarkPage,
  head: ({ params }) => {
    const benchmark = getBenchmark(params.id);
    return {
      meta: [
        { title: benchmark ? `${benchmark.name} — Ridge` : "Benchmark not found — Ridge" },
        { name: "description", content: benchmark?.description ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <Container width="prose" className="py-24">
      <h1 className="font-serif text-[32px] text-n-text">No such board</h1>
      <Link
        to="/new/benchmarks"
        className="n-focus n-tap text-[13.5px] text-n-amber hover:underline"
      >
        Every benchmark Ridge tracks
      </Link>
    </Container>
  ),
});

function BenchmarkPage() {
  const { id } = Route.useParams();
  const benchmark = getBenchmark(id);
  if (!benchmark) throw notFound();

  const rows = board(id);
  const missing = MODELS.filter((m) => !rows.some((r) => r.model.id === m.id));
  const values = rows.map((r) => r.score.value);
  const spread = values.length > 1 ? values[0] - values[values.length - 1] : 0;

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>{benchmark.category}</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            {benchmark.name}
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            {benchmark.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            <div>
              <Eyebrow>Published by</Eyebrow>
              <p className="mt-1.5 text-[14px] text-n-text">{benchmark.sourceName}</p>
            </div>
            <div>
              <Eyebrow>Read on</Eyebrow>
              <p className="n-num mt-1.5 text-[14px] text-n-text">{benchmark.asOf}</p>
            </div>
            <div>
              <Eyebrow>Scored rows</Eyebrow>
              <p className="n-num mt-1.5 text-[14px] text-n-text">
                {rows.length} of {MODELS.length}
              </p>
            </div>
            <div>
              <Eyebrow>Top to bottom</Eyebrow>
              <p className="n-num mt-1.5 text-[14px] text-n-text">
                {spread > 0 ? formatValue(benchmark, Number(spread.toFixed(1))) : "—"}
              </p>
            </div>
          </div>
          <SourceLine
            className="mt-6"
            name={benchmark.sourceName}
            url={benchmark.sourceUrl}
            asOf={benchmark.asOf}
          />
        </Container>
      </section>

      <Container className="pt-10">
        <Reveal>
          <SectionHead
            title="The board"
            sub="Every scored row, ranked, with the source line each score was read from. Effort variants are separate rows and are never merged."
          />
          {/* Cards on a phone. The four-column version puts a wrapping source
              line next to a percentage-width bar, which on a 393px screen makes
              rows several hundred pixels tall with the bar clipped off-screen. */}
          <ul className="mt-6 flex flex-col gap-2 md:hidden">
            {rows.map((row) => (
              <li
                key={row.model.id}
                className="rounded-lg border border-n-line bg-n-raised p-3.5"
              >
                <div className="flex items-start gap-2.5">
                  <span className="n-num mt-0.5 w-5 shrink-0 text-right text-[12px] text-n-text-3">
                    {row.rank}
                  </span>
                  <LabDot model={row.model} className="mt-[7px]" />
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/new/models/$slug"
                      params={{ slug: row.model.id }}
                      className="n-focus n-tap flex min-h-9 items-center text-[15px] font-medium leading-snug text-n-text"
                    >
                      {row.model.name}
                    </Link>
                    {row.model.status !== "ga" ? (
                      <span className="mt-1 inline-block">
                        <StatusPill status={row.model.status} />
                      </span>
                    ) : null}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="n-num text-[19px] leading-none text-n-text">
                      {formatValue(benchmark, row.score.value)}
                    </p>
                    <RankBadge
                      className="mt-1"
                      rank={row.rank}
                      of={row.of}
                      tied={row.tied}
                    />
                  </div>
                </div>
                <div className="mt-3 h-[5px] overflow-hidden rounded-full bg-n-overlay">
                  <div
                    className="n-bar h-full rounded-full"
                    style={{
                      width: `${row.share * 100}%`,
                      backgroundColor: modelColor(row.model),
                      opacity: 0.85,
                    }}
                  />
                </div>
                <SourceLine
                  className="mt-2.5 flex w-fit"
                  name={row.score.sourceName}
                  url={row.score.sourceUrl}
                  asOf={row.score.asOf}
                  note={row.score.note}
                />
              </li>
            ))}
          </ul>

          <div className="mt-6 hidden overflow-x-auto rounded-lg border border-n-line md:block">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-n-raised">
                  <th className="px-3 py-2.5 text-left text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                    Model
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                    Score
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                    Magnitude
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.model.id} className="n-row border-t border-n-line hover:bg-n-overlay/40">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="n-num w-5 shrink-0 text-right text-[11px] text-n-text-3">
                          {row.rank}
                        </span>
                        <LabDot model={row.model} />
                        <Link
                          to="/new/models/$slug"
                          params={{ slug: row.model.id }}
                          className="n-focus n-tap max-w-full truncate font-medium text-n-text hover:text-n-amber"
                        >
                          {row.model.name}
                        </Link>
                        {row.model.status !== "ga" ? (
                          <StatusPill status={row.model.status} />
                        ) : null}
                      </div>
                    </td>
                    <td className="n-num whitespace-nowrap px-3 py-2.5 text-right">
                      <span className="text-n-text">
                        {formatValue(benchmark, row.score.value)}
                      </span>
                      <RankBadge className="ml-2" rank={row.rank} of={row.of} tied={row.tied} />
                    </td>
                    <td className="w-[26%] px-3 py-2.5">
                      <span className="block h-[6px] overflow-hidden rounded-full bg-n-overlay">
                        <span
                          className="n-bar block h-full rounded-full"
                          style={{
                            width: `${row.share * 100}%`,
                            backgroundColor: modelColor(row.model),
                            opacity: 0.8,
                          }}
                        />
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <SourceLine
                        name={row.score.sourceName}
                        url={row.score.sourceUrl}
                        asOf={row.score.asOf}
                        note={row.score.note}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>

      {missing.length > 0 ? (
        <Container className="pt-12">
          <Reveal>
            <Card className="p-5 sm:p-6">
              <Eyebrow>Not on this board</Eyebrow>
              <h2 className="mt-2 font-serif text-[22px] leading-tight text-n-text">
                {missing.length} catalog row{missing.length === 1 ? "" : "s"} carry no{" "}
                {benchmark.short} score
              </h2>
              <p className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-n-text-2">
                {benchmark.sourceName} has published nothing for these on the{" "}
                {benchmark.asOf} read. They stay in the catalog with a dash rather than
                being dropped from the site or filled in from an adjacent number.
              </p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {missing.map((model) => (
                  <li key={model.id}>
                    <Link
                      to="/new/models/$slug"
                      params={{ slug: model.id }}
                      className="n-focus inline-flex items-center gap-2 rounded-md border border-n-line px-2.5 py-1.5 text-[12.5px] text-n-text-2 transition-colors duration-150 hover:border-n-line-2 hover:text-n-text"
                    >
                      <LabDot model={model} />
                      {model.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </Container>
      ) : null}
    </>
  );
}
