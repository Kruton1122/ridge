import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import {
  Blank,
  Eyebrow,
  LabDot,
  RankBadge,
  SectionHead,
  StatusPill,
  Tag,
} from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { LAB_COLORS } from "@/lib/data/colors";
import { formatContext } from "@/lib/data/catalog";
import { labStats, moneyPair, rankOf } from "@/lib/data/derived";
import { LAB_THEME } from "@/lib/data/profiles";
import type { LabId } from "@/lib/data/types";

export const Route = createFileRoute("/new/labs/$id")({
  component: LabPage,
  head: ({ params }) => {
    const lab = labStats().find((l) => l.lab === params.id);
    return {
      meta: [
        { title: lab ? `${lab.name} — Ridge` : "Lab not found — Ridge" },
        {
          name: "description",
          content: lab
            ? `${lab.name} on the Ridge ledger: ${lab.models.length} catalog rows, ${lab.scored} scored on the AA Intelligence Index.`
            : "",
        },
      ],
    };
  },
  notFoundComponent: () => (
    <Container width="prose" className="py-24">
      <h1 className="font-serif text-[32px] text-n-text">No such lab</h1>
      <Link
        to="/new/labs"
        className="n-focus n-tap text-[13.5px] text-n-amber hover:underline"
      >
        Every lab on the ledger
      </Link>
    </Container>
  ),
});

