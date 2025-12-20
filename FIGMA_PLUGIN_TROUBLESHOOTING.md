# Figma Plugin Troubleshooting

## "Failed to fetch" Error

### Common Causes

1. **Sync server not running**
   - **Fix**: Start the sync server:
     ```bash
     pnpm --filter design-system dev:sync-server
     ```
   - **Verify**: Check console output shows "🚀 Local sync server running on http://localhost:3001"

2. **Wrong port in plugin**
   - **Fix**: Check the Server URL in plugin matches the port shown in server console
   - **Default**: `http://localhost:3001`
   - **If different**: Update Server URL in plugin UI

3. **Server crashed or stopped**
   - **Fix**: Restart the server
   - **Check**: Look for errors in server console

4. **Firewall blocking connection**
   - **Fix**: Allow Node.js through Windows Firewall
   - **Or**: Try a different port (3002, 3003, etc.)

### Quick Diagnostic Steps

1. **Check if server is running:**
   ```powershell
   Test-NetConnection -ComputerName localhost -Port 3001
   ```
   Should show `TcpTestSucceeded : True`

2. **Check server logs:**
   - Look at the terminal where you ran `dev:sync-server`
   - Should see: "🚀 Local sync server running on http://localhost:3001"

3. **Test server directly:**
   ```powershell
   Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
   ```
   Should return: `{"status":"ok","port":3001}`

4. **Check plugin Server URL:**
   - Open Figma plugin
   - Verify Server URL matches the port shown in server console
   - Default: `http://localhost:3001`

### Production Sync Specific Issues

**"GitHub token is required"**
- Make sure you selected "Production (GitHub)" mode
- Paste your GitHub token in the GitHub Token field

**"Failed to sync tokens to production"**
- Check GitHub token is valid (starts with `ghp_`)
- Verify token has `repo` scope
- Check server console for detailed error messages

**"Cannot connect to sync server"**
- Server must be running for production sync too
- The server handles both local and production sync
- Start server: `pnpm --filter design-system dev:sync-server`

## Step-by-Step Fix

1. **Stop any existing server processes:**
   ```powershell
   # Find and kill processes on port 3001
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

2. **Start fresh server:**
   ```bash
   pnpm --filter design-system dev:sync-server
   ```

3. **Verify server is running:**
   - Should see: "🚀 Local sync server running on http://localhost:3001"
   - Note the port number

4. **Update plugin Server URL:**
   - Open Figma plugin
   - Set Server URL to match the port shown (e.g., `http://localhost:3001`)

5. **Try syncing again:**
   - Select sync mode (Local or Production)
   - Click "Sync Tokens"

## Still Not Working?

1. **Check server console** for error messages
2. **Check plugin console** (Figma → Plugins → Development → Open Console)
3. **Try different port** (3002, 3003, etc.)
4. **Rebuild plugin** if you made changes:
   ```bash
   pnpm --filter design-system build:plugin
   ```

---

**Most common issue**: Server not running. Always start the server first!

