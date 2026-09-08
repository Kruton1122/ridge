import { Link, createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { ScoreBars } from "@/components/score-bars";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BENCHMARKS, MODELS, SCORES, formatScore, getModel } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import { LAB_THEME, profileFor } from "@/lib/data/profiles";

export const Route = createFileRoute("/models/$slug")({
  component: ModelPage,
});

function ModelPage() {
  const { slug } = Route.useParams();
  const model = getModel(slug, MODELS);
  if (!model) {
    return (
      <div className="min-h-dvh bg-bg px-6 py-16 text-fg">
        <SiteHeader />
        <h1 className="mt-10 font-serif text-3xl">Model not in this snapshot</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-primary">
          Back to the ledger
        </Link>
      </div>
    );
  }
  const scores = SCORES.filter((s) => s.modelId === model.id);
  const color = modelColor(model);
  const profile = profileFor(model);
  const theme = LAB_THEME[model.lab];
  const featured = scores[0]?.benchmarkId ?? "aa-intelligence";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <SiteHeader />
      <section className="border-b border-border" style={{ background: `linear-gradient(180deg, ${color}1a, transparent)` }}>
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <p className="text-xs uppercase tracking-[0.2em]" style={{ color }}>
            {model.labName} · {profile.epithet}
          </p>
          <h1 className="mt-3 font-serif text-5xl">{model.name}</h1>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{profile.voice}</p>
          <p className="mt-3 text-xs text-faint">{theme.motif}</p>
          {model.publicOpinionStars != null ? (
            <div className="mt-5 max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.2em] text-faint">Public opinion</p>
              <p
                className="mt-1 font-serif text-xl leading-none tracking-[0.12em] text-primary"
                aria-label={`${model.publicOpinionStars} out of 5 stars`}
              >
                {"★".repeat(model.publicOpinionStars)}
              </p>
              {model.publicOpinionNote ? (
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {model.publicOpinionNote}
                  {model.publicOpinionAsOf ? (
                    <span className="text-faint"> · {model.publicOpinionAsOf}</span>
                  ) : null}
                </p>
              ) : model.publicOpinionAsOf ? (
                <p className="mt-2 text-xs text-faint">{model.publicOpinionAsOf}</p>
              ) : null}
            </div>
          ) : null}
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-faint">Released</dt>
              <dd>{model.released}</dd>
            </div>
            <div>
              <dt className="text-faint">License</dt>
              <dd>{model.license}</dd>
            </div>
            <div>
              <dt className="text-faint">Context</dt>
              <dd>{model.contextTokens ? model.contextTokens.toLocaleString() : "—"}</dd>
            </div>
            <div>
              <dt className="text-faint">Price / 1M</dt>
              <dd>{model.pricing ? `$${model.pricing.inputPerM} / $${model.pricing.outputPerM}` : "—"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <Reveal className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h2 className="font-serif text-2xl">On the field</h2>
        <p className="mt-2 text-sm text-muted">Same board as the homepage, this model marked.</p>
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)]">
          <ScoreBars scores={SCORES} benchmarkId={featured} limit={10} highlightId={model.id} />
        </div>
      </Reveal>

      <Reveal className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <h2 className="font-serif text-2xl">Cited scores</h2>
        <ul className="mt-4 grid gap-4">
          {scores.map((score) => {
            const bench = BENCHMARKS.find((b) => b.id === score.benchmarkId);
            const field = SCORES.filter((s) => s.benchmarkId === score.benchmarkId);
            const peak = Math.max(...field.map((s) => s.value), 1);
            const pct = Math.max(4, (score.value / peak) * 100);
            return (
              <li key={score.benchmarkId} className="rounded-xl bg-surface p-4 shadow-[0_0_0_1px_var(--color-border)]">
                <div className="flex items-baseline justify-between gap-3">
                  <p>{bench?.name ?? score.benchmarkId}</p>
                  <p className="text-xl tabular-nums">{formatScore(score.benchmarkId, score.value)}</p>
                </div>
                <div className="mt-3 h-6 overflow-hidden rounded-sm bg-raised">
                  <div
                    className="ridge-bar h-full rounded-sm"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                    }}
                  />
                </div>
                <a
                  href={score.sourceUrl}
                  className="mt-2 inline-block text-xs text-faint hover:text-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  {score.sourceName} · {score.asOf}
                  {score.note ? ` · ${score.note}` : ""}
                </a>
              </li>
            );
          })}
        </ul>
      </Reveal>
      <SiteFooter />
    </div>
  );
}
