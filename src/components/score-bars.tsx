import { Link } from "@tanstack/react-router";
import { modelColor } from "@/lib/data/colors";
import { formatScore, getBenchmark, getModel, rankBenchmark } from "@/lib/data/catalog";
import type { Score } from "@/lib/data/types";
import { cn } from "@/lib/utils";

export function ScoreBars({
  scores,
  benchmarkId = "aa-intelligence",
  limit = 12,
  highlightId,
}: {
  scores: Score[];
  benchmarkId?: string;
  limit?: number;
  highlightId?: string;
}) {
  const ranked = rankBenchmark(benchmarkId, scores).slice(0, limit);
  const peak = ranked[0]?.value ?? 1;
  const bench = getBenchmark(benchmarkId);

  return (
    <div>
      {bench ? (
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-faint">{bench.sourceName}</p>
            <h3 className="mt-1 font-serif text-2xl sm:text-3xl">{bench.name}</h3>
          </div>
          <p className="text-xs text-faint">as of {bench.asOf}</p>
        </div>
      ) : null}
      <ol className="grid gap-4">
        {ranked.map((row, i) => {
          const model = getModel(row.modelId);
          if (!model) return null;
          const pct = Math.max(4, (row.value / peak) * 100);
          const color = modelColor(model);
          const active = highlightId === model.id;
          return (
            <li key={`${row.modelId}-${benchmarkId}`}>
              <Link
                to="/models/$slug"
                params={{ slug: model.id }}
                className={cn("group block", active && "rounded-md ring-1 ring-primary/40")}
              >
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="flex min-w-0 items-baseline gap-2">
                    <span className="w-5 shrink-0 text-right text-xs tabular-nums text-faint">{i + 1}</span>
                    <span className="truncate text-sm group-hover:text-primary">{model.name}</span>
                  </span>
                  <span className="shrink-0 text-sm tabular-nums">{formatScore(benchmarkId, row.value)}</span>
                </div>
                <div className="h-8 overflow-hidden rounded-sm bg-raised sm:h-9">
                  <div
                    className="ridge-bar h-full rounded-sm"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                    }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
