# Figma Plugin Alias Resolution - Complete Setup

## ✅ Status: Fully Automated!

Alias resolution is now **fully automated** and works directly from the Figma plugin. No Cursor prompts needed!

## What Was Fixed

### 1. **Figma Plugin** (`figma-plugin/code.ts`)
- ✅ Preserves alias structures instead of converting to strings
- ✅ Sends variables with both name and ID keys for resolution
- ✅ Includes referenced variable names in alias objects

### 2. **Sync Function** (`scripts/sync-from-figma-mcp.ts`)
- ✅ Handles multiple alias formats (ID, name, valuesByMode)
- ✅ Recursively resolves nested aliases
- ✅ Diagnostic logging to show resolution process

### 3. **Sync Server** (`server/local-sync-server.ts`)
- ✅ Already uses `syncFromFigmaMCP` with alias resolution
- ✅ Works for both local and production syncs

## How It Works

### Flow:
```
Figma Plugin → Sync Server → syncFromFigmaMCP → Resolve Aliases → Update Token Files
```

1. **Figma Plugin** detects alias variables and preserves their structure
2. **Sync Server** receives variables and calls `syncFromFigmaMCP`
3. **Alias Resolution** resolves aliases to primitive values
4. **Token Files** are updated with resolved values

## Testing

### Step 1: Start Sync Server

```bash
cd packages/design-system
pnpm dev:sync-server
```

You should see:
```
🚀 Local sync server running on http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/sync-tokens
```

### Step 2: Use Figma Plugin

1. Open Figma file: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
2. Open the plugin: **Plugins → Development → Design Token Sync**
3. Click **"Sync Tokens"**

### Step 3: Check Output

In the sync server console, you should see:
```
🔍 Diagnostic: Checking alias variable formats...

   bg-subtle:
     Type: object
     Value: { type: 'VARIABLE_ALIAS', id: '...', name: 'slate-50' }

   🔗 Resolved alias: bg-subtle → #f8fafc
   🔗 Resolved alias: bg-strong → #0f172a
```

### Step 4: Verify Token Files

Check `packages/design-system/src/tokens/tailwind-extension.json`:
```json
{
  "colors": {
    "bg-subtle": "#f8fafc",  // ✅ Resolved!
    "bg-strong": "#0f172a"   // ✅ Resolved!
  }
}
```

### Step 5: Restart Dev Server

```bash
# Stop dev server (Ctrl+C)
pnpm dev
```

## Troubleshooting

### Aliases Still Show #NaNNaNNaN

1. **Check sync server logs** - Are aliases being resolved?
2. **Check plugin output** - Are alias structures being preserved?
3. **Verify variable format** - Check diagnostic output

### Sync Server Not Running

```bash
# Start sync server
cd packages/design-system
pnpm dev:sync-server
```

### Plugin Can't Connect

1. Check sync server is running on port 3001 (or check console for actual port)
2. Update plugin "Server URL" to match: `http://localhost:3001`
3. Check firewall/network settings

## Files Modified

- ✅ `packages/design-system/figma-plugin/code.ts` - Preserves alias structures
- ✅ `packages/design-system/scripts/sync-from-figma-mcp.ts` - Resolves aliases
- ✅ `packages/design-system/server/local-sync-server.ts` - Already using sync function

## Expected Result

After syncing from Figma plugin:
- ✅ `bg-subtle` = resolved color (e.g., `#f8fafc`)
- ✅ `bg-strong` = resolved color (e.g., `#0f172a`)
- ✅ No `#NaNNaNNaN` values
- ✅ Components use correct colors
- ✅ **Fully automated** - no Cursor prompts needed!

## Next Steps

1. **Start sync server**: `pnpm --filter design-system dev:sync-server`
2. **Open Figma plugin** and click "Sync Tokens"
3. **Check token files** - aliases should be resolved
4. **Restart dev server** to see changes in components

That's it! The alias resolution is now fully automated through the Figma plugin! 🎉


