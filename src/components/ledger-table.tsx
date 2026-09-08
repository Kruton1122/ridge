import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MODELS, formatContext, formatScore } from "@/lib/data/catalog";
import { modelColor } from "@/lib/data/colors";
import {
  buildLedger,
  formatDollarPerAa,
  formatPricePair,
  statusLabel,
  type LedgerRow,
} from "@/lib/data/ledger";
import type { LabId } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type SortKey = "rank" | "aa" | "swe" | "arena" | "dollarPerAa";

const LABS: { id: LabId | "all"; label: string }[] = [
  { id: "all", label: "All labs" },
  { id: "anthropic", label: "Anthropic" },
  { id: "openai", label: "OpenAI" },
  { id: "meta", label: "Meta" },
  { id: "xai", label: "xAI" },
  { id: "google", label: "Google" },
];

export function LedgerTable() {
  const [lab, setLab] = useState<LabId | "all">("all");
  const [sort, setSort] = useState<SortKey>("aa");
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const [priceMode, setPriceMode] = useState<"list" | "promo">("promo");

  const rows = useMemo(() => {
    const built = buildLedger(priceMode);
    const filtered = lab === "all" ? built : built.filter((r) => r.lab === lab);
    return [...filtered].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const an = av == null ? -Infinity : av;
      const bn = bv == null ? -Infinity : bv;
      return dir === "desc" ? Number(bn) - Number(an) : Number(an) - Number(bn);
    });
  }, [lab, sort, dir, priceMode]);

  function toggle(key: SortKey) {
    if (sort === key) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSort(key);
      setDir("desc");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {LABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLab(item.id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs",
              lab === item.id ? "bg-raised text-fg" : "text-muted hover:text-fg",
            )}
          >
            {item.label}
          </button>
        ))}
        <span className="mx-2 hidden h-4 w-px bg-border sm:block" />
        <button
          type="button"
          onClick={() => setPriceMode((m) => (m === "promo" ? "list" : "promo"))}
          className="rounded-md px-3 py-1.5 text-xs text-muted hover:text-fg"
        >
          Price: {priceMode === "promo" ? "promo where live" : "list"}
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="sticky top-14 bg-surface text-left text-xs uppercase tracking-wider text-faint">
            <tr>
              <th className="px-3 py-3">Model</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Weights</th>
              <SortHead label="AA" active={sort === "aa"} onClick={() => toggle("aa")} />
              <SortHead label="SWE" active={sort === "swe"} onClick={() => toggle("swe")} />
              <SortHead label="Arena" active={sort === "arena"} onClick={() => toggle("arena")} />
              <SortHead label="$/AA" active={sort === "dollarPerAa"} onClick={() => toggle("dollarPerAa")} />
              <th className="px-3 py-3 text-right">Price</th>
              <th className="px-3 py-3 text-right">Ctx</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <LedgerLine key={row.id} row={row} priceMode={priceMode} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortHead({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <th className="px-3 py-3 text-right">
      <button type="button" onClick={onClick} className={cn("hover:text-fg", active && "text-fg")}>
        {label}
      </button>
    </th>
  );
}

function LedgerLine({ row, priceMode }: { row: LedgerRow; priceMode: "list" | "promo" }) {
  const model = MODELS.find((m) => m.id === row.id);
  if (!model) return null;
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-3">
        <Link to="/models/$slug" params={{ slug: row.id }} className="flex items-center gap-3 hover:text-primary">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: modelColor(model) }} />
          <span>
            <span className="text-faint">{row.rank} · </span>
            {row.name}
          </span>
        </Link>
      </td>
      <td className="px-3 py-3 text-xs uppercase tracking-wider text-muted">{statusLabel(row.status)}</td>
      <td className="px-3 py-3 text-xs text-muted">{row.license === "open-weight" ? "Open" : "Closed"}</td>
      <td className="px-3 py-3 text-right tabular-nums">
        {row.aa ?? "—"}
        {row.aaNote ? <span className="ml-1 text-[10px] text-faint">{row.status === "partner" ? "max" : ""}</span> : null}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-muted">
        {row.swe != null ? formatScore("swe-bench", row.swe) : "—"}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-muted">
        {row.arena != null ? formatScore("arena-elo", row.arena) : "—"}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-muted">{formatDollarPerAa(row.dollarPerAa)}</td>
      <td className="px-3 py-3 text-right tabular-nums text-muted">{formatPricePair(model, priceMode)}</td>
      <td className="px-3 py-3 text-right tabular-nums text-muted">{formatContext(row.context)}</td>
    </tr>
  );
}
