import { useMemo } from "react";
import { scatter } from "@/lib/data/derived";
import { labVar } from "./shell";

const W = 720;
const H = 420;
const M = { l: 40, r: 20, t: 16, b: 34 };

/** Mid price (log) against AA v4.2. The dashed line is the cost frontier: nothing is both cheaper and better. */
export function CostScatter() {
  const pts = useMemo(() => scatter("promo"), []);
  if (!pts.length) return null;
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const lx0 = Math.log10(Math.min(...xs) * 0.7), lx1 = Math.log10(Math.max(...xs) * 1.4);
  const y0 = Math.floor((Math.min(...ys) - 2) / 5) * 5, y1 = Math.ceil((Math.max(...ys) + 2) / 5) * 5;
  const X = (v: number) => M.l + ((Math.log10(v) - lx0) / (lx1 - lx0)) * (W - M.l - M.r);
  const Y = (v: number) => H - M.b - ((v - y0) / (y1 - y0)) * (H - M.t - M.b);
  const front = pts.filter((p) => p.frontier).sort((a, b) => a.x - b.x);
  const ticksX = [0.1, 0.3, 1, 3, 10, 30, 100].filter((v) => Math.log10(v) >= lx0 && Math.log10(v) <= lx1);
  const ticksY: number[] = [];
  for (let v = y0; v <= y1; v += 5) ticksY.push(v);
  const top = new Set([...pts].sort((a, b) => b.y - a.y).slice(0, 3).map((p) => p.model.id));

  return (
    <div className="rx-scatter">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Price per 1M tokens against AA Index">
        {ticksY.map((v) => (
          <g key={v}>
            <line className="ax" x1={M.l} x2={W - M.r} y1={Y(v)} y2={Y(v)} strokeDasharray="2 4" />
            <text className="ax-t" x={M.l - 8} y={Y(v) + 4} textAnchor="end">{v}</text>
          </g>
        ))}
        {ticksX.map((v) => (
          <text key={v} className="ax-t" x={X(v)} y={H - 10} textAnchor="middle">${v}</text>
        ))}
        <polyline className="front" points={front.map((p) => `${X(p.x)},${Y(p.y)}`).join(" ")} />
        {pts.map((p, i) => (
          <a key={p.model.id} href={`/models/${p.model.id}`}>
            <circle className="pt rx-in" cx={X(p.x)} cy={Y(p.y)} r={p.frontier ? 6 : 4.5}
              fill={p.frontier ? labVar(p.model.lab) : "var(--paper)"} stroke={labVar(p.model.lab)} strokeWidth={1.8}
              style={{ "--d": `${200 + i * 30}ms` } as React.CSSProperties}>
              <title>{`${p.model.name} — AA ${p.y}, $${p.x.toFixed(2)} mid per 1M, $${p.dollarPerAa.toFixed(2)} per point`}</title>
            </circle>
            {(p.frontier || top.has(p.model.id)) && (
              <text className={`lbl${p.frontier ? "" : " dim"}`} x={X(p.x) + 9} y={Y(p.y) - 8}>{p.model.shortName || p.model.name}</text>
            )}
          </a>
        ))}
        <text className="ax-t" x={W - M.r} y={M.t + 2} textAnchor="end">↑ smarter · → pricier (log)</text>
      </svg>
    </div>
  );
}
