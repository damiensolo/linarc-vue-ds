# Hot Reload for Token Changes

## How It Works

We've set up automatic hot reloading for token changes, so you **don't need to restart the server** after syncing tokens from Figma!

### What Happens Now

1. **Sync tokens from Figma** → Plugin updates token files
2. **Vite detects file changes** → Automatically watches token files
3. **Tailwind config reloads** → Reads new token values dynamically
4. **CSS rebuilds** → New styles are generated
5. **Browser updates** → Changes appear automatically! ✨

## Technical Details

### Dynamic Token Loading

The `tailwind.config.js` now uses a function `loadFigmaTokens()` that reads tokens dynamically in development mode:

```javascript
// In dev mode, tokens are reloaded on each config evaluation
...(process.env.NODE_ENV === 'development' ? loadFigmaTokens().colors : figmaTokens.colors)
```

### File Watching

Vite watches these token files for changes:

- `packages/design-system/src/tokens/tailwind-extension.json`
- `packages/design-system/src/tokens/figma-tokens.ts`

When they change, Vite triggers a rebuild automatically.

## Usage

### Before (Required Restart)

```bash
1. Sync tokens from Figma
2. Stop server (Ctrl+C)
3. Restart server (pnpm dev)
4. Refresh browser
```

### Now (Automatic!)

```bash
1. Sync tokens from Figma
2. Wait 1-2 seconds
3. Refresh browser (or it auto-refreshes!)
```

## Limitations

### When Restart IS Still Needed

You'll still need to restart if:

- ✅ **First time setup** - Initial server start
- ✅ **Tailwind config structure changes** - Not just token values
- ✅ **New token categories added** - Colors → Spacing, etc.
- ✅ **Production build** - Always rebuilds from scratch

### When Hot Reload Works

Hot reload works for:

- ✅ **Token value changes** - `indigo-600: "#e54646"` → `"#ff0000"`
- ✅ **Adding new tokens** - Same category (e.g., new colors)
- ✅ **Removing tokens** - Same category

## Troubleshooting

### Changes Not Appearing?

1. **Check Vite is watching files**

   - Look for: `🔄 Token files changed, triggering CSS rebuild...` in terminal
   - If not, restart server once

2. **Hard refresh browser**

   - `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clears CSS cache

3. **Check token files updated**

   - Verify `tailwind-extension.json` has new values
   - Check timestamp matches sync time

4. **Restart if needed**
   - If hot reload isn't working, restart is still an option
   - `Ctrl+C` then `pnpm dev`

### Performance Note

Dynamic loading only happens in **development mode**. Production builds use static token values for better performance.

## Summary

- ✅ **Hot reload enabled** - No restart needed for token value changes
- ✅ **Automatic file watching** - Vite detects token file changes
- ✅ **Dynamic config loading** - Tailwind reads tokens on-demand in dev
- ⚠️ **Restart still needed** - For config structure changes or first setup

**Try it now:** Sync tokens from Figma and watch them update automatically! 🎉
