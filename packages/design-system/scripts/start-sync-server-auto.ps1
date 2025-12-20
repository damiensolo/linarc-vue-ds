# Auto-Start Sync Server Script
# Checks if server is running, starts it if not

$ports = @(3001, 3002, 3003, 3004, 3005)
$workspaceRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host "🔍 Checking for sync server..." -ForegroundColor Cyan

# Check if server is already running
$serverRunning = $false
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "✅ Sync server already running on port $port" -ForegroundColor Green
        Write-Host "   Server URL: http://localhost:$port" -ForegroundColor Gray
        $serverRunning = $true
        break
    }
}

if (-not $serverRunning) {
    Write-Host "🚀 Starting sync server..." -ForegroundColor Yellow
    
    # Kill any old processes on these ports
    foreach ($port in $ports) {
        $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        foreach ($conn in $connections) {
            Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Start server in new window
    $scriptPath = Join-Path $workspaceRoot "server\local-sync-server.ts"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$workspaceRoot'; pnpm --filter design-system dev:sync-server"
    
    Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
    
    # Check if it started
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            Write-Host "✅ Sync server started on port $port" -ForegroundColor Green
            Write-Host "   Server URL: http://localhost:$port" -ForegroundColor Gray
            Write-Host ""
            Write-Host "💡 Tip: Keep the server window open while using the Figma plugin" -ForegroundColor Cyan
            break
        }
    }
} else {
    Write-Host ""
    Write-Host "💡 Server is ready! You can use the Figma plugin now." -ForegroundColor Cyan
}

