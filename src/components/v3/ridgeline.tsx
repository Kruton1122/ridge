import { useMemo, useRef, useState } from "react";
import { SNAPSHOT_DATE } from "@/lib/data/catalog";
import { AA_VERSION, timeline, type TimelinePoint } from "@/lib/data/derived";
import type { LabId } from "@/lib/data/types";
import { labVar } from "./shell";

/**
 * The ridge: one line per lab, stepping up each time the lab released something that beat
 * its own best. Release date against the *current* index score, the same single ruler the
 * ledger uses -- it shows who moved the ceiling and when, not a history of past scores.
 */
const W = 1100;
const LABEL_W = 170;
const RIDGE_H = 108;
const GAP = 44;
const TOP = 26;

interface Ridge {
  lab: LabId;
  name: string;
  points: TimelinePoint[];
  best: number;
  steps: { t: number; v: number }[];
}

function buildRidges(): Ridge[] {
  const byLab = new Map<LabId, TimelinePoint[]>();
  for (const p of timeline()) {
    const list = byLab.get(p.model.lab) ?? [];
    list.push(p);
    byLab.set(p.model.lab, list);
  }
  const ridges: Ridge[] = [];
  for (const [lab, pts] of byLab) {
    pts.sort((a, b) => a.t - b.t);
    const steps: { t: number; v: number }[] = [];
    let high = -Infinity;
    for (const p of pts) {
      if (p.aa > high) {
        high = p.aa;
        steps.push({ t: p.t, v: p.aa });
      }
    }
    ridges.push({ lab, name: pts[0].model.labName, points: pts, best: high, steps });
  }
  return ridges.sort((a, b) => b.best - a.best || a.name.localeCompare(b.name));
}

export function Ridgeline({ only }: { only?: LabId } = {}) {
  const ridges = useMemo(() => buildRidges().filter((r) => !only || r.lab === only), [only]);
  const [focus, setFocus] = useState<LabId | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; p: TimelinePoint } | null>(null);
  const box = useRef<HTMLDivElement>(null);

  const all = (only ? buildRidges() : ridges).flatMap((r) => r.points);   // same axes as the front page
  if (!ridges.length) return null;
  const t0 = Date.UTC(new Date(Math.min(...all.map((p) => p.t))).getUTCFullYear(), 0, 1);
  const t1 = Date.parse(`${SNAPSHOT_DATE}T00:00:00Z`) + 6 * 86400000;
  const lo = Math.min(...all.map((p) => p.aa)) - 3;
  const hi = Math.max(...all.map((p) => p.aa));
  const plotW = W - LABEL_W;
  const x = (t: number) => ((t - t0) / (t1 - t0)) * plotW;
  const yv = (v: number) => ((v - lo) / (hi - lo)) * RIDGE_H;
  const H = TOP + RIDGE_H + (ridges.length - 1) * GAP + 46;

  const months: { t: number; label: string }[] = [];
  for (let d = new Date(t0); d.getTime() <= t1; d.setUTCMonth(d.getUTCMonth() + 1)) {
    months.push({ t: d.getTime(), label: d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }) });
  }

  const show = (e: React.MouseEvent, p: TimelinePoint) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setTip({ x: e.clientX - r.left, y: e.clientY - r.top, p });
  };

  return (
    <div className="rx-ridge" ref={box} onMouseLeave={() => { setFocus(null); setTip(null); }}>
      <svg viewBox={`0 0 ${W} ${H}`} className={focus ? "focus" : undefined} role="img"
        aria-label={`Each lab's best AA Intelligence Index ${AA_VERSION} score by release date`}>
        {months.map((m) => (
          <g key={m.t}>
            <line className="r-grid" x1={x(m.t)} x2={x(m.t)} y1={8} y2={H - 30} />
            <text className="r-axis" x={x(m.t) + 4} y={H - 12}>{m.label.toUpperCase()}</text>
          </g>
        ))}
        {ridges.map((r, i) => {
          const base = TOP + RIDGE_H + i * GAP;
          const end = x(t1);
          let d = `M0 ${base} L${x(r.steps[0].t)} ${base}`;
          for (let k = 0; k < r.steps.length; k++) {
            const s = r.steps[k];
            const nx = k + 1 < r.steps.length ? x(r.steps[k + 1].t) : end;
            d += ` L${x(s.t)} ${base - yv(s.v)} L${nx} ${base - yv(s.v)}`;
          }
          const fill = `${d} L${end} ${base} Z`;
          const len = Math.round(end + (r.steps.length + 1) * RIDGE_H + 40);
          const style = { "--i": i, "--len": len } as React.CSSProperties;
          return (
            <g key={r.lab} className={`lab${focus === r.lab ? " on" : ""}`}
              onMouseEnter={() => setFocus(r.lab)} onFocus={() => setFocus(r.lab)} tabIndex={0}
              aria-label={`${r.name}: best ${r.best}`}>
              <path className="r-fill" d={fill} />
              <path className="r-tint" d={fill} fill={labVar(r.lab)} />
              <line className="r-base" x1={0} x2={end} y1={base} y2={base} />
              <path className="r-line" d={d} stroke={labVar(r.lab)} style={style} />
              {r.points.map((p) => (
                <g key={p.model.id}>
                  <line className="r-tick" x1={x(p.t)} x2={x(p.t)} y1={base} y2={base + 5} style={style} />
                  <circle className="r-dot" cx={x(p.t)} cy={base - yv(p.aa)} r={p.setsHigh ? 4.5 : 3}
                    fill={p.aa >= Math.max(...r.points.filter((q) => q.t <= p.t).map((q) => q.aa)) ? labVar(r.lab) : "var(--paper)"}
                    stroke={labVar(r.lab)} strokeWidth={1.5} style={style}
                    onMouseEnter={(e) => show(e, p)} onMouseMove={(e) => show(e, p)} onMouseLeave={() => setTip(null)} />
                </g>
              ))}
              <text className="r-label" x={end + 14} y={base - yv(r.best) + 4} style={style}>{r.name}</text>
              <text className="r-score" x={end + 14} y={base - yv(r.best) + 19} style={style}>best {r.best}</text>
            </g>
          );
        })}
      </svg>
      {tip && (
        <div className="tip" style={{ left: tip.x, top: tip.y }}>
          <b>{tip.p.model.name}</b>
          <span className="rx-num">AA {tip.p.aa} · released {tip.p.released}</span>
          {tip.p.setsHigh && <div style={{ marginTop: 4, color: "var(--accent)" }}>Set a new high for the field</div>}
        </div>
      )}
    </div>
  );
}
