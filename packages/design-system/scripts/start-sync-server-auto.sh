#!/bin/bash
# Auto-Start Sync Server Script
# Checks if server is running, starts it if not

set -e

PORTS=(3001 3002 3003 3004 3005)

# Calculate workspace root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DESIGN_SYSTEM_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PACKAGES_DIR="$(cd "$DESIGN_SYSTEM_DIR/.." && pwd)"
WORKSPACE_ROOT="$(cd "$PACKAGES_DIR/.." && pwd)"

echo "🔍 Checking for sync server..."

# Check if server is already running
SERVER_RUNNING=false
for port in "${PORTS[@]}"; do
  if command -v lsof >/dev/null 2>&1; then
    if lsof -ti:$port >/dev/null 2>&1; then
      echo "✅ Sync server already running on port $port"
      echo "   Server URL: http://localhost:$port"
      SERVER_RUNNING=true
      break
    fi
  elif command -v netstat >/dev/null 2>&1; then
    if netstat -an | grep -q ":$port.*LISTEN"; then
      echo "✅ Sync server already running on port $port"
      echo "   Server URL: http://localhost:$port"
      SERVER_RUNNING=true
      break
    fi
  fi
done

if [ "$SERVER_RUNNING" = false ]; then
  echo "🚀 Starting sync server..."
  
  # Kill any old processes on these ports
  for port in "${PORTS[@]}"; do
    if command -v lsof >/dev/null 2>&1; then
      PIDS=$(lsof -ti:$port 2>/dev/null || true)
      if [ -n "$PIDS" ]; then
        for PID in $PIDS; do
          kill -TERM $PID 2>/dev/null || kill -KILL $PID 2>/dev/null || true
        done
      fi
    fi
  done
  
  # Start server in background
  cd "$WORKSPACE_ROOT"
  nohup pnpm --filter design-system dev:sync-server > /tmp/sync-server.log 2>&1 &
  SERVER_PID=$!
  
  echo "⏳ Waiting for server to start..."
  sleep 3
  
  # Check if it started
  for port in "${PORTS[@]}"; do
    if command -v lsof >/dev/null 2>&1; then
      if lsof -ti:$port >/dev/null 2>&1; then
        echo "✅ Sync server started on port $port"
        echo "   Server URL: http://localhost:$port"
        echo ""
        echo "💡 Tip: Keep the server running while using the Figma plugin"
        echo "   Logs: tail -f /tmp/sync-server.log"
        break
      fi
    elif command -v netstat >/dev/null 2>&1; then
      if netstat -an | grep -q ":$port.*LISTEN"; then
        echo "✅ Sync server started on port $port"
        echo "   Server URL: http://localhost:$port"
        echo ""
        echo "💡 Tip: Keep the server running while using the Figma plugin"
        echo "   Logs: tail -f /tmp/sync-server.log"
        break
      fi
    fi
  done
else
  echo ""
  echo "💡 Server is ready! You can use the Figma plugin now."
fi

