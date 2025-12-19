# How to See Synced Tokens in Your App

## Understanding the Two Servers

You have **two different servers** running:

1. **Sync Server** (Port 3001)

   - Purpose: Receives tokens from Figma plugin
   - URL: `http://localhost:3001`
   - This is NOT your app - it's just an API server

2. **Nuxt Dev Server** (Port 3000)
   - Purpose: Your actual application
   - URL: `http://localhost:3000`
   - This is where you see your components and pages

## Important: Restart Nuxt After Syncing!

After syncing tokens from Figma, you **MUST restart the Nuxt dev server** for changes to appear.

**Why?** Tailwind CSS loads its config at startup. When tokens change, Tailwind needs to reload.

## Step-by-Step: See Your Synced Tokens

### Step 1: Sync Tokens from Figma

1. Open Figma plugin
2. Click "Sync Tokens"
3. See success message ✅

### Step 2: Restart Nuxt Dev Server

```bash
# Stop current server (Ctrl+C in the terminal running pnpm dev)
# Then restart:
pnpm dev
```

### Step 3: Visit Test Page

Open in browser: **`http://localhost:3000/test-token-sync`**

This page shows:

- Current token values from `figma-tokens.ts`
- Visual color swatches
- Components using the tokens
- Whether sync worked correctly

### Step 4: Check Main Page

Open: **`http://localhost:3000/`**

Look for:

- FloatingActionButton components (should use `indigo-600` color)
- Any components using `bg-indigo-600` class

## Current Token Status

Based on your latest sync, `indigo-600` is: **`#e54646`** (RED)

This means:

- ✅ Tokens synced successfully
- ✅ Components using `bg-indigo-600` should show RED
- ⚠️ If you see PURPLE, Nuxt server needs restart

## Quick Test

1. **Check token file:**

   ```bash
   cat packages/design-system/src/tokens/figma-tokens.ts
   ```

   Look for `indigo-600` value

2. **Visit test page:**

   ```
   http://localhost:3000/test-token-sync
   ```

   Should show RED swatches if synced correctly

3. **Check main page:**
   ```
   http://localhost:3000/
   ```
   FloatingActionButton should be RED

## Troubleshooting

### Tokens synced but colors not changing?

1. ✅ **Restart Nuxt dev server** (most common issue!)

   ```bash
   # Stop: Ctrl+C
   # Start: pnpm dev
   ```

2. ✅ **Clear browser cache**

   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

3. ✅ **Check Tailwind config loaded tokens**

   - Look at Nuxt startup logs
   - Should see: `✅ Loaded Figma tokens: [...]`

4. ✅ **Verify token file updated**
   - Check `packages/design-system/src/tokens/figma-tokens.ts`
   - Check `packages/design-system/src/tokens/tailwind-extension.json`

### Still not working?

1. Check browser console for errors
2. Check Nuxt terminal for errors
3. Verify Tailwind config imports tokens correctly
4. Try changing a token value manually to test

## Summary

- **Sync Server (3001)**: For Figma plugin only - not your app
- **Nuxt Server (3000)**: Your actual app - where you see components
- **After syncing**: Always restart Nuxt dev server!
- **Test page**: `http://localhost:3000/test-token-sync`
