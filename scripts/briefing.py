#!/usr/bin/env python3
"""
Ridge daily briefing — non-AI scrape of the public leaderboards.

Pulls:
  - openlm.ai/chatbot-arena/   -> Arena Elo + AA Intelligence Index (AAII), one table
  - vals.ai/benchmarks/swebench -> SWE-bench Verified overall accuracy (Astro island JSON)

No AI involved on the normal path. Exits nonzero (and prints which source broke
to stderr) if a page can't be fetched or parsed, so the wrapper script knows to
fall back to invoking Grok instead of silently sending garbage.

State (previous run's top10s) is kept in logs/briefing-state.json so we can report
real deltas (rank-1/2 changes, new top-10 entrants) instead of a stale hardcoded seed.
"""
import html
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
STATE_FILE = REPO / "logs" / "briefing-state.json"
UA = "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
TIMEOUT = 20


def fetch(url: str) -> str:
    r = subprocess.run(
        ["curl", "-sL", "-A", UA, "-m", str(TIMEOUT), url],
        capture_output=True, text=True, timeout=TIMEOUT + 5,
    )
    if r.returncode != 0 or not r.stdout:
        raise RuntimeError(f"fetch failed ({r.returncode}): {url}")
    return r.stdout


def clean(cell: str) -> str:
    return re.sub(r"<[^>]+>", "", cell).strip()


def num(cell: str):
    c = clean(cell)
    try:
        return float(c)
    except ValueError:
        return None


def parse_openlm(src: str):
    rows = re.findall(
        r"<tr>\s*<td>.*?</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>"
        r"\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>",
        src,
    )
    entries = []
    for r in rows[1:]:  # skip header row
        name = clean(r[0])
        arena = num(r[1])
        aaii = num(r[4])
        if name and arena is not None:
            entries.append({"name": name, "arena": arena, "aaii": aaii})
    if len(entries) < 10:
        raise RuntimeError(f"openlm.ai: only parsed {len(entries)} rows, expected 100+")
    return entries


def parse_vals_swebench(src: str):
    islands = re.findall(r'<astro-island[^>]*props="([^"]*)"[^>]*>', src)
    best = None
    for raw in islands:
        blob = html.unescape(raw)
        if '"overall":[0,{' in blob and "accuracy" in blob:
            if best is None or len(blob) > len(best):
                best = blob
    if best is None:
        raise RuntimeError("vals.ai: no astro-island contained an 'overall' accuracy block")
    m = re.search(r'"overall":\[0,\{(.*?)\}\],"1-4 hours"', best)
    if not m:
        raise RuntimeError("vals.ai: 'overall' block found but couldn't isolate it")
    pairs = re.findall(r'"([a-zA-Z0-9_.\-/]+)":\[0,\{"accuracy":\[0,([0-9.]+)\]', m.group(1))
    if len(pairs) < 10:
        raise RuntimeError(f"vals.ai: only parsed {len(pairs)} model scores, expected 50+")
    def pretty(slug: str) -> str:
        tail = slug.split("/")[-1]
        return " ".join(w.capitalize() if not any(c.isdigit() for c in w) else w for w in tail.split("-"))
    return [{"name": pretty(slug), "score": float(acc)} for slug, acc in pairs]


def top(entries, key, n=10):
    return sorted([e for e in entries if e.get(key) is not None], key=lambda e: e[key], reverse=True)[:n]


def load_state():
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            return None
    return None


def delta_line(label, prev_top10, cur_top10):
    if not prev_top10:
        return None
    prev_names = [n for n, _ in prev_top10]
    cur_names = [n for n, _ in cur_top10]
    lines = []
    if prev_names[:2] != cur_names[:2]:
        lines.append(f"{label} #1/#2 changed: now {cur_names[0]}, {cur_names[1]}")
    new_entrants = [n for n in cur_names if n not in prev_names]
    if new_entrants:
        lines.append(f"{label} new in top 10: {', '.join(new_entrants)}")
    return lines


def fmt_list(pairs, unit=""):
    return "; ".join(f"{n} {s:g}{unit}" for n, s in pairs)


def main():
    errors = []
    arena_top10 = aaii_top10 = swe_top10 = []

    try:
        openlm_src = fetch("https://openlm.ai/chatbot-arena/")
        entries = parse_openlm(openlm_src)
        arena_top10 = [(e["name"], e["arena"]) for e in top(entries, "arena")]
        aaii_top10 = [(e["name"], e["aaii"]) for e in top(entries, "aaii")]
    except Exception as e:
        errors.append(f"openlm.ai (Arena + AAII): {e}")

    try:
        vals_src = fetch("https://www.vals.ai/benchmarks/swebench")
        swe_entries = parse_vals_swebench(vals_src)
        swe_top10 = [(e["name"], e["score"]) for e in top(swe_entries, "score")]
    except Exception as e:
        errors.append(f"vals.ai (SWE-bench Verified): {e}")

    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        sys.exit(2)

    prev = load_state()
    deltas = []
    if prev:
        for label, prev_key, cur10 in [
            ("Arena", "arena", arena_top10),
            ("AAII", "aaii", aaii_top10),
            ("SWE-bench", "swe", swe_top10),
        ]:
            lines = delta_line(label, prev.get(prev_key), cur10)
            if lines:
                deltas.extend(lines)

    today = date.today().isoformat()
    STATE_FILE.parent.mkdir(parents=True, exist_ok=True)
    STATE_FILE.write_text(json.dumps({
        "date": today,
        "arena": arena_top10,
        "aaii": aaii_top10,
        "swe": swe_top10,
    }, indent=2))

    msg_lines = [
        f"Ridge briefing {today}",
        f"AAII top5: {fmt_list(aaii_top10[:5])}",
        f"Arena top5: {fmt_list(arena_top10[:5])}",
        f"SWE-bench top5: {fmt_list(swe_top10[:5], unit='%')}",
    ]
    if deltas:
        msg_lines.append("Changes: " + " | ".join(deltas))
    else:
        msg_lines.append("No rank-1/2 changes or new top-10 entrants since last run." if prev else "(first run, no delta baseline yet)")

    print("\n".join(msg_lines))


if __name__ == "__main__":
    main()
