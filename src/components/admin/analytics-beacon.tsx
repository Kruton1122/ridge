import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Tiny first-party pageview beacon for public pages.
 * Skips /admin/* so the dashboard does not pollute its own stats.
 */
export function AnalyticsBeacon() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/admin")) return;
    if (pathname.startsWith("/api")) return;

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || "",
      language: navigator.language || "",
      screen: `${window.screen.width}x${window.screen.height}`,
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon("/api/t", blob);
        return;
      }
    } catch {
      /* fall through */
    }

    void fetch("/api/t", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
      credentials: "omit",
    }).catch(() => {});
  }, [pathname]);

  return null;
}
