import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Copy, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Blank,
  Card,
  Eyebrow,
  LabDot,
  RankBadge,
  SectionHead,
  StatusPill,
} from "@/components/new/bits";
import { PriceScatter } from "@/components/new/charts";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { MODELS } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import {
  HEADLINE_BENCHMARK,
  compare,
  compareLeads,
  comparePresets,
  labsPresent,
  promoIsLive,
  rankOf,
  type PriceMode,
} from "@/lib/data/derived";
import type { LabId, Model } from "@/lib/data/types";
import { cn } from "@/lib/utils";

const MAX = 4;

export const Route = createFileRoute("/_app/compare")({
  validateSearch: (search: Record<string, unknown>): { ids: string } => ({
    ids: typeof search.ids === "string" ? search.ids : "",
  }),
  component: ComparePage,
  head: () => ({
    meta: [
      { title: "Compare — Ridge" },
      {
        name: "description",
        content:
          "Put two to four frontier models side by side: index scores with ranks and gaps, price, cost per index point, context window and access status.",
      },
    ],
  }),
});

function ComparePage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/compare" });
  const [query, setQuery] = useState("");
  const [lab, setLab] = useState<LabId | "all">("all");
  const [mode, setMode] = useState<PriceMode>("promo");
  const [copied, setCopied] = useState(false);

  const selected = ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX);
  const { models, rows } = compare(selected, mode);
  const leads = compareLeads(selected, mode);
  const presets = comparePresets();
  const anyPromo = models.some(promoIsLive);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MODELS.filter((model) => {
      if (lab !== "all" && model.lab !== lab) return false;
      if (!q) return true;
      return (
        model.name.toLowerCase().includes(q) ||
        model.shortName.toLowerCase().includes(q) ||
        model.labName.toLowerCase().includes(q) ||
        model.aliases.some((alias) => alias.toLowerCase().includes(q))
      );
    });
  }, [query, lab]);

  function setSelection(next: string[]) {
    const y = typeof window !== "undefined" ? window.scrollY : 0;
    void navigate({
      search: { ids: next.join(",") },
      replace: true,
      resetScroll: false,
    }).then(() => {
      if (typeof window !== "undefined" && Math.abs(window.scrollY - y) > 1) {
        window.scrollTo(0, y);
      }
    });
  }

  function toggle(id: string) {
    if (selected.includes(id)) setSelection(selected.filter((s) => s !== id));
    else if (selected.length < MAX) setSelection([...selected, id]);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const sections: { id: "boards" | "cost" | "access"; label: string }[] = [
    { id: "boards", label: "Boards" },
    { id: "cost", label: "Cost" },
    { id: "access", label: "Access" },
  ];

  return (
    <>
      <section className="border-b border-n-line">
        <Container className="py-10 sm:py-12">
          <Eyebrow>Side by side</Eyebrow>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.06] text-n-text sm:text-[46px]">
            Compare
          </h1>
          <p className="mt-4 max-w-[68ch] text-[14.5px] leading-relaxed text-n-text-2">
            Up to four rows at once. Metrics run down the page and models across it,
            because that is the direction a comparison actually gets read. Amber is the
            unique leader of a row; ties are left unmarked, and a dash means the publisher
            has nothing for that pairing on this snapshot.
          </p>
        </Container>
      </section>

      <Container className="pt-8">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>
              Pick models — {selected.length} of {MAX}
            </Eyebrow>
            <div className="flex flex-wrap items-center gap-2">
              {selected.length >= 2 ? (
                <button
                  type="button"
                  onClick={() => void copyLink()}
                  className="n-focus n-tap inline-flex items-center gap-1.5 text-[12px] text-n-text-3 hover:text-n-text-2"
                >
                  {copied ? <Check className="size-3" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              ) : null}
              {selected.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setSelection([])}
                  className="n-focus n-tap text-[12px] text-n-text-3 hover:text-n-text-2"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {presets.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const active =
                  preset.ids.length === selected.length &&
                  preset.ids.every((id) => selected.includes(id));
                return (
                  <li key={preset.id}>
                    <button
                      type="button"
                      onClick={() => setSelection(preset.ids)}
                      title={preset.sub}
                      className={cn(
                        "n-focus rounded-md border px-2.5 py-1.5 text-[12.5px]",
                        active
                          ? "border-n-line-amber bg-n-amber/10 text-n-amber"
                          : "border-n-line text-n-text-2 hover:border-n-line-2 hover:text-n-text",
                      )}
                    >
                      {preset.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Filter models</span>
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-n-text-3"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by name, lab, alias"
                className="n-focus h-9 w-full rounded-md border border-n-line bg-n-base pl-8 pr-3 text-[13px] text-n-text placeholder:text-n-text-3"
              />
            </label>
            <div className="flex flex-wrap gap-1">
              <FilterChip
                label="All labs"
                active={lab === "all"}
                onClick={() => setLab("all")}
              />
              {labsPresent().map((item) => (
                <FilterChip
                  key={item.id}
                  label={item.label}
                  active={lab === item.id}
                  onClick={() => setLab(item.id)}
                />
              ))}
            </div>
          </div>

          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {filtered.map((model) => {
              const active = selected.includes(model.id);
              const full = !active && selected.length >= MAX;
              return (
                <li key={model.id}>
                  <button
                    type="button"
                    onClick={() => toggle(model.id)}
                    disabled={full}
                    aria-pressed={active}
                    className={cn(
                      "n-focus inline-flex min-h-9 items-center gap-2 rounded-md border px-2.5 py-1.5 text-[12.5px]",
                      active
                        ? "border-n-line-amber bg-n-amber/10 text-n-amber"
                        : full
                          ? "cursor-not-allowed border-n-line text-n-text-3/50"
                          : "border-n-line text-n-text-2 hover:border-n-line-2 hover:text-n-text",
                    )}
                  >
                    <LabDot model={model} />
                    {model.shortName}
                    {active ? <X className="size-3" aria-hidden="true" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
          {filtered.length === 0 ? (
            <p className="mt-3 text-[12.5px] text-n-text-3">No models match that filter.</p>
          ) : null}
        </Card>
      </Container>

      <Container className="pt-8">
        {models.length === 0 ? (
          <Card className="px-6 py-16 text-center">
            <p className="text-[14px] text-n-text-2">Pick at least two models to fill the matrix.</p>
            <p className="mt-2 text-[12.5px] text-n-text-3">
              The starting sets above are derived from this snapshot, not a hand-picked list.
            </p>
          </Card>
        ) : (
          <>
            {anyPromo ? (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Eyebrow className="mr-1">Price</Eyebrow>
                <FilterChip label="Promo where live" active={mode === "promo"} onClick={() => setMode("promo")} />
                <FilterChip label="List price" active={mode === "list"} onClick={() => setMode("list")} />
              </div>
            ) : null}

            {leads.length > 0 ? (
              <Reveal>
                <Card className="mb-6 p-5">
                  <Eyebrow>On this snapshot</Eyebrow>
                  <ul className="mt-3 flex flex-col gap-2">
                    {leads.map((line) => (
                      <li
                        key={line}
                        className="border-l-2 border-n-line pl-3 text-[13.5px] leading-snug text-n-text-2"
                      >
                        {line}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ) : models.length === 1 ? (
              <p className="mb-6 text-[13.5px] text-n-text-3">
                Add a second model and the gaps fill in. Amber only marks a unique leader.
              </p>
            ) : null}

            <Reveal>
              <MobileMatrix models={models} rows={rows} onRemove={toggle} />
              <div className="mt-0 hidden overflow-x-auto rounded-lg border border-n-line md:block">
                <table className="w-full border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-n-raised">
                      <th className="n-freeze sticky left-0 bg-n-raised px-4 py-3 text-left text-[10.5px] font-medium uppercase tracking-[0.12em] text-n-text-3">
                        Metric
                      </th>
                      {models.map((model) => (
                        <th
                          key={model.id}
                          scope="col"
                          className="min-w-[188px] px-4 py-3 text-left align-top"
                          style={{ borderTop: `2px solid ${modelColor(model)}` }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                to="/models/$slug"
                                params={{ slug: model.id }}
                                className="n-focus n-tap text-[14px] font-medium text-n-text hover:text-n-amber"
                              >
                                {model.name}
                              </Link>
                              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-normal normal-case tracking-normal text-n-text-3">
                                <LabDot model={model} />
                                {model.labName}
                              </p>
                              <div className="mt-1.5">
                                <StatusPill status={model.status} />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggle(model.id)}
                              aria-label={`Remove ${model.shortName}`}
                              className="n-focus n-tap inline-flex size-7 shrink-0 items-center justify-center rounded-md text-n-text-3 hover:bg-n-overlay hover:text-n-text"
                            >
                              <X className="size-3.5" aria-hidden="true" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sections.map((section) => {
                      const sectionRows = rows.filter((row) => row.section === section.id);
                      if (sectionRows.length === 0) return null;
                      return (
                        <SectionBlock
                          key={section.id}
                          label={section.label}
                          columns={models.length}
                          rows={sectionRows}
                          models={models}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11.5px] leading-relaxed text-n-text-3">
                Gaps are versus the leader of that row, not versus a made-up average. Bars
                are magnitude among the selected set only. A dash means the publisher has
                not printed a number for that pairing on this snapshot.
              </p>
            </Reveal>

            {models.length >= 2 ? (
              <div className="mt-12 grid gap-10 lg:grid-cols-2">
                <Reveal>
                  <SectionHead
                    title="Among these"
                    sub="Headline AA Index, ranked inside this comparison, not against the whole board."
                  />
                  <div className="mt-5">
                    <AmongThese models={models} />
                  </div>
                </Reveal>
                <Reveal>
                  <SectionHead
                    title="On the price map"
                    sub="The same scatter as the homepage, with this set ringed and the rest dimmed."
                  />
                  <div className="mt-5">
                    <PriceScatter mode={mode} highlightIds={models.map((m) => m.id)} />
                  </div>
                </Reveal>
              </div>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}

function SectionBlock({
  label,
  columns,
  rows,
  models,
}: {
  label: string;
  columns: number;
  rows: ReturnType<typeof compare>["rows"];
  models: Model[];
}) {
  return (
    <>
      <tr className="border-t border-n-line">
        <th
          colSpan={columns + 1}
          className="bg-n-raised/80 px-4 py-2 text-left text-[10.5px] font-medium uppercase tracking-[0.14em] text-n-text-3"
        >
          {label}
        </th>
      </tr>
      {rows.map((row) => (
        <tr key={row.id} className="border-t border-n-line">
          <th
            scope="row"
            className="n-freeze sticky left-0 bg-n-base px-4 py-3 text-left align-top font-normal"
          >
            {row.sourceUrl ? (
              <a
                href={row.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="n-focus n-tap text-[13px] text-n-text-2 hover:text-n-amber"
              >
                {row.label}
              </a>
            ) : (
              <span className="text-[13px] text-n-text-2">{row.label}</span>
            )}
            {row.note ? (
              <span className="mt-0.5 block max-w-[22ch] text-[10.5px] leading-snug text-n-text-3">
                {row.note}
              </span>
            ) : null}
          </th>
          {row.cells.map((cell, i) => (
            <td
              key={models[i]?.id ?? i}
              className={cn("px-4 py-3 align-top", cell.best ? "text-n-amber" : "text-n-text-2")}
            >
              {cell.text == null ? (
                <Blank />
              ) : (
                <div>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="n-num text-[15px] leading-none">{cell.text}</span>
                    {cell.rank ? (
                      <RankBadge rank={cell.rank.rank} of={cell.rank.of} tied={cell.rank.tied} />
                    ) : null}
                  </div>
                  {cell.delta ? (
                    <p className="n-num mt-1 text-[11px] text-n-text-3">{cell.delta}</p>
                  ) : null}
                  {cell.share != null ? (
                    <span className="mt-2 block h-[4px] overflow-hidden rounded-full bg-n-overlay">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${cell.share * 100}%`,
                          backgroundColor: modelColor(models[i]!),
                          opacity: cell.best ? 1 : 0.75,
                        }}
                      />
                    </span>
                  ) : null}
                  {cell.hint ? (
                    <p className="mt-1.5 max-w-[28ch] text-[10.5px] leading-snug text-n-text-3">
                      {cell.hint}
                    </p>
                  ) : null}
                </div>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function AmongThese({ models }: { models: Model[] }) {
  const ranked = models
    .map((model) => ({ model, rank: rankOf(model.id, HEADLINE_BENCHMARK) }))
    .filter((row): row is { model: Model; rank: NonNullable<ReturnType<typeof rankOf>> } =>
      Boolean(row.rank),
    )
    .sort((a, b) => b.rank.value - a.rank.value);

  if (ranked.length < 2) {
    return (
      <p className="text-[13px] text-n-text-3">
        Need two published AA scores in this set to rank them against each other.
      </p>
    );
  }

  const peak = ranked[0].rank.value;

  return (
    <ol className="flex flex-col">
      {ranked.map((row) => (
        <li key={row.model.id} className="border-t border-n-line first:border-t-0">
          <Link
            to="/models/$slug"
            params={{ slug: row.model.id }}
            className="n-focus flex min-h-9 flex-wrap items-center gap-x-3 gap-y-1 py-2.5 hover:bg-n-overlay/40"
          >
            <LabDot model={row.model} />
            <span className="min-w-0 flex-1 truncate text-[13.5px] text-n-text-2">
              {row.model.shortName}
            </span>
            <span className="ml-auto flex shrink-0 items-baseline gap-2">
              <span className="n-num text-[13.5px] text-n-text">{row.rank.value}</span>
              <RankBadge rank={row.rank.rank} of={row.rank.of} tied={row.rank.tied} />
            </span>
          </Link>
          <div className="mb-2 h-[4px] overflow-hidden rounded-full bg-n-overlay">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(4, (row.rank.value / peak) * 100)}%`,
                backgroundColor: modelColor(row.model),
                opacity: 0.85,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

function MobileMatrix({
  models,
  rows,
  onRemove,
}: {
  models: Model[];
  rows: ReturnType<typeof compare>["rows"];
  onRemove: (id: string) => void;
}) {
  const sections: { id: "boards" | "cost" | "access"; label: string }[] = [
    { id: "boards", label: "Boards" },
    { id: "cost", label: "Cost" },
    { id: "access", label: "Access" },
  ];

  return (
    <div className="md:hidden" data-testid="compare-cards">
      <ul className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {models.map((model) => (
          <li
            key={model.id}
            className="flex shrink-0 items-center gap-2 rounded-md border border-n-line bg-n-raised px-2.5 py-1.5"
            style={{ borderTop: `2px solid ${modelColor(model)}` }}
          >
            <LabDot model={model} />
            <Link
              to="/models/$slug"
              params={{ slug: model.id }}
              className="n-focus n-tap text-[13px] text-n-text"
            >
              {model.shortName}
            </Link>
            <button
              type="button"
              onClick={() => onRemove(model.id)}
              aria-label={`Remove ${model.shortName}`}
              className="n-focus n-tap inline-flex size-7 items-center justify-center text-n-text-3"
            >
              <X className="size-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {sections.map((section) => {
        const sectionRows = rows.filter((row) => row.section === section.id);
        if (sectionRows.length === 0) return null;
        return (
          <div key={section.id} className="mt-5">
            <Eyebrow>{section.label}</Eyebrow>
            <ul className="mt-2 flex flex-col gap-2">
              {sectionRows.map((row) => (
                <li key={row.id} className="rounded-lg border border-n-line bg-n-raised p-3.5">
                  <p className="text-[13px] font-medium text-n-text">{row.label}</p>
                  {row.note ? (
                    <p className="mt-0.5 text-[11px] leading-snug text-n-text-3">{row.note}</p>
                  ) : null}
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {models.map((model, i) => {
                      const cell = row.cells[i];
                      return (
                        <li key={model.id}>
                          <div className="flex items-start gap-2">
                            <LabDot model={model} className="mt-1.5" />
                            <span className="min-w-0 flex-1 truncate pt-0.5 text-[13px] text-n-text-2">
                              {model.shortName}
                            </span>
                            <div className="shrink-0 text-right">
                              {cell?.text == null ? (
                                <Blank />
                              ) : (
                                <>
                                  <p
                                    className={cn(
                                      "n-num text-[15px] leading-none",
                                      cell.best ? "text-n-amber" : "text-n-text",
                                    )}
                                  >
                                    {cell.text}
                                  </p>
                                  {cell.rank ? (
                                    <RankBadge
                                      rank={cell.rank.rank}
                                      of={cell.rank.of}
                                      tied={cell.rank.tied}
                                      className="mt-1 justify-end"
                                    />
                                  ) : null}
                                  {cell.delta ? (
                                    <p className="n-num mt-1 text-[11px] text-n-text-3">{cell.delta}</p>
                                  ) : null}
                                </>
                              )}
                            </div>
                          </div>
                          {cell?.share != null ? (
                            <span className="mt-1.5 block h-[4px] overflow-hidden rounded-full bg-n-overlay">
                              <span
                                className="block h-full rounded-full"
                                style={{
                                  width: `${cell.share * 100}%`,
                                  backgroundColor: modelColor(model),
                                  opacity: cell.best ? 1 : 0.75,
                                }}
                              />
                            </span>
                          ) : null}
                          {cell?.hint ? (
                            <p className="mt-1 pl-[15px] text-[10.5px] leading-snug text-n-text-3">
                              {cell.hint}
                            </p>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "n-focus inline-flex min-h-8 items-center rounded-md border px-2.5 text-[12px]",
        active
          ? "border-n-line-amber bg-n-amber/10 text-n-amber"
          : "border-n-line text-n-text-3 hover:border-n-line-2 hover:text-n-text-2",
      )}
    >
      {label}
    </button>
  );
}
