import { createFileRoute, useNavigate, useRouteContext } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adminAuthClient } from "@/lib/admin/auth-client";
import type { StatsPayload } from "@/lib/admin/analytics";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [{ title: "Ridge Admin — traffic" }],
  }),
});

type RangeKey = "h24" | "d7";

function AdminDashboard() {
  const { adminSession } = useRouteContext({ from: "/admin" });
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<RangeKey>("h24");
  const [passkeyMsg, setPasskeyMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      if (res.status === 401) {
        await navigate({ to: "/admin/login" });
        return;
      }
      if (!res.ok) {
        setError(`stats ${res.status}`);
        return;
      }
      setStats((await res.json()) as StatsPayload);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load stats");
    }
  }, [navigate]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(id);
  }, [load]);

  const current = stats?.ranges[range];

  const chartData = useMemo(() => {
    if (!current) return [];
    return current.hourly.map((h) => ({
      label: range === "h24" ? h.hour.slice(11, 16) : h.hour.slice(5, 13),
      count: h.count,
    }));
  }, [current, range]);

  async function signOut() {
    await adminAuthClient.signOut();
    await navigate({ to: "/admin/login" });
  }

  async function addPasskey() {
    setPasskeyMsg(null);
    const { error: err } = await adminAuthClient.passkey.addPasskey({
      name: "Ridge Admin",
    });
    if (err) {
      setPasskeyMsg(err.message || "Failed to register passkey");
      return;
    }
    setPasskeyMsg("Passkey registered.");
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-n-line pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-n-amber">Ridge admin</p>
          <h1 className="font-serif text-2xl tracking-tight">Traffic</h1>
          <p className="mt-1 text-[12px] text-n-text-3">
            Signed in as {adminSession?.user.email ?? "—"}. First-party beacon · live-ish refresh 15s.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void addPasskey()}
            className="n-focus rounded-md border border-n-line px-2.5 py-1.5 text-[12px] text-n-text-2 hover:border-n-amber hover:text-n-amber"
          >
            Add passkey
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="n-focus rounded-md border border-n-line px-2.5 py-1.5 text-[12px] text-n-text-2 hover:text-n-text"
          >
            Sign out
          </button>
        </div>
      </header>

      {passkeyMsg && (
        <p className="mt-3 text-[12px] text-n-up">{passkeyMsg}</p>
      )}
      {error && (
        <p className="mt-3 text-[12px] text-n-down" role="alert">
          {error}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        {(
          [
            ["h24", "Last 24h"],
            ["d7", "Last 7d"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setRange(key)}
            className={
              range === key
                ? "rounded-md bg-n-amber/15 px-2.5 py-1 text-[12px] text-n-amber"
                : "rounded-md px-2.5 py-1 text-[12px] text-n-text-3 hover:text-n-text-2"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Pageviews" value={current?.pageviews ?? 0} />
        <StatCard label="Top path" value={current?.topPaths[0]?.path ?? "—"} mono />
        <StatCard
          label="Top referrer"
          value={current?.topReferrers[0]?.host ?? "—"}
          mono
        />
      </section>

      <section className="mt-6 rounded-lg border border-n-line bg-n-raised p-4">
        <h2 className="text-[12px] uppercase tracking-[0.12em] text-n-text-3">Volume</h2>
        <div className="mt-3 h-48">
          {chartData.length === 0 ? (
            <Empty>No hits yet. Browse the public site to seed the beacon.</Empty>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#6f8397", fontSize: 10 }}
                  axisLine={{ stroke: "#1a2635" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#6f8397", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: "#0c1926",
                    border: "1px solid #1a2635",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#e8b86d" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <TableCard
          title="Paths"
          rows={(current?.topPaths ?? []).map((r) => [r.path, String(r.count)])}
          empty="No paths yet"
        />
        <TableCard
          title="Referrers"
          rows={(current?.topReferrers ?? []).map((r) => [r.host, String(r.count)])}
          empty="No referrers yet"
        />
        <TableCard
          title="Countries"
          rows={(current?.topCountries ?? []).map((r) => [r.country, String(r.count)])}
          empty="No country headers yet (needs CF-IPCountry)"
        />
      </div>

      <section className="mt-6 rounded-lg border border-n-line bg-n-raised p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-[12px] uppercase tracking-[0.12em] text-n-text-3">Recent hits</h2>
          <span className="n-num text-[11px] text-n-text-3">
            {stats ? new Date(stats.generatedAt).toLocaleString() : "—"}
          </span>
        </div>
        {(stats?.recent.length ?? 0) === 0 ? (
          <Empty>Waiting for first beacon.</Empty>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[12px]">
              <thead className="text-n-text-3">
                <tr className="border-b border-n-line">
                  <th className="py-1.5 pr-3 font-medium">When</th>
                  <th className="py-1.5 pr-3 font-medium">Path</th>
                  <th className="py-1.5 pr-3 font-medium">Referrer</th>
                  <th className="py-1.5 pr-3 font-medium">CC</th>
                  <th className="py-1.5 font-medium">Lang</th>
                </tr>
              </thead>
              <tbody>
                {stats!.recent.map((hit, i) => (
                  <tr key={`${hit.ts}-${i}`} className="border-b border-n-line/70">
                    <td className="n-num py-1.5 pr-3 text-n-text-3 whitespace-nowrap">
                      {new Date(hit.ts).toLocaleString()}
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[11px]">{hit.path}</td>
                    <td className="py-1.5 pr-3 text-n-text-2">
                      {hit.referrerHost ?? "(direct)"}
                    </td>
                    <td className="py-1.5 pr-3 font-mono text-[11px]">
                      {hit.country ?? "—"}
                    </td>
                    <td className="py-1.5 text-n-text-3">{hit.language ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats && (
        <p className="mt-4 text-[11px] text-n-text-3">{stats.cloudflare.note}</p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | number;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-n-line bg-n-raised px-4 py-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-n-text-3">{label}</p>
      <p
        className={
          mono
            ? "mt-1 truncate font-mono text-[14px] text-n-text"
            : "n-num mt-1 text-[22px] text-n-amber"
        }
      >
        {value}
      </p>
    </div>
  );
}

function TableCard({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: [string, string][];
  empty: string;
}) {
  return (
    <div className="rounded-lg border border-n-line bg-n-raised p-4">
      <h2 className="text-[12px] uppercase tracking-[0.12em] text-n-text-3">{title}</h2>
      {rows.length === 0 ? (
        <Empty>{empty}</Empty>
      ) : (
        <ul className="mt-2 divide-y divide-n-line">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-3 py-1.5 text-[12px]">
              <span className="min-w-0 truncate font-mono text-[11px] text-n-text-2">{k}</span>
              <span className="n-num shrink-0 text-n-text">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Empty({ children }: { children: import("react").ReactNode }) {
  return <p className="mt-3 text-[12px] text-n-text-3">{children}</p>;
}
