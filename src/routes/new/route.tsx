import { createFileRoute, redirect } from "@tanstack/react-router";

/** Old preview URLs: /new and /new/foo → / and /foo. */
export const Route = createFileRoute("/new")({
  beforeLoad: ({ location }) => {
    const next = location.pathname.replace(/^\/new/, "") || "/";
    throw redirect({ href: `${next}${location.searchStr}` });
  },
});
