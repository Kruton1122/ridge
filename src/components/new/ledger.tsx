import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import { Blank, LabDot, StatusPill } from "@/components/new/bits";
import { modelColor } from "@/lib/data/colors";
import { formatContext } from "@/lib/data/catalog";
import {
  HEADLINE_BENCHMARK,
  benchmarksWithScores,
  formatValue,
  labsPresent,
  ledgerRows,
  moneyPair,
  type PriceMode,
  type Row,
} from "@/lib/data/derived";
import type { Benchmark, LabId } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/**
 * A sort key is either one of the fixed model attributes or *any benchmark id*
 * in the catalog. Adding a fifth board to `BENCHMARKS` gives it a column, a
 * header, and an entry in the mobile sort menu with no code change here.
 */
type FixedKey = "rank" | "dollarPerAa" | "midPrice" | "context" | "released";
type SortKey = FixedKey | (string & {});

type Weights = "all" | "open" | "closed";

const FIXED_LABELS: Record<FixedKey, string> = {
  rank: "Rank",
  dollarPerAa: "$ per AA point",
  midPrice: "Price",
  context: "Context window",
  released: "Release date",
};

function sortOptions(): { key: SortKey; label: string }[] {
  return [
    { key: "rank", label: FIXED_LABELS.rank },
    ...benchmarksWithScores().map((b) => ({ key: b.id, label: b.name })),
    { key: "dollarPerAa", label: FIXED_LABELS.dollarPerAa },
    { key: "midPrice", label: FIXED_LABELS.midPrice },
    { key: "context", label: FIXED_LABELS.context },
    { key: "released", label: FIXED_LABELS.released },
  ];
}

/** `claude-fable-5.1` is not a valid CSS ident — dots and dashes need scrubbing. */
function vtName(id: string): string {
  return `nrow-${id.replace(/[^a-zA-Z0-9]/g, "-")}`;
}

function sortValue(row: Row, key: SortKey): number | null {
  switch (key) {
    case "rank":
      return row.rank;
    case "dollarPerAa":
      return row.dollarPerAa;
    case "midPrice":
      return row.midPrice;
    case "context":
      return row.model.contextTokens;
    case "released":
      return Date.parse(`${row.model.released}T00:00:00Z`);
    default:
      return row.scores[key]?.value ?? null;
  }
}

/** Ascending is the useful default for ranks and money, descending for scores. */
function defaultDir(key: SortKey): "asc" | "desc" {
  return key === "rank" || key === "dollarPerAa" || key === "midPrice" ? "asc" : "desc";
}

/**
 * Derived from the catalog, not hardcoded: a model from a lab Ridge has never
 * listed brings its own filter chip with it, and a lab that drops off the
 * catalog stops advertising an empty filter.
 */
function labChips(): { id: LabId | "all"; label: string }[] {
  return [{ id: "all" as const, label: "All labs" }, ...labsPresent()];
}

