import { useMemo, useState } from "react";
import { HEADLINE_BENCHMARK, benchmarksWithScores, formatValue, labsPresent, ledgerRows, type Row } from "@/lib/data/derived";
import type { Benchmark, LabId } from "@/lib/data/types";
import { labVar } from "./shell";

type SortKey = "rank" | "name" | "price" | "dpa" | string; // string = benchmark id

const short = (b: Benchmark) =>
  ({ "aa-intelligence": "AA", "swe-bench": "SWE", "cursor-bench": "Cursor", "arena-elo": "Arena", "terminal-bench": "Term" })[b.id] ??
  b.short;

export function Ledger({ fixedLab }: { fixedLab?: LabId } = {}) {
  const rows = useMemo(() => ledgerRows("promo"), []);
  const benches = useMemo(() => benchmarksWithScores(), []);
  const others = benches.filter((b) => b.id !== HEADLINE_BENCHMARK);
  const labs = useMemo(() => labsPresent(), []);
  const [lab, setLab] = useState<LabId | "all">(fixedLab ?? "all");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "rank", asc: true });
  const [seed, setSeed] = useState(0); // re-runs the row entrance when the view changes

  const best = useMemo(() => {
    const out: Record<string, number> = {};
    for (const b of benches) {
      const vals = rows.map((r) => r.scores[b.id]?.value).filter((v): v is number => v != null);
      if (vals.length) out[b.id] = b.higherIsBetter ? Math.max(...vals) : Math.min(...vals);
    }
    const dpas = rows.map((r) => r.dollarPerAa).filter((v): v is number => v != null);
    if (dpas.length) out.dpa = Math.min(...dpas);
    return out;
  }, [rows, benches]);

  const shown = useMemo(() => {
    let list = rows.filter((r) => (lab === "all" || r.model.lab === lab) && (!openOnly || r.model.license === "open-weight"));
    const val = (r: Row): number | string | null => {
      if (sort.key === "rank") return r.rank;
      if (sort.key === "name") return r.model.name;
      if (sort.key === "price") return r.midPrice;
      if (sort.key === "dpa") return r.dollarPerAa;
      return r.scores[sort.key]?.value ?? null;
    };
    const bench = benches.find((b) => b.id === sort.key);
    list = [...list].sort((a, b) => {
      const va = val(a), vb = val(b);
      if (va == null && vb == null) return (a.rank ?? 999) - (b.rank ?? 999);
      if (va == null) return 1;
      if (vb == null) return -1;
      let c = typeof va === "string" ? va.localeCompare(vb as string) : (va as number) - (vb as number);
      if (bench && bench.higherIsBetter) c = -c; // a benchmark's natural order is best first
      return sort.asc ? c : -c;
    });
    return list;
  }, [rows, lab, openOnly, sort, benches]);

  const scored = shown.filter((r) => r.rank != null || sort.key !== "rank");
  const unscored = sort.key === "rank" ? shown.filter((r) => r.rank == null) : [];

  const by = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, asc: !s.asc } : { key, asc: true }));
    setSeed((n) => n + 1);
  };
  const Th = ({ k, children, l }: { k: SortKey; children: React.ReactNode; l?: boolean }) => (
    <th className={l ? "l" : undefined} aria-sort={sort.key === k ? (sort.asc ? "ascending" : "descending") : "none"}>
      <button type="button" className={`${sort.key === k ? "on" : ""}${sort.key === k && !sort.asc ? " asc" : ""}`} onClick={() => by(k)}>
        {children}
        {sort.key === k && <span className="ar">↓</span>}
      </button>
    </th>
  );

  const count = (id: LabId) => rows.filter((r) => r.model.lab === id).length;
  const pick = (v: LabId | "all") => { setLab(v); setSeed((n) => n + 1); };

  const cell = (r: Row, b: Benchmark) => {
    const s = r.scores[b.id];
    if (!s) return <span className="blank">—</span>;
    return (
      <a href={s.sourceUrl} target="_blank" rel="noreferrer" title={`${s.sourceName} · as of ${s.asOf}`}
        className={best[b.id] === s.value ? "best" : undefined}>
        {formatValue(b, s.value)}
      </a>
    );
  };

  const line = (r: Row, i: number) => (
    <tr key={`${r.model.id}-${seed}`} style={{ "--i": Math.min(i, 30), "--c": labVar(r.model.lab) } as React.CSSProperties}
      className={r.rank == null ? "unscored" : undefined}>
      <td className="rank">{r.rank != null ? <b>{r.tied ? `=${r.rank}` : r.rank}</b> : "—"}</td>
      <td className="l">
        <a className="m" href={`/models/${r.model.id}`}>
          <span className="dot" />
          <span className="m-name">{r.model.name}</span>
          <span className="m-lab">{r.model.labName}</span>
          {r.model.license === "open-weight" && <span className="tag open">open</span>}
          {r.model.status !== "ga" && <span className="tag">{r.model.status}</span>}
          {r.promo && <span className="tag promo">promo</span>}
        </a>
      </td>
      <td>
        {r.scores[HEADLINE_BENCHMARK] ? (
          <span className="aa">
            <span className="bar"><i style={{ "--w": r.headlineShare } as React.CSSProperties} /></span>
            <b className={best[HEADLINE_BENCHMARK] === r.scores[HEADLINE_BENCHMARK].value ? "best" : undefined}>
              {r.scores[HEADLINE_BENCHMARK].value}
            </b>
          </span>
        ) : <span className="blank">—</span>}
      </td>
      {others.map((b) => <td key={b.id}>{cell(r, b)}</td>)}
      <td>{r.priceIn != null ? `$${fmt(r.priceIn)} / $${fmt(r.priceOut ?? 0)}` : <span className="blank">—</span>}</td>
      <td className={r.dollarPerAa != null && r.dollarPerAa === best.dpa ? "best" : undefined}>
        {r.dollarPerAa != null ? `$${r.dollarPerAa.toFixed(2)}` : <span className="blank">—</span>}
      </td>
    </tr>
  );

  return (
    <div>
      <div className="rx-filters" hidden={Boolean(fixedLab)}>
        <button type="button" className={`rx-chip${lab === "all" ? " on" : ""}`} onClick={() => pick("all")}>
          All labs <span className="n">{rows.length}</span>
        </button>
        {labs.map((l) => (
          <button key={l.id} type="button" className={`rx-chip${lab === l.id ? " on" : ""}`}
            style={{ "--c": labVar(l.id) } as React.CSSProperties} onClick={() => pick(lab === l.id ? "all" : l.id)}>
            <i /> {l.label} <span className="n">{count(l.id)}</span>
          </button>
        ))}
        <span className="sep" />
        <button type="button" className={`rx-chip${openOnly ? " on" : ""}`} onClick={() => { setOpenOnly((v) => !v); setSeed((n) => n + 1); }}>
          Open weights only
        </button>
      </div>
      <div className="rx-table-wrap">
        <table className="rx-table">
          <thead>
            <tr>
              <Th k="rank">#</Th>
              <Th k="name" l>Model</Th>
              <Th k={HEADLINE_BENCHMARK}>AA Index</Th>
              {others.map((b) => <Th key={b.id} k={b.id}>{short(b)}</Th>)}
              <Th k="price">$ in / out</Th>
              <Th k="dpa">$ / point</Th>
            </tr>
          </thead>
          <tbody>
            {scored.map(line)}
            {unscored.length > 0 && (
              <tr className="divider"><td colSpan={5 + others.length}>Catalogued, not yet scored on the AA Index. Kept, not hidden.</td></tr>
            )}
            {unscored.map((r, i) => line(r, scored.length + i))}
          </tbody>
        </table>
      </div>
      <p className="rx-table-note">
        Every score links to its publisher and as-of date. Prices are list per 1M tokens (promo where one is live);
        $ / point is the mid price per AA Index point. “=” marks a tie the publisher didn’t break.
      </p>
    </div>
  );
}

function fmt(v: number): string {
  return v >= 10 ? v.toFixed(0) : v >= 1 ? v.toFixed(2).replace(/\.00$/, "") : v.toFixed(2);
}
