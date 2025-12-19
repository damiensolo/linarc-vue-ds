# Token Hot Reload: How It Works (And Limitations)

## The Reality

**Short answer:** Tailwind CSS config is evaluated at **build time**, not runtime. This means token changes require Tailwind to rebuild its CSS, which typically requires a server restart.

However, we've set up **file watching** that can trigger automatic rebuilds, making the process smoother.

## What We've Implemented

### 1. Dynamic Token Loading

The `tailwind.config.js` now uses a function to reload tokens dynamically:

```javascript
function loadFigmaTokens() {
  // Reads token file fresh each time
  return JSON.parse(readFileSync(tokensPath, "utf-8"));
}
```

This means when Tailwind config is re-evaluated, it reads the latest token values.

### 2. File Watching

Vite watches token files for changes:

- `tailwind-extension.json`
- `figma-tokens.ts`

When these files change, Vite detects it and can trigger a rebuild.

## How It Works (In Theory)

1. **Sync tokens** → Files update
2. **Vite detects change** → Watches token files
3. **Tailwind config reloads** → Function reads new values
4. **CSS rebuilds** → New styles generated
5. **Browser updates** → Changes appear

## The Problem

**Tailwind config is cached** and only re-evaluated when:

- The config file itself changes (`tailwind.config.js`)
- PostCSS processes CSS (which happens on file changes)
- Server restarts

Token JSON files changing **doesn't automatically trigger** Tailwind config re-evaluation, even with file watching.

## Current Behavior

### What Happens Now

1. ✅ **Token files update** - Sync from Figma works
2. ⚠️ **Vite detects change** - File watcher sees it
3. ❓ **Tailwind may or may not rebuild** - Depends on what else changed
4. ⚠️ **Browser may need refresh** - Even if CSS rebuilds

### Best Case Scenario

- Token files change
- Vite triggers rebuild
- Tailwind processes CSS (reads new config)
- Browser auto-refreshes
- **Changes appear!** ✨

### Typical Scenario

- Token files change
- Vite detects change
- Tailwind doesn't automatically rebuild (config cached)
- **Need to restart server** or **manually trigger rebuild**

## Solutions

### Option 1: Restart Server (Most Reliable)

```bash
# After syncing tokens
Ctrl+C  # Stop server
pnpm dev  # Restart
```

**Pros:** Always works, guaranteed  
**Cons:** Slower workflow

### Option 2: Touch Config File (Workaround)

After syncing tokens, touch the Tailwind config to trigger rebuild:

```bash
# On Windows PowerShell
(Get-Item packages/nuxt-app/tailwind.config.js).LastWriteTime = Get-Date
```

**Pros:** Faster than restart  
**Cons:** Manual step required

### Option 3: Use CSS Custom Properties (Future Enhancement)

Instead of Tailwind config values, use CSS variables:

```css
:root {
  --indigo-600: #e54646; /* Updated dynamically */
}
```

Then components use `bg-[var(--indigo-600)]` which updates instantly.

**Pros:** True hot reload  
**Cons:** Requires refactoring components

## Recommendation

**For now:** Restart server after syncing tokens. It's the most reliable approach.

**Future:** Consider CSS custom properties approach for true hot reload.

## Testing Hot Reload

To test if hot reload is working:

1. Sync tokens from Figma
2. Watch Nuxt terminal for rebuild messages
3. Check if browser auto-refreshes
4. If not, restart server

If you see `🔄 Token files changed, triggering CSS rebuild...` in terminal, the watcher is working, but Tailwind may still need a restart.

## Summary

- ✅ **File watching set up** - Vite watches token files
- ✅ **Dynamic loading** - Config reads tokens fresh
- ⚠️ **Tailwind limitation** - Config evaluated at build time
- 💡 **Best practice** - Restart server for guaranteed updates
- 🚀 **Future** - CSS custom properties for true hot reload

**Bottom line:** Restart is still the most reliable method, but we've optimized the setup for when hot reload does work!