export function LedgerTable({ compact = false }: { compact?: boolean }) {
  const [lab, setLab] = useState<LabId | "all">("all");
  const [weights, setWeights] = useState<Weights>("all");
  const [priceMode, setPriceMode] = useState<PriceMode>("promo");
  const [dense, setDense] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "rank",
    dir: "asc",
  });

  const rows = useMemo(() => {
    const all = ledgerRows(priceMode);
    const filtered = all.filter((row) => {
      if (lab !== "all" && row.model.lab !== lab) return false;
      if (weights === "open" && row.model.license !== "open-weight") return false;
      if (weights === "closed" && row.model.license !== "proprietary") return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sort.key);
      const bv = sortValue(b, sort.key);
      // Unscored rows always sink, whichever way the column is pointing.
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sort.dir === "asc" ? av - bv : bv - av;
    });
  }, [lab, weights, priceMode, sort]);

  /**
   * Re-sorting animates on desktop, where the row you were reading visibly
   * travels to its new rank.
   *
   * The state update happens unconditionally; the View Transition is only ever
   * a wrapper around it. An earlier version put `setSort` *inside*
   * `startViewTransition`, which meant that anywhere the transition failed —
   * notably iOS Safari, where naming dozens of `<tr>` elements is unreliable —
   * the sort silently did nothing at all. Animation must never decide whether a
   * control works.
   */
  const applySort = useCallback((key: SortKey, dir?: "asc" | "desc") => {
    const next = (previous: { key: SortKey; dir: "asc" | "desc" }) =>
      dir
        ? { key, dir }
        : previous.key === key
          ? { key, dir: previous.dir === "asc" ? ("desc" as const) : ("asc" as const) }
          : { key, dir: defaultDir(key) };

    const animate =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function" &&
      typeof window !== "undefined" &&
      // Wide viewport with a real pointer only: the named-row transition is a
      // desktop nicety, and it is the fragile path.
      window.matchMedia("(min-width: 768px)").matches &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!animate) {
      setSort(next);
      return;
    }

    // The update must not live only inside startViewTransition. Chromium on a
    // loaded Pi can accept the call and never run the callback, which is how
    // sort used to silently no-op. Apply at most once; the transition is a
    // wrapper, not a gate.
    let applied = false;
    const apply = () => {
      if (applied) return;
      applied = true;
      flushSync(() => setSort(next));
    };

    const fallback = window.setTimeout(apply, 80);
    try {
      const vt = document.startViewTransition(() => {
        window.clearTimeout(fallback);
        apply();
      });
      vt.ready.catch(() => {
        window.clearTimeout(fallback);
        apply();
      });
      vt.finished.catch(() => {});
    } catch {
      window.clearTimeout(fallback);
      apply();
    }
  }, []);

  const pad = dense ? "py-2" : "py-3.5";
  const benchmarks = benchmarksWithScores();

  return (
    <div>
      <Toolbar
        lab={lab}
        setLab={setLab}
        weights={weights}
        setWeights={setWeights}
        priceMode={priceMode}
        setPriceMode={setPriceMode}
        dense={dense}
        setDense={setDense}
        expanded={expanded}
        setExpanded={setExpanded}
        sort={sort}
        onSort={applySort}
        shown={rows.length}
      />

      {rows.length === 0 ? (
        <div className="mt-3 rounded-lg border border-n-line bg-n-raised px-6 py-10 text-center">
          <p className="text-[14px] text-n-text-2">No rows match those filters.</p>
          <p className="mt-1.5 text-[12.5px] text-n-text-3">
            Not every lab ships open weights, and not every lab ships closed ones.
          </p>
          <button
            type="button"
            onClick={() => {
              setLab("all");
              setWeights("all");
            }}
            className="n-focus mt-4 inline-flex min-h-9 items-center rounded-md border border-n-line-amber bg-n-amber/10 px-3.5 text-[13px] text-n-amber"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {/* Phones get cards. A nine-column table on a 390px screen is a two-inch
          window onto the data, and no amount of horizontal scrolling fixes it —
          you can never see a row and its columns at the same time. */}
      <ul data-testid="ledger-cards" className="mt-3 flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <li key={row.model.id}>
            <LedgerCard row={row} expanded={expanded} />
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-3 hidden overflow-x-auto rounded-lg border border-n-line md:block",
          rows.length === 0 && "md:hidden",
        )}
      >
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-n-raised">
              <Th
                className="n-freeze bg-n-raised text-left"
                label="Model"
                sortKey="rank"
                sort={sort}
                onSort={applySort}
                align="left"
              />
              {benchmarks.map((benchmark) => (
                <Th
                  key={benchmark.id}
                  label={benchmark.short}
                  sortKey={benchmark.id}
                  sort={sort}
                  onSort={applySort}
                />
              ))}
              <Th label="$/AA" sortKey="dollarPerAa" sort={sort} onSort={applySort} />
              <Th label="Price in / out" sortKey="midPrice" sort={sort} onSort={applySort} />
              {expanded ? (
                <>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                    Weights
                  </th>
                  <Th label="Context" sortKey="context" sort={sort} onSort={applySort} />
                  <Th label="Released" sortKey="released" sort={sort} onSort={applySort} />
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <LedgerRow
                key={row.model.id}
                row={row}
                pad={pad}
                expanded={expanded}
                named={i < 30}
                compact={compact}
                benchmarks={benchmarks}
              />
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11.5px] leading-relaxed text-n-text-3">
        A dash means the source has published nothing for that pairing on this snapshot — Ridge does
        not estimate across it. $/AA is list mid-price divided by the AA Index: a Ridge proxy, not
        AA cost-per-task. Effort variants stay separate rows.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ mobile card -- */

function LedgerCard({ row, expanded }: { row: Row; expanded: boolean }) {
  const { model } = row;
  const color = modelColor(model);
  const top = row.rank != null && row.rank <= 3;

  const metrics: { label: string; value: React.ReactNode }[] = [
    ...benchmarksWithScores().map((benchmark) => {
      const score = row.scores[benchmark.id];
      return {
        label: benchmark.short,
        value: score ? formatValue(benchmark, score.value) : <Blank />,
      };
    }),
    {
      label: "$/AA",
      value: row.dollarPerAa != null ? `$${row.dollarPerAa.toFixed(2)}` : <Blank />,
    },
    {
      label: "Price in / out",
      value:
        row.priceIn != null && row.priceOut != null ? (
          <span className={cn(row.promo && "text-n-up")}>
            {moneyPair(row.priceIn, row.priceOut)}
          </span>
        ) : (
          <Blank />
        ),
    },
    ...(expanded
      ? [
          {
            label: "Context",
            value: model.contextTokens ? formatContext(model.contextTokens) : <Blank />,
          },
          { label: "Released", value: model.released },
        ]
      : []),
  ];

  return (
    <Link
      to="/models/$slug"
      params={{ slug: model.id }}
      className="n-focus block rounded-lg border border-n-line bg-n-raised transition-colors duration-150 active:bg-n-overlay"
      style={top ? { borderLeftColor: color, borderLeftWidth: "2px" } : undefined}
    >
      <div className="flex items-start gap-2.5 px-3.5 pt-3">
        <span className="n-num mt-0.5 w-5 shrink-0 text-right text-[12px] text-n-text-3">
          {row.rank ?? "—"}
        </span>
        <LabDot model={model} className="mt-[7px]" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium leading-snug text-n-text">{model.name}</p>
          <p className="mt-0.5 text-[11.5px] text-n-text-3">{model.labName}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {model.status !== "ga" ? <StatusPill status={model.status} /> : null}
          {model.license === "open-weight" ? (
            <span className="rounded bg-n-overlay px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.09em] text-n-text-3">
              Open
            </span>
          ) : null}
        </div>
      </div>

      {/* Magnitude survives on a phone: the bar moves under the card headline
          rather than being dropped at small widths. */}
      {row.scores[HEADLINE_BENCHMARK] ? (
        <div className="mt-3 px-3.5">
          <div className="h-[4px] overflow-hidden rounded-full bg-n-overlay">
            <div
              className="n-bar h-full rounded-full"
              style={{
                width: `${Math.max(4, row.headlineShare * 100)}%`,
                backgroundColor: color,
                opacity: 0.85,
              }}
            />
          </div>
        </div>
      ) : null}

      <dl className="mt-3 grid grid-cols-3 gap-x-3 gap-y-2.5 border-t border-n-line px-3.5 py-3">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <dt className="text-[9.5px] font-medium uppercase tracking-[0.1em] text-n-text-3">
              {metric.label}
            </dt>
            <dd className="n-num mt-0.5 text-[13.5px] text-n-text-2">{metric.value}</dd>
          </div>
        ))}
      </dl>
    </Link>
  );
}

