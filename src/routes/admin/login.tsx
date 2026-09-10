import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { adminAuthClient } from "@/lib/admin/auth-client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [{ title: "Ridge Ops — sign in" }],
  }),
});

type BootstrapStatus = {
  needsBootstrap: boolean;
  allowlistConfigured: boolean;
};

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bootstrap, setBootstrap] = useState<BootstrapStatus | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/bootstrap")
      .then(async (r) => {
        if (r.status === 429) {
          const j = (await r.json().catch(() => ({}))) as { error?: string; retryAfterSec?: number };
          setError(
            j.error
              ? `${j.error}${j.retryAfterSec ? ` (${j.retryAfterSec}s)` : ""}`
              : "Too many attempts. Try again later.",
          );
          setBootstrap({ needsBootstrap: false, allowlistConfigured: true });
          return;
        }
        return r.json() as Promise<BootstrapStatus>;
      })
      .then((j) => {
        if (j && "needsBootstrap" in j) setBootstrap(j);
      })
      .catch(() => setBootstrap({ needsBootstrap: false, allowlistConfigured: false }));
  }, []);

  useEffect(() => {
    if (bootstrap?.needsBootstrap) {
      setShowPassword(true);
      return;
    }
    if (
      typeof PublicKeyCredential === "undefined" ||
      typeof PublicKeyCredential.isConditionalMediationAvailable !== "function"
    ) {
      return;
    }
    void PublicKeyCredential.isConditionalMediationAvailable().then((ok) => {
      if (!ok) return;
      void adminAuthClient.signIn.passkey({ autoFill: true });
    });
  }, [bootstrap?.needsBootstrap]);

  function mapAuthError(raw: string | undefined | null, status?: number): string {
    if (status === 429 || (raw && /too many|rate|locked|try again later/i.test(raw))) {
      return raw || "Too many attempts. Try again later.";
    }
    if (!raw) return "Invalid email or password";
    if (/invalid|password|email|credential|unauthorized|user/i.test(raw)) {
      return "Invalid email or password";
    }
    return raw;
  }

  async function onPasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (bootstrap?.needsBootstrap) {
        const res = await fetch("/api/admin/bootstrap", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const j = (await res.json()) as { error?: string; retryAfterSec?: number };
        if (res.status === 429) {
          setError(
            `${j.error ?? "Too many attempts."}${j.retryAfterSec ? ` Retry in ${j.retryAfterSec}s.` : ""}`,
          );
          return;
        }
        if (!res.ok) {
          setError(j.error ?? "Bootstrap failed");
          return;
        }
      }

      const { error: signError } = await adminAuthClient.signIn.email({
        email,
        password,
      });
      if (signError) {
        setError(mapAuthError(signError.message, signError.status));
        return;
      }
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? mapAuthError(err.message) : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onPasskey() {
    setError(null);
    setBusy(true);
    try {
      const { error: signError } = await adminAuthClient.signIn.passkey();
      if (signError) {
        setError(signError.message || "Passkey sign-in failed");
        return;
      }
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Passkey sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  const needsBootstrap = Boolean(bootstrap?.needsBootstrap);

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="overflow-hidden rounded-xl border border-n-line bg-n-raised/90 shadow-[0_0_0_1px_rgba(232,184,109,0.04),0_24px_64px_-32px_rgba(0,0,0,0.8)] backdrop-blur-sm">
        <div className="border-b border-n-line bg-gradient-to-r from-n-amber/[0.07] to-transparent px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-n-line-amber bg-n-base font-serif text-lg text-n-amber">
              R
            </span>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-n-amber">Ridge Ops</p>
              <h1 className="font-serif text-2xl tracking-tight text-n-text">
                {needsBootstrap ? "Create admin" : "Sign in"}
              </h1>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-n-text-3">
            {needsBootstrap
              ? "First-time bootstrap for an allowlisted email. Register a passkey right after — password stays a fallback."
              : "Passkey is preferred. Password is secondary and rate-limited."}
          </p>
        </div>

        <div className="px-6 py-6">
          {!bootstrap?.allowlistConfigured && (
            <p className="mb-4 rounded-lg border border-n-line-amber bg-n-amber/[0.08] px-3 py-2 text-[12px] text-n-amber">
              Set <code className="font-n-mono">RIDGE_ADMIN_EMAIL</code> in{" "}
              <code className="font-n-mono">.env</code> before bootstrap. See ADMIN.md.
            </p>
          )}

          {!needsBootstrap && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onPasskey()}
              className="n-focus group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-n-amber px-3 py-3 text-[14px] font-medium text-n-base transition hover:brightness-105 disabled:opacity-60"
            >
              <PasskeyIcon />
              Sign in with passkey
            </button>
          )}

          {!needsBootstrap && (
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-n-text-3">
              <span className="h-px flex-1 bg-n-line" />
              or password
              <span className="h-px flex-1 bg-n-line" />
            </div>
          )}

          {!needsBootstrap && !showPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword(true)}
              className="n-focus w-full rounded-lg border border-n-line px-3 py-2.5 text-[13px] text-n-text-2 transition hover:border-n-line-2 hover:text-n-text"
            >
              Use password instead
            </button>
          ) : (
            <form className="flex flex-col gap-3" onSubmit={onPasswordSubmit}>
              <label className="flex flex-col gap-1.5 text-[12px] text-n-text-2">
                Email
                <input
                  type="email"
                  name="email"
                  autoComplete="username webauthn"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="n-focus rounded-lg border border-n-line bg-n-base px-3 py-2.5 text-[14px] text-n-text placeholder:text-n-text-3"
                  placeholder="you@example.com"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-[12px] text-n-text-2">
                Password
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password webauthn"
                  required
                  minLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="n-focus rounded-lg border border-n-line bg-n-base px-3 py-2.5 text-[14px] text-n-text"
                />
                <span className="text-[11px] text-n-text-3">At least 12 characters · avoid common passwords</span>
              </label>
              <button
                type="submit"
                disabled={busy}
                className={
                  needsBootstrap
                    ? "n-focus mt-1 rounded-lg bg-n-amber px-3 py-2.5 text-[13px] font-medium text-n-base disabled:opacity-60"
                    : "n-focus mt-1 rounded-lg border border-n-line-2 px-3 py-2.5 text-[13px] text-n-text-2 transition hover:border-n-amber hover:text-n-amber disabled:opacity-60"
                }
              >
                {needsBootstrap ? "Create admin & sign in" : "Sign in with password"}
              </button>
            </form>
          )}

          {error && (
            <p
              className="mt-4 rounded-lg border border-n-down/30 bg-n-down/10 px-3 py-2 text-[12px] text-n-down"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>
      </div>
      <p className="mt-6 text-center text-[11px] text-n-text-3">
        Owner-only · sessions HttpOnly · rate-limited
      </p>
    </div>
  );
}

function PasskeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-90">
      <path
        d="M12 2a5 5 0 0 1 2 9.58V14h2v2h2v2h-6v-6.42A5 5 0 0 1 12 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7" r="1.25" fill="currentColor" />
    </svg>
  );
}
