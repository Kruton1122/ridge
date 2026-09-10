import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { CHANGELOG } from "@/lib/data/changelog";
import { nextPullLabel } from "@/lib/data/ledger";

export const Route = createFileRoute("/_app/changelog")({
  component: Changelog,
  head: () => ({
    meta: [
      { title: "Changelog — Ridge" },
      {
        name: "description",
        content:
          "Every cut of the Ridge ledger since the seed: which scores moved, which models were added, and what changed about the index itself.",
      },
    ],
  }),
});

function Changelog() {
  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Audit trail</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            Changelog
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Every number that has moved on this ledger, and why. Current snapshot{" "}
            {SNAPSHOT_LABEL}; next scheduled pull{" "}
            <span className="n-num">{nextPullLabel()}</span>.
          </p>
        </Container>
      </section>

      <Container width="prose" className="pt-12">
        <ol className="relative flex flex-col gap-10 border-l border-n-line pl-7">
          {CHANGELOG.map((entry, i) => (
            <li key={`${entry.date}-${entry.title}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[33px] top-1.5 size-[9px] rounded-full ring-4 ring-n-base ${
                  i === 0 ? "bg-n-amber" : "bg-n-line-2"
                }`}
              />
              <Reveal>
                <p className="n-num text-[11.5px] uppercase tracking-[0.12em] text-n-text-3">
                  {entry.date}
                </p>
                <h2 className="mt-1.5 font-serif text-[23px] leading-snug text-n-text">
                  {entry.title}
                </h2>
                <ul className="mt-3.5 flex flex-col gap-2.5">
                  {entry.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[13.5px] leading-relaxed">
                      <span aria-hidden="true" className="shrink-0 text-n-text-3">
                        —
                      </span>
                      <span className="text-n-text-2">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </>
  );
}
