#!/usr/bin/env bash
# Ridge daily briefing. Non-AI scrape by default (scripts/briefing.py);
# falls back to invoking Grok only if the scrape itself breaks.
# After a successful scrape, applies staging → catalog if the apply script exists.
set -uo pipefail

REPO="${RIDGE_HOME:-$HOME/ridge}"
LOG_DIR="$REPO/logs"
LOG_FILE="$LOG_DIR/briefing.log"
NOTIFY="${NOTIFY_BIN:-/home/pi/scripts/notify.sh}"
GROK_BIN="${GROK_BIN:-$(command -v grok || echo /home/pi/.grok/bin/grok)}"
APPLY_JS="$REPO/scripts/apply-briefing-staging.mjs"
APPLY_PY="$REPO/scripts/apply-briefing-staging.py"

mkdir -p "$LOG_DIR"
ts() { date '+%Y-%m-%dT%H:%M:%S%z'; }

echo "[$(ts)] starting" >> "$LOG_FILE"

MSG="$(python3 "$REPO/scripts/briefing.py" 2>>"$LOG_FILE")"
RC=$?

if [[ $RC -eq 0 && -n "$MSG" ]]; then
  echo "[$(ts)] scrape OK" >> "$LOG_FILE"
  echo "$MSG" >> "$LOG_FILE"

  APPLY_MSG=""
  if [[ -f "$APPLY_JS" ]]; then
    echo "[$(ts)] apply staging (node)" >> "$LOG_FILE"
    APPLY_OUT="$(node "$APPLY_JS" 2>>"$LOG_FILE")"
    APPLY_RC=$?
    if [[ $APPLY_RC -ne 0 ]]; then
      APPLY_MSG=" | apply ERROR (rc=$APPLY_RC): ${APPLY_OUT:-see log}"
      echo "[$(ts)] apply FAILED rc=$APPLY_RC" >> "$LOG_FILE"
      echo "$APPLY_OUT" >> "$LOG_FILE"
    else
      APPLY_MSG=" | apply: ${APPLY_OUT:-ok}"
      echo "[$(ts)] apply OK: $APPLY_OUT" >> "$LOG_FILE"
    fi
  elif [[ -f "$APPLY_PY" ]]; then
    echo "[$(ts)] apply staging (python)" >> "$LOG_FILE"
    APPLY_OUT="$(python3 "$APPLY_PY" 2>>"$LOG_FILE")"
    APPLY_RC=$?
    if [[ $APPLY_RC -ne 0 ]]; then
      APPLY_MSG=" | apply ERROR (rc=$APPLY_RC): ${APPLY_OUT:-see log}"
      echo "[$(ts)] apply FAILED rc=$APPLY_RC" >> "$LOG_FILE"
    else
      APPLY_MSG=" | apply: ${APPLY_OUT:-ok}"
      echo "[$(ts)] apply OK: $APPLY_OUT" >> "$LOG_FILE"
    fi
  else
    echo "[$(ts)] no apply-briefing-staging script present — scrape only" >> "$LOG_FILE"
  fi
  MSG="${MSG}${APPLY_MSG}"
else
  echo "[$(ts)] scrape FAILED (rc=$RC) — falling back to Grok" >> "$LOG_FILE"
  if [[ -x "$GROK_BIN" || -n "$(command -v "$GROK_BIN" 2>/dev/null)" ]]; then
    MSG="$("$GROK_BIN" -p "$(cat "$REPO/scripts/briefing-fallback-prompt.txt")" --cwd "$REPO" --always-approve 2>>"$LOG_FILE")"
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
