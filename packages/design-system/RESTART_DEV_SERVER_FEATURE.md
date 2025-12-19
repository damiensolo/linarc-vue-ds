# Restart Dev Server Feature

## Overview

Added a "Restart Dev Server" button to the Figma plugin that allows you to restart the Nuxt dev server directly from Figma without manually stopping and restarting it.

## What Was Added

### 1. Restart Script (`scripts/restart-dev-server.ps1`)

PowerShell script that:

- Finds processes running on port 3000 (Nuxt dev server)
- Stops them gracefully
- Starts a new dev server in a new PowerShell window

### 2. Restart Endpoint (`/api/restart-dev-server`)

Added to the sync server (`server/local-sync-server.ts`):

- Accepts POST requests
- Executes the restart script
- Returns success/error status

### 3. Plugin UI Update (`figma-plugin/ui.html`)

Added:

- "Restart Dev Server" button (purple/secondary style)
- JavaScript handler that calls the restart endpoint
- Status messages for restart progress

## How to Use

### Step 1: Restart Sync Server

**Important:** The sync server needs to be restarted to pick up the new endpoint:

```bash
# Stop current sync server (Ctrl+C)
# Then restart:
pnpm --filter design-system dev:sync-server
```

### Step 2: Reload Plugin in Figma

1. Open Figma Desktop
2. Go to: **Plugins → Development → Design Token Sync**
3. If plugin is already loaded, you may need to reload it:
   - Close and reopen the plugin
   - Or: **Plugins → Development → Import plugin from manifest...** → Select `packages/design-system/figma-plugin/dist/manifest.json` again

### Step 3: Use the Feature

1. **Sync tokens** (if needed):

   - Click "Sync Tokens" button
   - Wait for success message

2. **Restart dev server**:
   - Click "Restart Dev Server" button
   - A new PowerShell window will open with the restarted dev server
   - Check the plugin UI for success message

## Workflow

```
1. Designer changes tokens in Figma
2. Click "Sync Tokens" → Tokens update in design system
3. Click "Restart Dev Server" → Server restarts automatically
4. Changes appear in browser! ✨
```

## Technical Details

### Restart Script Behavior

- **Finds processes**: Uses `Get-NetTCPConnection` to find processes on port 3000
- **Stops processes**: Uses `Stop-Process` to gracefully stop them
- **Starts new server**: Opens new PowerShell window with `pnpm dev`
- **Non-blocking**: Script returns immediately, doesn't wait for server to start

### Endpoint Details

- **URL**: `POST http://localhost:3001/api/restart-dev-server`
- **Method**: POST
- **Response**: JSON with `success` and `message` fields
- **Error handling**: Returns 500 with error details if script fails

### Security Note

The restart script executes PowerShell commands with `-ExecutionPolicy Bypass`. This is safe because:

- Only runs locally (localhost)
- Only executes the specific restart script
- User must explicitly click the button

## Troubleshooting

### Button doesn't appear

- ✅ Rebuild plugin: `pnpm --filter design-system build:plugin`
- ✅ Reload plugin in Figma
- ✅ Check browser console for errors

### Restart doesn't work

- ✅ Verify sync server is running: `http://localhost:3001/health`
- ✅ Restart sync server to pick up new endpoint
- ✅ Check sync server console for error messages
- ✅ Verify PowerShell execution policy allows scripts

### New window doesn't open

- ✅ Check if PowerShell is available in PATH
- ✅ Verify workspace root path is correct
- ✅ Check sync server console for script output

### Port conflicts

- ✅ If port 3000 is in use by another app, the script will try to stop it
- ✅ If you want to use a different port, modify the script

## Files Changed

1. `packages/design-system/scripts/restart-dev-server.ps1` (NEW)
2. `packages/design-system/server/local-sync-server.ts` (UPDATED)
3. `packages/design-system/figma-plugin/ui.html` (UPDATED)

## Testing

To test the feature:

1. **Start sync server**:

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Start dev server** (in separate terminal):

   ```bash
   pnpm dev
   ```

3. **Test restart endpoint**:

   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3001/api/restart-dev-server" -Method POST -ContentType "application/json"
   ```

4. **Expected result**:
   - Old dev server stops
   - New PowerShell window opens
   - New dev server starts in that window
   - Endpoint returns success message

## Summary

✅ **Feature complete!** The restart dev server functionality is now available in the Figma plugin.

**Next steps:**

1. Restart sync server to pick up new endpoint
2. Reload plugin in Figma
3. Test the "Restart Dev Server" button
4. Enjoy automated server restarts! 🎉
