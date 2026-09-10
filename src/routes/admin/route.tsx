import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAdminSession } from "@/lib/admin/auth";
import { ADMIN_SECURITY_HEADERS } from "@/lib/admin/security";

const getAdminSessionFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const session = await getAdminSession(request.headers);
  if (!session) return null;
  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
});

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ location }) => {
    const isLogin = location.pathname === "/admin/login";
    const session = await getAdminSessionFn();
    if (!session && !isLogin) {
      throw redirect({ to: "/admin/login" });
    }
    if (session && isLogin) {
      throw redirect({ to: "/admin" });
    }
    return { adminSession: session };
  },
  headers: () => ({ ...ADMIN_SECURITY_HEADERS }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="admin-shell min-h-dvh bg-n-base text-n-text antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,184,109,0.08), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(111,131,151,0.06), transparent 50%)",
        }}
      />
      <Outlet />
    </div>
  );
}
