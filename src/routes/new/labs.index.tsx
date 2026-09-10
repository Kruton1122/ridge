import { Link, createFileRoute } from "@tanstack/react-router";
import { Blank, Card, Eyebrow, LabDot } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { LAB_COLORS } from "@/lib/data/colors";
import { labStats } from "@/lib/data/derived";

export const Route = createFileRoute("/new/labs/")({
  component: LabIndex,
  head: () => ({
    meta: [
      { title: "Labs — Ridge" },
      {
        name: "description",
        content:
          "Every lab on the Ridge ledger, with its highest scoring row, its best cost per index point, and how many of its models carry open weights.",
      },
    ],
  }),
});

function LabIndex() {
  const labs = labStats();

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Who is shipping</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            Labs
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Ordered by the highest AA Intelligence Index score each lab currently holds
            on the board. A lab with no scored row sits at the bottom, which usually
            means it shipped recently rather than badly.
          </p>
        </Container>
      </section>

      <Container className="pt-10">
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {labs.map((lab) => (
            <li key={lab.lab}>
              <Reveal>
                <Link to="/new/labs/$id" params={{ id: lab.lab }} className="n-focus block h-full">
                  <Card interactive className="h-full p-5">
                    <div className="flex items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: LAB_COLORS[lab.lab] }}
                      />
                      <h2 className="font-serif text-[21px] leading-none text-n-text">
                        {lab.name}
                      </h2>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      <div>
                        <Eyebrow>Best AA row</Eyebrow>
                        <p className="n-num mt-1.5 text-[28px] leading-none text-n-text">
                          {lab.bestAa ? lab.bestAa.score.value : <Blank />}
                        </p>
                        <p className="mt-1.5 truncate text-[12px] text-n-text-3">
                          {lab.bestAa ? lab.bestAa.model.shortName : "No scored row"}
                        </p>
                      </div>
                      <div className="text-right">
                        <Eyebrow>Best $/AA</Eyebrow>
                        <p className="n-num mt-1.5 text-[19px] leading-none text-n-text-2">
                          {lab.cheapestPerAa
                            ? `$${lab.cheapestPerAa.dollarPerAa.toFixed(2)}`
                            : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-n-line pt-3.5 text-[11.5px] text-n-text-3">
                      <span className="n-num">{lab.models.length} rows</span>
                      <span className="n-num">{lab.scored} scored</span>
                      {lab.openWeights > 0 ? (
                        <span className="n-num">{lab.openWeights} open-weight</span>
                      ) : null}
                    </div>

                    <ul className="mt-3.5 flex flex-wrap gap-1.5">
                      {lab.models.slice(0, 5).map((model) => (
                        <li
                          key={model.id}
                          className="inline-flex items-center gap-1.5 rounded bg-n-overlay px-2 py-1 text-[11px] text-n-text-3"
                        >
                          <LabDot model={model} className="size-1.5" />
                          {model.shortName}
                        </li>
                      ))}
                      {lab.models.length > 5 ? (
                        <li className="n-num inline-flex items-center px-1 py-1 text-[11px] text-n-text-3">
                          +{lab.models.length - 5}
                        </li>
                      ) : null}
                    </ul>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
