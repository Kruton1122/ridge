import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultErrorComponent: AppErrorComponent,
    // Persist positions across back/forward. Also sets history.scrollRestoration
    // to "manual" so the browser and the router do not fight.
    scrollRestoration: true,
  });

  // Root cause of the jarring initial-load yank: TanStack registers an
  // onRendered handler that defaults `_scroll.next === true` and calls
  // scrollTo(0, 0) on the first hydrate render — even when the user has
  // already scrolled the SSR HTML. Clear the flag once so that first
  // onRendered preserves position; subsequent navigations still reset.
  router._scroll.next = false;

  // During the boot cover (`data-boot="pending"`), a late commitLocation/load
  // can re-arm `_scroll.next`. Keep clearing it after each onRendered until
  // the cover unlocks, so a render that lands after the cover lifts cannot
  // yank the page back to top.
  if (typeof document !== "undefined") {
    router.subscribe("onRendered", () => {
      if (document.documentElement.dataset.boot === "pending") {
        router._scroll.next = false;
      }
    });
  }

  return router;
}
