#!/usr/bin/env bash
# Start Barkenciaga for verification, or adopt a healthy instance already
# serving this checkout. Never start a second Next process against the same
# .data/pglite directory.
set -euo pipefail
# shellcheck disable=SC1091
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

wait_ready() {
  local i
  for i in $(seq 1 90); do
    if curl -sS --max-time 2 -o /tmp/barkenciaga-launch-body.html -w "%{http_code}" "${BASE_URL}/" | grep -qx 200; then
      if html_looks_like_barkenciaga "$(cat /tmp/barkenciaga-launch-body.html)"; then
        return 0
      fi
    fi
    sleep 1
  done
  return 1
}

adopt_code="$(curl -sS --max-time 3 -o /tmp/barkenciaga-launch-body.html -w "%{http_code}" "${BASE_URL}/" 2>/dev/null || echo 000)"
if [[ "$adopt_code" == "200" ]] && html_looks_like_barkenciaga "$(cat /tmp/barkenciaga-launch-body.html)"; then
  cat >"$STATE_FILE" <<EOF
BASE_URL=$BASE_URL
HOST=$HOST
PORT=$PORT
OWNED=0
PID=
EOF
  echo "launch: adopted existing Barkenciaga at $BASE_URL (OWNED=0)"
  echo "  PGlite lives at ${REPO_ROOT}/.data/pglite — do not start another Next process in this checkout."
  exit 0
fi

if [[ "$adopt_code" =~ ^[0-9]{3}$ ]] && [[ "$adopt_code" != "000" ]]; then
  echo "launch FAIL: ${BASE_URL} answers HTTP ${adopt_code} but is not Barkenciaga. Pick another PORT or stop that process." >&2
  exit 1
fi

cd "$REPO_ROOT"
if [[ ! -d node_modules ]]; then
  echo "launch: pnpm install"
  pnpm install
fi

echo "launch: starting pnpm exec next dev --hostname ${HOST} --port ${PORT}"
mkdir -p "$RUN_DIR"
: >"$RUN_DIR/next.log"
pnpm exec next dev --hostname "$HOST" --port "$PORT" >"$RUN_DIR/next.log" 2>&1 &
pid=$!
cat >"$STATE_FILE" <<EOF
BASE_URL=$BASE_URL
HOST=$HOST
PORT=$PORT
OWNED=1
PID=$pid
EOF

if ! wait_ready; then
  echo "launch FAIL: ${BASE_URL} never served Barkenciaga home. Last log:" >&2
  tail -n 40 "$RUN_DIR/next.log" >&2
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  rm -f "$STATE_FILE"
  exit 1
fi

echo "launch OK owned pid=$pid $BASE_URL"
echo "  first request bootstraps PGlite + seed under ${REPO_ROOT}/.data/pglite"
