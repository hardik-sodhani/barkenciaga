#!/usr/bin/env bash
# Read-only: is this Barkenciaga instance worth driving?
set -euo pipefail
# shellcheck disable=SC1091
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_state

code="$(curl -sS -o /tmp/barkenciaga-doctor-body.html -w "%{http_code}" --max-time 15 "${BASE_URL}/" || true)"
if [[ "$code" != "200" ]]; then
  echo "doctor FAIL: GET ${BASE_URL}/ -> HTTP ${code:-unreachable}"
  exit 1
fi

body="$(cat /tmp/barkenciaga-doctor-body.html)"
if ! html_looks_like_barkenciaga "$body"; then
  echo "doctor FAIL: ${BASE_URL}/ is not Barkenciaga (missing brand copy)"
  exit 1
fi
if grep -q "Application error" <<<"$body"; then
  echo "doctor FAIL: home page rendered Application error"
  exit 1
fi

echo "doctor OK"
echo "  BASE_URL=$BASE_URL"
echo "  owned=${OWNED:-unknown} pid=${PID:-none}"
echo "  home contains Barkenciaga + High fashion"
exit 0
