import { Link, createFileRoute } from "@tanstack/react-router";
import { DeskTag } from "@/components/desk-tag";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getModel } from "@/lib/data/catalog";
import { NEWS, isFresh } from "@/lib/data/desk";

export const Route = createFileRoute("/news/$id")({
  component: DeskArticle,
});

function DeskArticle() {
  const { id } = Route.useParams();
  const item = NEWS.find((row) => row.id === id);

  if (!item) {
    return (
      <div className="min-h-dvh bg-bg px-6 py-16 text-fg">
        <SiteHeader current="news" />
        <h1 className="mt-10 font-serif text-3xl">That note is not on the desk</h1>
        <Link to="/news" className="mt-4 inline-block text-sm text-primary">
          All items
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader current="news" />
      <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {isFresh(item.date) ? <DeskTag label="New" tone="new" /> : null}
          <DeskTag label={item.kind} />
          {item.tags
            .filter((t) => t !== item.kind)
            .map((tag) => (
              <DeskTag key={tag} label={tag} />
            ))}
          <span className="text-xs text-faint">{item.date}</span>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-[2.75rem]">{item.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{item.dek}</p>
        {item.pull ? (
          <blockquote className="mt-8 border-l-2 border-primary pl-4 font-serif text-xl leading-snug text-fg">
            {item.pull}
          </blockquote>
        ) : null}
        <div className="mt-8 grid gap-6 text-[1.07rem] leading-[1.7] text-fg/90">
          {item.body.map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs uppercase tracking-wider text-faint">Models in this note</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.models.map((id) => {
              const model = getModel(id);
              if (!model) return null;
              return (
                <li key={id}>
                  <Link
                    to="/models/$slug"
                    params={{ slug: model.id }}
                    className="rounded-md bg-raised px-3 py-1.5 text-sm hover:text-primary"
                  >
                    {model.shortName}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a
            href={item.sourceUrl}
            className="mt-6 inline-block text-sm text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Source · {item.sourceName}
          </a>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
