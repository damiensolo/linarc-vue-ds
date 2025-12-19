# Figma Plugin Troubleshooting Guide

## Port Already in Use (EADDRINUSE)

### Error
```
Error: listen EADDRINUSE: address already in use :::3001
```

### Solution 1: Find and Kill the Process

**Windows:**
```powershell
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

**Or use PowerShell:**
```powershell
# Find and kill process on port 3001
$connection = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if ($connection) {
    Stop-Process -Id $connection.OwningProcess -Force
    Write-Host "✅ Killed process on port 3001"
}
```

### Solution 2: Use a Different Port

```bash
PORT=3002 pnpm --filter design-system dev:sync-server
```

Then update the Server URL in the Figma plugin UI to `http://localhost:3002`

### Solution 3: Check if Server is Already Running

The server might already be running from a previous session. Check:
- Look for a terminal window with the sync server running
- Or test: `http://localhost:3001/health` in your browser

## Common Issues

### Plugin Can't Connect to Server

**Symptoms:** Plugin shows connection error or timeout

**Solutions:**
1. ✅ Verify server is running: Check terminal for "Local sync server running"
2. ✅ Test server: Visit `http://localhost:3001/health` in browser
3. ✅ Check Server URL in plugin UI matches server port
4. ✅ Verify firewall isn't blocking localhost connections
5. ✅ Try restarting both server and plugin

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

**Symptoms:** `pnpm build` fails with TypeScript errors

**Solutions:**
1. ✅ Install dependencies: `cd figma-plugin && pnpm install`
2. ✅ Check TypeScript version matches project
3. ✅ Verify `@figma/plugin-typings` is installed
4. ✅ Try: `pnpm build --skipLibCheck` (temporary workaround)

### Plugin Not Loading in Figma

**Symptoms:** Plugin doesn't appear or fails to load

**Solutions:**
1. ✅ Check `manifest.json` syntax is valid JSON
2. ✅ Verify `code.js` exists in `dist/` folder
3. ✅ Check Figma console: Plugins → Development → Open Console
4. ✅ Rebuild plugin: `cd figma-plugin && pnpm build`
5. ✅ Reload plugin: Close and reopen in Figma

## Quick Fixes

### Restart Everything

```bash
# 1. Stop all servers (Ctrl+C in terminals)
# 2. Kill process on port 3001 (see above)
# 3. Rebuild plugin
cd packages/design-system/figma-plugin
pnpm build

# 4. Start sync server
cd ../..
pnpm --filter design-system dev:sync-server

# 5. Reload plugin in Figma
```

### Verify Setup

```bash
# Check plugin is built
Test-Path packages/design-system/figma-plugin/dist/code.js

# Check server file exists
Test-Path packages/design-system/server/local-sync-server.ts

# Test server health
curl http://localhost:3001/health
```

## Still Having Issues?

1. Check browser console for errors
2. Check Figma plugin console (Plugins → Development → Open Console)
3. Check server terminal for error messages
4. Verify all dependencies are installed
5. Try rebuilding everything from scratch

