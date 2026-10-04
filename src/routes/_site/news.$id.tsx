import { createFileRoute, notFound } from "@tanstack/react-router";
import { Linkify } from "@/components/v3/linkify";
import { labVar } from "@/components/v3/shell";
import { getModel } from "@/lib/data/catalog";
import { NEWS } from "@/lib/data/desk";
import { rankOf } from "@/lib/data/derived";

export const Route = createFileRoute("/_site/news/$id")({
  component: Note,
  loader: ({ params }) => {
    if (!NEWS.some((n) => n.id === params.id)) throw notFound();
    return null;
  },
  head: ({ params }) => ({ meta: [{ title: `${NEWS.find((n) => n.id === params.id)?.title ?? "Note"} | Ridge` }] }),
});

function Note() {
  const { id } = Route.useParams();
  const sorted = [...NEWS].sort((a, b) => b.date.localeCompare(a.date));
  const i = sorted.findIndex((n) => n.id === id);
  const n = sorted[i];
  const next = sorted[i + 1];
  const models = n.models.map((m) => getModel(m)).filter((m): m is NonNullable<typeof m> => Boolean(m));
  return (
    <div className="rx-wrap">
      <article className="rx-article">
        <header className="rx-in">
          <div className="rx-kicker">{new Date(`${n.date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} · {n.kind}</div>
          <h1>{n.title}</h1>
          <p className="dek">{n.dek}</p>
          <p className="src">Source · <a className="rx-link" href={n.sourceUrl} target="_blank" rel="noreferrer">{n.sourceName}</a></p>
        </header>
        {n.pull && <blockquote className="rx-pull rx-in">{n.pull}</blockquote>}
        <div className="rx-prose rx-in" style={{ "--d": "100ms" } as React.CSSProperties}>
          {n.body.map((p, k) => <p key={k}><Linkify text={p} /></p>)}
        </div>
        {models.length > 0 && (
          <section className="rx-sec">
            <div className="rx-sec-head"><div><div className="rx-kicker">Live from the ledger</div><h2>The models in this note</h2></div><p>Today’s numbers, not the ones on the day this was filed.</p></div>
            <table className="rx-table">
              <tbody>
                {models.map((m, k) => {
                  const r = rankOf(m.id, "aa-intelligence");
                  return (
                    <tr key={m.id} style={{ "--i": k, "--c": labVar(m.lab) } as React.CSSProperties}>
                      <td className="l"><a className="m" href={`/models/${m.id}`}><span className="dot" /><span className="m-name">{m.name}</span><span className="m-lab">{m.labName}</span></a></td>
                      <td>{r ? <b>AA {r.value}</b> : <span className="blank">no AA row</span>}</td>
                      <td className="rx-faint">{r ? `${r.tied ? "joint " : ""}#${r.rank} of ${r.of}` : ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}
        {next && (
          <a className="rx-next" href={`/news/${next.id}`}>
            <span className="rx-kicker">Earlier note</span>
            <span className="t">{next.title}</span>
          </a>
        )}
      </article>
    </div>
  );
}
