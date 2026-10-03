import { createFileRoute } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import { labsPresent, ledgerRows } from "@/lib/data/derived";

export const Route = createFileRoute("/v3/models/")({
  component: Models,
  head: () => ({ meta: [{ title: "Models — Ridge" }] }),
});

function Models() {
  const rows = ledgerRows("promo");
  return (
    <div className="rx-wrap">
      {labsPresent().map((lab, li) => {
        const mine = rows.filter((r) => r.model.lab === lab.id).sort((a, b) => b.model.released.localeCompare(a.model.released));
        return (
          <section key={lab.id} className="rx-sec rx-in" style={{ "--d": `${li * 60}ms`, "--c": labVar(lab.id) } as React.CSSProperties}>
            <div className="rx-sec-head">
              <div>
                <div className="rx-kicker" style={{ color: labVar(lab.id) }}>● {mine.length} on the ledger</div>
                <h2>{lab.label}</h2>
              </div>
            </div>
            <table className="rx-table">
              <tbody>
                {mine.map((r, i) => (
                  <tr key={r.model.id} style={{ "--i": i, "--c": labVar(lab.id) } as React.CSSProperties}>
                    <td className="l">
                      <a className="m" href={`/v3/models/${r.model.id}`}><span className="dot" /><span className="m-name">{r.model.name}</span></a>
                      <div className="rx-faint" style={{ fontSize: 13, whiteSpace: "normal", maxWidth: 640, marginTop: 4 }}>{r.model.summary}</div>
                    </td>
                    <td style={{ verticalAlign: "top" }}>{r.model.released}</td>
                    <td style={{ verticalAlign: "top" }}>{r.scores["aa-intelligence"] ? <b>AA {r.scores["aa-intelligence"].value}</b> : <span className="blank">no AA row</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
