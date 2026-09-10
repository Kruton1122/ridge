import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Blank,
  Card,
  Eyebrow,
  LabDot,
  RankBadge,
  SectionHead,
  StatusPill,
  Tag,
} from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { formatContext } from "@/lib/data/catalog";
import { labStats, moneyPair, rankOf } from "@/lib/data/derived";

export const Route = createFileRoute("/_app/models/")({
  component: ModelIndex,
  head: () => ({
    meta: [
      { title: "Models — Ridge" },
      {
        name: "description",
        content:
          "Every model in the Ridge catalog, grouped by lab, with its AA Intelligence Index rank, access status and list price.",
      },
    ],
  }),
});

function ModelIndex() {
  const labs = labStats();

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            Every model on the ledger
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Grouped by lab, newest first. A model earns a catalog row on sourced
            specifications alone — a scored row on the board is a separate thing, and
            plenty here have the first without the second.
          </p>
        </Container>
      </section>

      <Container className="pt-10">
        <div className="flex flex-col gap-12">
          {labs.map((lab) => (
            <Reveal key={lab.lab}>
              <SectionHead
                title={lab.name}
                sub={
                  <>
                    {lab.models.length} row{lab.models.length === 1 ? "" : "s"} ·{" "}
                    {lab.scored} scored on AA
                    {lab.openWeights > 0 ? ` · ${lab.openWeights} open-weight` : ""}
                  </>
                }
                right={
                  <Link
                    to="/labs/$id"
                    params={{ id: lab.lab }}
                    className="n-focus n-tap text-[13px] text-n-amber hover:underline"
                  >
                    Lab page
                  </Link>
                }
              />
              <ul className="mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                {lab.models.map((model) => {
                  const aa = rankOf(model.id, "aa-intelligence");
                  return (
                    <li key={model.id}>
                      <Link
                        to="/models/$slug"
                        params={{ slug: model.id }}
                        className="n-focus block h-full"
                      >
                        <Card interactive className="flex h-full flex-col p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <LabDot model={model} />
                              <span className="truncate text-[14px] font-medium text-n-text">
                                {model.name}
                              </span>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="n-num text-[20px] leading-none text-n-text">
                                {aa ? aa.value : <Blank />}
                              </p>
                              {aa ? (
                                <RankBadge className="mt-1" rank={aa.rank} of={aa.of} tied={aa.tied} />
                              ) : (
                                <p className="mt-1 text-[10.5px] text-n-text-3">unscored</p>
                              )}
                            </div>
                          </div>

                          <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-n-text-2">
                            {model.summary}
                          </p>

                          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3.5">
                            {model.status !== "ga" ? <StatusPill status={model.status} /> : null}
                            {model.license === "open-weight" ? <Tag>Open</Tag> : null}
                            <span className="n-num text-[11px] text-n-text-3">
                              {model.released}
                            </span>
                            <span className="n-num ml-auto text-[11px] text-n-text-3">
                              {model.pricing
                                ? moneyPair(model.pricing.inputPerM, model.pricing.outputPerM)
                                : "—"}
                              {model.contextTokens
                                ? ` · ${formatContext(model.contextTokens)}`
                                : ""}
                            </span>
                          </div>
                        </Card>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
