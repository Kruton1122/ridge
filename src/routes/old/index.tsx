import { Link, createFileRoute } from "@tanstack/react-router";
import { ChangelogPanel } from "@/components/changelog-panel";
import { DeskTag } from "@/components/desk-tag";
import { LedgerTable } from "@/components/ledger-table";
import { Reveal } from "@/components/reveal";
import { ScoreBars } from "@/components/score-bars";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import {
  NEWS,
  SCORES,
  SNAPSHOT_LABEL,
  formatScore,
  getModel,
  isFresh,
  rankBenchmark,
} from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";

export const Route = createFileRoute("/old/")({ component: Home });

function Home() {
  const aa = rankBenchmark("aa-intelligence", SCORES);
  const first = aa[0];
  const second = aa[1];

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader current="home" />
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-55"
          style={{ backgroundImage: "url(/ridge-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/55 to-bg" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Frontier ledger</p>
          <h1 className="mt-3 max-w-xl font-serif text-5xl leading-[1.05] sm:text-7xl">
            The frontier, scored.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
            Independent cut of Artificial Analysis, Arena+, and Vals. Seed {SNAPSHOT_LABEL}.
            Cite the source URL and the as-of date. AA composite is Index v4.2.
          </p>
        </div>
      </section>

      <Reveal className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <WinnerCard place="First" row={first} />
        <WinnerCard place="Second" row={second} />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <section id="boards" className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-8">
          <ScoreBars scores={SCORES} benchmarkId="aa-intelligence" />
        </section>
      </Reveal>

      <Reveal className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6">
        <section className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-7">
          <ScoreBars scores={SCORES} benchmarkId="swe-bench" limit={8} />
        </section>
        <section className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-7">
          <ScoreBars scores={SCORES} benchmarkId="arena-elo" limit={8} />
        </section>
      </Reveal>

      <Reveal className="mx-auto mt-6 max-w-6xl px-4 sm:px-6">
        <section className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-7">
          <ScoreBars scores={SCORES} benchmarkId="terminal-bench" limit={8} />
        </section>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-xs uppercase tracking-[0.2em] text-faint">Full cut</p>
        <h2 className="mt-2 font-serif text-3xl">Ledger</h2>
        <p className="mt-2 text-sm text-muted">
          $/AA is list mid-price ÷ AA Index — a Ridge proxy, not AA cost-per-task. Spark xhigh and Spark max are separate rows.
        </p>
        <div className="mt-6">
          <LedgerTable />
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <ChangelogPanel />
      </Reveal>

      <Reveal className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex items-end justify-between">
          <h2 className="font-serif text-3xl">News</h2>
          <Link to="/old/news" className="text-sm text-primary">
            All items
          </Link>
        </div>
        <ul className="mt-6 grid gap-4">
          {NEWS.slice(0, 3).map((item) => (
            <li key={item.id}>
              <Link
                to="/old/news/$id"
                params={{ id: item.id }}
                className="block rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-primary)]"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {isFresh(item.date) ? <DeskTag label="New" tone="new" /> : null}
                  <DeskTag label={item.kind} />
                  <span className="text-xs text-faint">{item.date}</span>
                </div>
                <h3 className="mt-3 font-serif text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.dek}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
      <SiteFooter />
    </div>
  );
}

function WinnerCard({
  place,
  row,
}: {
  place: string;
  row: { modelId: string; value: number } | undefined;
}) {
  const model = row ? getModel(row.modelId) : undefined;
  if (!model || !row) return null;
  return (
    <article
      className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-6"
      style={{ borderLeft: `4px solid ${modelColor(model)}` }}
    >
      <p className="text-xs uppercase tracking-wider text-faint">{place}</p>
      <Link
        to="/old/models/$slug"
        params={{ slug: model.id }}
        className="mt-2 block font-serif text-3xl hover:text-primary"
      >
        {model.name}
      </Link>
      <p className="mt-1 text-sm text-muted">{model.labName}</p>
      <p className="mt-4 text-2xl tabular-nums">{row.value}</p>
      <p className="text-xs text-faint">AA Intelligence Index</p>
    </article>
  );
}
