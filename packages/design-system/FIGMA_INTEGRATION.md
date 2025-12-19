# Figma Integration Guide

Complete guide for syncing design tokens from Figma to your Vue design system.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Figma Plugin Setup](#figma-plugin-setup)
3. [Workflow](#workflow)
4. [Features](#features)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Usage](#advanced-usage)

## Quick Start

### For Designers

1. **Build the plugin:**

   ```bash
   pnpm --filter design-system build:plugin
   ```

2. **Start the sync server:**

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

3. **Load plugin in Figma:**

   - Open Figma Desktop
   - Go to: **Plugins → Development → Import plugin from manifest...**
   - Select: `packages/design-system/figma-plugin/dist/manifest.json`

4. **Sync tokens:**
   - Run plugin: **Plugins → Development → Design Token Sync**
   - Click **"Sync Tokens"**
   - Click **"Restart Dev Server"** (if Nuxt app is running)
   - Done! ✨

### For Developers

See [Advanced Usage](#advanced-usage) for programmatic sync options.

## Figma Plugin Setup

### Prerequisites

- Figma Desktop app installed
- Design tokens/variables defined in your Figma file
- Node.js >= 18 and pnpm >= 8

### Step 1: Build the Plugin

```bash
pnpm --filter design-system build:plugin
```

This compiles the TypeScript plugin code and creates a `dist/` folder with:

- `code.js` - Plugin logic
- `ui.html` - Plugin UI
- `manifest.json` - Plugin configuration

### Step 2: Load Plugin in Figma

1. Open **Figma Desktop** app
2. Open your design file (or create a new one)
3. Go to: **Plugins → Development → Import plugin from manifest...**
4. Navigate to: `packages/design-system/figma-plugin/dist/manifest.json`
5. Click **"Open"**

The plugin is now installed and appears in: **Plugins → Development → Design Token Sync**

### Step 3: Start Sync Server

**Recommended (auto-handles port conflicts):**

```bash
pnpm --filter design-system dev:sync-server
```

The server automatically tries alternative ports (3002, 3003, etc.) if 3001 is in use.

**Clean start (kills old processes first):**

```powershell
pnpm --filter design-system dev:sync-server:clean
```

**Custom port:**

```powershell
$env:PORT=3002; pnpm --filter design-system dev:sync-server
```

**Expected output:**

```
🚀 Local sync server running on http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/sync-tokens
🔄 Endpoint: POST http://localhost:3001/api/restart-dev-server
💚 Health check: http://localhost:3001/health
```

If a different port is used, update the Server URL in the plugin UI.

## Workflow

### Standard Workflow

1. **Designer changes tokens in Figma**

   - Update color variables, spacing, border radius, etc.

2. **Sync tokens**

   - Run plugin: **Plugins → Development → Design Token Sync**
   - Click **"Sync Tokens"** button
   - Wait for success message ✅

3. **Restart dev server** (optional but recommended)

   - Click **"Restart Dev Server"** button in plugin
   - Or manually: Stop server (Ctrl+C) and run `pnpm dev`

4. **See changes in browser!**
   - Tokens are updated in `packages/design-system/src/tokens/figma-tokens.ts`
   - Components automatically use new values

### What Gets Synced

The plugin syncs the following from Figma variables:

- **Colors** - All color variables (e.g., `indigo-500`, `slate-900`)
- **Border Radius** - Radius values (e.g., `radii-sm`, `radii-lg`)
- **Spacing** - Spacing tokens (if defined)
- **Shadows** - Box shadow values (if defined)

### Token File Structure

Synced tokens are stored in:

- `packages/design-system/src/tokens/figma-tokens.ts` - TypeScript tokens
- `packages/design-system/src/tokens/tailwind-extension.json` - Tailwind config extension

## Features

### 1. Sync Tokens

Fetches all local variables from the current Figma file and syncs them to your design system.

**How it works:**

- Plugin reads variables using `figma.variables.getLocalVariables()`
- Sends variables to sync server via POST request
- Server processes variables and updates token files
- Returns success message with token counts

### 2. Restart Dev Server

Automatically restarts your Nuxt dev server to pick up token changes.

**How it works:**

- Finds processes running on port 3000
- Stops them gracefully
- Starts new dev server in a new PowerShell window
- Returns success message

**Note:** This feature requires PowerShell and works on Windows. For other platforms, restart manually.

### 3. Auto Port Detection

The sync server automatically finds an available port if the default (3001) is in use.

**Ports tried in order:**

1. 3001 (default)
2. 3002
3. 3003
4. 3004
5. 3005

If all ports are in use, the server will show helpful error messages.

## Troubleshooting

### Plugin Can't Connect to Server

**Symptoms:** Plugin shows connection error or timeout

**Solutions:**

1. ✅ Verify server is running: Check terminal for "Local sync server running"
2. ✅ Test server: Visit `http://localhost:3001/health` in browser
3. ✅ Check Server URL in plugin UI matches server port
4. ✅ Verify firewall isn't blocking localhost connections
5. ✅ Try restarting both server and plugin

### Port Already in Use

**Error:** `listen EADDRINUSE: address already in use :::3001`

**Solutions:**

**Option 1: Kill the process (PowerShell)**

```powershell
$connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($connection) {
    Stop-Process -Id $connection.OwningProcess -Force
    Write-Host "✅ Killed process on port 3001"
}
```

**Option 2: Use different port**

```powershell
$env:PORT=3002; pnpm --filter design-system dev:sync-server
```

**Option 3: Use clean start script**

```powershell
pnpm --filter design-system dev:sync-server:clean
```

### No Variables Found

**Symptoms:** Plugin says "No variables found in this file"

**Solutions:**

1. ✅ Ensure your Figma file has variables defined
2. ✅ Variables must be "Local" (not published to library)
3. ✅ Check variable names - they should follow naming conventions
4. ✅ Try creating a test variable in Figma to verify plugin can see it

### Token Files Not Updating

**Symptoms:** Sync succeeds but files don't change

**Solutions:**

1. ✅ Check file permissions in `packages/design-system/src/tokens/`
2. ✅ Verify server console shows sync success message
3. ✅ Check for errors in server terminal output
4. ✅ Restart dev server after sync to see changes
5. ✅ Verify token files exist and are writable

### Build Errors

**Symptoms:** `pnpm build:plugin` fails with TypeScript errors

**Solutions:**

1. ✅ Install dependencies: `cd figma-plugin && pnpm install`
2. ✅ Check TypeScript version matches project
3. ✅ Verify `@figma/plugin-typings` is installed at monorepo root
4. ✅ Try: `pnpm build:plugin` (uses `--skipLibCheck` flag)

### Plugin Not Loading in Figma

**Symptoms:** Plugin doesn't appear or fails to load

**Solutions:**

1. ✅ Check `manifest.json` syntax is valid JSON
2. ✅ Verify `code.js` exists in `dist/` folder
3. ✅ Check Figma console: Plugins → Development → Open Console
4. ✅ Rebuild plugin: `pnpm --filter design-system build:plugin`
5. ✅ Reload plugin: Close and reopen in Figma

### Restart Dev Server Not Working

**Symptoms:** Button doesn't restart server or shows error

**Solutions:**

1. ✅ Verify sync server is running: `http://localhost:3001/health`
2. ✅ Restart sync server to pick up new endpoint
3. ✅ Check sync server console for error messages
4. ✅ Verify PowerShell execution policy allows scripts
5. ✅ Check if PowerShell is available in PATH

### Token Changes Not Visible

**Symptoms:** Tokens sync but changes don't appear in browser

**Solutions:**

1. ✅ **Restart dev server** - Tailwind config changes require a restart
2. ✅ Clear browser cache
3. ✅ Check browser console for errors
4. ✅ Verify tokens are in `figma-tokens.ts` file
5. ✅ Check Tailwind config is loading tokens correctly

## Advanced Usage

### Programmatic Sync (For Developers)

You can sync tokens programmatically using the sync function:

```typescript
import { syncFromFigmaMCP } from "./scripts/sync-from-figma-mcp.js";

const variables = {
  "indigo-500": "#6366f1",
  "slate-900": "#0f172a",
  // ... more variables
};

const tokens = syncFromFigmaMCP(variables);
// Tokens are automatically written to files
```

### Using MCP Directly (Cursor AI)

You can use Cursor AI with Figma MCP to fetch variables:

```
Get variable definitions from Figma file [fileKey] node [nodeId] and sync to design system
```

The AI will:

1. Fetch variables using Figma MCP
2. Call `syncFromFigmaMCP()` with the variables
3. Update token files automatically

### CI/CD Integration (Future)

A webhook handler is available for CI/CD workflows:

```bash
pnpm --filter design-system dev:webhook-server
```

This creates GitHub commits/PRs with token updates. See `server/webhook-handler.ts` for implementation details.

## Server Endpoints

### POST `/api/sync-tokens`

Syncs tokens from Figma plugin.

**Request:**

```json
{
  "variables": {
    "indigo-500": "#6366f1",
    "slate-900": "#0f172a"
  },
  "fileKey": "rDLR9ZCB0Dq2AmRvxrifds",
  "nodeId": "0:1"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Tokens synced successfully",
  "tokens": {
    "colors": 20,
    "borderRadius": 4,
    "spacing": 0,
    "shadows": 0
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### POST `/api/restart-dev-server`

Restarts the Nuxt dev server.

**Request:** Empty body

**Response:**

```json
{
  "success": true,
  "message": "Dev server restart initiated",
  "output": "PowerShell script output..."
}
```

### GET `/health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "port": 3001
}
```

## Quick Reference

**Build plugin:**

```bash
pnpm --filter design-system build:plugin
```

**Start sync server:**

```bash
pnpm --filter design-system dev:sync-server
```

**Clean start (kills old processes):**

```powershell
pnpm --filter design-system dev:sync-server:clean
```

**Load plugin in Figma:**
Plugins → Development → Import plugin from manifest → Select `dist/manifest.json`

**Sync tokens:**
Run plugin → Click "Sync Tokens" → Done!

**Restart dev server:**
Click "Restart Dev Server" button in plugin

## File Structure

```
packages/design-system/
├── figma-plugin/          # Figma plugin source
│   ├── code.ts            # Plugin logic
│   ├── ui.html            # Plugin UI
│   ├── manifest.json      # Plugin config
│   └── dist/              # Compiled plugin
├── server/                 # Sync server
│   ├── local-sync-server.ts    # Main sync server
│   └── webhook-handler.ts      # CI/CD webhook handler
├── scripts/               # Utility scripts
│   ├── sync-from-figma-mcp.ts  # Main sync function
│   └── restart-dev-server.ps1  # Restart script
└── src/tokens/            # Token files
    ├── figma-tokens.ts     # Synced tokens
    └── tailwind-extension.json  # Tailwind config
```

## Next Steps

- Change variables in Figma
- Run plugin to sync updates
- Tokens automatically update in design system
- Components use new values immediately!

For questions or issues, check the troubleshooting section above or review the server console output.
