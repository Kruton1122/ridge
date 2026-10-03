import { createFileRoute, redirect } from "@tanstack/react-router";

/** Preview URLs: /v3 and /v3/foo → / and /foo. */
export const Route = createFileRoute("/v3")({
  beforeLoad: ({ location }) => {
    const next = location.pathname.replace(/^\/v3/, "") || "/";
    throw redirect({ href: `${next}${location.searchStr}` });
  },
});
