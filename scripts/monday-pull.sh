#!/usr/bin/env bash
# Monday Ridge pull for a Pi (or any box with Grok Build CLI).
# Crontab example (9am America/New_York every Monday):
#   TZ=America/New_York
#   0 9 * * 1 /home/kodi/ridge/scripts/monday-pull.sh >> /home/kodi/ridge/logs/monday.log 2>&1

set -euo pipefail

REPO="${RIDGE_HOME:-$HOME/ridge}"
GROK_BIN="${GROK_BIN:-$(command -v grok || true)}"
LOG_DIR="$REPO/logs"
mkdir -p "$LOG_DIR"

if [[ ! -d "$REPO/.git" ]]; then
  echo "Ridge repo not found at $REPO" >&2
  exit 1
fi
if [[ -z "$GROK_BIN" ]]; then
  echo "grok CLI not on PATH. Install Grok Build or set GROK_BIN." >&2
  exit 1
fi

cd "$REPO"
git pull --ff-only origin main || git pull --ff-only

export XAI_API_KEY="${XAI_API_KEY:-}"

"$GROK_BIN" -p "$(cat "$REPO/scripts/monday-prompt.txt")" --directory "$REPO"

if [[ "${RIDGE_PUSH:-0}" == "1" ]]; then
  if ! git diff --quiet || ! git diff --cached --quiet; then
    git add src/lib/data public/llms.txt
    git commit -m "Monday board pull $(date -I)"
    git push origin main
  else
    echo "No file changes to push."
  fi
fi
