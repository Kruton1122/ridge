import { createFileRoute } from "@tanstack/react-router";
import { ensureAdminAuthMigrated, getAdminAuth } from "@/lib/admin/auth";

/**
 * Better Auth catch-all for Ridge admin: /api/admin/auth/*
 */
async function handle({ request }: { request: Request }) {
  await ensureAdminAuthMigrated();
  const auth = getAdminAuth();
  return auth.handler(request);
}

export const Route = createFileRoute("/api/admin/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
      OPTIONS: handle,
    },
  },
});
