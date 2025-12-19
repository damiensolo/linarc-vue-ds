# Quick Token Sync Check

## The Two Servers Explained

1. **Sync Server** (`localhost:3001`) - API server for Figma plugin

   - ✅ You don't need to visit this in browser
   - ✅ Just needs to be running for plugin to work

2. **Nuxt App** (`localhost:3000`) - Your actual application
   - ✅ This is where you see your components
   - ✅ Visit this to see token changes

## See Your Synced Tokens

### Option 1: Test Page (Best for Verification)

Visit: **`http://localhost:3000/test-token-sync`**

This page shows:

- Current token values
- Visual color swatches
- Whether sync worked

### Option 2: Main Showcase Page

Visit: **`http://localhost:3000/`**

Look at:

- FloatingActionButton components (should be RED if synced)
- Any buttons/components using `bg-indigo-600`

## ⚠️ CRITICAL: Restart Nuxt After Syncing!

After syncing tokens from Figma:

1. **Stop Nuxt server**: Press `Ctrl+C` in terminal
2. **Restart Nuxt**: Run `pnpm dev`
3. **Refresh browser**: Visit `http://localhost:3000/test-token-sync`

**Why?** Tailwind loads config at startup. Changes won't appear until restart!

## Current Status Check

Your tokens show `indigo-600: "#e54646"` (RED)

**If you see RED** = ✅ Sync worked, Nuxt restarted correctly
**If you see PURPLE** = ⚠️ Nuxt needs restart

## Quick Verification

```bash
# 1. Check tokens synced
cat packages/design-system/src/tokens/figma-tokens.ts | findstr indigo-600

# 2. Restart Nuxt (if not already restarted)
# Ctrl+C to stop, then:
pnpm dev

# 3. Visit test page
# Open: http://localhost:3000/test-token-sync
```

## Summary

- Sync Server (3001) = For plugin only, not your app
- Nuxt Server (3000) = Your app, where you see components
- After sync = **Always restart Nuxt!**
- Test page = `http://localhost:3000/test-token-sync`
