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
    meta: [{ title: "Ridge Ops — Traffic" }],
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
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 15_000);
    return () => window.clearInterval(id);
  }, [load]);

  const current = stats?.ranges[range];
  const other = stats?.ranges[range === "h24" ? "d7" : "h24"];

  const chartData = useMemo(() => {
    if (!current) return [];
    return current.hourly.map((h) => ({
      label: range === "h24" ? h.hour.slice(11, 16) : h.hour.slice(5, 13),
      count: h.count,
    }));
  }, [current, range]);

  const topCountry = current?.topCountries.find((c) => c.country !== "(unknown)")?.country
    ?? current?.topCountries[0]?.country
    ?? "—";

  async function signOut() {
    await adminAuthClient.signOut();
    await navigate({ to: "/admin/login" });
  }

  async function addPasskey() {
    setPasskeyMsg(null);
    const { error: err } = await adminAuthClient.passkey.addPasskey({
      name: `Ridge Ops · ${new Date().toISOString().slice(0, 10)}`,
    });
    if (err) {
      setPasskeyMsg(err.message || "Failed to register passkey");
      return;
    }
    setPasskeyMsg("Passkey registered — prefer it next sign-in.");
  }

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-n-line pb-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-n-line-amber bg-n-raised font-serif text-base text-n-amber">
              R
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-n-amber">Ridge Ops</p>
              <h1 className="font-serif text-[1.65rem] leading-tight tracking-tight text-n-text">
                Traffic
              </h1>
            </div>
          </div>
          <p className="mt-2 truncate text-[12px] text-n-text-3">
            {adminSession?.user.email ?? "—"} · first-party beacon · refresh 15s
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <LiveDot />
          <button
            type="button"
            onClick={() => void addPasskey()}
            className="n-focus rounded-lg border border-n-line-amber bg-n-amber/[0.08] px-3 py-1.5 text-[12px] text-n-amber transition hover:bg-n-amber/[0.14]"
          >
            Add passkey
          </button>
          <button
            type="button"
            onClick={() => void signOut()}
            className="n-focus rounded-lg border border-n-line px-3 py-1.5 text-[12px] text-n-text-2 transition hover:border-n-line-2 hover:text-n-text"
          >
            Sign out
          </button>
        </div>
      </header>

      {passkeyMsg && (
        <p className="mt-3 rounded-lg border border-n-up/25 bg-n-up/10 px-3 py-2 text-[12px] text-n-up">
          {passkeyMsg}
        </p>
      )}
      {error && (
        <p className="mt-3 rounded-lg border border-n-down/30 bg-n-down/10 px-3 py-2 text-[12px] text-n-down" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 flex gap-1 rounded-lg border border-n-line bg-n-raised/60 p-1 w-fit">
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
                ? "rounded-md bg-n-amber/15 px-3 py-1.5 text-[12px] font-medium text-n-amber"
                : "rounded-md px-3 py-1.5 text-[12px] text-n-text-3 transition hover:text-n-text-2"
            }
          >
            {label}
          </button>
        ))}
      </div>

      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label={range === "h24" ? "24h views" : "7d views"}
          value={fmt(current?.pageviews)}
          hint={other ? `${range === "h24" ? "7d" : "24h"}: ${fmt(other.pageviews)}` : undefined}
          loading={loading && !stats}
        />
        <KpiCard
          label="Unique-ish"
          value={fmt(current?.uniqueApprox)}
          hint="UA · country · lang fingerprint"
          loading={loading && !stats}
        />
        <KpiCard
          label="Top country"
          value={topCountry}
          mono={topCountry.length <= 3}
          loading={loading && !stats}
        />
        <KpiCard
          label="Top path"
          value={current?.topPaths[0]?.path ?? "—"}
          mono
          loading={loading && !stats}
        />
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-n-line bg-n-raised/80">
        <div className="flex items-baseline justify-between gap-2 border-b border-n-line px-4 py-3">
          <h2 className="text-[12px] uppercase tracking-[0.14em] text-n-text-3">Volume</h2>
          <span className="text-[11px] text-n-text-3">
            {range === "h24" ? "Hourly" : "Hourly · 7 days"}
          </span>
        </div>
        <div className="px-2 pb-3 pt-2 sm:px-4">
          <div className="h-52 sm:h-56">
            {chartData.length === 0 ? (
              <EmptyState>
                No hits yet. Browse the public site to seed the beacon.
              </EmptyState>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6f8397", fontSize: 10 }}
                    axisLine={{ stroke: "#1a2635" }}
                    tickLine={false}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#6f8397", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(232,184,109,0.06)" }}
                    contentStyle={{
                      background: "#0c1926",
                      border: "1px solid #1a2635",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#e8eef4",
                    }}
                  />
                  <Bar dataKey="count" fill="#e8b86d" radius={[3, 3, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <TableCard
          title="Top pages"
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

      <section className="mt-5 overflow-hidden rounded-xl border border-n-line bg-n-raised/80">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-n-line px-4 py-3">
          <div className="flex items-center gap-2">
            <h2 className="text-[12px] uppercase tracking-[0.14em] text-n-text-3">Recent hits</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-n-line px-2 py-0.5 text-[10px] uppercase tracking-wider text-n-text-3">
              <span className="admin-pulse h-1.5 w-1.5 rounded-full bg-n-up" />
              Live
            </span>
          </div>
          <span className="n-num text-[11px] text-n-text-3">
            {stats ? formatWhen(stats.generatedAt) : "—"}
          </span>
        </div>
        {(stats?.recent.length ?? 0) === 0 ? (
          <div className="px-4 py-6">
            <EmptyState>Waiting for first beacon.</EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-[12px]">
              <thead className="text-n-text-3">
                <tr className="border-b border-n-line">
                  <th className="px-4 py-2 font-medium">When</th>
                  <th className="py-2 pr-3 font-medium">Path</th>
                  <th className="py-2 pr-3 font-medium">Referrer</th>
                  <th className="py-2 pr-3 font-medium">CC</th>
                  <th className="py-2 pr-4 font-medium">Lang</th>
                </tr>
              </thead>
              <tbody>
                {stats!.recent.map((hit, i) => (
                  <tr
                    key={`${hit.ts}-${i}`}
                    className="border-b border-n-line/60 transition-colors hover:bg-n-amber/[0.03]"
                    style={{
                      animation: i < 8 ? `adminHitIn 420ms ease ${i * 28}ms both` : undefined,
                    }}
                  >
                    <td className="n-num whitespace-nowrap px-4 py-2 text-n-text-3">
                      {formatWhen(hit.ts)}
                    </td>
                    <td className="max-w-[220px] truncate py-2 pr-3 font-mono text-[11px] text-n-text">
                      {hit.path}
                    </td>
                    <td className="py-2 pr-3 text-n-text-2">
                      {hit.referrerHost ?? "(direct)"}
                    </td>
                    <td className="py-2 pr-3 font-mono text-[11px]">{hit.country ?? "—"}</td>
                    <td className="py-2 pr-4 text-n-text-3">{hit.language ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {stats && (
        <p className="mt-5 text-[11px] leading-relaxed text-n-text-3">{stats.cloudflare.note}</p>
      )}

      <style>{`
        @keyframes adminHitIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes adminPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .admin-pulse { animation: adminPulse 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function fmt(n: number | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString();
}

function formatWhen(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "—";
  }
}

function LiveDot() {
  return (
    <span className="mr-1 hidden items-center gap-1.5 text-[11px] text-n-text-3 sm:inline-flex">
      <span className="admin-pulse h-1.5 w-1.5 rounded-full bg-n-up" />
      Live
    </span>
  );
}

function KpiCard({
  label,
  value,
  hint,
  mono,
  loading,
}: {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
  loading?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-n-line bg-n-raised/80 px-4 py-3.5">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-n-amber/40 to-transparent"
      />
      <p className="text-[11px] uppercase tracking-[0.14em] text-n-text-3">{label}</p>
      {loading ? (
        <div className="mt-2 h-7 w-20 animate-pulse rounded bg-n-overlay" />
      ) : (
        <p
          className={
            mono
              ? "mt-1.5 truncate font-mono text-[15px] text-n-text"
              : "n-num mt-1 text-[1.65rem] leading-none tracking-tight text-n-amber"
          }
          title={value}
        >
          {value}
        </p>
      )}
      {hint && <p className="mt-1.5 truncate text-[11px] text-n-text-3">{hint}</p>}
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
    <div className="rounded-xl border border-n-line bg-n-raised/80 p-4">
      <h2 className="text-[12px] uppercase tracking-[0.14em] text-n-text-3">{title}</h2>
      {rows.length === 0 ? (
        <EmptyState>{empty}</EmptyState>
      ) : (
        <ul className="mt-2 divide-y divide-n-line">
          {rows.map(([k, v]) => (
            <li key={k} className="flex items-baseline justify-between gap-3 py-2 text-[12px]">
              <span className="min-w-0 truncate font-mono text-[11px] text-n-text-2" title={k}>
                {k}
              </span>
              <span className="n-num shrink-0 tabular-nums text-n-text">{v}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState({ children }: { children: import("react").ReactNode }) {
  return (
    <div className="mt-3 flex flex-col items-start gap-1 rounded-lg border border-dashed border-n-line bg-n-base/40 px-3 py-4">
      <p className="text-[12px] text-n-text-3">{children}</p>
    </div>
  );
}
