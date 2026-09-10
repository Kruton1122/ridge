import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { getAdminSession } from "@/lib/admin/auth";

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
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-dvh bg-n-base text-n-text antialiased">
      <Outlet />
    </div>
  );
}
