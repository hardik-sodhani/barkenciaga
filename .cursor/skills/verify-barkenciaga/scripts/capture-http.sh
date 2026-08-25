#!/usr/bin/env bash
# Save a GET of a site-relative path into evidence/. Requires a healthy launch.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
STATE_FILE="$SKILL_DIR/run/state.env"

if [[ $# -lt 2 ]]; then
  echo "usage: capture-http.sh <site-relative-path> <evidence-relative-file>" >&2
  echo "example: capture-http.sh /search?q=quilted search/quilted.html" >&2
  exit 2
fi

PATH_Q="$1"
OUT_REL="$2"

if [[ ! -f "$STATE_FILE" ]]; then
  echo "FAIL launch first (missing $STATE_FILE)" >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$STATE_FILE"

OUT="$SKILL_DIR/evidence/$OUT_REL"
mkdir -p "$(dirname "$OUT")"

STATUS="$(curl -sS -o "$OUT" -w "%{http_code}" --max-time 10 "${VERIFY_BASE_URL}${PATH_Q}")"
echo "wrote $OUT status=$STATUS bytes=$(wc -c < "$OUT" | tr -d ' ')"
if [[ "$STATUS" != "200" ]]; then
  echo "FAIL expected HTTP 200" >&2
  exit 1
fi
