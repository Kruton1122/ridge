#!/usr/bin/env bash
# Ridge daily briefing. Non-AI scrape by default (scripts/briefing.py);
# falls back to invoking Grok only if the scrape itself breaks.
set -uo pipefail

REPO="${RIDGE_HOME:-$HOME/ridge}"
LOG_DIR="$REPO/logs"
LOG_FILE="$LOG_DIR/briefing.log"
NOTIFY="${NOTIFY_BIN:-/home/pi/scripts/notify.sh}"
GROK_BIN="${GROK_BIN:-$(command -v grok || echo /home/pi/.grok/bin/grok)}"

mkdir -p "$LOG_DIR"
ts() { date '+%Y-%m-%dT%H:%M:%S%z'; }

echo "[$(ts)] starting" >> "$LOG_FILE"

MSG="$(python3 "$REPO/scripts/briefing.py" 2>>"$LOG_FILE")"
RC=$?

if [[ $RC -eq 0 && -n "$MSG" ]]; then
  echo "[$(ts)] scrape OK" >> "$LOG_FILE"
  echo "$MSG" >> "$LOG_FILE"
else
  echo "[$(ts)] scrape FAILED (rc=$RC) — falling back to Grok" >> "$LOG_FILE"
  if [[ -x "$GROK_BIN" || -n "$(command -v "$GROK_BIN" 2>/dev/null)" ]]; then
    MSG="$("$GROK_BIN" -p "$(cat "$REPO/scripts/briefing-fallback-prompt.txt")" --directory "$REPO" 2>>"$LOG_FILE")"
    if [[ -z "$MSG" ]]; then
      MSG="Ridge briefing failed today: scraper broke and Grok fallback returned nothing. Check $LOG_FILE."
    else
      MSG="[Grok fallback — scraper broke, check $LOG_FILE] $MSG"
    fi
  else
    MSG="Ridge briefing failed today: scraper broke and no grok CLI found for fallback. Check $LOG_FILE."
  fi
  echo "$MSG" >> "$LOG_FILE"
fi

"$NOTIFY" "Ridge briefing" "$MSG" >> "$LOG_FILE" 2>&1
echo "[$(ts)] done" >> "$LOG_FILE"
echo "----" >> "$LOG_FILE"
