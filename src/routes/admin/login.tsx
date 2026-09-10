import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { adminAuthClient } from "@/lib/admin/auth-client";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
  head: () => ({
    meta: [{ title: "Ridge Admin — sign in" }],
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

  useEffect(() => {
    void fetch("/api/admin/bootstrap")
      .then((r) => r.json())
      .then((j: BootstrapStatus) => setBootstrap(j))
      .catch(() => setBootstrap({ needsBootstrap: false, allowlistConfigured: false }));
  }, []);

  useEffect(() => {
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
  }, []);

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
        const j = (await res.json()) as { error?: string };
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
        setError(signError.message || "Sign-in failed");
        return;
      }
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
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

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border border-n-line bg-n-raised p-6">
        <p className="text-[11px] uppercase tracking-[0.14em] text-n-amber">Ridge admin</p>
        <h1 className="mt-2 font-serif text-2xl tracking-tight">Sign in</h1>
        <p className="mt-2 text-[13px] text-n-text-3">
          {bootstrap?.needsBootstrap
            ? "Create the first allowlisted admin (password bootstrap). Add a passkey after login."
            : "Passkey preferred. Password works as fallback."}
        </p>

        {!bootstrap?.allowlistConfigured && (
          <p className="mt-4 rounded border border-n-line-amber bg-n-amber/[0.08] px-3 py-2 text-[12px] text-n-amber">
            Set <code className="font-n-mono">RIDGE_ADMIN_EMAIL</code> in{" "}
            <code className="font-n-mono">.env</code> before bootstrap. See ADMIN.md.
          </p>
        )}

        <form className="mt-6 flex flex-col gap-3" onSubmit={onPasswordSubmit}>
          <label className="flex flex-col gap-1 text-[12px] text-n-text-2">
            Email
            <input
              type="email"
              name="email"
              autoComplete="username webauthn"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="n-focus rounded-md border border-n-line bg-n-base px-3 py-2 text-[14px] text-n-text"
            />
          </label>
          <label className="flex flex-col gap-1 text-[12px] text-n-text-2">
            Password
            <input
              type="password"
              name="password"
              autoComplete="current-password webauthn"
              required
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="n-focus rounded-md border border-n-line bg-n-base px-3 py-2 text-[14px] text-n-text"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="n-focus mt-2 rounded-md bg-n-amber px-3 py-2 text-[13px] font-medium text-n-base disabled:opacity-60"
          >
            {bootstrap?.needsBootstrap ? "Create admin & sign in" : "Sign in with password"}
          </button>
        </form>

        {!bootstrap?.needsBootstrap && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void onPasskey()}
            className="n-focus mt-3 w-full rounded-md border border-n-line-2 px-3 py-2 text-[13px] text-n-text-2 hover:border-n-amber hover:text-n-amber disabled:opacity-60"
          >
            Sign in with passkey
          </button>
        )}

        {error && (
          <p className="mt-4 text-[12px] text-n-down" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
