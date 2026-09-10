import { ScriptOnce, useHydrated } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RidgeMark } from "@/components/ridge-mark";

const MIN_MS = 900;
const MAX_MS = 1500;
const REDUCE_MIN_MS = 120;
const REDUCE_MAX_MS = 280;

/**
 * Early-paint boot cover.
 *
 * SSR emits the overlay + a ScriptOnce that locks body scroll before any
 * React hydrate. Once hydrated (and after a short intentional dwell), the
 * cover fades and the app shell springs in. prefers-reduced-motion skips
 * the spring and shortens the dwell.
 *
 * Pairs with the router fix that skips the first onRendered scroll-to-top,
 * so a late hydrate after the cover lifts still cannot yank the page.
 */
export function BootCover() {
  const hydrated = useHydrated();
  const [phase, setPhase] = useState<"cover" | "exit" | "gone">("cover");
  const started = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (started.current == null) {
      const marked = Number(document.documentElement.dataset.bootStarted || "");
      started.current = Number.isFinite(marked) && marked > 0 ? marked : performance.now();
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minMs = reduce ? REDUCE_MIN_MS : MIN_MS;
    const maxMs = reduce ? REDUCE_MAX_MS : MAX_MS;
    const elapsed = performance.now() - started.current;
    const waitHydrated = Math.max(0, minMs - elapsed);
    const waitMax = Math.max(0, maxMs - elapsed);

    let cancelled = false;
    let revealed = false;
    let goneTimer: number | undefined;
    let hydratedTimer: number | undefined;

    const unlock = () => {
      document.documentElement.dataset.boot = "ready";
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    const reveal = () => {
      if (cancelled || revealed) return;
      revealed = true;
      unlock();
      setPhase("exit");
      goneTimer = window.setTimeout(
        () => {
          if (!cancelled) setPhase("gone");
        },
        reduce ? 40 : 520,
      );
    };

    // Ready when: hydrated + min dwell, OR hard max timeout (slow hydrate).
    const maxTimer = window.setTimeout(reveal, waitMax);
    if (hydrated) {
      hydratedTimer = window.setTimeout(reveal, waitHydrated);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(maxTimer);
      if (hydratedTimer != null) window.clearTimeout(hydratedTimer);
      if (goneTimer != null) window.clearTimeout(goneTimer);
    };
  }, [hydrated]);

  if (phase === "gone") return null;

  return (
    <>
      <ScriptOnce>
        {`(function(){try{var d=document.documentElement;if(d.dataset.boot==="ready")return;d.dataset.boot="pending";d.dataset.bootStarted=String(performance.now());d.style.overflow="hidden";document.body&&(document.body.style.overflow="hidden");if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.bootMotion="reduce";}catch(e){}})()`}
      </ScriptOnce>
      <div
        id="ridge-boot"
        className={phase === "exit" ? "ridge-boot ridge-boot--exit" : "ridge-boot"}
        aria-hidden="true"
        role="presentation"
      >
        <div className="ridge-boot__inner">
          <RidgeMark className="ridge-boot__mark" />
          <span className="ridge-boot__word">Ridge</span>
        </div>
      </div>
    </>
  );
}
