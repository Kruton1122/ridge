import { Link, createFileRoute } from "@tanstack/react-router";
import { DeskTag } from "@/components/desk-tag";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NEWS, isFresh } from "@/lib/data/desk";
import { WIRE } from "@/lib/data/wire";

export const Route = createFileRoute("/news")({ component: NewsPage });

function NewsPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader current="news" />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-faint">News</p>
        <h1 className="mt-2 font-serif text-4xl">Model wire</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Curated headlines about frontier models, then Ridge’s own notes. Every card keeps the outlet and the date.
        </p>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl">Wire</h2>
            <p className="text-xs text-faint">External · as published</p>
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {WIRE.map((item) => (
              <li key={item.id}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full flex-col rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-primary)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {isFresh(item.date) ? <DeskTag label="New" tone="new" /> : null}
                    <DeskTag label={item.beat} />
                    <span className="text-xs text-faint">
                      {item.date} · {item.outlet}
                    </span>
                  </div>
                  <h3 className="mt-3 font-medium leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.blurb}</p>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-2xl">Ridge notes</h2>
            <p className="text-xs text-faint">Written here</p>
          </div>
          <ul className="mt-5 grid gap-4">
            {NEWS.map((item) => (
              <li key={item.id}>
                <Link
                  to="/news/$id"
                  params={{ id: item.id }}
                  className="block rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-primary)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {isFresh(item.date) ? <DeskTag label="New" tone="new" /> : null}
                    <DeskTag label={item.kind} />
                    <span className="text-xs text-faint">{item.date}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-2xl leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.dek}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
