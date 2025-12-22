# Quick Fixes

Common issues and their quick solutions.

## "Failed to fetch" Error

**The Problem:**
"Failed to fetch" means the Figma plugin **cannot connect** to the sync server.

**The Solution:**
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

## Vercel Deployment Issues

### Quick Diagnostic Steps

1. **Check Vercel Dashboard:**

   - Go to: https://vercel.com/dashboard
   - Click on your project
   - Go to **"Deployments"** tab
   - Do you see new deployments when you push?

2. **Verify Token Files Are Committed:**

   ```bash
   git ls-files packages/design-system/src/tokens/
   ```

   Should show token files. If missing, commit them.

3. **Force a Fresh Deployment:**
   - Vercel Dashboard → Deployments
   - Click **"Redeploy"** on latest deployment
   - **Uncheck** "Use existing Build Cache"
   - Click **"Redeploy"**

### Most Common Issues

**Vercel Not Connected:**

1. Vercel Dashboard → Settings → Git
2. If no repository shown → Click "Connect Git Repository"
3. Select your GitHub repo
4. Authorize Vercel

**Wrong Branch:**

1. Vercel Dashboard → Settings → Git
2. Check "Production Branch"
3. Should be `main` (or your default branch)

**Build Cache:**

1. Redeploy with cache cleared (see above)
2. Or use CLI: `vercel --prod --force`

## Color Not Updating After Sync

1. ✅ Check variable name matches exactly in Figma
2. ✅ Run sync command
3. ✅ Restart dev server
4. ✅ Clear browser cache

### Clear Caches

```bash
# Clear Nuxt cache
Remove-Item -Recurse -Force packages/nuxt-app/.nuxt

# Clear Vite cache
Remove-Item -Recurse -Force packages/nuxt-app/node_modules/.vite

# Restart
pnpm dev
```

## Can't Find Variable

1. ✅ Check Figma file key: `rDLR9ZCB0Dq2AmRvxrifds`
2. ✅ Check node ID: `1:110`
3. ✅ Verify variable exists in Figma

## Figma Plugin Issues

### "Cannot connect to helper"

- Make sure helper is running: `pnpm --filter design-system dev:auto-start`
- Check port 2999 is available (helper uses 2999, Nuxt uses 3000)

### "Helper started but server won't start"

- Check ports 3001-3005 are available
- Look at helper console for error messages

### "Server starts but plugin can't connect"

- Check helper console for server URL
- Verify the URL matches plugin Server URL field

## Platform-Specific Issues

### Windows

**PowerShell Execution Policy:**
If you get execution policy errors:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### macOS/Linux

**Script Not Executable:**

```bash
chmod +x packages/design-system/scripts/*.sh
```

## Still Not Working?

1. **Check server console** for error messages
2. **Check plugin console** (Figma → Plugins → Development → Open Console)
3. **Try different port** (3002, 3003, etc.)
4. **Rebuild plugin** if you made changes:
   ```bash
   pnpm --filter design-system build:plugin
   ```

---

**Most common fix**: Just start the server! `pnpm --filter design-system dev:sync-server`
