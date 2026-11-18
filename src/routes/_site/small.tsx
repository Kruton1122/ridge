import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import type { LabId } from "@/lib/data/types";
import {
  SMALL_AS_OF,
  SMALL_MAX_PARAMS_B,
  SMALL_ROWS,
  SMALL_SOURCE,
  smallPtsPerB,
  smallVramFit,
  type SmallRow,
} from "@/lib/data/small";

export const Route = createFileRoute("/_site/small")({
  component: Small,
  head: () => ({
    meta: [
      { title: "Small models | Ridge" },
      {
        name: "description",
        content:
          "Open-weight models at or under 20 billion total parameters, ranked on the Artificial Analysis Intelligence Index v5, with score per billion parameters, license, and a plain VRAM-fit estimate.",
      },
    ],
  }),
});

const PROVIDER_LAB: Record<string, LabId> = {
  Google: "google",
};

const n = (v: string) => Number.parseFloat(v);

type SortKey = "index" | "pts" | "params" | "name";

function fmtParams(params: number): string {
  return `${(params / 1e9).toFixed(3)}B`;
}

function Cell({ v }: { v: string | null }) {
  return v == null ? <span className="blank">—</span> : <>{v}</>;
}

function Small() {
  const [sort, setSort] = useState<{ key: SortKey; dir: "desc" | "asc" }>({ key: "index", dir: "desc" });
  const rows = useMemo(() => {
    const copy = [...SMALL_ROWS];
    const dir = sort.dir === "desc" ? -1 : 1;
    copy.sort((a, b) => {
      let cmp = 0;
      if (sort.key === "index") cmp = n(a.index) - n(b.index);
      else if (sort.key === "pts") cmp = Number.parseFloat(smallPtsPerB(a.index, a.officialParams)) - Number.parseFloat(smallPtsPerB(b.index, b.officialParams));
      else if (sort.key === "params") cmp = a.officialParams - b.officialParams;
      else cmp = a.name.localeCompare(b.name);
      if (cmp === 0) cmp = n(b.index) - n(a.index) || a.name.localeCompare(b.name);
      return cmp * dir;
    });
    return copy;
  }, [sort]);

  const top = Math.max(...SMALL_ROWS.map((r) => n(r.index)), 1);
  const ranks = (() => {
    const scored = [...SMALL_ROWS].sort((a, b) => n(b.index) - n(a.index) || a.name.localeCompare(b.name));
    let rank = 0;
    let prev: number | null = null;
    const map = new Map<string, number>();
    scored.forEach((r, i) => {
      const v = n(r.index);
      if (v !== prev) rank = i + 1;
      prev = v;
      map.set(r.id, rank);
    });
    return map;
  })();
  const tied = (id: string) => {
    const rk = ranks.get(id);
    return rk != null && [...ranks.values()].filter((x) => x === rk).length > 1;
  };

  const click = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "desc" ? "asc" : "desc" } : { key, dir: key === "name" ? "asc" : "desc" }));
  };
  const mark = (key: SortKey) => (sort.key === key ? (sort.dir === "desc" ? " ↓" : " ↑") : "");
  const th = (key: SortKey, label: string, className?: string) => (
    <th className={className}>
      <button type="button" onClick={() => click(key)} style={{ background: "none", border: 0, padding: 0, color: "inherit", font: "inherit", cursor: "pointer" }} aria-label={`Sort by ${label}`}>
        {label}{mark(key)}
      </button>
    </th>
  );

  const line = (r: SmallRow, i: number) => {
    const rk = ranks.get(r.id) ?? i + 1;
    const pts = smallPtsPerB(r.index, r.officialParams);
    return (
      <tr key={r.id} style={{ "--i": Math.min(i, 30), "--c": labVar(PROVIDER_LAB[r.lab]) } as React.CSSProperties}>
        <td className="rank">{tied(r.id) ? <b>={rk}</b> : <b>{rk}</b>}</td>
        <td className="l">
          <span className="m">
            <span className="dot" />
            <a className="m-name" href={r.weightsUrl}>{r.name}</a>
            <span className="m-lab">{r.lab}</span>
          </span>
        </td>
        <td>
          <span className="aa">
            <span className="bar"><i style={{ "--w": n(r.index) / top } as React.CSSProperties} /></span>
            <b className={n(r.index) === top ? "best" : undefined}>{r.index}</b>
          </span>
        </td>
        <td><b>{pts}</b></td>
        <td title={r.cardNote ?? undefined}>
          {fmtParams(r.officialParams)}
          {r.cardNote ? <span className="m-lab"> · {r.cardNote}</span> : null}
        </td>
        <td>
          <a className="rx-link" href={r.licenseUrl}>{r.license}</a>
        </td>
        <td><Cell v={smallVramFit(r.officialParams)} /></td>
      </tr>
    );
  };

  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Open weights ≤ {SMALL_MAX_PARAMS_B}B · as of {SMALL_AS_OF}</div>
        <h1>Small models</h1>
        <p className="dek">
          Open-weight models at or under about {SMALL_MAX_PARAMS_B} billion total parameters, ranked on the{" "}
          <a className="rx-link" href={SMALL_SOURCE.url}>Artificial Analysis Intelligence Index v5</a>. Points per
          billion uses official weight counts, not AA&apos;s rounded size. This board is kept apart from the text
          ledger: these models are listed here only. Click a column header to sort.
        </p>
      </header>
      <div className="rx-table-wrap" style={{ marginTop: 22 }}>
        <table className="rx-table">
          <thead>
            <tr>
              <th>#</th>
              {th("name", "Model", "l")}
              {th("index", "AA Index v5")}
              {th("pts", "Pts / B")}
              {th("params", "Params")}
              <th>License</th>
              <th>VRAM fit</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => line(r, i))}
          </tbody>
        </table>
      </div>
      <p className="rx-table-note">
        Index scores are copied from {SMALL_SOURCE.name} as of {SMALL_AS_OF}, rounded to two decimals. The parameter
        total is the official Hugging Face safetensors count for that model&apos;s card; where the card&apos;s own wording
        differs (a &quot;core&quot; or &quot;effective&quot; size, or embeddings counted separately), that wording sits beside the
        total. Points per billion is the Index score divided by that official total. VRAM fit is a plain estimate, not
        a measured run: Q4 ≈ 0.55 GB per billion parameters plus 1 GB, FP16 ≈ 2 GB per billion plus 1 GB, then the
        smallest of 8, 12, 16 or 24 GB that covers each. Licenses are the exact names on the official cards;{" "}
        <a className="rx-link" href="https://www.liquid.ai/lfm-license">LFM Open License v1.0</a> allows commercial use
        under $10 million annual revenue. Each model name links to its official weights. Ridge does not fill blanks
        and does not guess a parameter count.
      </p>
    </div>
  );
}
