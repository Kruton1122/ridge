import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { labVar } from "@/components/v3/shell";
import { MODELS } from "@/lib/data/catalog";
import { compare, compareLeads, comparePresets, labsPresent } from "@/lib/data/derived";
import type { LabId } from "@/lib/data/types";

const MAX = 4;

export const Route = createFileRoute("/v3/compare")({
  validateSearch: (search: Record<string, unknown>): { ids: string } => ({
    ids: typeof search.ids === "string" ? search.ids : "",
  }),
  component: Compare,
  head: () => ({ meta: [{ title: "Compare — Ridge" }] }),
});

function Compare() {
  const { ids } = Route.useSearch();
  const navigate = useNavigate({ from: "/v3/compare" });
  const presets = useMemo(() => comparePresets(), []);
  const chosen = (ids ? ids.split(",") : presets[0]?.ids ?? []).filter((id) => MODELS.some((m) => m.id === id)).slice(0, MAX);
  const [q, setQ] = useState("");
  const [lab, setLab] = useState<LabId | "all">("all");
  const [copied, setCopied] = useState(false);
  const { models, rows } = useMemo(() => compare(chosen, "promo"), [chosen.join(",")]);
  const leads = useMemo(() => compareLeads(chosen, "promo"), [chosen.join(",")]);

  const set = (next: string[]) => navigate({ search: { ids: next.join(",") }, replace: true, resetScroll: false });
  const toggle = (id: string) =>
    set(chosen.includes(id) ? chosen.filter((x) => x !== id) : chosen.length >= MAX ? [...chosen.slice(1), id] : [...chosen, id]);
  const pool = MODELS.filter(
    (m) => (lab === "all" || m.lab === lab) && (!q || `${m.name} ${m.labName} ${m.aliases.join(" ")}`.toLowerCase().includes(q.toLowerCase())),
  ).sort((a, b) => b.released.localeCompare(a.released));
  const sections: { id: "boards" | "cost" | "access"; label: string }[] = [
    { id: "boards", label: "Boards" },
    { id: "cost", label: "Cost" },
    { id: "access", label: "Access" },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no clipboard */
    }
  };

  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Side by side</div>
        <h1>Compare</h1>
        <p className="dek">Up to four models on every board Ridge carries, with ranks, gaps to the leader, price and access. The page address saves the set, so you can share it.</p>
      </header>

      <section className="rx-picker rx-in" style={{ "--d": "80ms" } as React.CSSProperties}>
        <div className="rx-picked">
          {models.map((m) => (
            <button key={m.id} type="button" className="rx-pick on" style={{ "--c": labVar(m.lab) } as React.CSSProperties} onClick={() => toggle(m.id)}>
              <i /> {m.name} <span aria-hidden="true">×</span>
            </button>
          ))}
          {Array.from({ length: MAX - models.length }).map((_, i) => <span key={i} className="rx-pick empty">Add a model</span>)}
          <span className="sp" />
          {presets.map((p) => (
            <button key={p.id} type="button" className="rx-chip" title={p.sub} onClick={() => set(p.ids)}>{p.label}</button>
          ))}
          <button type="button" className="rx-chip" onClick={copy}>{copied ? "Link copied" : "Copy link"}</button>
        </div>
        <div className="rx-pool-tools">
          <input className="rx-input" placeholder="Find a model…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Find a model" />
          <div className="rx-filters" style={{ padding: 0 }}>
            <button type="button" className={`rx-chip${lab === "all" ? " on" : ""}`} onClick={() => setLab("all")}>All</button>
            {labsPresent().map((l) => (
              <button key={l.id} type="button" className={`rx-chip${lab === l.id ? " on" : ""}`} style={{ "--c": labVar(l.id) } as React.CSSProperties} onClick={() => setLab(lab === l.id ? "all" : l.id)}>
                <i /> {l.label}
              </button>
            ))}
          </div>
        </div>
        <div className="rx-pool">
          {pool.map((m) => (
            <button key={m.id} type="button" className={`rx-pick${chosen.includes(m.id) ? " on" : ""}`} style={{ "--c": labVar(m.lab) } as React.CSSProperties} onClick={() => toggle(m.id)}>
              <i /> {m.name}
            </button>
          ))}
          {pool.length === 0 && <span className="rx-faint">No model matches “{q}”.</span>}
        </div>
      </section>

      {models.length > 0 && (
        <section className="rx-sec">
          {leads.length > 0 && (
            <ul className="rx-leads">
              {leads.map((l) => <li key={l}>{l}</li>)}
            </ul>
          )}
          <div className="rx-table-wrap">
            <table className="rx-table rx-cmp" style={{ "--n": models.length } as React.CSSProperties}>
              <thead>
                <tr>
                  <th className="l" />
                  {models.map((m) => (
                    <th key={m.id} className="l" style={{ "--c": labVar(m.lab) } as React.CSSProperties}>
                      <a className="cmp-h" href={`/v3/models/${m.id}`}><i />{m.name}<span>{m.labName}</span></a>
                    </th>
                  ))}
                </tr>
              </thead>
              {sections.map((sec) => {
                const mine = rows.filter((r) => r.section === sec.id);
                if (!mine.length) return null;
                return (
                  <tbody key={sec.id}>
                    <tr className="divider"><td colSpan={models.length + 1}>{sec.label}</td></tr>
                    {mine.map((r, ri) => (
                      <tr key={r.id} style={{ "--i": ri } as React.CSSProperties}>
                        <td className="l">
                          <div style={{ fontWeight: 600 }}>{r.label}</div>
                          {r.note && <div className="rx-faint" style={{ fontSize: 11.5, fontFamily: "var(--mono)" }}>{r.note}</div>}
                        </td>
                        {r.cells.map((c, i) => (
                          <td key={i} className="l cmp-c" style={{ "--c": labVar(models[i].lab) } as React.CSSProperties}>
                            {c.text == null ? (
                              <span className="blank">—</span>
                            ) : (
                              <>
                                <span className={c.best ? "best" : undefined}>{c.text}</span>
                                {c.delta && <span className="delta">{c.delta}</span>}
                                {c.rank && r.kind === "score" && <span className="rk">#{c.rank.rank} of {c.rank.of}</span>}
                                {c.hint && <span className="rk">{c.hint}</span>}
                                {c.share != null && <span className="cbar"><i style={{ "--w": c.share } as React.CSSProperties} /></span>}
                              </>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                );
              })}
            </table>
          </div>
          <p className="rx-table-note">Highlighted cells lead their row among the models picked; a tie highlights nothing. Gaps are against that row’s leader. Ridge never names an overall winner.</p>
        </section>
      )}
    </div>
  );
}
