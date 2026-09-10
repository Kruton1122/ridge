import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Card, Eyebrow, LabDot, SectionHead, Tag } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { getModel } from "@/lib/data/catalog";
import { NEWS, isFresh } from "@/lib/data/desk";
import { WIRE } from "@/lib/data/wire";

export const Route = createFileRoute("/_app/news/")({
  component: NewsIndex,
  head: () => ({
    meta: [
      { title: "News — Ridge" },
      {
        name: "description",
        content:
          "Ridge desk notes on frontier model releases and rankings, plus a curated external wire. Every item keeps its outlet and date.",
      },
    ],
  }),
});

function NewsIndex() {
  const [lead, ...rest] = NEWS;

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Desk and wire</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            News
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Notes written here, and headlines collected from elsewhere. The two are kept
            visibly apart: a Ridge note argues, a wire item points. Both carry the outlet
            and the date.
          </p>
        </Container>
      </section>

      {lead ? (
        <Container className="pt-10">
          <Reveal>
            <Link to="/news/$id" params={{ id: lead.id }} className="n-focus block">
              <Card interactive className="overflow-hidden">
                <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-2">
                      {isFresh(lead.date) ? <Tag tone="new">New</Tag> : null}
                      <Tag>{lead.kind}</Tag>
                      <span className="n-num text-[11px] text-n-text-3">{lead.date}</span>
                    </div>
                    <h2 className="mt-4 font-serif text-[28px] leading-[1.15] text-n-text sm:text-[34px]">
                      {lead.title}
                    </h2>
                    <p className="mt-4 max-w-[60ch] text-[14.5px] leading-relaxed text-n-text-2">
                      {lead.dek}
                    </p>
                    <ul className="mt-6 flex flex-wrap gap-1.5">
                      {lead.models.map((id) => {
                        const model = getModel(id);
                        if (!model) return null;
                        return (
                          <li
                            key={id}
                            className="inline-flex items-center gap-1.5 rounded bg-n-overlay px-2 py-1 text-[11px] text-n-text-3"
                          >
                            <LabDot model={model} className="size-1.5" />
                            {model.shortName}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {lead.pull ? (
                    <div className="flex items-center border-t border-n-line bg-n-overlay/40 p-6 sm:p-8 lg:border-l lg:border-t-0">
                      <blockquote className="font-serif text-[20px] leading-[1.4] text-n-text sm:text-[23px]">
                        <span aria-hidden="true" className="text-n-amber">
                          “
                        </span>
                        {lead.pull}
                      </blockquote>
                    </div>
                  ) : null}
                </div>
              </Card>
            </Link>
          </Reveal>
        </Container>
      ) : null}

      <Container className="pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <SectionHead
                eyebrow="Written here"
                title="Ridge notes"
                sub="Original analysis. Opinionated on purpose, sourced on principle."
              />
              <ul className="mt-6 flex flex-col gap-3">
                {rest.map((item) => (
                  <li key={item.id}>
                    <Link
                      to="/news/$id"
                      params={{ id: item.id }}
                      className="n-focus block"
                    >
                      <Card interactive className="p-5">
                        <div className="flex flex-wrap items-center gap-2">
                          {isFresh(item.date) ? <Tag tone="new">New</Tag> : null}
                          <Tag>{item.kind}</Tag>
                          <span className="n-num text-[11px] text-n-text-3">{item.date}</span>
                        </div>
                        <h3 className="mt-3 font-serif text-[21px] leading-snug text-n-text">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[13.5px] leading-relaxed text-n-text-2">
                          {item.dek}
                        </p>
                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          {item.models.slice(0, 6).map((id) => {
                            const model = getModel(id);
                            if (!model) return null;
                            return (
                              <span
                                key={id}
                                className="inline-flex items-center gap-1.5 rounded bg-n-overlay px-2 py-0.5 text-[10.5px] text-n-text-3"
                              >
                                <LabDot model={model} className="size-1.5" />
                                {model.shortName}
                              </span>
                            );
                          })}
                        </div>
                      </Card>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <SectionHead
                eyebrow="External"
                title="Wire"
                sub="Collected, not written. Links go straight to the outlet."
              />
              <ul className="mt-6 flex flex-col divide-y divide-n-line border-y border-n-line">
                {WIRE.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="n-focus group block py-4 transition-colors duration-150 hover:bg-n-overlay/40"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        {isFresh(item.date) ? <Tag tone="new">New</Tag> : null}
                        <Tag>{item.beat}</Tag>
                        <span className="n-num text-[11px] text-n-text-3">
                          {item.date} · {item.outlet}
                        </span>
                      </div>
                      <h3 className="mt-2 flex items-start gap-1.5 text-[14px] font-medium leading-snug text-n-text">
                        {item.title}
                        <ArrowUpRight
                          className="mt-0.5 size-3.5 shrink-0 text-n-text-3 transition-colors duration-150 group-hover:text-n-amber"
                          aria-hidden="true"
                        />
                      </h3>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-n-text-2">
                        {item.blurb}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </>
  );
}
