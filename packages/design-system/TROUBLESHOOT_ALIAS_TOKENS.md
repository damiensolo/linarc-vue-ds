# Troubleshooting: Alias Tokens Not Showing in Components

## ✅ Alias Resolution is Working!

The alias resolution code is now working correctly. Test shows:
- `bg-subtle` → `#f8fafc` ✅
- `bg-strong` → `#0f172a` ✅

## Common Issues & Fixes

### Issue 1: Tokens Still Have #NaNNaNNaN

**Symptom**: Token files show `#NaNNaNNaN` instead of resolved colors.

**Fix**: Run a sync from Figma plugin:
1. Start sync server: `pnpm --filter design-system dev:sync-server`
2. Open Figma plugin and click "Sync Tokens"
3. Check sync server console for resolution messages

### Issue 2: Components Not Updating After Sync

**Symptom**: Tokens are resolved but components still show old colors.

**Fix**: Restart dev server:
```bash
# Stop dev server (Ctrl+C)
pnpm dev
```

Tailwind needs to rebuild CSS with new token values.

### Issue 3: Tailwind Not Picking Up Tokens

**Symptom**: Tokens are in `tailwind-extension.json` but Tailwind classes don't work.

**Check**:
1. Verify `tailwind.config.js` loads tokens:
   ```js
   import figmaTokens from './src/tokens/tailwind-extension.json'
   // ...
   colors: {
     ...(figmaTokens.colors || {}),
   }
   ```

2. Check token file exists: `packages/design-system/src/tokens/tailwind-extension.json`

3. Verify tokens are valid JSON (no `#NaNNaNNaN`)

### Issue 4: Wrong Tailwind Class Names

**Symptom**: Component uses `bg-bg-subtle` but it's not working.

**Check**: Token name in `tailwind-extension.json`:
- Token: `"bg-subtle": "#f8fafc"`
- Tailwind class: `bg-bg-subtle` ✅ (correct - `bg-` prefix + token name)

If token is named `bg-subtle`, use `bg-bg-subtle` in components.

### Issue 5: Browser Cache

**Symptom**: Changes don't appear even after restart.

**Fix**: Hard refresh browser:
- Chrome/Edge: `Ctrl+Shift+R` or `Ctrl+F5`
- Firefox: `Ctrl+Shift+R`
- Safari: `Cmd+Shift+R`

## Step-by-Step Fix

### Step 1: Verify Tokens Are Synced

Check `packages/design-system/src/tokens/tailwind-extension.json`:
```json
{
  "colors": {
    "bg-subtle": "#f8fafc",  // ✅ Should be resolved, not #NaNNaNNaN
    "bg-strong": "#0f172a"   // ✅ Should be resolved, not #NaNNaNNaN
  }
}
```

### Step 2: Verify Tailwind Config

Check `packages/design-system/tailwind.config.js`:
```js
colors: {
  ...(figmaTokens.colors || {}),  // ✅ Should include bg-subtle and bg-strong
}
```

### Step 3: Restart Dev Server

```bash
# Stop dev server
Ctrl+C

# Restart
pnpm dev
```

### Step 4: Check Component Usage

Component should use:
```vue
<div :class="bg-bg-subtle">  <!-- bg- prefix + token name -->
```

Not:
```vue
<div :class="bg-subtle">  <!-- ❌ Missing bg- prefix -->
```

### Step 5: Hard Refresh Browser

- `Ctrl+Shift+R` (Windows/Linux)
- `Cmd+Shift+R` (Mac)

## Quick Test

1. **Check tokens**: `cat packages/design-system/src/tokens/tailwind-extension.json | grep bg-subtle`
2. **Check Tailwind**: Look for `bg-subtle` in dev server console when it starts
3. **Test class**: Add `bg-bg-subtle` to a component and see if it applies

## Expected Result

After fixing:
- ✅ Tokens resolved (no `#NaNNaNNaN`)
- ✅ Tailwind config loads tokens
- ✅ Dev server restarted
- ✅ Components show correct colors
- ✅ Browser cache cleared

## Still Not Working?

1. Check sync server logs for resolution messages
2. Verify Figma plugin is sending alias structures correctly
3. Check browser console for Tailwind errors
4. Verify token file is valid JSON



