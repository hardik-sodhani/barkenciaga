#!/usr/bin/env bash
# Start a verification-owned Next.js instance in its own session so it
# survives the agent shell exiting. Never attach to an existing :3000.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_DIR="$(cd "$SKILL_DIR/../../.." && pwd)"
RUN_DIR="$SKILL_DIR/run"
STATE_FILE="$RUN_DIR/state.env"
LOG_FILE="$RUN_DIR/next.log"
PID_FILE="$RUN_DIR/next.pid"
PORT="${VERIFY_PORT:-3317}"
HOST="127.0.0.1"
BASE_URL="http://${HOST}:${PORT}"

mkdir -p "$RUN_DIR"

if [[ -f "$STATE_FILE" ]]; then
  # shellcheck disable=SC1090
  source "$STATE_FILE"
  if [[ -n "${VERIFY_PID:-}" ]] && kill -0 "$VERIFY_PID" 2>/dev/null; then
    echo "already running pid=$VERIFY_PID url=$VERIFY_BASE_URL"
    exit 0
  fi
  rm -f "$STATE_FILE" "$PID_FILE"
fi

if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "port $PORT is already in use; pick another VERIFY_PORT or stop that listener" >&2
  lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >&2
  exit 1
fi

if [[ -n "${DATABASE_URL:-}${POSTGRES_URL:-}" ]]; then
  echo "DATABASE_URL/POSTGRES_URL is set; verification expects local PGlite. Unset it for this run." >&2
  exit 1
fi

if ps -axo command= | grep -E '[n]ext (dev|start)' >/dev/null; then
  echo "another Next.js process is running. Stop it (do not drive :3000) before launching verification." >&2
  ps -axo pid=,command= | grep -E '[n]ext (dev|start)' >&2 || true
  exit 1
fi

cd "$REPO_DIR"
if [[ ! -d node_modules ]]; then
  pnpm install
fi

: > "$LOG_FILE"
rm -f "$PID_FILE"

python3 - "$REPO_DIR" "$LOG_FILE" "$PID_FILE" "$HOST" "$PORT" <<'PY'
import os, sys

repo, log_path, pid_path, host, port = sys.argv[1:]

if os.fork() > 0:
    sys.exit(0)
os.setsid()
if os.fork() > 0:
    os._exit(0)

os.chdir(repo)
os.environ["VERIFY_BARKENCIAGA"] = "1"
with open(pid_path, "w", encoding="utf-8") as fh:
    fh.write(str(os.getpid()))
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
os.close(devnull)
log = os.open(log_path, os.O_WRONLY | os.O_APPEND | os.O_CREAT, 0o644)
os.dup2(log, 1)
os.dup2(log, 2)
os.close(log)
os.execvp("pnpm", ["pnpm", "exec", "next", "dev", "--hostname", host, "--port", port])
PY

for _ in $(seq 1 20); do
  if [[ -f "$PID_FILE" ]]; then
    break
  fi
  sleep 0.1
done

if [[ ! -f "$PID_FILE" ]]; then
  echo "daemon did not write $PID_FILE" >&2
  exit 1
fi

PID="$(tr -d '[:space:]' < "$PID_FILE")"
{
  echo "VERIFY_PID=$PID"
  echo "VERIFY_PORT=$PORT"
  echo "VERIFY_BASE_URL=$BASE_URL"
  echo "VERIFY_LOG=$LOG_FILE"
  echo "VERIFY_CWD=$REPO_DIR"
  echo "VERIFY_STARTED_AT=$(date -u +%Y-%m-%dT%H:%M:%SZ)"
} > "$STATE_FILE"

cleanup_failed_start() {
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    PGID="$(ps -o pgid= -p "$PID" | tr -d ' ')"
    kill -TERM -"$PGID" 2>/dev/null || kill -TERM "$PID" 2>/dev/null || true
  fi
  rm -f "$STATE_FILE" "$PID_FILE"
}

for _ in $(seq 1 60); do
  if ! kill -0 "$PID" 2>/dev/null; then
    echo "next exited before ready; see $LOG_FILE" >&2
    tail -n 40 "$LOG_FILE" >&2 || true
    cleanup_failed_start
    exit 1
  fi
  if curl -fsS --max-time 2 "$BASE_URL/" >/dev/null 2>&1; then
    echo "ready pid=$PID url=$BASE_URL"
    exit 0
  fi
  sleep 1
done

echo "timed out waiting for $BASE_URL; see $LOG_FILE" >&2
tail -n 40 "$LOG_FILE" >&2 || true
cleanup_failed_start
exit 1
