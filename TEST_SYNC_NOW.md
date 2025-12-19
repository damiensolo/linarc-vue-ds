# Test Sync Right Now! 🧪

## Current Status

I just synced tokens from Figma and found:
- **`indigo/600`** in Figma is currently: `#e54646` (RED!)
- Token files have been updated
- Tailwind configs updated to import tokens

## Test Steps

### 1. Check Token Files

**figma-tokens.ts:**
```typescript
colors: {
  'indigo-600': '#e54646', // ✅ Should be RED now!
}
```

**tailwind-extension.json:**
```json
{
  "colors": {
    "indigo-600": "#e54646"  // ✅ Should be RED!
  }
}
```

### 2. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 3. Check Components

Visit these pages:
- `http://localhost:3000/floating-action-button` - FAB buttons should be RED
- `http://localhost:3000/test-token-sync` - Should show RED color swatch

### 4. Verify Tailwind Config

The Nuxt app's Tailwind config now imports from `tailwind-extension.json`:
```javascript
// Nuxt tailwind.config.js
import figmaTokens from '../design-system/src/tokens/tailwind-extension.json'
// ...
colors: {
  ...(figmaTokens.colors || {}), // ✅ Should include indigo-600: #e54646
}
```

## If Still Not Working

### Check 1: Verify Token Files
```bash
cat packages/design-system/src/tokens/figma-tokens.ts
cat packages/design-system/src/tokens/tailwind-extension.json
```

Should show `#e54646` for `indigo-600`.

### Check 2: Clear Caches
```bash
# Clear Nuxt cache
Remove-Item -Recurse -Force packages/nuxt-app/.nuxt

# Clear Vite cache  
Remove-Item -Recurse -Force packages/nuxt-app/node_modules/.vite

# Restart
pnpm dev
```

### Check 3: Verify Tailwind Import

Check `packages/nuxt-app/tailwind.config.js` - it should import the extension file.

### Check 4: Browser DevTools

1. Open browser DevTools
2. Inspect a button with `bg-indigo-600`
3. Check computed styles - should show `background-color: #e54646`

## Expected Result

After restarting:
- FloatingActionButton components should be **RED** (#e54646)
- Not purple (#4f46e5)
- Test page should show RED color swatch

## Next: Change Back to Test

1. Change `indigo/600` in Figma back to `#4f46e5`
2. Ask Cursor: "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"
3. Restart server
4. Should see purple again!

