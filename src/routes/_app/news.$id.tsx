import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  Eyebrow,
  LabDot,
  Prose,
  RankBadge,
  SectionHead,
  Tag,
} from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { getModel } from "@/lib/data/catalog";
import { NEWS, isFresh } from "@/lib/data/desk";
import { rankOf } from "@/lib/data/derived";

export const Route = createFileRoute("/_app/news/$id")({
  component: DeskNote,
  head: ({ params }) => {
    const item = NEWS.find((n) => n.id === params.id);
    return {
      meta: [
        { title: item ? `${item.title} — Ridge` : "Note not found — Ridge" },
        { name: "description", content: item?.dek ?? "" },
      ],
    };
  },
  notFoundComponent: () => (
    <Container width="prose" className="py-24">
      <h1 className="font-serif text-[32px] text-n-text">Not on the desk</h1>
      <Link
        to="/news"
        className="n-focus n-tap text-[13.5px] text-n-amber hover:underline"
      >
        Every note and wire item
      </Link>
    </Container>
  ),
});

function DeskNote() {
  const { id } = Route.useParams();
  const item = NEWS.find((row) => row.id === id);
  if (!item) throw notFound();

  const index = NEWS.findIndex((row) => row.id === id);
  const next = NEWS[index + 1];
  const models = item.models.map((mid) => getModel(mid)).filter(Boolean);

  return (
    <>
      <article>
        <Container width="prose" className="pt-12">
          <div className="flex flex-wrap items-center gap-2">
            {isFresh(item.date) ? <Tag tone="new">New</Tag> : null}
            <Tag>{item.kind}</Tag>
            {item.tags
              .filter((t) => t !== item.kind)
              .map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            <span className="n-num text-[11.5px] text-n-text-3">{item.date}</span>
          </div>

          <h1 className="mt-5 font-serif text-[34px] leading-[1.13] text-n-text sm:text-[44px]">
            {item.title}
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-n-text-2">{item.dek}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-n-line py-3">
            <span className="text-[12px] text-n-text-3">Ridge desk</span>
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="n-focus n-tap items-center gap-1 text-[12px] text-n-amber hover:underline"
            >
              Source · {item.sourceName}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          </div>
        </Container>

        {item.pull ? (
          <Container width="prose" className="pt-10">
            <blockquote className="border-l-2 border-n-amber pl-5 font-serif text-[22px] leading-[1.36] text-n-text sm:text-[26px]">
              {item.pull}
            </blockquote>
          </Container>
        ) : null}

        <Container width="prose" className="pt-10">
          <Prose>
            {item.body.map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </Prose>
        </Container>
      </article>

      {models.length > 0 ? (
        <Container className="pt-14">
          <Reveal>
            <SectionHead
              eyebrow="Cited in this note"
              title="Where these rows stand now"
              sub="Live from the catalog rather than the day this note was filed — if the daily pull has moved a score since, this table has moved with it."
            />
            <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => {
                if (!model) return null;
                const aa = rankOf(model.id, "aa-intelligence");
                return (
                  <li key={model.id}>
                    <Link
                      to="/models/$slug"
                      params={{ slug: model.id }}
                      className="n-focus block h-full"
                    >
                      <Card interactive className="flex h-full items-center gap-3 p-3.5">
                        <LabDot model={model} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13.5px] font-medium text-n-text">
                            {model.name}
                          </p>
                          <p className="text-[11.5px] text-n-text-3">{model.labName}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="n-num text-[18px] leading-none text-n-text">
                            {aa ? aa.value : "—"}
                          </p>
                          {aa ? (
                            <RankBadge className="mt-1" rank={aa.rank} of={aa.of} tied={aa.tied} />
                          ) : (
                            <p className="mt-1 text-[10.5px] text-n-text-3">unscored</p>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Container>
      ) : null}

      {next ? (
        <Container className="pt-14">
          <Reveal>
            <Eyebrow>Next note</Eyebrow>
            <Link to="/news/$id" params={{ id: next.id }} className="n-focus mt-3 block">
              <Card interactive className="p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag>{next.kind}</Tag>
                  <span className="n-num text-[11px] text-n-text-3">{next.date}</span>
                </div>
                <h3 className="mt-2.5 font-serif text-[21px] leading-snug text-n-text">
                  {next.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-n-text-2">
                  {next.dek}
                </p>
              </Card>
            </Link>
          </Reveal>
        </Container>
      ) : null}
    </>
  );
}
