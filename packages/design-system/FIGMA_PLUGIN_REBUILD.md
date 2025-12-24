# Figma Plugin Rebuild - Alias Resolution Fix

## ✅ Plugin Rebuilt Successfully!

The plugin has been rebuilt with the updated alias resolution code. The compiled plugin now preserves alias structures instead of converting them to strings.

## What Changed

### Before (Old Code)
```javascript
// Converted everything to strings immediately
variables[name] = stringValue; // Lost alias structure!
```

### After (New Code)
```javascript
// Preserves alias structure for resolution
if (value && typeof value === "object" && "id" in value && !("r" in value)) {
  variables[name] = {
    type: "VARIABLE_ALIAS",
    id: aliasId,
    name: referencedVar?.name,
  };
}
```

## Next Steps

### 1. Reload Plugin in Figma

**Important**: You must reload the plugin in Figma to use the new code!

1. **Open Figma Desktop App** (not browser)
2. **Open your file**: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
3. **Open Plugin**:
   - Plugins → Development → Design Token Sync
   - Or: Right-click → Plugins → Development → Design Token Sync
4. **Reload Plugin**:
   - In the plugin UI, look for a reload button
   - Or: Close and reopen the plugin
   - Or: Restart Figma Desktop App

### 2. Verify Plugin Location

Make sure Figma is loading the plugin from:
```
packages/design-system/figma-plugin/dist/
```

If you're using a development plugin:
- Check Figma Settings → Plugins → Development
- Verify the plugin path points to `dist` folder

### 3. Test Sync

1. **Start sync server** (if not running):
   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Sync from plugin**:
   - Click "Sync Tokens" in the plugin UI
   - Check sync server console for resolution messages

3. **Check output**:
   ```
   🔗 Resolved alias: bg-subtle → #f8fafc
   🔗 Resolved alias: bg-strong → #0f172a
   ```

### 4. Verify Token Files

After syncing, check:
- `packages/design-system/src/tokens/tailwind-extension.json`
- Should have resolved colors (not `#NaNNaNNaN`)

## Troubleshooting

### Plugin Still Using Old Code

1. **Restart Figma Desktop App** completely
2. **Clear plugin cache**:
   - Figma → Settings → Plugins → Development
   - Remove and re-add plugin if needed
3. **Verify dist folder**:
   ```bash
   cat packages/design-system/figma-plugin/dist/code.js | grep "VARIABLE_ALIAS"
   ```
   Should show the alias preservation code

### Still Getting #NaNNaNNaN

1. **Check sync server logs** - Are aliases being resolved?
2. **Check plugin console** - Open Figma DevTools to see plugin logs
3. **Verify alias format** - Check what structure Figma is sending

### Plugin Not Found

1. **Check plugin manifest**:
   ```bash
   cat packages/design-system/figma-plugin/dist/manifest.json
   ```
2. **Verify plugin is installed**:
   - Figma → Settings → Plugins → Development
   - Should see "Design Token Sync" plugin

## Rebuild Command

If you need to rebuild again:
```bash
pnpm --filter design-system build:plugin
```

Or manually:
```bash
cd packages/design-system/figma-plugin
pnpm install
pnpm build
```

## Expected Result

After reloading plugin and syncing:
- ✅ Aliases preserved as objects (not strings)
- ✅ Sync server resolves aliases correctly
- ✅ Token files have resolved colors (not `#NaNNaNNaN`)
- ✅ Components show correct colors

## Files Updated

- ✅ `packages/design-system/figma-plugin/code.ts` - Source code with alias preservation
- ✅ `packages/design-system/figma-plugin/code.js` - Compiled JavaScript
- ✅ `packages/design-system/figma-plugin/dist/code.js` - Plugin distribution file

The plugin is now ready! Just reload it in Figma and sync again.



