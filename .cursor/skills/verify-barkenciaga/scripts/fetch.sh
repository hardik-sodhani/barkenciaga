#!/usr/bin/env bash
# GET a storefront path and write headers + body next to each other.
# Usage: fetch.sh <path> <artifact-stem>
# Example: fetch.sh "/search?q=quilted" artifacts/search/match
set -euo pipefail
# shellcheck disable=SC1091
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"
load_state

if [[ $# -lt 2 ]]; then
  echo "usage: fetch.sh <path> <artifact-stem>" >&2
  exit 2
fi

path="$1"
stem="$2"
if [[ "$stem" != /* ]]; then
  stem="$SKILL_ROOT/$stem"
fi
mkdir -p "$(dirname "$stem")"

url="${BASE_URL}${path}"
curl -sS -D "${stem}.headers.txt" -o "${stem}.html" --max-time 30 -w "HTTP %{http_code}  ${path}\n" "$url"
grep -q "^HTTP/" "${stem}.headers.txt"
echo "wrote ${stem}.html and ${stem}.headers.txt"
