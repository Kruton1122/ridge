import type { ReactNode } from "react";
import { modelColor } from "@/lib/data/colors";
import { statusLabel } from "@/lib/data/ledger";
import type { AccessStatus, Model } from "@/lib/data/types";
import { cn } from "@/lib/utils";

/** The one place a lab's brand color is allowed to appear at full chroma. */
export function LabDot({ model, className }: { model: Model; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block size-[7px] shrink-0 rounded-full", className)}
      style={{ backgroundColor: modelColor(model) }}
    />
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-medium uppercase tracking-[0.16em] text-n-text-3",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function StatusPill({ status }: { status: AccessStatus }) {
  const tone =
    status === "ga"
      ? "text-n-text-2 border-n-line-2"
      : status === "promo"
        ? "text-n-up border-n-up/30"
        : "text-n-amber border-n-amber/30";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.09em]",
        tone,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "new";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.09em]",
        tone === "new"
          ? "bg-n-amber/15 text-n-amber"
          : "bg-n-overlay text-n-text-3",
      )}
    >
      {children}
    </span>
  );
}

/**
 * Source URL and as-of date, inline rather than footnoted. This is the thing
 * Ridge does that the bigger boards do not, so it should be visible on the row
 * it belongs to.
 */
export function SourceLine({
  name,
  url,
  asOf,
  note,
  className,
}: {
  name: string;
  url: string;
  asOf: string;
  note?: string;
  className?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "n-focus inline-flex min-h-6 flex-wrap items-center gap-x-1.5 text-[11px] text-n-text-3 transition-colors duration-150 hover:text-n-amber",
        className,
      )}
    >
      <span>{name}</span>
      <span aria-hidden="true">·</span>
      <span className="n-num">as of {asOf}</span>
      {note ? <span className="text-n-text-3/70">· {note}</span> : null}
    </a>
  );
}

/**
 * `#3 of 10` — the denominator is what turns a score into a measurement.
 * `=#1` when another row holds the same value: ranking tied scores 1 and 2 would
 * assert a separation the publisher never measured.
 */
export function RankBadge({
  rank,
  of,
  tied = false,
  className,
}: {
  rank: number;
  of: number;
  tied?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "n-num inline-flex items-baseline gap-1 text-[11px]",
        rank === 1 ? "text-n-amber" : "text-n-text-3",
        className,
      )}
      title={tied ? `Tied for ${rank} of ${of}` : undefined}
    >
      <span className="font-medium">
        {tied ? <span className="text-n-text-3">=</span> : null}#{rank}
      </span>
      <span className="text-n-text-3">of {of}</span>
    </span>
  );
}

/** Em-dash at low contrast. Never a zero, never an empty cell. */
export function Blank({ className }: { className?: string }) {
  return (
    <span aria-label="no data" className={cn("text-n-text-3/45", className)}>
      —
    </span>
  );
}

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-n-line bg-n-raised",
        interactive &&
          "transition-colors duration-150 hover:border-n-line-2 hover:bg-n-overlay",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  right,
}: {
  eyebrow?: string;
  title: string;
  sub?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-1.5 font-serif text-[26px] leading-tight text-n-text sm:text-[32px]">
          {title}
        </h2>
        {sub ? (
          <p className="mt-2 max-w-[68ch] text-[13.5px] leading-relaxed text-n-text-2">{sub}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

/** Editorial body copy, held to a readable measure. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-[16px] leading-[1.72] text-n-text/90 [&_p+p]:mt-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
}) {
  return (
    <div>
      <Eyebrow>{label}</Eyebrow>
      <p className="n-num mt-1.5 text-[22px] leading-none text-n-text">{value}</p>
      {sub ? <p className="mt-1.5 text-[12px] leading-snug text-n-text-3">{sub}</p> : null}
    </div>
  );
}
