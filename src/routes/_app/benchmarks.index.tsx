import { Link, createFileRoute } from "@tanstack/react-router";
import { Card, Eyebrow, SectionHead, SourceLine } from "@/components/new/bits";
import { BarBoard } from "@/components/new/charts";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { MODELS } from "@/lib/data/catalog";
import { coverage } from "@/lib/data/derived";

export const Route = createFileRoute("/_app/benchmarks/")({
  component: BenchmarkIndex,
  head: () => ({
    meta: [
      { title: "Benchmarks — Ridge" },
      {
        name: "description",
        content:
          "What each index on the Ridge ledger actually measures, who publishes it, how much of the catalog it covers, and where it should not be trusted.",
      },
    ],
  }),
});

function BenchmarkIndex() {
  const rows = coverage();

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Instruments</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            What the numbers measure
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Five boards, five publishers, five different questions. None of them is the
            answer on its own, and the gap between what they cover and what the catalog
            holds is as informative as the scores.
          </p>
        </Container>
      </section>

      <Container className="pt-10">
        <Reveal>
          <Card className="p-5 sm:p-6">
            <Eyebrow>Coverage</Eyebrow>
            <p className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-n-text-2">
              How many of the {MODELS.length} catalog rows each board has actually scored.
              A short bar is not a flaw in the benchmark — it is how long independent
              evaluation takes after a launch.
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {rows.map((row) => (
                <li key={row.benchmark.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <Link
                      to="/benchmarks/$id"
                      params={{ id: row.benchmark.id }}
                      className="n-focus n-tap text-[13.5px] text-n-text-2 hover:text-n-amber"
                    >
                      {row.benchmark.name}
                    </Link>
                    <span className="n-num shrink-0 text-[12.5px] text-n-text-3">
                      {row.scored} of {row.total}
                    </span>
                  </div>
                  <div className="mt-2 h-[5px] overflow-hidden rounded-full bg-n-overlay">
                    <div
                      className="n-bar h-full rounded-full bg-n-amber/70"
                      style={{ width: `${(row.scored / row.total) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </Container>

      <Container className="pt-12">
        <div className="grid gap-3 lg:grid-cols-2">
          {rows.map((row) => (
            <Reveal key={row.benchmark.id}>
              <Card className="flex h-full flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Eyebrow>{row.benchmark.category}</Eyebrow>
                    <Link
                      to="/benchmarks/$id"
                      params={{ id: row.benchmark.id }}
                      className="n-focus mt-1.5 block font-serif text-[22px] leading-tight text-n-text hover:text-n-amber"
                    >
                      {row.benchmark.name}
                    </Link>
                  </div>
                  <span className="n-num shrink-0 rounded border border-n-line px-2 py-1 text-[11px] text-n-text-3">
                    {row.scored} rows
                  </span>
                </div>

                <p className="mt-3 text-[13px] leading-relaxed text-n-text-2">
                  {row.benchmark.description}
                </p>

                <div className="mt-5 border-t border-n-line pt-4">
                  <BarBoard benchmarkId={row.benchmark.id} limit={6} showSource={false} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-n-line pt-3">
                  <SourceLine
                    name={row.benchmark.sourceName}
                    url={row.benchmark.sourceUrl}
                    asOf={row.benchmark.asOf}
                  />
                  <Link
                    to="/benchmarks/$id"
                    params={{ id: row.benchmark.id }}
                    className="n-focus n-tap shrink-0 text-[12.5px] text-n-amber hover:underline"
                  >
                    Full board
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>

      <Container className="pt-12">
        <Reveal>
          <SectionHead
            eyebrow="A standing warning"
            title="Two rulers, one number"
            sub="The AA Intelligence Index was rebased from v4.1.1 to v4.2 on 4 September 2026. Scores fell across the board because the scale changed, not because the models did."
          />
          <Card className="mt-6 p-5 sm:p-6">
            <p className="max-w-[68ch] text-[13.5px] leading-relaxed text-n-text-2">
              v4.2 added AA-Briefcase and GDP.pdf, dropped a saturated GPQA Diamond and
              pushed private held-out weight to 40%. A model that read 66 in August and
              53 in September did not collapse — it was measured with a different
              instrument. Ridge will not draw a line between the two, will not average
              them, and will not put them on one bar. Any chart on this site that spans
              time is plotted entirely on v4.2.
            </p>
            <Link
              to="/methodology"
              className="n-focus n-tap text-[13px] text-n-amber hover:underline"
            >
              The full methodology
            </Link>
          </Card>
        </Reveal>
      </Container>
    </>
  );
}
