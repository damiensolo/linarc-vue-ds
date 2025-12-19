# PowerShell script to restart the Nuxt dev server
# Finds processes on port 3000, stops them, and starts a new dev server

$ErrorActionPreference = "Continue"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$port = 3000
# Calculate workspace root: scripts -> design-system -> packages -> workspace root
# $PSScriptRoot = packages/design-system/scripts
# Split-Path -Parent = packages/design-system
# Split-Path -Parent = packages  
# Split-Path -Parent = workspace root
$workspaceRoot = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))

# Debug output
Write-Host "[DEBUG] PSScriptRoot: $PSScriptRoot" -ForegroundColor DarkGray
Write-Host "[DEBUG] Calculated workspace root: $workspaceRoot" -ForegroundColor DarkGray

Write-Host "[RESTART] Restarting dev server..." -ForegroundColor Cyan
Write-Host "[INFO] Script location: $PSScriptRoot" -ForegroundColor Gray
Write-Host "[INFO] Workspace root: $workspaceRoot" -ForegroundColor Gray
Write-Host ""

# Find processes using port 3000
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "[INFO] Found processes on port ${port}:" -ForegroundColor Yellow
    $connections | ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            Write-Host "   - PID $($proc.Id): $($proc.Name)" -ForegroundColor Gray
        }
    }
    Write-Host ""

    # Stop processes gracefully
    $connections | ForEach-Object {
        $proc = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($proc) {
            try {
                Stop-Process -Id $proc.Id -Force -ErrorAction Stop
                Write-Host "[SUCCESS] Stopped process: $($proc.Name) (PID: $($proc.Id))" -ForegroundColor Green
            } catch {
                Write-Host "[WARNING] Could not stop process: $($proc.Name) (PID: $($proc.Id))" -ForegroundColor Yellow
            }
        }
    }
    
    # Wait a moment for processes to fully stop
    Start-Sleep -Milliseconds 500
} else {
    Write-Host "[INFO] No processes found on port ${port}" -ForegroundColor Gray
    Write-Host ""
}

# Start new dev server in a new PowerShell window
Write-Host "[INFO] Starting new dev server..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $workspaceRoot)) {
    Write-Host "[ERROR] Workspace root not found: $workspaceRoot" -ForegroundColor Red
    exit 1
}

# Prepare Nuxt files first to avoid manifest errors
Write-Host "[INFO] Preparing Nuxt files..." -ForegroundColor Gray
$nuxtAppDir = Join-Path $workspaceRoot "packages\nuxt-app"
if (Test-Path $nuxtAppDir) {
    try {
        # Run nuxt prepare from workspace root using pnpm filter
        Write-Host "[INFO] Running nuxt prepare..." -ForegroundColor Gray
        Push-Location $workspaceRoot
        
        # Run prepare command and capture output
        $prepareOutput = & pnpm --filter nuxt-app exec nuxt prepare 2>&1
        $prepareExitCode = $LASTEXITCODE
        
        if ($prepareExitCode -eq 0) {
            Write-Host "[SUCCESS] Nuxt files prepared" -ForegroundColor Green
            
            # Verify .nuxt directory was created
            $nuxtDir = Join-Path $nuxtAppDir ".nuxt"
            if (Test-Path $nuxtDir) {
                Write-Host "[INFO] .nuxt directory verified" -ForegroundColor Gray
            } else {
                Write-Host "[WARNING] .nuxt directory not found after prepare" -ForegroundColor Yellow
            }
        } else {
            Write-Host "[WARNING] Nuxt prepare exited with code $prepareExitCode" -ForegroundColor Yellow
            if ($prepareOutput) {
                # Only show errors, not all output
                $prepareOutput | Where-Object { $_ -match "error|Error|ERROR|warning|Warning" } | ForEach-Object { Write-Host $_ }
            }
        }
        Pop-Location
        
        # Give Nuxt a moment to finish writing files
        Write-Host "[INFO] Waiting for Nuxt files to be written..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "[WARNING] Nuxt prepare had issues (may still work): $_" -ForegroundColor Yellow
        Pop-Location -ErrorAction SilentlyContinue
    }
} else {
    Write-Host "[WARNING] Nuxt app directory not found: $nuxtAppDir" -ForegroundColor Yellow
}
Write-Host ""

# Start dev server
# Run directly from nuxt-app directory to avoid pnpm filter issues
$nuxtAppDir = Join-Path $workspaceRoot "packages\nuxt-app"
Write-Host "[INFO] Starting dev server from: $nuxtAppDir" -ForegroundColor Gray
Write-Host ""

if (-not (Test-Path $nuxtAppDir)) {
    Write-Host "[ERROR] Nuxt app directory not found: $nuxtAppDir" -ForegroundColor Red
    exit 1
}

try {
    # Run nuxt dev directly (bypasses pnpm recursive run issues)
    # This avoids the exit code 4294967295 error that occurs with pnpm --filter
    $command = "cd '$nuxtAppDir'; pnpm exec nuxt dev"
    Write-Host "[INFO] Command: $command" -ForegroundColor Gray
    Write-Host "[INFO] Using 'pnpm exec nuxt dev' to avoid pnpm filter exit code issues" -ForegroundColor Gray
    Write-Host ""
    
    # Start process - this will run nuxt dev directly without pnpm's recursive wrapper
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $command -WorkingDirectory $nuxtAppDir -ErrorAction Stop
    Write-Host "[SUCCESS] Dev server process started!" -ForegroundColor Green
    Write-Host "[INFO] A new PowerShell window should open with the dev server." -ForegroundColor Gray
    Write-Host ""
    
    # Wait a bit for server to start, then check health
    Write-Host "[INFO] Waiting for server to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
    
    # Check if server is responding
    $maxAttempts = 10
    $attempt = 0
    $serverReady = $false
    
    while ($attempt -lt $maxAttempts -and -not $serverReady) {
        $attempt++
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
            if ($response.StatusCode -eq 200) {
                $serverReady = $true
                Write-Host "[SUCCESS] Server is up and running! (http://localhost:3000)" -ForegroundColor Green
            }
        } catch {
            Write-Host "[INFO] Waiting for server... (attempt $attempt/$maxAttempts)" -ForegroundColor Gray
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $serverReady) {
        Write-Host "[WARNING] Server may still be starting. Check the dev server window." -ForegroundColor Yellow
    }
    
    Write-Host ""
} catch {
    Write-Host "[ERROR] Error starting dev server: $_" -ForegroundColor Red
    exit 1
}

