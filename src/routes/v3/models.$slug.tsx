import { createFileRoute, notFound } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import { ABOUTS } from "@/lib/data/abouts";
import { formatContext, getModel } from "@/lib/data/catalog";
import { board, dossier, formatValue, money } from "@/lib/data/derived";

export const Route = createFileRoute("/v3/models/$slug")({
  component: ModelPage,
  loader: ({ params }) => {
    if (!getModel(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const m = getModel(params.slug);
    return { meta: [{ title: m ? `${m.name} — Ridge` : "Not on the ledger — Ridge" }] };
  },
});

const longDate = (d: string) =>
  new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function ModelPage() {
  const { slug } = Route.useParams();
  const d = dossier(slug, "promo");
  if (!d) return null;
  const m = d.model;
  const about = ABOUTS[m.id];
  const c = { "--c": labVar(m.lab) } as React.CSSProperties;
  const ord = (n: number) => `${n}${["th", "st", "nd", "rd"][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10 < 4 ? n % 10 : 0]}`;

  const stats = [
    { k: "AA Index v4.2", v: d.aa ? String(d.aa.value) : "—", s: d.aa ? `${d.aa.tied ? "joint " : ""}${ord(d.aa.rank)} of ${d.aa.of}` : "No published score" },
    { k: "Price, mid", v: d.midPrice != null ? money(d.midPrice) : "—", s: m.pricing ? `$${m.pricing.inputPerM} in · $${m.pricing.outputPerM} out per 1M` : "Not listed" },
    { k: "$ per point", v: d.dollarPerAa != null ? `$${d.dollarPerAa.toFixed(2)}` : "—", s: d.dollarPerAaRank ? `${ord(d.dollarPerAaRank.rank)} cheapest of ${d.dollarPerAaRank.of}` : "Needs a price and a score" },
    { k: "Context", v: m.contextTokens ? formatContext(m.contextTokens) : "—", s: "tokens" },
    { k: "Released", v: shortDate(m.released), s: `${m.license === "open-weight" ? "Open weights" : "Proprietary"} · ${m.status.toUpperCase()}` },
  ];

  return (
    <div className="rx-wrap" style={c}>
      <header className="rx-model-head rx-in">
        <div className="eyebrow rx-kicker"><i />{m.labName} · model</div>
        <h1>{m.name}</h1>
        <p className="dek">{m.summary}</p>
      </header>

      <div className="rx-stats rx-in" style={{ "--d": "100ms" } as React.CSSProperties}>
        {stats.map((s) => (
          <div key={s.k}>
            <div className="rx-kicker">{s.k}</div>
            <div className="v">{s.v}</div>
            <div className="s">{s.s}</div>
          </div>
        ))}
      </div>

      <section className="rx-sec">
        <div className="rx-sec-head">
          <div>
            <div className="rx-kicker">Fig. 1</div>
            <h2>Where it stands</h2>
          </div>
          <p>Each line is one board. Faint dots are every other model on it; the coloured one is {m.shortName || m.name}.</p>
        </div>
        <div className="rx-strips">
          {d.scores.map(({ benchmark: b, rank }, i) => {
            const rows = board(b.id);
            const vals = rows.map((r) => r.score.value);
            const lo = Math.min(...vals), hi = Math.max(...vals);
            const pos = (v: number) => `${hi === lo ? 50 : ((b.higherIsBetter ? v - lo : hi - v) / (hi - lo)) * 100}%`;
            return (
              <div key={b.id} className="rx-strip">
                <div>
                  <div className="bn">{b.name}</div>
                  <div className="bs">{b.sourceName} · as of {rank.score.asOf}</div>
                </div>
                <div className="track" aria-hidden="true">
                  {rows.filter((r) => r.model.id !== m.id).map((r) => <i key={r.model.id} style={{ left: pos(r.score.value) }} title={`${r.model.name}: ${formatValue(b, r.score.value)}`} />)}
                  <b style={{ left: pos(rank.value), "--i": i } as React.CSSProperties} />
                </div>
                <div className="rv">
                  <a className="v" href={rank.score.sourceUrl} target="_blank" rel="noreferrer">{formatValue(b, rank.value)}</a>
                  <div className="r">{rank.tied ? "joint " : ""}{ord(rank.rank)} of {rank.of}</div>
                </div>
              </div>
            );
          })}
          {d.missing.map((b) => (
            <div key={b.id} className="rx-strip missing">
              <div>
                <div className="bn">{b.name}</div>
                <div className="bs">{b.sourceName} hasn’t published a row</div>
              </div>
              <div className="track" aria-hidden="true" />
              <div className="rv"><span className="v rx-faint">—</span></div>
            </div>
          ))}
        </div>
      </section>

      <section className="rx-sec">
        <div className="rx-cols">
          <div>
            <div className="rx-sec-head" style={{ marginBottom: 18 }}>
              <div>
                <div className="rx-kicker">Profile</div>
                <h2>About {m.shortName || m.name}</h2>
              </div>
            </div>
            <div className="rx-prose">
              {(about?.lede ?? m.summary).split(/\n\n+/).map((p, i) => <p key={i}>{p}</p>)}
            </div>
            {about?.claims?.length ? (
              <>
                <div className="rx-kicker" style={{ marginTop: 26 }}>What {m.labName} claims — their words, not Ridge’s measurements</div>
                <ul className="rx-claims">{about.claims.map((cl) => <li key={cl}>{cl}</li>)}</ul>
              </>
            ) : null}
            {m.publicOpinionStars ? (
              <div style={{ marginTop: 26 }}>
                <div className="rx-kicker">Public opinion{m.publicOpinionAsOf ? ` · as of ${m.publicOpinionAsOf}` : ""}</div>
                <div className="rx-stars" aria-label={`${m.publicOpinionStars} of 5`}>
                  {"★".repeat(m.publicOpinionStars)}<span className="rx-faint">{"★".repeat(5 - m.publicOpinionStars)}</span>
                </div>
                {m.publicOpinionNote && <p className="rx-muted" style={{ margin: "4px 0 0", fontSize: 14 }}>{m.publicOpinionNote}</p>}
              </div>
            ) : null}
          </div>
          <div>
            <div className="rx-kicker" style={{ paddingBottom: 8, borderBottom: "2px solid var(--rule-strong)" }}>Specifications</div>
            <dl className="rx-specs">
              {(about?.specs ?? [
                { label: "Released", value: longDate(m.released) },
                { label: "Context", value: m.contextTokens ? `${formatContext(m.contextTokens)} tokens` : "—" },
              ]).map((s) => (
                <div key={s.label}><dt>{s.label}</dt><dd>{s.value}</dd></div>
              ))}
            </dl>
            {about?.whereUsed?.length ? (
              <>
                <div className="rx-kicker" style={{ marginTop: 22 }}>Where it ships</div>
                <p className="rx-muted" style={{ fontSize: 14, margin: "6px 0 0" }}>{about.whereUsed.join(" · ")}</p>
              </>
            ) : null}
            {d.siblings.length > 0 && (
              <>
                <div className="rx-kicker" style={{ marginTop: 22 }}>Also from {m.labName}</div>
                <div className="rx-sib">
                  {d.siblings.slice(0, 8).map((s) => <a key={s.id} href={`/v3/models/${s.id}`}>{s.name}</a>)}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="rx-sec">
        <div className="rx-sec-head">
          <div>
            <div className="rx-kicker">Receipts</div>
            <h2>Every number on this page</h2>
          </div>
          <p>Where each figure was published and when Ridge read it. If it isn’t here, Ridge doesn’t claim it.</p>
        </div>
        <table className="rx-sources">
          <tbody>
            {d.scores.map(({ benchmark: b, rank }) => (
              <tr key={b.id}>
                <td>{b.name}{rank.score.harness ? <span className="rx-faint"> · {rank.score.harness}</span> : null}{rank.score.note ? <div className="rx-faint" style={{ fontSize: 12.5 }}>{rank.score.note}</div> : null}</td>
                <td className="n">{formatValue(b, rank.value)}</td>
                <td><a href={rank.score.sourceUrl} target="_blank" rel="noreferrer">{rank.score.sourceName}</a></td>
                <td className="n rx-faint">{rank.score.asOf}</td>
              </tr>
            ))}
            {about?.sources?.map((s) => (
              <tr key={s.url}>
                <td colSpan={2} className="rx-muted">{s.label}</td>
                <td colSpan={2}><a href={s.url} target="_blank" rel="noreferrer">{new URL(s.url).hostname.replace(/^www\./, "")}</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {(d.news.length > 0 || d.wire.length > 0) && (
        <section className="rx-sec">
          <div className="rx-sec-head">
            <div>
              <div className="rx-kicker">In the news</div>
              <h2>Where it came up</h2>
            </div>
          </div>
          <div className="rx-desk">
            <div>
              {d.news.slice(0, 3).map((n) => (
                <a key={n.id} className="rx-story" href={`/news/${n.id}`}>
                  <span className="rx-kicker">{shortDate(n.date)} · {n.kind}</span>
                  <h3>{n.title}</h3>
                  <p>{n.dek}</p>
                </a>
              ))}
            </div>
            <div className="rx-wire">
              {d.wire.slice(0, 6).map((w) => (
                <a key={w.id} href={w.url} target="_blank" rel="noreferrer">
                  <span className="d">{shortDate(w.date)}</span>
                  <span><span className="t">{w.title}</span><div className="o">{w.outlet}</div></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function shortDate(d: string): string {
  return new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
