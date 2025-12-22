# Figma Token Sync Guide

Complete guide for syncing design tokens from Figma to your design system.

## Quick Start

### The Simplest Way: 3 Steps

1. **Change variable in Figma**
2. **Ask Cursor AI**: "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"
3. **Restart dev server**: `pnpm dev`

That's it! Your components update automatically.

## Sync Methods

### Method 1: Cursor AI (Recommended)

Just ask Cursor:

```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

Cursor will:

- ✅ Fetch variables from Figma
- ✅ Update `figma-tokens.ts`
- ✅ Update `tailwind-extension.json`
- ✅ Everything is ready!

### Method 2: Simple Script

```bash
pnpm --filter design-system sync:figma:simple
```

### Method 3: Interactive Mode

```bash
pnpm --filter design-system sync:figma:interactive
```

### Method 4: Figma Plugin (Local Sync)

1. **Start sync server**:

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Open Figma plugin**:

   - Plugins → Development → Design Token Sync
   - Select "Local (localhost)" mode
   - Click "Sync Tokens"

3. **Restart dev server** to see changes

## Production Sync

### Manual Workflow (Recommended First)

1. **Make changes in Figma** (update color/spacing variables)
2. **Sync locally** using the Figma plugin (to test)
3. **Commit and push** token changes:
   ```bash
   git add packages/design-system/src/tokens/
   git commit -m "chore: sync design tokens from Figma"
   git push origin main
   ```
4. **Auto-deploy**: Vercel will automatically deploy the changes

### Automated Production Sync

The Figma plugin supports direct production sync:

1. **Get GitHub Personal Access Token**:

   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Name: `Figma Token Sync`
   - Scopes: ✅ `repo`, ✅ `workflow`
   - Copy token (starts with `ghp_`)

2. **Start sync server**:

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

3. **Use Figma plugin**:
   - Select "Production (GitHub)" mode
   - Paste your GitHub token
   - Click "Sync Tokens"
   - Plugin creates commit → Vercel auto-deploys!

## What Gets Updated

When you sync, these files update automatically:

1. **`src/tokens/figma-tokens.ts`**

   ```typescript
   colors: {
     'indigo-600': '#64748b', // ✅ Updated!
   }
   ```

2. **`src/tokens/tailwind-extension.json`**

   ```json
   {
     "colors": {
       "indigo-600": "#64748b"
     }
   }
   ```

3. **Tailwind config** (auto-imports)
4. **Components** (automatically use new value)

## Testing Token Sync

### Quick Test

1. **Change variable in Figma**:

   - Open: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
   - Find variable: `indigo/600`
   - Change value: `#4f46e5` → `#64748b` (slate-500)

2. **Sync tokens**:

   - Ask Cursor: "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"
   - Or run: `pnpm --filter design-system sync:figma:simple`

3. **Restart dev server**:

   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

4. **See the change**:
   - Visit: `http://localhost:3000/test-token-sync`
   - Components using `bg-indigo-600` now show slate-500!

### Test Page

Visit `http://localhost:3000/test-token-sync` to see:

- Current token values
- Visual color swatches
- Whether sync worked

## Common Variables

| Variable          | What It Controls     |
| ----------------- | -------------------- |
| `indigo/600`      | Primary button color |
| `slate/50`        | Light text color     |
| `Radius/radii-xl` | Large border radius  |
| `Radius/radii-s`  | Small border radius  |

## Troubleshooting

### "Failed to fetch" Error

**The sync server must be running** for both local AND production sync!

1. **Start the sync server**:

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Expected output**:

   ```
   🚀 Local sync server running on http://localhost:3001
   📡 Endpoint: POST http://localhost:3001/api/sync-tokens
   ```

3. **Check plugin Server URL**:
   - Should match the port shown in server console
   - Default: `http://localhost:3001`

### Color Not Updating

1. ✅ Check variable name matches exactly in Figma
2. ✅ Run sync command
3. ✅ Restart dev server
4. ✅ Clear browser cache

### Can't Find Variable

1. ✅ Check Figma file key: `rDLR9ZCB0Dq2AmRvxrifds`
2. ✅ Check node ID: `1:110`
3. ✅ Verify variable exists in Figma

### Server Won't Start

1. **Check if port is in use**:

   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
   ```

2. **Kill process on port**:

   ```powershell
   Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
   ```

3. **Try alternative port**:
   ```powershell
   $env:PORT=3002; pnpm --filter design-system dev:sync-server
   ```
   Then update plugin Server URL to `http://localhost:3002`

## Auto-Start Helper

For easier workflow, use the auto-start helper:

```bash
pnpm --filter design-system dev:auto-start
```

**Keep this running in the background!** The helper:

- ✅ Listens for plugin connections
- ✅ Auto-starts sync server when plugin needs it
- ✅ Handles everything automatically

Then just open the Figma plugin and click "Sync Tokens" - no terminal commands needed!

## Pro Tips

1. **Use Cursor AI** - It's the fastest way!
2. **Test one at a time** - Change one variable to see effect clearly
3. **Use test page** - `/test-token-sync` shows current values
4. **Commit changes** - Save token updates to git
5. **Keep helper running** - Use auto-start for convenience

## Next Steps

1. ✅ Try changing `indigo/600` to a different color
2. ✅ Sync using Cursor AI
3. ✅ See component update
4. ✅ Set up production sync for automated deployments

---

**Remember:** Change in Figma → Sync → See it update! 🚀
