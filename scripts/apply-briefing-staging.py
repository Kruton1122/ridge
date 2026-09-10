#!/usr/bin/env python3
"""Apply briefing-pull.json to catalog SCORES."""
from __future__ import annotations
import json, os, re, subprocess, sys
from pathlib import Path
REPO = Path(__file__).resolve().parent.parent
PULL_PATH = REPO / "logs" / "briefing-pull.json"
CATALOG_PATH = REPO / "src" / "lib" / "data" / "catalog.ts"
DESK_PATH = REPO / "src" / "lib" / "data" / "desk.ts"
CHANGELOG_PATH = REPO / "src" / "lib" / "data" / "changelog.ts"
LLMS_PATH = REPO / "public" / "llms.txt"
DRY_RUN = "--dry-run" in sys.argv
AA_URL = "https://artificialanalysis.ai/leaderboards/models"
ARENA_URL = "https://openlm.ai/chatbot-arena/"
SWE_URL = "https://vals.ai/benchmarks/swebench"

# Large-delta safety rails (absolute points). Exceeding these without a
# high-confidence exact/alias match → log and skip.
ARENA_DELTA_MAX = 80
SWE_DELTA_MAX = 5
AA_DELTA_MAX = 8

def die(msg, code=1):
    print(msg, file=sys.stderr)
    raise SystemExit(code)

