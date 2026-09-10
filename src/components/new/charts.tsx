import { Link } from "@tanstack/react-router";
import { Blank, RankBadge, SourceLine } from "@/components/new/bits";
import { modelColor } from "@/lib/data/colors";
import { board, formatValue, scatter, timeline, type PriceMode } from "@/lib/data/derived";
import { getBenchmark } from "@/lib/data/catalog";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ bars -- */

/**
 * One benchmark, ranked, as bars. Bar length is share of the top score; the
 * exact figure sits beside it because the bar is for magnitude, not reading.
 */
export function BarBoard({
  benchmarkId,
  limit = 12,
  highlightId,
  showSource = true,
}: {
  benchmarkId: string;
  limit?: number;
  highlightId?: string;
  showSource?: boolean;
}) {
  const rows = board(benchmarkId).slice(0, limit);
  const benchmark = getBenchmark(benchmarkId);
  if (!benchmark || rows.length === 0) return null;

  return (
    <div>
      <ol className="flex flex-col">
        {rows.map((row, i) => {
          const color = modelColor(row.model);
          const active = highlightId === row.model.id;
          return (
            <li
              key={row.model.id}
              className={cn(
                "border-t border-n-line first:border-t-0",
                active && "bg-n-amber/[0.05]",
              )}
            >
              {/* Narrow screens stack the bar under the name rather than
                  dropping it. Hiding the bar below a breakpoint meant the whole
                  point of the module only existed in landscape. */}
              <Link
                to="/models/$slug"
                params={{ slug: row.model.id }}
                className="n-focus group block py-2.5 transition-colors duration-150 hover:bg-n-overlay/40 sm:flex sm:items-center sm:gap-3"
              >
                <span className="flex items-baseline gap-3 sm:contents">
                  <span className="n-num w-5 shrink-0 text-right text-[11px] text-n-text-3">
                    {row.rank}
                  </span>
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-[13.5px] transition-colors duration-150 sm:text-[13px]",
                      active ? "text-n-amber" : "text-n-text-2 group-hover:text-n-text",
                    )}
                  >
                    {row.model.shortName}
                  </span>
                  <span className="n-num shrink-0 text-right text-[13.5px] text-n-text sm:order-last sm:w-14 sm:text-[13px]">
                    {formatValue(benchmark, row.score.value)}
                  </span>
                </span>
                <span className="mt-2 block h-[6px] overflow-hidden rounded-full bg-n-overlay sm:mt-0 sm:w-[34%] sm:shrink-0">
                  <span
                    className="n-bar block h-full rounded-full"
                    style={{
                      width: `${row.share * 100}%`,
                      backgroundColor: color,
                      opacity: active ? 1 : 0.8,
                      animationDelay: `${Math.min(i, 10) * 28}ms`,
                    }}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
      {showSource ? (
        <div className="mt-3 border-t border-n-line pt-3">
          <SourceLine name={benchmark.sourceName} url={benchmark.sourceUrl} asOf={benchmark.asOf} />
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- scatter -- */

/**
 * Two coordinate spaces, not one scaled down.
 *
 * A single 860-unit viewBox squeezed into a 360px phone renders 11px axis text
 * at about five pixels, so the first fix was a horizontal scroll — which just
 * traded illegible for inconvenient. Instead each chart draws twice: a wide
 * layout for desktop and a near-1:1 narrow one for phones, where a font-size of
 * 10 stays a font-size of 10. Nothing pans, nothing shrinks.
 */
interface Layout {
  W: number;
  H: number;
  PAD: { top: number; right: number; bottom: number; left: number };
  fs: number;
  /** Label text next to plotted points; too dense to read on a phone. */
  labels: boolean;
}

const WIDE: Layout = {
  W: 860,
  H: 470,
  PAD: { top: 26, right: 30, bottom: 46, left: 52 },
  fs: 11,
  labels: true,
};

const NARROW: Layout = {
  W: 360,
  H: 400,
  PAD: { top: 18, right: 16, bottom: 42, left: 34 },
  fs: 10,
  labels: false,
};

/** Gridlines on round numbers inside the window, rather than stretching the
    window out to the next round number and leaving a band of dead space. */
function gridTicks(min: number, max: number): number[] {
  const step = max - min > 34 ? 10 : 5;
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) out.push(v);
  return out;
}

function niceLogTicks(min: number, max: number): number[] {
  const candidates = [0.1, 0.25, 0.5, 1, 2.5, 5, 10, 25, 50, 100];
  return candidates.filter((c) => c >= min * 0.85 && c <= max * 1.15);
}

/**
 * Models genuinely land on identical coordinates — Fable 5.1 and Astra share a
 * price and a score — so a plain plot draws one dot on top of another and one
 * label through another. Fan coincident dots around their shared point and push
 * colliding labels clear rather than dropping either.
 */
function fanOut<T>(
  items: T[],
  at: (item: T) => { x: number; y: number },
): { item: T; cx: number; cy: number; nudged: boolean }[] {
  const counts = new Map<string, number>();
  return items.map((item) => {
    const { x, y } = at(item);
    const key = `${x.toFixed(1)}:${y.toFixed(1)}`;
    const n = counts.get(key) ?? 0;
    counts.set(key, n + 1);
    if (n === 0) return { item, cx: x, cy: y, nudged: false };
    const angle = -Math.PI / 2 + (n - 1) * 2.1;
    return { item, cx: x + Math.cos(angle) * 8, cy: y + Math.sin(angle) * 8, nudged: true };
  });
}

function placeLabels(slots: { cx: number; cy: number }[]): number[] {
  const placed: { x: number; y: number }[] = [];
  return slots.map((slot) => {
    let y = slot.cy - 9;
    let guard = 0;
    while (
      guard < 12 &&
      placed.some((p) => Math.abs(p.x - slot.cx) < 96 && Math.abs(p.y - y) < 14)
    ) {
      y -= 14;
      guard += 1;
    }
    placed.push({ x: slot.cx, y });
    return y;
  });
}

/**
 * Cost against intelligence, the chart this genre lives on.
 *
 * Log x-axis because a linear one crushes everything under $5 into the margin.
 * The frontier line is the point of the chart: it turns a cloud of dots into
 * "nothing here is both cheaper and smarter than these".
 */
/**
 * Mobile hides in-plot labels to stay readable, which would leave the dots
 * anonymous — so the highlighted points get named underneath instead.
 */
function ChartKey({
  items,
}: {
  items: { id: string; name: string; color: string; note: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 md:hidden">
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-1.5 text-[11.5px] text-n-text-2">
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          {item.name}
          <span className="n-num text-n-text-3">{item.note}</span>
        </li>
      ))}
    </ul>
  );
}

function ScatterSvg({
  mode,
  highlightId,
  layout,
  className,
}: {
  mode: PriceMode;
  highlightId?: string;
  layout: Layout;
  className?: string;
}) {
  const { W, H, PAD, fs, labels: showLabels } = layout;
  const points = scatter(mode);
  if (points.length < 2) return null;

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const xMin = Math.min(...xs);
  const xMax = Math.max(...xs);
  const yMin = Math.min(...ys);
  const yMax = Math.max(...ys);

  const lx = (v: number) => Math.log10(v);
  const x0 = lx(xMin) - 0.12;
  const x1 = lx(xMax) + 0.12;
  const y0 = yMin - 3;
  const y1 = yMax + 3;

  const px = (v: number) => PAD.left + ((lx(v) - x0) / (x1 - x0)) * (W - PAD.left - PAD.right);
  const py = (v: number) => PAD.top + (1 - (v - y0) / (y1 - y0)) * (H - PAD.top - PAD.bottom);

  const frontier = points.filter((p) => p.frontier).sort((a, b) => a.x - b.x);
  const xTicks = niceLogTicks(xMin, xMax);
  const yTicks = gridTicks(y0, y1);

  // Staircase: the frontier holds its score until a better model appears.
  const stair = frontier.flatMap((p, i) =>
    i === 0
      ? [[px(p.x), py(p.y)]]
      : [
          [px(p.x), py(frontier[i - 1].y)],
          [px(p.x), py(p.y)],
        ],
  );

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={className}
        role="img"
        aria-label={`Price against AA Intelligence Index for ${points.length} models. ${frontier.length} sit on the cost-efficiency frontier.`}
      >
        {yTicks.map((v) => (
          <g key={`y${v}`}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--color-n-line)"
              strokeWidth="1"
            />
            <text
              x={PAD.left - 10}
              y={py(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={fs}
              fill="var(--color-n-text-3)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {v}
            </text>
          </g>
        ))}

        {xTicks.map((v) => (
          <g key={`x${v}`}>
            <line
              x1={px(v)}
              x2={px(v)}
              y1={PAD.top}
              y2={H - PAD.bottom}
              stroke="var(--color-n-line)"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <text
              x={px(v)}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              fontSize={fs}
              fill="var(--color-n-text-3)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              ${v < 1 ? v.toFixed(2) : v}
            </text>
          </g>
        ))}

        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={fs} fill="var(--color-n-text-3)">
          Mid price per 1M tokens — log scale
        </text>
        <text
          x={14}
          y={H / 2}
          textAnchor="middle"
          fontSize={fs}
          fill="var(--color-n-text-3)"
          transform={`rotate(-90 14 ${H / 2})`}
        >
          AA Intelligence Index v4.2
        </text>

        <polyline
          points={stair.map(([a, b]) => `${a},${b}`).join(" ")}
          fill="none"
          stroke="var(--color-n-amber)"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          strokeDasharray="5 4"
        />

        {(() => {
          const dots = fanOut(points, (p) => ({ x: px(p.x), y: py(p.y) }));
          // A highlighted model is labelled even when it is nowhere near the frontier.
          const labelled = dots.filter((d) => d.item.frontier || d.item.model.id === highlightId);
          const labelY = placeLabels(labelled);

          return (
            <>
              {dots.map(({ item: p, cx, cy, nudged }) => {
                const active = p.model.id === highlightId;
                return (
                  <g key={p.model.id}>
                    {nudged ? (
                      <line
                        x1={px(p.x)}
                        y1={py(p.y)}
                        x2={cx}
                        y2={cy}
                        stroke="var(--color-n-line-2)"
                        strokeWidth="1"
                      />
                    ) : null}
                    {active ? (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="none"
                        stroke="var(--color-n-amber)"
                        strokeWidth="1.25"
                        strokeOpacity="0.85"
                      />
                    ) : null}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={p.frontier || active ? 6 : 4.5}
                      fill={modelColor(p.model)}
                      fillOpacity={p.frontier || active ? 0.95 : 0.5}
                      stroke={p.frontier ? "var(--color-n-amber)" : "transparent"}
                      strokeWidth="1.5"
                    />
                    <title>
                      {`${p.model.name} — AA ${p.y}, $${p.x.toFixed(2)} mid, $${p.dollarPerAa.toFixed(2)} per index point`}
                    </title>
                  </g>
                );
              })}

              {showLabels &&
                labelled.map((d, i) => {
                  const p = d.item;
                  const active = p.model.id === highlightId;
                  const flip = d.cx > W - 190;
                  const y = labelY[i];
                  return (
                    <g key={`label-${p.model.id}`}>
                      <line
                        x1={d.cx}
                        y1={d.cy}
                        x2={flip ? d.cx - 10 : d.cx + 10}
                        y2={y + 3}
                        stroke="var(--color-n-line-2)"
                        strokeWidth="1"
                      />
                      <text
                        x={flip ? d.cx - 13 : d.cx + 13}
                        y={y}
                        textAnchor={flip ? "end" : "start"}
                        fontSize={fs + 0.5}
                        fill={active ? "var(--color-n-amber)" : "var(--color-n-text)"}
                      >
                        {p.model.shortName}
                        <tspan fill="var(--color-n-text-3)" dx="5">
                          ${p.dollarPerAa.toFixed(2)}/pt
                        </tspan>
                      </text>
                    </g>
                  );
                })}
            </>
          );
        })()}
      </svg>
    </>
  );
}

export function PriceScatter({
  mode = "promo",
  highlightId,
}: {
  mode?: PriceMode;
  highlightId?: string;
}) {
  return (
    <figure className="m-0">
      <ScatterSvg
        mode={mode}
        highlightId={highlightId}
        layout={NARROW}
        className="w-full md:hidden"
      />
      <ScatterSvg
        mode={mode}
        highlightId={highlightId}
        layout={WIDE}
        className="hidden w-full md:block"
      />
      <ChartKey
        items={scatter(mode)
          .filter((p) => p.frontier || p.model.id === highlightId)
          .map((p) => ({
            id: p.model.id,
            name: p.model.shortName,
            color: modelColor(p.model),
            note: `$${p.dollarPerAa.toFixed(2)}/pt`,
          }))}
      />
      <figcaption className="mt-3 max-w-[74ch] text-[12px] leading-relaxed text-n-text-3">
        Each dot is one model with both a published AA v4.2 score and a list price. Ringed dots sit
        on the frontier: nothing on this board is simultaneously cheaper and higher-scoring. Mid
        price averages input and output, which flatters output-heavy workloads — read it as a shelf
        tag, not an invoice.
      </figcaption>
    </figure>
  );
}

/* -------------------------------------------------------------- timeline -- */

/**
 * Release date against the *current* score. Deliberately not "score over
 * time": Ridge holds no historical index series, and v4.1.1 numbers are on a
 * different ruler, so every point here is read off the same v4.2 board.
 */
function TimelineSvg({ layout, className }: { layout: Layout; className?: string }) {
  const { W, H, PAD, fs, labels: showLabels } = layout;
  const points = timeline();
  if (points.length < 2) return null;

  const ts = points.map((p) => p.t);
  const ys = points.map((p) => p.aa);
  const first = Math.min(...ts);
  const last = Math.max(...ts);
  // Breathing room at both ends, or the earliest and latest dots get sliced in
  // half by the plot edge.
  const margin = Math.max(last - first, 1) * 0.1;
  const t0 = first - margin;
  const t1 = last + margin;
  const span = t1 - t0;
  const y0 = Math.min(...ys) - 3;
  const y1 = Math.max(...ys) + 3;

  const px = (t: number) => PAD.left + ((t - t0) / span) * (W - PAD.left - PAD.right);
  const py = (v: number) => PAD.top + (1 - (v - y0) / (y1 - y0)) * (H - PAD.top - PAD.bottom);

  const highs = points.filter((p) => p.setsHigh);
  const stair = highs.flatMap((p, i) =>
    i === 0
      ? [[px(p.t), py(p.aa)]]
      : [
          [px(p.t), py(highs[i - 1].aa)],
          [px(p.t), py(p.aa)],
        ],
  );
  if (highs.length > 0) {
    stair.push([px(last), py(highs[highs.length - 1].aa)]);
  }

  const months: { t: number; label: string }[] = [];
  const cursor = new Date(first);
  cursor.setUTCDate(1);
  while (cursor.getTime() <= last + 31 * 86_400_000) {
    months.push({
      t: cursor.getTime(),
      label: cursor.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
    });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }

  const yTicks = gridTicks(y0, y1);

  return (
    <>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className={className}
        role="img"
        aria-label={`Release date against current AA Intelligence Index v4.2 score for ${points.length} models.`}
      >
        {yTicks.map((v) => (
          <g key={`ty${v}`}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={py(v)}
              y2={py(v)}
              stroke="var(--color-n-line)"
            />
            <text
              x={PAD.left - 10}
              y={py(v)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={fs}
              fill="var(--color-n-text-3)"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {v}
            </text>
          </g>
        ))}

        {months
          .filter((m) => px(m.t) >= PAD.left && px(m.t) <= W - PAD.right)
          .map((m) => (
            <text
              key={m.t}
              x={px(m.t)}
              y={H - PAD.bottom + 18}
              textAnchor="middle"
              fontSize={fs}
              fill="var(--color-n-text-3)"
            >
              {m.label}
            </text>
          ))}

        <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={fs} fill="var(--color-n-text-3)">
          Release date, 2026
        </text>

        <polyline
          points={stair.map(([a, b]) => `${a},${b}`).join(" ")}
          fill="none"
          stroke="var(--color-n-amber)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
        />

        {(() => {
          // Several models share a launch date — three landed on 2 September.
          const dots = fanOut(points, (p) => ({ x: px(p.t), y: py(p.aa) }));
          const labelled = dots.filter((d) => d.item.setsHigh);
          const labelY = placeLabels(labelled);

          return (
            <>
              {dots.map(({ item: p, cx, cy, nudged }) => (
                <g key={p.model.id}>
                  {nudged ? (
                    <line
                      x1={px(p.t)}
                      y1={py(p.aa)}
                      x2={cx}
                      y2={cy}
                      stroke="var(--color-n-line-2)"
                      strokeWidth="1"
                    />
                  ) : null}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={p.setsHigh ? 6 : 4.5}
                    fill={modelColor(p.model)}
                    fillOpacity={p.setsHigh ? 0.95 : 0.5}
                    stroke={p.setsHigh ? "var(--color-n-amber)" : "transparent"}
                    strokeWidth="1.5"
                  />
                  <title>{`${p.model.name} — released ${p.released}, AA ${p.aa}`}</title>
                </g>
              ))}

              {showLabels &&
                labelled.map((d, i) => {
                  const flip = d.cx > W - 150;
                  return (
                    <text
                      key={`label-${d.item.model.id}`}
                      x={flip ? d.cx - 10 : d.cx + 10}
                      y={labelY[i]}
                      textAnchor={flip ? "end" : "start"}
                      fontSize={fs + 0.5}
                      fill="var(--color-n-text)"
                    >
                      {d.item.model.shortName}
                    </text>
                  );
                })}
            </>
          );
        })()}
      </svg>
    </>
  );
}

export function ReleaseTimeline() {
  return (
    <figure className="m-0">
      <TimelineSvg layout={NARROW} className="w-full md:hidden" />
      <TimelineSvg layout={WIDE} className="hidden w-full md:block" />
      <ChartKey
        items={timeline()
          .filter((p) => p.setsHigh)
          .map((p) => ({
            id: p.model.id,
            name: p.model.shortName,
            color: modelColor(p.model),
            note: p.released,
          }))}
      />
      <figcaption className="mt-3 max-w-[74ch] text-[12px] leading-relaxed text-n-text-3">
        Every point is a model's <em>current</em> v4.2 score plotted at its release date — one ruler
        across the whole chart. This is not a history of the index: Ridge keeps no back-dated
        series, and the v4.1.1 numbers these models launched against sat on a different scale
        entirely. The stepped line tracks the running high among models released so far.
      </figcaption>
    </figure>
  );
}

/* ----------------------------------------------------------------- misc --- */

export function ScoreRow({ benchmarkId, modelId }: { benchmarkId: string; modelId: string }) {
  const benchmark = getBenchmark(benchmarkId);
  const rows = board(benchmarkId);
  const hit = rows.find((r) => r.model.id === modelId);
  if (!benchmark) return null;

  if (!hit) {
    return (
      <div className="border-t border-n-line py-3.5 first:border-t-0">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[13.5px] text-n-text-2">{benchmark.name}</p>
          <Blank className="text-[18px]" />
        </div>
        <p className="mt-1 text-[11.5px] text-n-text-3">
          No row for this model on the {benchmark.asOf} pull.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-n-line py-3.5 first:border-t-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13.5px] text-n-text-2">{benchmark.name}</p>
        <div className="flex items-baseline gap-3">
          <RankBadge rank={hit.rank} of={hit.of} />
          <p className="n-num text-[20px] leading-none text-n-text">
            {formatValue(benchmark, hit.score.value)}
          </p>
        </div>
      </div>
      <div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-n-overlay">
        <div
          className="n-bar h-full rounded-full"
          style={{
            width: `${hit.share * 100}%`,
            backgroundColor: modelColor(hit.model),
          }}
        />
      </div>
      <SourceLine
        className="mt-2"
        name={hit.score.sourceName}
        url={hit.score.sourceUrl}
        asOf={hit.score.asOf}
        note={hit.score.note}
      />
    </div>
  );
}
