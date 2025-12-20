#!/bin/bash
# Bash script to start sync server with automatic port handling
# Usage: ./scripts/start-sync-server.sh

set -e

echo "🚀 Starting Figma Sync Server..."
echo ""

# Try to kill any existing processes on common ports
PORTS=(3001 3002 3003 3004 3005)

for port in "${PORTS[@]}"; do
  if command -v lsof >/dev/null 2>&1; then
    PIDS=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$PIDS" ]; then
      for PID in $PIDS; do
        if kill -0 $PID 2>/dev/null; then
          kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null || true
          echo "✅ Killed process on port $port (PID: $PID)"
        fi
      done
    fi
  fi
done

echo ""
echo "Starting server..."
echo ""

# Start the server (it will auto-try ports if needed)
pnpm --filter design-system dev:sync-server

