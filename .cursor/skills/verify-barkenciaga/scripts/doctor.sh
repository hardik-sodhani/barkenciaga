#!/usr/bin/env bash
# Read-only: is this verification instance worth driving?
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_FILE="$SKILL_DIR/run/state.env"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "FAIL no state file at $STATE_FILE (launch first)" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

if [[ -z "${VERIFY_PID:-}" ]] || ! kill -0 "$VERIFY_PID" 2>/dev/null; then
  echo "FAIL pid ${VERIFY_PID:-unset} is not running" >&2
  exit 1
fi

if [[ -z "${VERIFY_PORT:-}" ]] || [[ -z "${VERIFY_BASE_URL:-}" ]]; then
  echo "FAIL state file missing VERIFY_PORT or VERIFY_BASE_URL" >&2
  exit 1
fi

LISTEN_PID="$(lsof -nP -iTCP:"$VERIFY_PORT" -sTCP:LISTEN -t 2>/dev/null | head -n 1 || true)"
if [[ -z "$LISTEN_PID" ]]; then
  echo "FAIL nothing listening on $VERIFY_PORT" >&2
  exit 1
fi

owned_by_our_tree() {
  local walk="$1"
  local i=0
  while [[ -n "$walk" && "$walk" != "1" && "$i" -lt 12 ]]; do
    if [[ "$walk" == "$VERIFY_PID" ]]; then
      return 0
    fi
    walk="$(ps -o ppid= -p "$walk" 2>/dev/null | tr -d ' ')"
    i=$((i + 1))
  done
  return 1
}

if ! owned_by_our_tree "$LISTEN_PID"; then
  echo "FAIL port $VERIFY_PORT is owned by pid $LISTEN_PID, not our tree (VERIFY_PID=$VERIFY_PID)" >&2
  exit 1
fi

HOME_HTML="$(curl -fsS --max-time 5 "$VERIFY_BASE_URL/")"
if ! grep -q "Barkenciaga" <<<"$HOME_HTML"; then
  echo "FAIL $VERIFY_BASE_URL/ did not contain Barkenciaga" >&2
  exit 1
fi

SHOWROOM_HTML="$(curl -fsS --max-time 5 "$VERIFY_BASE_URL/showroom")"
if ! grep -q "Showroom" <<<"$SHOWROOM_HTML"; then
  echo "FAIL $VERIFY_BASE_URL/showroom did not contain Showroom" >&2
  exit 1
fi

if grep -q "text-ink-40" <<<"$HOME_HTML"; then
  echo "FAIL a11y regression: text-ink-40 in home HTML" >&2
  exit 1
fi

echo "ok pid=$VERIFY_PID listen=$LISTEN_PID url=$VERIFY_BASE_URL"
echo "ok home+showroom contain brand/showroom copy"
exit 0