/* ------------------------------------------------------------- table row -- */

function LedgerRow({
  row,
  pad,
  expanded,
  named,
  compact,
  benchmarks,
}: {
  row: Row;
  pad: string;
  expanded: boolean;
  named: boolean;
  compact: boolean;
  benchmarks: Benchmark[];
}) {
  const { model } = row;
  const color = modelColor(model);
  const top = row.rank != null && row.rank <= 3;

  return (
    <tr
      className="group n-row border-t border-n-line transition-colors duration-150 hover:bg-n-overlay/50"
      style={named ? { viewTransitionName: vtName(model.id) } : undefined}
    >
      <td
        className={cn(
          "n-freeze bg-n-base px-3 text-left transition-colors duration-150 group-hover:bg-n-overlay/50",
          pad,
        )}
      >
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="w-4 shrink-0 border-l-2 pl-2 text-[11px]"
            style={{ borderColor: top ? "var(--color-n-amber)" : "transparent" }}
          />
          <span className="n-num w-5 shrink-0 text-right text-[11px] text-n-text-3">
            {row.rank ?? "—"}
          </span>
          <LabDot model={model} />
          <Link
            to="/models/$slug"
            params={{ slug: model.id }}
            className="n-focus inline-flex min-h-6 min-w-0 items-center truncate font-medium text-n-text transition-colors duration-150 hover:text-n-amber"
          >
            {compact ? model.shortName : model.name}
          </Link>
          {model.status !== "ga" ? <StatusPill status={model.status} /> : null}
          {model.license === "open-weight" ? (
            <span className="shrink-0 rounded bg-n-overlay px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-[0.09em] text-n-text-3">
              Open
            </span>
          ) : null}
        </div>
      </td>

      {benchmarks.map((benchmark) => {
        const score = row.scores[benchmark.id];
        const headline = benchmark.id === HEADLINE_BENCHMARK;
        return (
          <ScoreCell
            key={benchmark.id}
            pad={pad}
            value={score ? formatValue(benchmark, score.value) : null}
            share={headline && score ? row.headlineShare : null}
            color={headline ? color : undefined}
            emphasis={headline}
            title={score?.note}
          />
        );
      })}
      <ScoreCell
        pad={pad}
        value={row.dollarPerAa != null ? `$${row.dollarPerAa.toFixed(2)}` : null}
      />

      <td className={cn("whitespace-nowrap px-3 text-right", pad)}>
        {row.priceIn != null && row.priceOut != null ? (
          <span
            className={cn("n-num text-n-text-2", row.promo && "text-n-up")}
            title={row.promo ? "Promotional pricing, dated" : undefined}
          >
            {moneyPair(row.priceIn, row.priceOut)}
          </span>
        ) : (
          <Blank />
        )}
      </td>

      {expanded ? (
        <>
          <td className={cn("whitespace-nowrap px-3 text-right text-n-text-2", pad)}>
            {model.license === "open-weight" ? "Open" : "Closed"}
          </td>
          <td className={cn("n-num whitespace-nowrap px-3 text-right text-n-text-2", pad)}>
            {model.contextTokens ? formatContext(model.contextTokens) : <Blank />}
          </td>
          <td className={cn("n-num whitespace-nowrap px-3 text-right text-n-text-2", pad)}>
            {model.released}
          </td>
        </>
      ) : null}
    </tr>
  );
}

