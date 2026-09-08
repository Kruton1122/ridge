import { cn } from "@/lib/utils";

export function DeskTag({ label, tone = "mute" }: { label: string; tone?: "new" | "mute" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        tone === "new" ? "bg-primary text-primary-fg" : "bg-raised text-muted",
      )}
    >
      {label}
    </span>
  );
}
