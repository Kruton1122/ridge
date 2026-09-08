import { CHANGELOG } from "@/lib/data/changelog";
import { SNAPSHOT_LABEL } from "@/lib/data/catalog";
import { nextPullLabel } from "@/lib/data/ledger";

export function ChangelogPanel() {
  return (
    <section className="rounded-2xl bg-surface p-5 shadow-[0_0_0_1px_var(--color-border)] sm:p-7">
      <p className="text-xs uppercase tracking-[0.2em] text-faint">Delta</p>
      <h2 className="mt-2 font-serif text-3xl">Since last cut</h2>
      <p className="mt-2 text-sm text-muted">
        Seed {SNAPSHOT_LABEL}. Next pull {nextPullLabel()}.
      </p>
      <ol className="mt-6 grid gap-6">
        {CHANGELOG.map((entry) => (
          <li key={entry.date}>
            <p className="text-xs uppercase tracking-wider text-faint">{entry.date}</p>
            <h3 className="mt-1 font-medium">{entry.title}</h3>
            <ul className="mt-2 grid gap-1.5 text-sm leading-relaxed text-muted">
              {entry.items.map((item) => (
                <li key={item}>— {item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
