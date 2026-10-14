import { createFileRoute } from "@tanstack/react-router";
import { labVar } from "@/components/v3/shell";
import type { LabId } from "@/lib/data/types";
import { VOICE_AS_OF, VOICE_ROWS, VOICE_SOURCE, type VoiceRow } from "@/lib/data/voice";

export const Route = createFileRoute("/_site/voice")({
  component: Voice,
  head: () => ({
    meta: [
      { title: "Voice | Ridge" },
      { name: "description", content: "Speech to speech models ranked on the Artificial Analysis Speech to Speech Index, with time to first audio. Kept apart from the text ledger." },
    ],
  }),
});

const PROVIDER_LAB: Record<string, LabId> = {
  SpaceXAI: "xai",
  OpenAI: "openai",
  Google: "google",
  "Alibaba Cloud": "alibaba",
};

const n = (v: string | null) => (v == null ? null : Number.parseFloat(v));

function Cell({ v }: { v: string | null }) {
  return v == null ? <span className="blank">—</span> : <>{v}</>;
}

function Voice() {
  const scored = VOICE_ROWS.filter((r) => r.index != null);
  const unscored = VOICE_ROWS.filter((r) => r.index == null);
  const top = Math.max(...scored.map((r) => n(r.index) ?? 0), 1);
  let rank = 0;
  let prev: number | null = null;
  const ranks = scored.map((r, i) => {
    const v = n(r.index);
    if (v !== prev) rank = i + 1;
    prev = v;
    return rank;
  });
  const tied = (i: number) => ranks.filter((x) => x === ranks[i]).length > 1;

  const line = (r: VoiceRow, i: number, rk: number | null, tie: boolean) => (
    <tr key={`${r.provider}-${r.model}`} className={rk == null ? "unscored" : undefined}
      style={{ "--i": Math.min(i, 30), "--c": labVar(PROVIDER_LAB[r.provider]) } as React.CSSProperties}>
      <td className="rank">{rk != null ? <b>{tie ? `=${rk}` : rk}</b> : <span className="blank">—</span>}</td>
      <td className="l">
        <span className="m">
          <span className="dot" />
          <span className="m-name">{r.model}</span>
          <span className="m-lab">{r.provider}</span>
        </span>
      </td>
      <td>
        {r.index != null ? (
          <span className="aa">
            <span className="bar"><i style={{ "--w": (n(r.index) ?? 0) / top } as React.CSSProperties} /></span>
            <b className={n(r.index) === top ? "best" : undefined}>{r.index}</b>
          </span>
        ) : <span className="blank">—</span>}
      </td>
      <td><Cell v={r.ttfa} /></td>
      <td><Cell v={r.reasoning} /></td>
      <td><Cell v={r.dynamics} /></td>
      <td><Cell v={r.agentic} /></td>
      <td><Cell v={r.taskSuccess} /></td>
      <td><Cell v={r.arenaElo} /></td>
    </tr>
  );

  return (
    <div className="rx-wrap">
      <header className="rx-page-head rx-in">
        <div className="rx-kicker">Speech to speech · as of {VOICE_AS_OF}</div>
        <h1>Voice</h1>
        <p className="dek">
          Voice models that listen and talk back, ranked on the{" "}
          <a className="rx-link" href={VOICE_SOURCE.url}>Artificial Analysis Speech to Speech Index</a>. This board is kept
          apart from the text ledger: a voice score and a text score measure different things and never share a column.
        </p>
      </header>
      <div className="rx-table-wrap" style={{ marginTop: 22 }}>
        <table className="rx-table">
          <thead>
            <tr>
              <th>#</th>
              <th className="l">Model</th>
              <th>S2S Index</th>
              <th>First audio (s)</th>
              <th>Reasoning</th>
              <th>Conversation</th>
              <th>Agentic</th>
              <th>Task success</th>
              <th>Arena Elo</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r, i) => line(r, i, ranks[i], tied(i)))}
            {unscored.length > 0 && (
              <tr className="divider"><td colSpan={9}>Listed by AA without an Index score yet. Component results shown where AA published them.</td></tr>
            )}
            {unscored.map((r, i) => line(r, scored.length + i, null, false))}
          </tbody>
        </table>
      </div>
      <p className="rx-table-note">
        All numbers are copied from {VOICE_SOURCE.name} as shown on its Speech to Speech page, as of {VOICE_AS_OF}. The
        Index is AA&apos;s weighted average of speech reasoning (Big Bench Audio), agentic performance, arena preference and
        task success. First audio is AA&apos;s measured time to first audio, lower is faster. A blank means AA shows no
        value. Ridge does not fill it in.
      </p>
    </div>
  );
}