/**
 * Number plus a hairline magnitude bar underneath it, so a scan picks up both
 * the exact figure and its size in one pass.
 */
function ScoreCell({
  pad,
  value,
  share,
  color,
  emphasis = false,
  title,
}: {
  pad: string;
  value: string | null;
  share?: number | null;
  color?: string;
  emphasis?: boolean;
  title?: string;
}) {
  return (
    <td className={cn("whitespace-nowrap px-3 text-right align-middle", pad)}>
      {value == null ? (
        <Blank />
      ) : (
        <span className="inline-flex flex-col items-end gap-1" title={title}>
          <span className={cn("n-num", emphasis ? "text-n-text" : "text-n-text-2")}>{value}</span>
          {share != null && color ? (
            <span
              aria-hidden="true"
              className="block h-[2px] w-12 overflow-hidden rounded-full bg-n-overlay"
            >
              <span
                className="n-bar block h-full rounded-full"
                style={{
                  width: `${Math.min(100, Math.max(4, share * 100))}%`,
                  backgroundColor: color,
                  opacity: 0.75,
                }}
              />
            </span>
          ) : null}
        </span>
      )}
    </td>
  );
}

function Th({
  label,
  sortKey,
  sort,
  onSort,
  align = "right",
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
  className?: string;
}) {
  const active = sort.key === sortKey;
  const Icon = sort.dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap px-3 py-2.5 text-[10.5px] font-medium uppercase tracking-[0.12em]",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
      aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
    >
      {/* No transition here on purpose: controls a reader hits constantly
          should feel instant, not animated. */}
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "n-focus inline-flex min-h-6 items-center gap-1",
          align === "right" && "flex-row-reverse",
          active ? "text-n-amber" : "text-n-text-3 hover:text-n-text-2",
        )}
      >
        {label}
        <Icon className={cn("size-3", !active && "opacity-0")} aria-hidden="true" />
      </button>
    </th>
  );
}

