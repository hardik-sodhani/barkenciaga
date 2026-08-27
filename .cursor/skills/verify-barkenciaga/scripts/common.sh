#!/usr/bin/env bash
# Shared paths and defaults for verify-barkenciaga helpers.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_ROOT="$(cd "$SKILL_ROOT/../../.." && pwd)"
RUN_DIR="$SKILL_ROOT/.run"
ARTIFACTS_DIR="$SKILL_ROOT/artifacts"
STATE_FILE="$RUN_DIR/state"

PORT="${PORT:-3000}"
HOST="${HOST:-127.0.0.1}"
BASE_URL="${BASE_URL:-http://${HOST}:${PORT}}"

mkdir -p "$RUN_DIR" "$ARTIFACTS_DIR"

load_state() {
  if [[ -f "$STATE_FILE" ]]; then
    # shellcheck disable=SC1090
    source "$STATE_FILE"
  fi
}

html_looks_like_barkenciaga() {
  local body="$1"
  grep -q "Barkenciaga" <<<"$body" && grep -q "High fashion" <<<"$body"
}
