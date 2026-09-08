#!/usr/bin/env python3
"""
Ridge daily briefing — non-AI scrape of the public leaderboards.

Pulls:
  - openlm.ai/chatbot-arena/              -> Arena Elo + OpenLM AAII column
  - artificialanalysis.ai/leaderboards/models -> AA Intelligence Index (SSR table)
  - vals.ai/benchmarks/swebench           -> SWE-bench Verified overall accuracy

Hard rules:
  - Never invent scores. Missing number => skip / leave —.
  - aa-intelligence catalog values MUST come from AA site, NOT OpenLM AAII
    (OpenLM and AA disagree; e.g. OpenLM 57 vs AA 54).
  - Do not mix AA v4.1.1 (~60s) with v4.2 (~50s).

Writes:
  - logs/briefing-state.json   (notify / delta baseline; keeps prior shape)
  - logs/briefing-pull.json    (staging for apply-briefing-staging.mjs)
"""
from __future__ import annotations

import html
import json
import re
import subprocess
import sys
from datetime import date, datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LOG_DIR = REPO / "logs"
STATE_FILE = LOG_DIR / "briefing-state.json"
PULL_FILE = LOG_DIR / "briefing-pull.json"
UA = "Mozilla/5.0 (X11; Linux aarch64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
TIMEOUT = 25

# Seed tops from 18 Aug 2026 (pre-v4.2 / pre-Fable-5.1 board) for the daily "vs seed" line.
# Overall numbers here are the old ~60s-scale Index — compare *names* for #1/#2 change.
SEED_ASOF = "2026-08-18"
SEED_OVERALL = [("Claude Opus 5", 63), ("Claude Fable 5", 62)]
SEED_SWE = [("Claude Opus 5", 97.0), ("DeepSeek V4 Pro", 96.4)]
SEED_ARENA = [("Claude Opus 5", 1511), ("Claude Fable 5", 1510)]


def fetch(url: str) -> str:
    r = subprocess.run(
        ["curl", "-sL", "-A", UA, "-m", str(TIMEOUT), url],
        capture_output=True,
        text=True,
        timeout=TIMEOUT + 5,
    )
    if r.returncode != 0 or not r.stdout:
        raise RuntimeError(f"fetch failed ({r.returncode}): {url}")
    return r.stdout