function LabPage() {
  const { id } = Route.useParams();
  const lab = labStats().find((l) => l.lab === id);
  if (!lab) throw notFound();

  const color = LAB_COLORS[lab.lab as LabId];
  const theme = LAB_THEME[lab.lab as LabId];

  return (
    <>
      <section
        className="border-b border-n-line"
        style={{ background: `linear-gradient(180deg, ${color}12, transparent 70%)` }}
      >
        <Container className="py-10 sm:py-14">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <Eyebrow>Lab</Eyebrow>
          </div>
          <h1 className="mt-3 font-serif text-[40px] leading-[1.05] text-n-text sm:text-[50px]">
            {lab.name}
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            {theme.motif}
          </p>

          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-5">
            <div>
              <Eyebrow>Catalog rows</Eyebrow>
              <p className="n-num mt-1.5 text-[26px] leading-none text-n-text">
                {lab.models.length}
              </p>
            </div>
            <div>
              <Eyebrow>Scored on AA</Eyebrow>
              <p className="n-num mt-1.5 text-[26px] leading-none text-n-text">{lab.scored}</p>
            </div>
            <div>
              <Eyebrow>Highest AA row</Eyebrow>
              <p className="n-num mt-1.5 text-[26px] leading-none text-n-text">
                {lab.bestAa ? lab.bestAa.score.value : <Blank />}
              </p>
              {lab.bestAa ? (
                <RankBadge className="mt-1.5" rank={lab.bestAa.rank} of={lab.bestAa.of} tied={lab.bestAa.tied} />
              ) : null}
            </div>
            <div>
              <Eyebrow>Best cost per point</Eyebrow>
              <p className="n-num mt-1.5 text-[26px] leading-none text-n-text">
                {lab.cheapestPerAa ? `$${lab.cheapestPerAa.dollarPerAa.toFixed(2)}` : <Blank />}
              </p>
              {lab.cheapestPerAa ? (
                <p className="mt-1.5 text-[11.5px] text-n-text-3">
                  {lab.cheapestPerAa.model.shortName}
                </p>
              ) : null}
            </div>
            <div>
              <Eyebrow>Open weights</Eyebrow>
              <p className="n-num mt-1.5 text-[26px] leading-none text-n-text">
                {lab.openWeights}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <Container className="pt-10">
        <Reveal>
          <SectionHead
            title="Every row"
            sub="Newest first. Each version keeps its own id so a fuzzy match in the daily scrape cannot fold one release onto another."
          />
          {/* Cards on a phone — six columns do not survive a 393px viewport. */}
          <ul className="mt-6 flex flex-col gap-2 md:hidden">
            {lab.models.map((model) => {
              const aa = rankOf(model.id, "aa-intelligence");
              return (
                <li key={model.id}>
                  <Link
                    to="/new/models/$slug"
                    params={{ slug: model.id }}
                    className="n-focus block rounded-lg border border-n-line bg-n-raised p-3.5 active:bg-n-overlay"
                  >
                    <div className="flex items-start gap-2.5">
                      <LabDot model={model} className="mt-[7px]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[15px] font-medium leading-snug text-n-text">
                          {model.name}
                        </p>
                        <p className="n-num mt-0.5 text-[11.5px] text-n-text-3">
                          Released {model.released}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="n-num text-[19px] leading-none text-n-text">
                          {aa ? aa.value : <Blank />}
                        </p>
                        {aa ? (
                          <RankBadge className="mt-1" rank={aa.rank} of={aa.of} tied={aa.tied} />
                        ) : (
                          <p className="mt-1 text-[10.5px] text-n-text-3">unscored</p>
                        )}
                      </div>
                    </div>
                    <dl className="mt-3 grid grid-cols-3 gap-x-3 border-t border-n-line pt-3">
                      {[
                        {
                          label: "Price in / out",
                          value: model.pricing
                            ? moneyPair(model.pricing.inputPerM, model.pricing.outputPerM)
                            : null,
                        },
                        {
                          label: "Context",
                          value: model.contextTokens ? formatContext(model.contextTokens) : null,
                        },
                        { label: "Access", value: model.status.toUpperCase() },
                      ].map((field) => (
                        <div key={field.label}>
                          <dt className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-n-text-3">
                            {field.label}
                          </dt>
                          <dd className="n-num mt-0.5 text-[13.5px] text-n-text-2">
                            {field.value ?? <Blank />}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 hidden overflow-x-auto rounded-lg border border-n-line md:block">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="bg-n-raised">
                  {["Model", "Released", "AA v4.2", "Price in / out", "Context", "Access"].map(
                    (label, i) => (
                      <th
                        key={label}
                        className={`whitespace-nowrap px-3 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3 ${
                          i === 0 ? "text-left" : "text-right"
                        }`}
                      >
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {lab.models.map((model) => {
                  const aa = rankOf(model.id, "aa-intelligence");
                  return (
                    <tr
                      key={model.id}
                      className="n-row border-t border-n-line hover:bg-n-overlay/40"
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <LabDot model={model} />
                          <Link
                            to="/new/models/$slug"
                            params={{ slug: model.id }}
                            className="n-focus n-tap max-w-full truncate font-medium text-n-text hover:text-n-amber"
                          >
                            {model.name}
                          </Link>
                          {model.license === "open-weight" ? <Tag>Open</Tag> : null}
                        </div>
                      </td>
                      <td className="n-num whitespace-nowrap px-3 py-2.5 text-right text-n-text-2">
                        {model.released}
                      </td>
                      <td className="n-num whitespace-nowrap px-3 py-2.5 text-right">
                        {aa ? (
                          <>
                            <span className="text-n-text">{aa.value}</span>
                            <RankBadge className="ml-2" rank={aa.rank} of={aa.of} tied={aa.tied} />
                          </>
                        ) : (
                          <Blank />
                        )}
                      </td>
                      <td className="n-num whitespace-nowrap px-3 py-2.5 text-right text-n-text-2">
                        {model.pricing ? (
                          moneyPair(model.pricing.inputPerM, model.pricing.outputPerM)
                        ) : (
                          <Blank />
                        )}
                      </td>
                      <td className="n-num whitespace-nowrap px-3 py-2.5 text-right text-n-text-2">
                        {model.contextTokens ? formatContext(model.contextTokens) : <Blank />}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-right">
                        <StatusPill status={model.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
