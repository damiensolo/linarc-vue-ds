# PowerShell script to start sync server with automatic port handling
# Usage: .\scripts\start-sync-server.ps1

Write-Host "🚀 Starting Figma Sync Server...`n"

# Try to kill any existing processes on common ports
$ports = @(3001, 3002, 3003, 3004, 3005)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        $conn | ForEach-Object {
            try {
                $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
                if ($proc -and $proc.Name -ne "Idle") {
                    Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Killed process on port $port"
                }
            } catch {
                # Ignore errors (process might already be gone)
            }
        }
    }
}

Write-Host "`nStarting server...`n"

# Start the server (it will auto-try ports if needed)
pnpm --filter design-system dev:sync-server