def clean(cell: str) -> str:
    text = re.sub(r"<[^>]+>", "", cell)
    text = html.unescape(text)
    # strip emoji / checkmarks that OpenLM appends
    text = re.sub(r"[\U0001F3C6\U0001F947\U0001F948\U0001F949\u2705]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def num(cell: str):
    c = clean(cell)
    m = re.search(r"-?\d+(?:\.\d+)?", c.replace(",", ""))
    if not m:
        return None
    try:
        return float(m.group(0))
    except ValueError:
        return None


def parse_openlm(src: str):
    """Parse Arena Elo + OpenLM's AAII column.

    Header row uses <th>, not <td>, so the first matched row is the real #1
    (do NOT skip rows[1:] — that dropped Fable 5.1).
    """
    rows = re.findall(
        r"<tr>\s*<td>.*?</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>"
        r"\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>\s*<td>(.*?)</td>",
        src,
    )
    entries = []
    for r in rows:
        name = clean(r[0])
        arena = num(r[1])
        aaii = num(r[4])  # OpenLM AAII — NOT for catalog aa-intelligence
        if name and arena is not None:
            entries.append({"name": name, "arena": arena, "aaii": aaii})
    if len(entries) < 10:
        raise RuntimeError(f"openlm.ai: only parsed {len(entries)} rows, expected 100+")
    return entries


def parse_aa_index(src: str):
    """Best-effort / best-variant Intelligence Index from AA SSR table.

    Each model may appear as multiple effort rows (max, xhigh, …). We keep the
    highest numeric Index per base name and record the variant in `note`.
    """
    trs = re.findall(r'<tr[^>]*class="[^"]*group[^"]*"[^>]*>.*?</tr>', src, re.S)
    if len(trs) < 10:
        # fallback: any data row with sticky model cell
        trs = [
            tr
            for tr in re.findall(r"<tr[^>]*>.*?</tr>", src, re.S)
            if "<td" in tr and ("Claude" in tr or "GPT" in tr or "Grok" in tr)
        ]
    best: dict[str, dict] = {}
    for tr in trs:
        tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
        if len(tds) < 4:
            continue
        cells = [clean(c) for c in tds]
        full = cells[0]
        if not full or full.lower() in {"model", "creator"}:
            continue
        score = num(cells[3])
        if score is None:
            continue
        # AA Index on v4.2 is ~30–60; reject absurd parses
        if score < 1 or score > 100:
            continue
        variant = None
        pm = re.search(r"\(([^)]+)\)\s*$", full)
        if pm:
            variant = pm.group(1).strip()
        base = re.sub(r"\s*\([^)]*\)\s*$", "", full).strip()
        if not base:
            continue
        key = base + "|" + (variant or "")
        prev = best.get(key)
        if prev is None or score > prev["score"]:
            note = f"best effort/variant: {variant}" if variant else "best listed row"
            if "*" in cells[3]:
                note += " (AA marked with *)"
            best[key] = {
                "name": base,
                "score": score,
                "note": note,
                "variant": variant,
                "fullName": full,
            }
    entries = sorted(best.values(), key=lambda e: e["score"], reverse=True)
    if len(entries) < 10:
        raise RuntimeError(f"artificialanalysis.ai: only parsed {len(entries)} models, expected 50+")
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
    pairs = re.findall(
        r'"([a-zA-Z0-9_.\-/]+)":\[0,\{"accuracy":\[0,([0-9.]+)\]',
        m.group(1),
    )
    if len(pairs) < 10:
        raise RuntimeError(f"vals.ai: only parsed {len(pairs)} model scores, expected 50+")

    def pretty(slug: str) -> str:
        tail = slug.split("/")[-1]
        return " ".join(
            w.capitalize() if not any(c.isdigit() for c in w) else w for w in tail.split("-")
        )

    return [{"name": pretty(slug), "accuracy": float(acc), "slug": slug} for slug, acc in pairs]


def top(entries, key, n=10):
    return sorted(
        [e for e in entries if e.get(key) is not None],
        key=lambda e: e[key],
        reverse=True,
    )[:n]


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


def names_of(pairs):
    return [n for n, _ in pairs]


def seed_change_line(label, seed_pairs, cur_pairs):
    seed_names = names_of(seed_pairs[:2])
    cur_names = names_of(cur_pairs[:2])
    if seed_names == cur_names:
        return f"{label} top2 same as {SEED_ASOF} seed ({seed_names[0]} / {seed_names[1]})"
    return (
        f"{label} top2 vs {SEED_ASOF} seed: was {seed_names[0]} / {seed_names[1]}; "
        f"now {cur_names[0]} / {cur_names[1]}"
    )


def frontier_new_in_top10(aa_top10, arena_top10, swe_top10):
    """Names in today's top-10s that were not on the 18 Aug seed top2s (frontier arrivals)."""
    seed_known = {
        "claude opus 5",
        "opus 5",
        "claude fable 5",
        "fable 5",
        "deepseek v4 pro",
        "v4 pro",
    }
    # Also treat obvious continuations of seed-era names as known
    known_extra = {
        "gpt-5.6 sol",
        "gpt 5.6 sol",
        "grok-4.6",
        "grok 4.6",
        "kimi-k3",
        "kimi k3",
        "qwen3.8-max",
        "qwen 3.8 max",
    }
    known = seed_known | known_extra
    frontier_markers = (
        "fable 5.1",
        "astra",
        "spark",
        "gemini 3.8",
        "3.8 flash",
        "grok 4.7",
        "opus 5.1",
    )
    seen = []
    for pairs in (aa_top10, arena_top10, swe_top10):
        for name, _ in pairs:
            low = name.lower()
            if any(m in low for m in frontier_markers) and low not in known:
                if name not in seen:
                    seen.append(name)
    return seen


def main():
    errors = []
    sources = []
    arena_entries = []
    aaii_openlm_entries = []
    aa_entries = []
    swe_entries = []

    try:
        openlm_src = fetch("https://openlm.ai/chatbot-arena/")
        openlm = parse_openlm(openlm_src)
        arena_entries = [{"name": e["name"], "elo": e["arena"]} for e in openlm]
        aaii_openlm_entries = [
            {"name": e["name"], "score": e["aaii"]}
            for e in openlm
            if e.get("aaii") is not None
        ]
        sources.append(
            {
                "id": "openlm-arena",
                "name": "OpenLM Arena+",
                "url": "https://openlm.ai/chatbot-arena/",
                "ok": True,
                "rows": len(arena_entries),
            }
        )
    except Exception as e:
        errors.append(f"openlm.ai (Arena + AAII): {e}")
        sources.append(
            {
                "id": "openlm-arena",
                "name": "OpenLM Arena+",
                "url": "https://openlm.ai/chatbot-arena/",
                "ok": False,
                "rows": 0,
                "error": str(e),
            }
        )

    try:
        aa_src = fetch("https://artificialanalysis.ai/leaderboards/models")
        aa_entries = parse_aa_index(aa_src)
        sources.append(
            {
                "id": "aa-intelligence",
                "name": "Artificial Analysis Intelligence Index",
                "url": "https://artificialanalysis.ai/leaderboards/models",
                "ok": True,
                "rows": len(aa_entries),
                "note": "best effort/variant per model from SSR table; not OpenLM AAII",
            }
        )
    except Exception as e:
        errors.append(f"artificialanalysis.ai (AA Index): {e}")
        sources.append(
            {
                "id": "aa-intelligence",
                "name": "Artificial Analysis Intelligence Index",
                "url": "https://artificialanalysis.ai/leaderboards/models",
                "ok": False,
                "rows": 0,
                "error": str(e),
            }
        )

    try:
        vals_src = fetch("https://www.vals.ai/benchmarks/swebench")
        swe_entries = parse_vals_swebench(vals_src)
        sources.append(
            {
                "id": "vals-swebench",
                "name": "Vals SWE-bench Verified",
                "url": "https://vals.ai/benchmarks/swebench",
                "ok": True,
                "rows": len(swe_entries),
            }
        )
    except Exception as e:
        errors.append(f"vals.ai (SWE-bench Verified): {e}")
        sources.append(
            {
                "id": "vals-swebench",
                "name": "Vals SWE-bench Verified",
                "url": "https://vals.ai/benchmarks/swebench",
                "ok": False,
                "rows": 0,
                "error": str(e),
            }
        )

    if errors:
        for e in errors:
            print(e, file=sys.stderr)
        sys.exit(2)

    arena_top10 = [(e["name"], e["elo"]) for e in top(arena_entries, "elo")]
    aaii_openlm_top10 = [(e["name"], e["score"]) for e in top(aaii_openlm_entries, "score")]
    # collapse variants to best score per model name for tops/deltas
    aa_best_by_name = {}
    for e in aa_entries:
        prev = aa_best_by_name.get(e["name"])
        if prev is None or e["score"] > prev["score"]:
            aa_best_by_name[e["name"]] = e
    aa_top10 = [(e["name"], e["score"]) for e in top(list(aa_best_by_name.values()), "score")]
    swe_top10 = [(e["name"], e["accuracy"]) for e in top(swe_entries, "accuracy")]

    prev = load_state()
    deltas = []
    if prev:
        for label, prev_key, cur10 in [
            ("Arena", "arena", arena_top10),
            ("AA Index", "aa_index", aa_top10),
            ("SWE-bench", "swe", swe_top10),
        ]:
            # fall back to old aaii key once for migration
            prev10 = prev.get(prev_key) or (prev.get("aaii") if prev_key == "aa_index" else None)
            lines = delta_line(label, prev10, cur10)
            if lines:
                deltas.extend(lines)

    today = date.today().isoformat()
    scraped_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    # Keep prior notify/delta shape; add aa_index from AA site.
    STATE_FILE.write_text(
        json.dumps(
            {
                "date": today,
                "arena": arena_top10,
                "aaii": aaii_openlm_top10,  # OpenLM column — informational only
                "aa_index": aa_top10,  # Artificial Analysis — authoritative for Overall
                "swe": swe_top10,
            },
            indent=2,
        )
    )

    pull = {
        "asOf": today,
        "scrapedAt": scraped_at,
        "sources": sources,
        "arena": arena_entries,
        "aaii_openlm": aaii_openlm_entries,
        "aa_index": [
            {"name": e["name"], "score": e["score"], "note": e.get("note")}
            for e in aa_entries
        ],
        "swe": [
            {"name": e["name"], "accuracy": e["accuracy"]}
            for e in swe_entries
        ],
    }
    PULL_FILE.write_text(json.dumps(pull, indent=2))

    seed_lines = [
        seed_change_line("Overall(AA)", SEED_OVERALL, aa_top10),
        seed_change_line("SWE", SEED_SWE, swe_top10),
        seed_change_line("Arena", SEED_ARENA, arena_top10),
    ]
    new_frontier = frontier_new_in_top10(aa_top10, arena_top10, swe_top10)

    msg_lines = [
        f"Ridge briefing {today}",
        f"AA Index top5 (artificialanalysis.ai, best variant): {fmt_list(aa_top10[:5])}",
        f"Arena top5: {fmt_list(arena_top10[:5])}",
        f"SWE-bench top5: {fmt_list(swe_top10[:5], unit='%')}",
        "vs seed: " + " | ".join(seed_lines),
    ]
    if new_frontier:
        msg_lines.append(
            "New frontier names in top 10: " + ", ".join(new_frontier[:8])
        )
    else:
        msg_lines.append("No new frontier names flagged in top 10.")
    if deltas:
        msg_lines.append("Since last run: " + " | ".join(deltas))
    else:
        msg_lines.append(
            "No rank-1/2 changes or new top-10 entrants since last run."
            if prev
            else "(first run, no delta baseline yet)"
        )

    print("\n".join(msg_lines))


if __name__ == "__main__":
    main()