/* --------------------------------------------------------------- toolbar -- */

function Toolbar({
  lab,
  setLab,
  weights,
  setWeights,
  priceMode,
  setPriceMode,
  dense,
  setDense,
  expanded,
  setExpanded,
  sort,
  onSort,
  shown,
}: {
  lab: LabId | "all";
  setLab: (v: LabId | "all") => void;
  weights: Weights;
  setWeights: (v: Weights) => void;
  priceMode: PriceMode;
  setPriceMode: (v: PriceMode) => void;
  dense: boolean;
  setDense: (v: boolean) => void;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (key: SortKey, dir?: "asc" | "desc") => void;
  shown: number;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {/* Wrapping, not scrolling: a hidden horizontal overflow on a phone leaves
          half the labs undiscoverable. */}
      <div className="flex flex-wrap items-center gap-1.5">
        {labChips().map((chip) => (
          <Chip key={chip.id} active={lab === chip.id} onClick={() => setLab(chip.id)}>
            {chip.label}
          </Chip>
        ))}
      </div>

      {/* Phones sort from a native select — far better than a row of 10px column
          headers sitting behind a horizontal scroll. */}
      <div className="flex items-center gap-2 md:hidden">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-n-line px-3 py-2">
          <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-[0.1em] text-n-text-3">
            Sort
          </span>
          <select
            value={sort.key}
            onChange={(event) => onSort(event.target.value as SortKey)}
            className="n-focus min-w-0 flex-1 bg-transparent text-[13.5px] text-n-text outline-none"
          >
            {sortOptions().map((option) => (
              <option key={option.key} value={option.key} className="bg-n-modal text-n-text">
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => onSort(sort.key, sort.dir === "asc" ? "desc" : "asc")}
          aria-label={sort.dir === "asc" ? "Sort descending" : "Sort ascending"}
          className="n-focus inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-n-line text-n-text-2"
        >
          {sort.dir === "asc" ? (
            <ChevronUp className="size-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <Segment
          options={[
            { id: "all", label: "All weights" },
            { id: "open", label: "Open" },
            { id: "closed", label: "Closed" },
          ]}
          value={weights}
          onChange={(value) => setWeights(value as Weights)}
        />
        <Segment
          options={[
            { id: "promo", label: "Promo where live" },
            { id: "list", label: "List price" },
          ]}
          value={priceMode}
          onChange={(value) => setPriceMode(value as PriceMode)}
        />
        <div className="hidden md:contents">
          <Segment
            options={[
              { id: "dense", label: "Compact" },
              { id: "roomy", label: "Comfortable" },
            ]}
            value={dense ? "dense" : "roomy"}
            onChange={(value) => setDense(value === "dense")}
          />
        </div>
        <Chip active={expanded} onClick={() => setExpanded(!expanded)}>
          {expanded ? "Fewer fields" : "More fields"}
        </Chip>
        <span className="n-num ml-auto text-[11px] text-n-text-3">{shown} rows</span>
      </div>
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "n-focus inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-md border px-3 text-[12.5px] md:min-h-8",
        active
          ? "border-n-line-amber bg-n-amber/10 text-n-amber"
          : "border-n-line text-n-text-2 hover:border-n-line-2 hover:text-n-text",
      )}
    >
      {children}
    </button>
  );
}

function Segment({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-n-line">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
          className={cn(
            "n-focus min-h-9 whitespace-nowrap px-3 text-[12.5px] md:min-h-8",
            value === option.id ? "bg-n-overlay text-n-text" : "text-n-text-3 hover:text-n-text-2",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
