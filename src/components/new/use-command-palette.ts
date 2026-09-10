import { useEffect, useState } from "react";

/** ⌘K / Ctrl-K anywhere except inside a text field. */
export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((value) => !value);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return { open, setOpen };
}

/**
 * "Ctrl K" everywhere by default (matches server render, avoids a hydration
 * mismatch), swapped for "⌘K" after mount on an actual Mac. The Windows
 * "Meta" key is the Windows-logo key, not an equivalent shortcut — Win+K
 * opens the OS's wireless-display panel before the page ever sees it, so
 * this label must never suggest that combo to a non-Mac reader.
 */
export function useShortcutLabel(): string {
  const [label, setLabel] = useState("Ctrl K");

  useEffect(() => {
    const uaData = (navigator as { userAgentData?: { platform?: string } }).userAgentData;
    const platform = uaData?.platform ?? navigator.platform ?? navigator.userAgent;
    if (/mac/i.test(platform)) setLabel("⌘K");
  }, []);

  return label;
}
