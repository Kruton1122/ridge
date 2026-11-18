#!/usr/bin/env python3
"""Ridge small-model board: open-weight models at or under 20B total params
with a published Artificial Analysis Intelligence Index v5 score.

Scores come from AA's models leaderboard (embedded initialModels). Official
parameter totals, licenses and weight URLs are a curated registry confirmed
from official model cards / Hugging Face safetensors counts — never guessed,
and never replaced by AA's rounded size field. New AA-scored open models
that look like they might qualify are printed as candidates and are not
added until official totals are confirmed.

Refuses to write if the page cannot be parsed or fewer than 5 registry
models still have a published v5 score.

Usage: small-models.py [--from FILE] [--dry-run]
"""
from __future__ import annotations

import datetime
import json
import os
import re
import subprocess
import sys

URL = "https://artificialanalysis.ai/leaderboards/models"
UA = "Mozilla/5.0 (X11; Linux x86_64) Chrome/130"
REPO = os.environ.get("RIDGE_HOME", os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(REPO, "src/lib/data/small.ts")
MAX_TOTAL_B = 20.0

# Official totals are Hugging Face safetensors parameter counts from the
# listed model cards, confirmed 2026-11-18. cardNote records the official
# card's own size wording when it differs from the weight total.
REGISTRY = [
    {
        "id": "k2-horizon-7b",
        "aaSlug": "k2-horizon-7b",
        "lab": "Institute of Foundation Models",
        "name": "K2 Horizon 7B",
        "officialParams": 8999178240,
        "cardNote": "7B-core on the official card",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/IFM/K2-Horizon-7B",
    },
    {
        "id": "k2-horizon-3.7b",
        "aaSlug": "k2-horizon-3-7b",
        "lab": "Institute of Foundation Models",
        "name": "K2 Horizon 3.7B",
        "officialParams": 5058255360,
        "cardNote": "3.7B-core on the official card",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/IFM/K2-Horizon-3.7B",
    },
    {
        "id": "lfm3-1.7b",
        "aaSlug": "lfm3-1-7b",
        "lab": "Liquid AI",
        "name": "LFM3-1.7B",
        "officialParams": 1728801536,
        "cardNote": None,
        "license": "LFM Open License v1.0",
        "licenseUrl": "https://www.liquid.ai/lfm-license",
        "weightsUrl": "https://huggingface.co/LiquidAI/LFM3-1.7B",
    },
    {
        "id": "granite-4.2-8b",
        "aaSlug": "granite-4-2-8b",
        "lab": "IBM",
        "name": "Granite 4.2 8B",
        "officialParams": 8791592960,
        "cardNote": "card lists 8B",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/ibm-granite/granite-4.2-8b",
    },
    {
        "id": "gemma-4-e4b",
        "aaSlug": "gemma-4-e4b",
        "lab": "Google",
        "name": "Gemma 4 E4B (Reasoning)",
        "officialParams": 7996156490,
        "cardNote": "4.5B effective / 8B with embeddings on the official card",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/google/gemma-4-E4B-it",
    },
    {
        "id": "granite-4.2-3b",
        "aaSlug": "granite-4-2-3b",
        "lab": "IBM",
        "name": "Granite 4.2 3B",
        "officialParams": 3659737600,
        "cardNote": "card lists 3B",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/ibm-granite/granite-4.2-3b",
    },
    {
        "id": "k2-horizon-0.9b",
        "aaSlug": "k2-horizon-0-9b",
        "lab": "Institute of Foundation Models",
        "name": "K2 Horizon 0.9B",
        "officialParams": 1078285824,
        "cardNote": "0.9B-class on the official card",
        "license": "Apache 2.0",
        "licenseUrl": "https://www.apache.org/licenses/LICENSE-2.0",
        "weightsUrl": "https://huggingface.co/IFM/K2-Horizon-0.9B",
    },
    {
        "id": "nvidia-nemotron-3-nano-4b",
        "aaSlug": "nvidia-nemotron-3-nano-4b",
        "lab": "NVIDIA",
        "name": "NVIDIA Nemotron 3 Nano 4B",
        "officialParams": 3973556832,
        "cardNote": "official card: 3.97e9 parameters",
        "license": "NVIDIA Nemotron Open Model License",
        "licenseUrl": "https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/",
        "weightsUrl": "https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-4B-BF16",
    },
    {
        "id": "lfm3-vl-2b",
        "aaSlug": "lfm3-vl-2b",
        "lab": "Liquid AI",
        "name": "LFM3-VL-2B",
        "officialParams": 1918181888,
        "cardNote": "vision-language model",
        "license": "LFM Open License v1.0",
        "licenseUrl": "https://www.liquid.ai/lfm-license",
        "weightsUrl": "https://huggingface.co/LiquidAI/LFM3-VL-2B",
    },
]


def official_b(n: int) -> float:
    return n / 1e9


def fmt_index(v: float) -> str:
    return f"{v:.2f}"


def parse_initial_models(raw: str):
    payloads = re.findall(r'self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)', raw)
    if not payloads:
        raise SystemExit("small-models: no Next.js payload found on the AA leaderboard")
    stream = "".join(payloads)
    try:
        unescaped = stream.encode("utf-8").decode("unicode_escape")
    except Exception as e:
        raise SystemExit(f"small-models: failed to unescape AA payload ({e})")
    idx = unescaped.find('"initialModels":')
    if idx < 0:
        raise SystemExit("small-models: initialModels not found on the AA leaderboard")
    obj_start = unescaped.rfind("{", 0, idx + 1)
    decoder = json.JSONDecoder()
    try:
        obj, _end = decoder.raw_decode(unescaped[obj_start:])
    except json.JSONDecodeError as e:
        raise SystemExit(f"small-models: could not parse initialModels ({e})")
    models = obj.get("initialModels")
    if not isinstance(models, list) or len(models) < 50:
        raise SystemExit(f"small-models: initialModels too small ({0 if not isinstance(models, list) else len(models)})")
    return models


def best_score_for_slug(models, slug: str):
    """Highest published Intelligence Index among AA rows for this release slug."""
    scored = []
    for m in models:
        rel = m.get("release") or {}
        if rel.get("slug") != slug:
            continue
        v = m.get("intelligenceIndex")
        if isinstance(v, (int, float)):
            scored.append((float(v), m))
    if not scored:
        return None
    scored.sort(key=lambda x: -x[0])
    return scored[0]


def vram_phrase(params: int) -> str:
    """Plain estimate, not a measured run. Q4 ≈ 0.55 GB/B + 1 GB; FP16 ≈ 2 GB/B + 1 GB."""
    b = official_b(params)
    q4 = b * 0.55 + 1.0
    fp16 = b * 2.0 + 1.0

    def card(gb: float) -> str:
        for c in (8, 12, 16, 24):
            if gb <= c:
                return f"{c}GB"
        return ">24GB"

    q4c, fp16c = card(q4), card(fp16)
    if q4c == fp16c:
        return f"{fp16c} at FP16"
    return f"{q4c} at Q4 · {fp16c} at FP16"


def pts_per_b(index: float, params: int) -> str:
    return f"{index / official_b(params):.2f}"


def ts_str(s: str | None) -> str:
    return json.dumps(s, ensure_ascii=False)


def render(rows, as_of: str, candidates: list[str]) -> str:
    lines = [
        "// Generated by scripts/small-models.py from Artificial Analysis Intelligence Index v5",
        "// and official model-card / Hugging Face safetensors parameter totals.",
        "// Do not hand-edit scores or official param counts. A model joins the registry only",
        "// after an official total is confirmed. These rows are not part of the text ledger.",
        "",
        "export interface SmallRow {",
        "  id: string;",
        "  lab: string;",
        "  name: string;",
        "  /** AA Intelligence Index v5, rounded to two decimals. */",
        "  index: string;",
        "  /** Official total parameters (Hugging Face safetensors count). */",
        "  officialParams: number;",
        "  /** Official card wording when it differs from the weight total. */",
        "  cardNote: string | null;",
        "  license: string;",
        "  licenseUrl: string;",
        "  weightsUrl: string;",
        "}",
        "",
        f"export const SMALL_AS_OF = {json.dumps(as_of)};",
        'export const SMALL_SOURCE = { name: "Artificial Analysis", url: "https://artificialanalysis.ai/leaderboards/models" };',
        "/** Inclusive cutoff for official total parameters, in billions. */",
        "export const SMALL_MAX_PARAMS_B = 20;",
        "",
        "/** Q4 ≈ 0.55 GB per billion params + 1 GB; FP16 ≈ 2 GB per billion + 1 GB. Not a measured run. */",
        "export function smallVramFit(officialParams: number): string {",
        "  const b = officialParams / 1e9;",
        "  const card = (gb: number) => {",
        "    for (const c of [8, 12, 16, 24]) if (gb <= c) return `${c}GB`;",
        "    return \">24GB\";",
        "  };",
        "  const q4 = card(b * 0.55 + 1);",
        "  const fp16 = card(b * 2 + 1);",
        "  return q4 === fp16 ? `${fp16} at FP16` : `${q4} at Q4 · ${fp16} at FP16`;",
        "}",
        "",
        "export function smallPtsPerB(index: string, officialParams: number): string {",
        "  return (Number.parseFloat(index) / (officialParams / 1e9)).toFixed(2);",
        "}",
        "",
        "export const SMALL_ROWS: SmallRow[] = [",
    ]
    for r in rows:
        lines.append(
            "  { "
            + ", ".join(
                [
                    f"id: {ts_str(r['id'])}",
                    f"lab: {ts_str(r['lab'])}",
                    f"name: {ts_str(r['name'])}",
                    f"index: {ts_str(r['index'])}",
                    f"officialParams: {r['officialParams']}",
                    f"cardNote: {ts_str(r['cardNote'])}",
                    f"license: {ts_str(r['license'])}",
                    f"licenseUrl: {ts_str(r['licenseUrl'])}",
                    f"weightsUrl: {ts_str(r['weightsUrl'])}",
                ]
            )
            + " },"
        )
    lines += ["];", ""]
    if candidates:
        lines.append("/* Candidates noted by the last scrape (not added; official totals unconfirmed):")
        for c in candidates:
            lines.append(f"   {c}")
        lines.append("*/")
        lines.append("")
    return "\n".join(lines)


def find_candidates(models, registry_slugs: set[str]) -> list[str]:
    out = []
    seen = set()
    for m in models:
        if not m.get("isOpenWeights"):
            continue
        v = m.get("intelligenceIndex")
        if not isinstance(v, (int, float)):
            continue
        rel = m.get("release") or {}
        slug = rel.get("slug")
        if not slug or slug in registry_slugs or slug in seen:
            continue
        # AA's rounded size is only a first-pass filter for candidates.
        # initialModels often omits parameters; "small" on AA is 4B–40B, so
        # only treat tiny (≤4B) as a safe candidate without a numeric size.
        params = m.get("parameters")
        aa_b = params if isinstance(params, (int, float)) else None
        pclass = m.get("paramClass")
        if aa_b is not None:
            if aa_b > MAX_TOTAL_B:
                continue
        elif pclass != "tiny":
            continue
        seen.add(slug)
        size = f"AA {aa_b}B" if aa_b is not None else f"paramClass={pclass}"
        out.append(f"{m.get('name')} slug={slug} index={float(v):.2f} {size}")
    return out


def main():
    args = sys.argv[1:]
    if "--from" in args:
        raw = open(args[args.index("--from") + 1], errors="ignore").read()
    else:
        proc = subprocess.run(
            ["curl", "-sL", "--compressed", "-A", UA, "-m", "90", URL],
            capture_output=True,
            text=True,
        )
        raw = proc.stdout
        if proc.returncode != 0 or not raw:
            raise SystemExit(f"small-models: failed to fetch AA leaderboard (rc={proc.returncode})")
    models = parse_initial_models(raw)

    # Enrich AA parameter field from the same objects if present (usually not on initialModels).
    rows = []
    missing = []
    for rec in REGISTRY:
        b = official_b(rec["officialParams"])
        if b > MAX_TOTAL_B:
            raise SystemExit(f"small-models: registry {rec['id']} official total {b:.3f}B exceeds {MAX_TOTAL_B}B")
        hit = best_score_for_slug(models, rec["aaSlug"])
        if not hit:
            missing.append(rec["name"])
            continue
        score, _aa = hit
        rows.append({**rec, "index": fmt_index(score), "score": score})

    if len(rows) < 5:
        raise SystemExit(
            f"small-models: only {len(rows)} registry models still have a published v5 score"
            + (f" (missing: {', '.join(missing)})" if missing else "")
            + ", not writing"
        )

    rows.sort(key=lambda r: (-r["score"], r["name"]))
    registry_slugs = {r["aaSlug"] for r in REGISTRY}
    candidates = find_candidates(models, registry_slugs)

    as_of = datetime.date.today().isoformat()
    new = render(rows, as_of, candidates)
    old = open(OUT).read() if os.path.exists(OUT) else ""
    strip = lambda s: re.sub(r'export const SMALL_AS_OF = "[^"]*";', "", s)
    changed = strip(new) != strip(old)
    if "--dry-run" not in args:
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        open(OUT, "w").write(new)
    lead = f"{rows[0]['name']} {rows[0]['index']}"
    extra = f", {len(candidates)} candidate(s)" if candidates else ""
    miss = f", {len(missing)} registry model(s) now unscored" if missing else ""
    print(
        f"small-models: {len(rows)} scored, leader {lead}"
        f"{extra}{miss}{'' if changed else ', scores unchanged'}"
    )
    for c in candidates:
        print(f"  candidate: {c}")
    for n in missing:
        print(f"  missing: {n}")


if __name__ == "__main__":
    main()
