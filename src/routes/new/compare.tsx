import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Blank, Card, Eyebrow, LabDot, StatusPill } from "@/components/new/bits";
import { Reveal } from "@/components/new/reveal";
import { Container } from "@/components/new/shell";
import { MODELS } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import { compare } from "@/lib/data/derived";
import { cn } from "@/lib/utils";

const MAX = 4;

export const Route = createFileRoute("/new/compare")({
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
          "Put two to four frontier models side by side: index scores with ranks, price, cost per index point, context window and access status.",
      },
    ],
  }),
});

function ComparePage() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/new/compare" });

  const selected = ids.split(",").map((s) => s.trim()).filter(Boolean).slice(0, MAX);
  const { models, rows } = compare(selected);

  function setSelection(next: string[]) {
    void navigate({ search: { ids: next.join(",") }, replace: true });
  }

  function toggle(id: string) {
    if (selected.includes(id)) setSelection(selected.filter((s) => s !== id));
    else if (selected.length < MAX) setSelection([...selected, id]);
  }

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
            because that is the direction a comparison actually gets read. A highlighted
            cell is the best value in its row; ties are left unmarked.
          </p>
        </Container>
      </section>

      <Container className="pt-8">
        <Card className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Eyebrow>
              Pick models — {selected.length} of {MAX}
            </Eyebrow>
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
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {MODELS.map((model) => {
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
                      "n-focus inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[12.5px]",
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
        </Card>
      </Container>

      <Container className="pt-8">
        {models.length < 2 ? (
          <Card className="px-6 py-16 text-center">
            <p className="text-[14px] text-n-text-2">
              Choose at least two models to see the table.
            </p>
            <p className="mt-2 text-[12.5px] text-n-text-3">
              Or start from a suggestion below.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { label: "The two at the top", ids: ["claude-fable-5.1", "gpt-6-astra"] },
                {
                  label: "Value seats",
                  ids: ["grok-4.6", "muse-spark-1.3", "gemini-3.8-flash"],
                },
                {
                  label: "Open weights",
                  ids: ["kimi-k3", "deepseek-v4-pro", "deepseek-v4.1-flash"],
                },
              ].map((preset) => (
                <li key={preset.label}>
                  <button
                    type="button"
                    onClick={() => setSelection(preset.ids)}
                    className="n-focus rounded-md border border-n-line px-3 py-1.5 text-[12.5px] text-n-text-2 hover:border-n-line-2 hover:text-n-text"
                  >
                    {preset.label}
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Reveal>
            <div className="overflow-x-auto rounded-lg border border-n-line">
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
                        className="min-w-[180px] px-4 py-3 text-left align-top"
                        style={{ borderTop: `2px solid ${modelColor(model)}` }}
                      >
                        <Link
                          to="/new/models/$slug"
                          params={{ slug: model.id }}
                          className="n-focus n-tap text-[14px] font-medium text-n-text hover:text-n-amber"
                        >
                          {model.name}
                        </Link>
                        <p className="mt-1 text-[11px] font-normal normal-case tracking-normal text-n-text-3">
                          {model.labName}
                        </p>
                        <div className="mt-1.5">
                          <StatusPill status={model.status} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-t border-n-line">
                      <th
                        scope="row"
                        className="n-freeze sticky left-0 bg-n-base px-4 py-3 text-left align-top font-normal"
                      >
                        <span className="text-[13px] text-n-text-2">{row.label}</span>
                        {row.note ? (
                          <span className="mt-0.5 block max-w-[22ch] text-[10.5px] leading-snug text-n-text-3">
                            {row.note}
                          </span>
                        ) : null}
                      </th>
                      {row.values.map((value, i) => (
                        <td
                          key={models[i]?.id ?? i}
                          className={cn(
                            "n-num px-4 py-3 align-top",
                            row.best === i ? "text-n-amber" : "text-n-text-2",
                          )}
                        >
                          {value ?? <Blank />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-n-text-3">
              Amber marks the leading value in a row. Rows where two or more models tie
              are left unmarked rather than picking one arbitrarily, and a dash means the
              publisher has nothing for that pairing on this snapshot.
            </p>
          </Reveal>
        )}
      </Container>
    </>
  );
}
