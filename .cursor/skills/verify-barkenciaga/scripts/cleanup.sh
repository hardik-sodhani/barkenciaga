#!/usr/bin/env bash
# Tear down the instance this run started. Does not delete evidence/.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_FILE="$SKILL_DIR/run/state.env"
PID_FILE="$SKILL_DIR/run/next.pid"
LOG_FILE="$SKILL_DIR/run/next.log"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "nothing to clean (no state file)"
  exit 0
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

if [[ -n "${VERIFY_PID:-}" ]] && kill -0 "$VERIFY_PID" 2>/dev/null; then
  PGID="$(ps -o pgid= -p "$VERIFY_PID" | tr -d ' ')"
  if [[ -n "$PGID" ]]; then
    kill -TERM -"$PGID" 2>/dev/null || true
  else
    kill -TERM "$VERIFY_PID" 2>/dev/null || true
  fi
  for _ in $(seq 1 20); do
    if ! kill -0 "$VERIFY_PID" 2>/dev/null; then
      break
    fi
    sleep 0.25
  done
  if kill -0 "$VERIFY_PID" 2>/dev/null; then
    echo "pid $VERIFY_PID ignored SIGTERM; sending SIGKILL" >&2
    if [[ -n "${PGID:-}" ]]; then
      kill -KILL -"$PGID" 2>/dev/null || true
    fi
    kill -KILL "$VERIFY_PID" 2>/dev/null || true
  fi
fi

rm -f "$STATE_FILE" "$PID_FILE"
if [[ -f "$LOG_FILE" ]]; then
  echo "left log at $LOG_FILE"
fi

echo "cleaned verification server; evidence/ preserved"
