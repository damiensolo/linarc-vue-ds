# Cross-Platform Compatibility Guide

This document outlines the cross-platform compatibility of the Linarc Vue Design System project.

## ✅ Fully Cross-Platform Components

### Core Application
- **Nuxt App** (`packages/nuxt-app/`) - Works on Windows, macOS, and Linux
- **Design System** (`packages/design-system/`) - Works on all platforms
- **Sync Server** (`packages/design-system/server/local-sync-server.ts`) - Cross-platform Node.js/TypeScript

### Main Scripts
- `pnpm dev` - Starts Nuxt dev server (cross-platform)
- `pnpm --filter design-system dev:sync-server` - Starts sync server (cross-platform)
- `pnpm --filter design-system build:plugin` - Builds Figma plugin (cross-platform)

### Token Sync Scripts
All TypeScript sync scripts work on all platforms:
- `sync:figma` - Sync tokens from Figma
- `sync:figma:mcp` - Sync via MCP
- `sync:figma:simple` - Simple sync
- `sync:figma:interactive` - Interactive sync

## 🔄 Platform-Specific Scripts (Auto-Detected)

### Restart Dev Server
The restart functionality automatically detects your platform:

- **Windows**: Uses `restart-dev-server.ps1` (PowerShell)
- **macOS/Linux**: Uses `restart-dev-server.sh` (Bash)

The sync server automatically detects the OS and runs the appropriate script.

### Helper Scripts
The following scripts have cross-platform wrappers:

- `dev:sync-server:clean` - Cleans ports and starts server
  - Windows: Uses `start-sync-server.ps1`
  - macOS/Linux: Uses `start-sync-server.sh`
  - Wrapper: `scripts/start-sync-server.js` (auto-detects platform)

- `dev:sync-server:auto` - Auto-starts server if not running
  - Windows: Uses `start-sync-server-auto.ps1`
  - macOS/Linux: Uses `start-sync-server-auto.sh`
  - Wrapper: `scripts/start-sync-server-auto.js` (auto-detects platform)

## 📋 Platform Detection

The codebase uses `process.platform` to detect the operating system:
- `win32` → Windows
- `darwin` → macOS
- `linux` → Linux
- Other Unix-like systems → Uses bash scripts

## ✅ Verified Cross-Platform Features

1. **Path Handling**
   - Node.js uses `path.resolve()` and `path.join()` (cross-platform)
   - PowerShell uses `Join-Path` (Windows-aware)
   - Bash scripts use standard Unix paths (work on macOS/Linux)

2. **Port Detection**
   - Windows: Uses `Get-NetTCPConnection` (PowerShell)
   - macOS/Linux: Uses `lsof` or `netstat` (bash)

3. **Process Management**
   - Windows: Uses `Stop-Process` (PowerShell)
   - macOS/Linux: Uses `kill` command (bash)

4. **File Operations**
   - All file operations use Node.js `fs` module (cross-platform)
   - Path separators are handled automatically

## 🚀 Quick Start (Any Platform)

```bash
# Install dependencies
pnpm install

# Start Nuxt app
pnpm dev

# Start sync server (in another terminal)
pnpm --filter design-system dev:sync-server

# Build plugin
pnpm --filter design-system build:plugin
```

## ⚠️ Platform-Specific Notes

### Windows
- Requires PowerShell (included with Windows 10+)
- Scripts use `-ExecutionPolicy Bypass` to run without prompts
- Paths use backslashes in PowerShell but Node.js handles this

### macOS/Linux
- Requires bash (included by default)
- Scripts are made executable with `chmod +x`
- Uses forward slashes for paths (standard Unix)

### Requirements
- **Node.js** >= 18.0.0 (all platforms)
- **pnpm** >= 8.0.0 (all platforms)
- **PowerShell** (Windows only, for helper scripts)
- **bash** (macOS/Linux, included by default)

## 🔧 Troubleshooting

### Script Not Executable (macOS/Linux)
```bash
chmod +x packages/design-system/scripts/*.sh
```

### PowerShell Execution Policy (Windows)
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
The sync server automatically tries alternative ports (3001-3005). If all are in use:
- **Windows**: Use `dev:sync-server:clean` to kill processes
- **macOS/Linux**: Use `dev:sync-server:clean` or manually kill processes

## 📝 Summary

✅ **All core functionality works on Windows, macOS, and Linux**
✅ **Platform detection is automatic - no manual configuration needed**
✅ **Helper scripts have cross-platform wrappers**
✅ **Path handling is cross-platform via Node.js**

The only platform-specific code is in the shell scripts (`.ps1` for Windows, `.sh` for Unix), and these are automatically selected based on your OS.