def normalize(s):
    s = (s or "").lower()
    s = re.sub(r"[\u2705]", "", s)
    s = re.sub(r"\([^)]*\)", " ", s)
    s = re.sub(r"[^a-z0-9]+", " ", s)
    s = re.sub(r"\b(claude|gpt|google|gemini|muse|meta|deepseek|kimi|qwen|glm)\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()


BRANDS = (
    "claude", "gpt", "gemini", "gemma", "grok", "muse", "spark", "kimi", "qwen",
    "glm", "deepseek", "llama", "command", "sonnet", "opus", "fable", "astra",
    "sol", "terra", "luna", "phi", "step", "intellect", "mistral", "nova",
)

def brands_in(s):
    low = (s or "").lower()
    return {b for b in BRANDS if b in low}

def version_tokens(s):
    """Whole version tokens only (no substring digit tricks)."""
    return re.findall(r"\d+(?:\.\d+)+|\d+", (s or "").lower())

def versions_compatible(scraped_name, model):
    """Require at least one exact shared version token when both sides have versions."""
    vs = set(version_tokens(re.sub(r"\([^)]*\)", " ", scraped_name or "")))
    vm = set(version_tokens(f"{model['name']} {model['shortName']} {model['id']}"))
    if not vs or not vm:
        return True
    return bool(vs & vm)

def brands_compatible(scraped_name, model):
    sb = brands_in(scraped_name)
    mb = brands_in(model["name"] + " " + model["id"] + " " + " ".join(model["aliases"]))
    if sb and mb and sb.isdisjoint(mb):
        return False
    return True

def arena_row_skippable(name):
    """Skip Arena rows that are style-control / deprecated / clearly non-main."""
    n = (name or "").lower()
    if re.search(r"style[\s-]?control", n):
        return True
    if re.search(r"\bdeprecated\b", n):
        return True
    # Ancient single-digit Claude (Claude-1 / Claude-2) — not frontier Fable/Opus
    if re.match(r"^claude[\s_-]*[12]\b", n):
        return True
    return False

def parse_models(src):

    models = []
    for m in re.finditer(
        r'm\(\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"\s*,\s*shortName:\s*"([^"]+)"[\s\S]*?aliases:\s*\[([^\]]*)\]',
        src,
    ):
        aliases = re.findall(r'"([^"]+)"', m.group(4))
        models.append({"id": m.group(1), "name": m.group(2), "shortName": m.group(3), "aliases": aliases})
    if len(models) < 5:
        die(f"failed to parse MODELS (got {len(models)})")
    return models

def parse_scores(src):
    scores = []
    for m in re.finditer(
        r's\(\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*([0-9.]+)\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"\s*,\s*"([^"]*)"(?:\s*,\s*"([^"]*)")?\s*\)',
        src,
    ):
        scores.append({
            "modelId": m.group(1), "benchmarkId": m.group(2), "value": float(m.group(3)),
            "sourceName": m.group(4), "sourceUrl": m.group(5), "asOf": m.group(6),
            "note": m.group(7), "raw": m.group(0),
        })
    return scores

def is_high_confidence(why, score):
    return why in ("exact", "exact-norm", "exact-alias", "exact-short") or score >= 95

def score_confidence(scraped_name, model, variant_hint):
    sn = normalize(scraped_name)
    candidates = [normalize(x) for x in [model["id"], model["name"], model["shortName"], *model["aliases"]]]
    mid = model["id"]
    # Spark max vs xhigh: gate BEFORE alias exact-match (aliases collide on base name)
    if mid.startswith("muse-spark"):
        v = (variant_hint or scraped_name or "").lower()
        if mid.endswith("-max"):
            if not re.search(r"\bmax\b", v):
                return 0, "spark-max needs max variant"
        elif re.search(r"\bmax\b", v) and not re.search(r"\bxhigh\b", v):
            return 0, "spark-xhigh rejected max-only"
    # Models whose id/name includes max should see max in the scrape
    if re.search(r"\bmax\b", model["id"] + " " + model["name"].lower()):
        v = (variant_hint or scraped_name or "").lower()
        if not re.search(r"\bmax\b", v):
            return 0, "max-model needs max token"

    if not brands_compatible(scraped_name, model):
        return 0, "brand-mismatch"
    if not versions_compatible(scraped_name, model):
        return 0, "version-mismatch"

    # Exact on normalized id / name / shortName / aliases
    raw_lower = re.sub(r"\s+", " ", re.sub(r"\([^)]*\)", " ", (scraped_name or "").lower())).strip()
    exact_raw = {model["id"].lower(), model["name"].lower(), model["shortName"].lower(), *[a.lower() for a in model["aliases"]]}
    if raw_lower in exact_raw or (scraped_name or "").strip().lower() in exact_raw:
        return 100, "exact"
    if sn and sn in candidates:
        # Avoid ultra-short alias traps (e.g. alias "k3" vs random "...3")
        if len(sn) <= 2:
            return 0, "short-norm"
        return 100, "exact-norm"

    # Reject contains when scraped norm is tiny / digits-only (Claude-1 → "1" ⊂ "fable 5 1")
    if not sn or len(sn) <= 2 or sn.isdigit():
        return 0, "too-short"

    best, why = 0, "none"
    for c in candidates:
        if not c or len(c) <= 2:
            continue
        if c == sn:
            return 100, "exact-norm"
        if sn in c or c in sn:
            # contained side must be meaningful
            shorter = sn if len(sn) <= len(c) else c
            if len(shorter) < 4 and not re.search(r"\d", shorter):
                continue
            ratio = min(len(c), len(sn)) / max(len(c), len(sn))
            # Prefer near-equal contains (Deepseek v4 Pro ⊂ Deepseek v4 Pro 0813)
            sc = 80 + round(ratio * 15)
            if sc > best:
                best, why = sc, "contains"

    # Token overlap — stricter: need brand overlap when model has brands,
    # and solid coverage (not a single shared digit).
    sb, mb = brands_in(scraped_name), brands_in(model["name"] + " " + model["id"] + " " + " ".join(model["aliases"]))
    if mb and not (sb & mb):
        # No shared brand → do not allow weak token matches
        return (best, why) if best >= 80 else (0, "token-no-brand")

    raw_tokens = [
        t.replace(".", "")
        for t in re.sub(r"[^a-z0-9.]+", " ", re.sub(r"\([^)]*\)", " ", scraped_name.lower())).split()
        if t and t not in {"thinking", "instruct", "preview", "it", "chat"}
    ]
    # Drop bare brand tokens from comparison set noise
    st = {t for t in (set(raw_tokens) | set(sn.split())) if t and not t.isdigit()}
    st_digits = {t for t in raw_tokens if any(ch.isdigit() for ch in t)}
    st = st | st_digits

    for c in candidates:
        if not c or len(c) <= 2:
            continue
        ct = set(c.split())
        if not ct:
            continue
        # Ignore pure brand-only candidate tokens already stripped by normalize
        inter_tokens = []
        for t in ct:
            if t in st or any(t == x for x in st):
                inter_tokens.append(t)
            elif any((not t.isdigit() and not x.isdigit() and (t in x or x in t) and min(len(t), len(x)) >= 3) for x in st):
                inter_tokens.append(t)
        inter = len(set(inter_tokens))
        if inter == 0:
            continue
        # Single shared numeric token alone is not enough (Step-3 vs k3)
        if inter == 1:
            only = next(iter(set(inter_tokens)))
            if only.isdigit() or len(only) <= 2:
                continue
        jaccard = inter / len(ct | st)
        coverage = inter / len(ct)
        sc = round(coverage * 55 + jaccard * 35)
        if mb and sb & mb:
            sc += 5
        if sc > best:
            best, why = sc, f"token({inter}/{len(ct)})"
    return best, why

def match_model(scraped_name, models, variant_hint):
    scraped_name = re.sub(r"\s*\b\d{4}\b\s*$", "", scraped_name or "").strip()
    ranked = []
    for model in models:
        sc, why = score_confidence(scraped_name, model, variant_hint)
        ranked.append((sc, why, model))
    ranked.sort(key=lambda x: -x[0])
    # Prefer exact / strong matches; reject weak fuzzy
    if not ranked or ranked[0][0] < 80:
        return None
    top_sc, top_why, top = ranked[0]
    # Non-exact fuzzy must clear a higher bar and prove brand+version
    if not is_high_confidence(top_why, top_sc):
        if top_sc < 88:
            return None
        if not brands_compatible(scraped_name, top) or not versions_compatible(scraped_name, top):
            return None
        # contains with strong ratio only
        if top_why == "contains" and top_sc < 90:
            return None
        if top_why.startswith("token") and top_sc < 92:
            return None
    if len(ranked) > 1:
        sec_sc, _, sec = ranked[1]
        if (sec_sc >= top_sc - 5 and sec["id"] != top["id"]
            and not (top["id"].startswith("muse-spark") and sec["id"].startswith("muse-spark"))):
            # Exact top beats near-tied fuzzy second
            if is_high_confidence(top_why, top_sc) and sec_sc < 95:
                pass
            else:
                return {"ambiguous": True, "top": top, "second": sec}
    return {"model": top, "score": top_sc, "why": top_why}

def format_snapshot_label(iso):
    y, m, d = map(int, iso.split("-"))
    months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    return f"{d} {months[m - 1]} {y}"

def format_num(n):
    if float(n).is_integer():
        return str(int(n))
    t = round(float(n) * 10) / 10
    if float(t).is_integer():
        return str(int(t))
    return f"{t:.1f}"

def values_differ(a, b, benchmark_id):
    if benchmark_id == "swe-bench":
        return abs(a - b) >= 0.05
    if benchmark_id == "arena-elo":
        return abs(a - b) >= 0.5
    return abs(a - b) >= 0.5

def replace_score_call(catalog_src, existing, next_row):
    note = next_row.get("note")
    note_part = f', "{note}"' if note else ""
    if note and '"' in note:
        note_part = ', "' + note.replace('"', '\\"') + '"'
    replacement = (
        f's("{next_row["modelId"]}", "{next_row["benchmarkId"]}", {format_num(next_row["value"])}, '
        f'"{next_row["sourceName"]}", "{next_row["sourceUrl"]}", "{next_row["asOf"]}"{note_part})'
    )
    if existing["raw"] not in catalog_src:
        die(f'could not locate score for {existing["modelId"]}/{existing["benchmarkId"]}')
    return catalog_src.replace(existing["raw"], replacement, 1)

def build_headline(aa_scores, models_by_id):
    lines = []
    rank = 0
    last_val = None
    display_rank = 0
    for row in aa_scores[:12]:
        rank += 1
        if last_val is None or row["value"] != last_val:
            display_rank = rank
        last_val = row["value"]
        model = models_by_id.get(row["modelId"])
        name = model["name"] if model else row["modelId"]
        note = row.get("note") or ""
        note = re.sub(r"^best effort/variant:\s*", "", note, flags=re.I)
        suffix = f" ({note})" if note else ""
        lines.append(f"{display_rank}. {name} — {format_num(row['value'])}{suffix}")
    return lines

def safety_delta_limit(benchmark_id):
    if benchmark_id == "arena-elo":
        return ARENA_DELTA_MAX
    if benchmark_id == "swe-bench":
        return SWE_DELTA_MAX
    if benchmark_id == "aa-intelligence":
        return AA_DELTA_MAX
    return None

def main():
    if not PULL_PATH.exists():
        die(f"missing {PULL_PATH} — run briefing.py first")
    pull = json.loads(PULL_PATH.read_text())
    as_of = pull.get("asOf")
    if not as_of:
        die("pull.asOf missing")

    catalog_src = CATALOG_PATH.read_text()
    models = parse_models(catalog_src)
    models_by_id = {m["id"]: m for m in models}
    existing_scores = parse_scores(catalog_src)
    unmatched, ambiguous, updates, logs = [], [], [], []
    safety_skips = []

    def apply_bucket(benchmark_id, rows, mapper):
        nonlocal catalog_src
        used = set()
        # higher sourced values first so Pro 96.4 beats Pro 77.4
        def _val(r):
            try:
                return float(mapper(r).get("value") or -1)
            except Exception:
                return -1
        rows = sorted(list(rows), key=_val, reverse=True)
        for row in rows:
            mapped = mapper(row)
            name = mapped["name"]
            value = mapped["value"]
            note = mapped.get("note")
            variant_hint = mapped.get("variantHint")
            if value is None:
                continue
            try:
                num_val = float(value)
            except (TypeError, ValueError):
                continue
            if benchmark_id == "arena-elo" and arena_row_skippable(name):
                (logs.append("skip arena non-main row %r" % name) if DRY_RUN else None)
                continue
            matched = match_model(name, models, variant_hint or note)
            if not matched:
                unmatched.append({"benchmarkId": benchmark_id, "name": name, "value": num_val})
                continue
            if matched.get("ambiguous"):
                ambiguous.append({"benchmarkId": benchmark_id, "name": name, "a": matched["top"]["id"], "b": matched["second"]["id"]})
                continue
            model = matched["model"]
            model_id = model["id"]
            if model_id in used:
                # keep higher sourced value for this model/benchmark
                prev_u = next((u for u in updates if u["modelId"]==model_id and u["benchmarkId"]==benchmark_id), None)
                # Also respect claim-only matches (no update row) — higher already claimed
                if prev_u is not None and num_val <= prev_u["to"]:
                    logs.append("skip duplicate match %s %s -> %s" % (benchmark_id, name, model_id)) if DRY_RUN else None
                    continue
                if prev_u is None:
                    # claimed by a no-op higher/equal match
                    logs.append("skip duplicate match %s %s -> %s (already claimed)" % (benchmark_id, name, model_id)) if DRY_RUN else None
                    continue
                # else fall through to overwrite with higher value
            # Claim this model as soon as we accept a confident match — even if
            # the catalog value is unchanged — so a later weaker/lower row cannot
            # overwrite (root cause of 2026-09-10 Arena/SWE corruption).
            used.add(model_id)
            prev = next((s for s in existing_scores if s["modelId"] == model_id and s["benchmarkId"] == benchmark_id), None)
            if benchmark_id == "aa-intelligence":
                source_name, source_url = "Artificial Analysis", AA_URL
            elif benchmark_id == "arena-elo":
                source_name, source_url = "Arena+", ARENA_URL
            else:
                source_name, source_url = "Vals AI", SWE_URL
            if not prev:
                logs.append(f"no existing {benchmark_id} row for {model_id} ({name}) — skip insert in v1")
                continue
            from_val = prev["value"]
            high_conf = is_high_confidence(matched["why"], matched["score"])
            lim = safety_delta_limit(benchmark_id)
            if lim is not None and abs(num_val - from_val) > lim and not high_conf:
                msg = (
                    "safety skip %s %s: %s->%s (delta %.1f > %s) matched %r via %s conf=%s"
                    % (benchmark_id, model_id, format_num(from_val), format_num(num_val),
                       abs(num_val - from_val), lim, name, matched["why"], matched["score"])
                )
                logs.append(msg)
                safety_skips.append(msg)
                # Keep claim so an even worse later row cannot apply either
                continue
            next_note = (note or prev.get("note")) if benchmark_id == "aa-intelligence" else prev.get("note")
            changed_val = values_differ(from_val, num_val, benchmark_id)
            changed_meta = prev["asOf"] != as_of or prev["sourceUrl"] != source_url or (
                benchmark_id == "aa-intelligence" and note and note != prev.get("note")
            )
            if not changed_val and not changed_meta:
                continue
            next_row = {
                "modelId": model_id, "benchmarkId": benchmark_id, "value": num_val,
                "sourceName": source_name, "sourceUrl": source_url, "asOf": as_of, "note": next_note,
            }
            catalog_src = replace_score_call(catalog_src, prev, next_row)
            note_part = f', "{next_note}"' if next_note else ""
            prev.update({
                "value": num_val, "asOf": as_of, "sourceUrl": source_url, "sourceName": source_name,
                "note": next_note,
                "raw": f's("{model_id}", "{benchmark_id}", {format_num(num_val)}, "{source_name}", "{source_url}", "{as_of}"{note_part})',
            })
            updates.append({
                "benchmarkId": benchmark_id, "modelId": model_id,
                "name": model["shortName"] or model["name"],
                "from": from_val, "to": num_val, "changedVal": changed_val,
                "matchWhy": matched["why"], "note": next_note, "scrapedName": name,
            })
    # aa-intelligence from AA site ONLY — never aaii_openlm
    apply_bucket("aa-intelligence", pull.get("aa_index") or [], lambda r: {
        "name": r["name"], "value": r.get("score"), "note": r.get("note"), "variantHint": r.get("note"),
    })
    apply_bucket("arena-elo", pull.get("arena") or [], lambda r: {
        "name": r["name"], "value": r.get("elo"), "note": None, "variantHint": None,
    })
    apply_bucket("swe-bench", pull.get("swe") or [], lambda r: {
        "name": r["name"], "value": r.get("accuracy"), "note": None, "variantHint": None,
    })

    material = [u for u in updates if u["changedVal"]]
    current_snap_m = re.search(r'SNAPSHOT_DATE = "([^"]+)"', CATALOG_PATH.read_text())
    current_snap = current_snap_m.group(1) if current_snap_m else None
    need_bump = bool(material) or (bool(updates) and current_snap != as_of)

    if not updates:
        for line in logs:
            print(line, file=sys.stderr)
        if unmatched:
            print("unmatched (skipped): " + ", ".join(f'{u["benchmarkId"]}:{u["name"]}' for u in unmatched[:20]), file=sys.stderr)
        if safety_skips:
            print("safety skips: %d" % len(safety_skips), file=sys.stderr)
        print("no catalog changes")
        return

    desk_src = DESK_PATH.read_text()
    changelog_src = CHANGELOG_PATH.read_text()
    llms_src = LLMS_PATH.read_text()

    if need_bump:
        label = format_snapshot_label(as_of)
        catalog_src = re.sub(
            r'export const SNAPSHOT_DATE = "[^"]+";',
            f'export const SNAPSHOT_DATE = "{as_of}";',
            catalog_src, count=1,
        )
        catalog_src = re.sub(
            r'export const SNAPSHOT_LABEL = "[^"]+";',
            f'export const SNAPSHOT_LABEL = "{label}";',
            catalog_src, count=1,
        )
        touched = {u["benchmarkId"] for u in updates}
        if "arena-elo" in touched:
            catalog_src = re.sub(
                r'(id: "arena-elo"[\s\S]*?asOf: )"[^"]+"',
                rf'\1"{as_of}"',
                catalog_src, count=1,
            )
        if "swe-bench" in touched:
            catalog_src = re.sub(
                r'(id: "swe-bench"[\s\S]*?asOf: )"[^"]+"',
                rf'\1"{as_of}"',
                catalog_src, count=1,
            )
        desk_src = re.sub(
            r'export function isFresh\(date: string, asOf = "[^"]+"\)',
            f'export function isFresh(date: string, asOf = "{as_of}")',
            desk_src, count=1,
        )
        if material:
            by_bench = {}
            for u in material:
                by_bench.setdefault(u["benchmarkId"], []).append(u)
            items = []
            for bench, rows in by_bench.items():
                bits = ", ".join(
                    "%s %s->%s" % (u["name"], format_num(u["from"]), format_num(u["to"])) for u in rows[:6]
                )
                items.append("%s: %s." % (bench, bits))
            items.append("Scores sourced from daily briefing scrape (AA / Arena+ / Vals).")
            nl = chr(10)
            entry_items = ("," + nl).join("      " + json.dumps(i) for i in items)
            entry = (
                "  {" + nl
                + "    date: %s," % json.dumps(as_of) + nl
                + "    title: \"Daily scrape - sourced score refresh\"," + nl
                + "    items: [" + nl + entry_items + "," + nl + "    ]," + nl
                + "  }," + nl
            )
            if "Daily scrape" not in changelog_src:
                changelog_src = changelog_src.replace(
                    "export const CHANGELOG = [" + nl,
                    "export const CHANGELOG = [" + nl + entry,
                    1,
                )
        aa_scores = sorted(
            [s for s in parse_scores(catalog_src) if s["benchmarkId"] == "aa-intelligence"],
            key=lambda s: -s["value"],
        )
        headline = build_headline(aa_scores, models_by_id)
        llms_src = re.sub(r"- Snapshot: .*?\n", "- Snapshot: %s\n" % as_of, llms_src, count=1)
        start = llms_src.find("Headline AA Intelligence Index")
        if start != -1:
            after = llms_src.find(chr(10), start) + 1
            rest = llms_src[after:]
            m = re.search(r"\n\n|\n#|$", rest)
            end = after + (m.start() if m else len(rest))
            llms_src = llms_src[:after] + chr(10).join(headline) + chr(10) + llms_src[end:].lstrip(chr(10))
            if not llms_src.endswith(chr(10)):
                llms_src += chr(10)


    if DRY_RUN:
        print(
            "DRY-RUN: would update %d score row(s); material value changes: %d"
            % (len(updates), len(material))
        )
        for u in updates:
            extra = "" if u["changedVal"] else " (asOf/source only)"
            print(
                "  %s %s: %s -> %s%s [%s] scraped=%r"
                % (u["benchmarkId"], u["modelId"], format_num(u["from"]), format_num(u["to"]), extra, u["matchWhy"], u.get("scrapedName"))
            )
        if unmatched:
            names = sorted({("%s:%s" % (u["benchmarkId"], u["name"])) for u in unmatched})
            print("unmatched: " + ", ".join(names[:25]))
        if ambiguous:
            print("ambiguous: " + ", ".join("%s->%s|%s" % (u["name"], u["a"], u["b"]) for u in ambiguous))
        if safety_skips:
            print("safety skips:")
            for line in safety_skips[:40]:
                print("  " + line)
        for line in logs[:30]:
            print(line)
        return

    CATALOG_PATH.write_text(catalog_src)
    if need_bump:
        DESK_PATH.write_text(desk_src)
        CHANGELOG_PATH.write_text(changelog_src)
        LLMS_PATH.write_text(llms_src)
    print("updated %d scores (%d value changes) asOf=%s" % (len(updates), len(material), as_of))
    for u in material[:12]:
        print("  %s %s: %s->%s" % (u["benchmarkId"], u["modelId"], format_num(u["from"]), format_num(u["to"])))
    if unmatched:
        print("unmatched skipped: " + ", ".join(sorted({u["name"] for u in unmatched})[:15]))
    if safety_skips:
        print("safety skipped: %d" % len(safety_skips))

if __name__ == "__main__":
    main()
