import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { BookOpen, Building2, FileText, Layers, Search } from "lucide-react";
import { useMemo } from "react";
import { searchIndex, type SearchEntry } from "@/lib/data/derived";

const ICONS = {
  model: Layers,
  news: FileText,
  benchmark: BookOpen,
  lab: Building2,
  page: Search,
} as const;

const GROUPS: { kind: SearchEntry["kind"]; heading: string }[] = [
  { kind: "model", heading: "Models" },
  { kind: "benchmark", heading: "Benchmarks" },
  { kind: "lab", heading: "Labs" },
  { kind: "news", heading: "Desk" },
  { kind: "page", heading: "Pages" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const entries = useMemo(() => searchIndex(), []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search Ridge"
      className="fixed inset-0 z-50"
      overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
      contentClassName="fixed left-1/2 top-[12vh] z-50 w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-xl border border-n-line-2 bg-n-modal shadow-2xl"
    >
      <div className="flex items-center gap-2.5 border-b border-n-line px-4">
        <Search className="size-4 shrink-0 text-n-text-3" aria-hidden="true" />
        <Command.Input
          placeholder="Search models, benchmarks, labs, desk notes…"
          className="h-12 w-full bg-transparent text-[14px] text-n-text outline-none placeholder:text-n-text-3"
        />
      </div>
      <Command.List className="max-h-[54vh] overflow-y-auto overscroll-contain p-2">
        <Command.Empty className="px-3 py-8 text-center text-[13px] text-n-text-3">
          Nothing in this snapshot matches.
        </Command.Empty>
        {GROUPS.map((group) => {
          const items = entries.filter((entry) => entry.kind === group.kind);
          if (items.length === 0) return null;
          const Icon = ICONS[group.kind];
          return (
            <Command.Group
              key={group.kind}
              heading={group.heading}
              className="px-1 pb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-n-text-3"
            >
              {items.map((entry) => (
                <Command.Item
                  key={entry.id}
                  value={`${entry.title} ${entry.sub} ${entry.keywords}`}
                  onSelect={() => {
                    onOpenChange(false);
                    void navigate({ to: entry.to });
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-2 text-[13.5px] text-n-text-2 data-[selected=true]:bg-n-overlay data-[selected=true]:text-n-text"
                >
                  <Icon className="size-3.5 shrink-0 text-n-text-3" aria-hidden="true" />
                  <span className="min-w-0 flex-1 truncate">{entry.title}</span>
                  <span className="n-num shrink-0 truncate text-[11px] text-n-text-3">
                    {entry.sub}
                  </span>
                </Command.Item>
              ))}
            </Command.Group>
          );
        })}
      </Command.List>
    </Command.Dialog>
  );
}
