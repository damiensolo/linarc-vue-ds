#!/bin/bash
# Bash script to restart the Nuxt dev server
# Finds processes on port 3000, stops them, and starts a new dev server

set -e

PORT=3000

# Calculate workspace root: scripts -> design-system -> packages -> workspace root
# $0 = packages/design-system/scripts/restart-dev-server.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESIGN_SYSTEM_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKAGES_DIR="$(cd "$DESIGN_SYSTEM_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$PACKAGES_DIR/.." && pwd)"

# Debug output
echo "[DEBUG] Script location: $SCRIPT_DIR" >&2
echo "[DEBUG] Calculated workspace root: $WORKSPACE_ROOT" >&2

echo "[RESTART] Restarting dev server..." >&2
echo "[INFO] Script location: $SCRIPT_DIR" >&2
echo "[INFO] Workspace root: $WORKSPACE_ROOT" >&2
echo ""

# Find processes using port 3000
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti:$PORT 2>/dev/null || true)
  
  if [ -n "$PIDS" ]; then
    echo "[INFO] Found processes on port ${PORT}:" >&2
    for PID in $PIDS; do
      PROCESS_NAME=$(ps -p $PID -o comm= 2>/dev/null || echo "unknown")
      echo "   - PID $PID: $PROCESS_NAME" >&2
    done
    echo "" >&2
    
    # Stop processes gracefully
    for PID in $PIDS; do
      if kill -0 $PID 2>/dev/null; then
        kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null || true
        PROCESS_NAME=$(ps -p $PID -o comm= 2>/dev/null || echo "unknown")
        echo "[SUCCESS] Stopped process: $PROCESS_NAME (PID: $PID)" >&2
      fi
    done
    
    # Wait a moment for processes to fully stop
    sleep 0.5
  else
    echo "[INFO] No processes found on port ${PORT}" >&2
    echo "" >&2
  fi
else
  echo "[WARNING] lsof not found, skipping port check" >&2
fi

# Start new dev server
echo "[INFO] Starting new dev server..." >&2
echo ""

if [ ! -d "$WORKSPACE_ROOT" ]; then
  echo "[ERROR] Workspace root not found: $WORKSPACE_ROOT" >&2
  exit 1
fi

# Prepare Nuxt files first to avoid manifest errors
echo "[INFO] Preparing Nuxt files..." >&2
NUXT_APP_DIR="$WORKSPACE_ROOT/packages/nuxt-app"
if [ -d "$NUXT_APP_DIR" ]; then
  # Run nuxt prepare from workspace root using pnpm filter
  echo "[INFO] Running nuxt prepare..." >&2
  cd "$WORKSPACE_ROOT"
  
  # Run prepare command and capture output
  if pnpm --filter nuxt-app exec nuxt prepare >/dev/null 2>&1; then
    echo "[SUCCESS] Nuxt files prepared" >&2
    
    # Verify .nuxt directory was created
    if [ -d "$NUXT_APP_DIR/.nuxt" ]; then
      echo "[INFO] .nuxt directory verified" >&2
    else
      echo "[WARNING] .nuxt directory not found after prepare" >&2
    fi
  else
    echo "[WARNING] Nuxt prepare had issues (may still work)" >&2
  fi
  
  # Give Nuxt a moment to finish writing files
  echo "[INFO] Waiting for Nuxt files to be written..." >&2
  sleep 2
else
  echo "[WARNING] Nuxt app directory not found: $NUXT_APP_DIR" >&2
fi
echo ""

# Start dev server
echo "[INFO] Starting dev server from: $NUXT_APP_DIR" >&2
echo ""

if [ ! -d "$NUXT_APP_DIR" ]; then
  echo "[ERROR] Nuxt app directory not found: $NUXT_APP_DIR" >&2
  exit 1
fi

# Start process in background
cd "$NUXT_APP_DIR"
echo "[INFO] Command: pnpm exec nuxt dev" >&2
echo "[INFO] Using 'pnpm exec nuxt dev' to avoid pnpm filter exit code issues" >&2
echo ""

# Start the dev server in the background
nohup pnpm exec nuxt dev > /tmp/nuxt-dev-server.log 2>&1 &
DEV_SERVER_PID=$!

echo "[SUCCESS] Dev server process started! (PID: $DEV_SERVER_PID)" >&2
echo "[INFO] Logs are being written to /tmp/nuxt-dev-server.log" >&2
echo ""

# Wait a bit for server to start, then check health
echo "[INFO] Waiting for server to start..." >&2
sleep 3

# Check if server is responding
MAX_ATTEMPTS=10
ATTEMPT=0
SERVER_READY=false

if command -v curl >/dev/null 2>&1; then
  while [ $ATTEMPT -lt $MAX_ATTEMPTS ] && [ "$SERVER_READY" = false ]; do
    ATTEMPT=$((ATTEMPT + 1))
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 http://localhost:3000 2>/dev/null || echo "000")
    if echo "$HTTP_CODE" | grep -qE "200|404"; then
      SERVER_READY=true
      echo "[SUCCESS] Server is up and running! (http://localhost:3000)" >&2
      break
    else
      echo "[INFO] Waiting for server... (attempt $ATTEMPT/$MAX_ATTEMPTS)" >&2
      sleep 2
    fi
  done
else
  # Fallback: just check if process is still running
  echo "[INFO] curl not available, skipping health check" >&2
  sleep 3
  if kill -0 $DEV_SERVER_PID 2>/dev/null; then
    SERVER_READY=true
    echo "[SUCCESS] Dev server process is running (PID: $DEV_SERVER_PID)" >&2
  fi
fi

if [ "$SERVER_READY" = false ]; then
  echo "[WARNING] Server may still be starting. Check the logs at /tmp/nuxt-dev-server.log" >&2
fi

echo ""

