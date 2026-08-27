#!/usr/bin/env bash
# Tear down only the Next process this run started. Proof artifacts stay.
set -euo pipefail
# shellcheck disable=SC1091
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_state

if [[ ! -f "$STATE_FILE" ]]; then
  echo "cleanup: no .run/state — nothing to stop"
  exit 0
fi

if [[ "${OWNED:-0}" != "1" ]]; then
  echo "cleanup: adopted instance at ${BASE_URL:-unknown} — not killing it"
  rm -f "$STATE_FILE"
  echo "cleanup: removed $STATE_FILE; artifacts under $ARTIFACTS_DIR kept"
  exit 0
fi

if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
  echo "cleanup: SIGTERM pid $PID"
  kill "$PID"
  for _ in $(seq 1 20); do
    kill -0 "$PID" 2>/dev/null || break
    sleep 0.25
  done
  if kill -0 "$PID" 2>/dev/null; then
    echo "cleanup: SIGKILL pid $PID"
    kill -9 "$PID" 2>/dev/null || true
  fi
else
  echo "cleanup: owned pid ${PID:-unset} already gone"
fi

rm -f "$STATE_FILE"
echo "cleanup: stopped owned instance; artifacts under $ARTIFACTS_DIR kept"
