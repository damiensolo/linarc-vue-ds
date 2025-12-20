# Quick Fix: "Failed to fetch" Error

## The Problem

"Failed to fetch" means the Figma plugin **cannot connect** to the sync server.

## The Solution

**The sync server must be running** for both local AND production sync!

### Step 1: Start the Sync Server

```bash
pnpm --filter design-system dev:sync-server
```

**Expected output:**
```
🚀 Local sync server running on http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/sync-tokens
```

### Step 2: Verify Server is Running

The server console should show:
- ✅ "🚀 Local sync server running on http://localhost:3001"
- ✅ No error messages

### Step 3: Check Plugin Server URL

1. Open Figma plugin
2. **Server URL** should match the port shown in server console
3. Default: `http://localhost:3001`

### Step 4: Try Syncing Again

1. Select sync mode (Local or Production)
2. If Production: Paste GitHub token
3. Click "Sync Tokens"

## Important Notes

- ⚠️ **Server must run for production sync too** - The server handles GitHub API calls
- ⚠️ **Keep server running** while using the plugin
- ✅ **Better error messages** - Plugin now tells you if server isn't running

## If Server Won't Start

1. **Check if port is in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
   ```

2. **Kill process on port:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

3. **Try alternative port:**
   ```powershell
   $env:PORT=3002; pnpm --filter design-system dev:sync-server
   ```
   Then update plugin Server URL to `http://localhost:3002`

---

**Most common fix**: Just start the server! `pnpm --filter design-system dev:sync-server`

