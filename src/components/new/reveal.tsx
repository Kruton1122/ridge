import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Reveal-on-scroll. The element is opaque by default and an IntersectionObserver
 * sets `data-in` once it enters the viewport, so content is never gated behind a
 * scroll position: no JS, no hydration, or no scroll all still render the page.
 */
export function Reveal({
  children,
  className,
  as: Tag = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Setting data-in starts n-rise from opacity 0 (animation-fill-mode: both).
    // Anything already on screen must stay opaque — otherwise the first paint
    // flashes blank, full-page capture blanks, and QA flags invisible content.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "1";
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("n-reveal", className)}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

