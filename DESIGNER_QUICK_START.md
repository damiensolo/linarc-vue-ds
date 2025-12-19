# Designer Quick Start - Token Sync

## The Simplest Workflow Ever 🎯

### For Designers: Just 2 Steps!

1. **Change variable in Figma**
2. **Ask Cursor AI:** "Sync tokens from Figma"

That's it! Component updates automatically.

## Real Example: Change indigo-600 Color

### Current State

- **Figma:** `indigo/600` = `#4f46e5` (purple)
- **Component:** Shows purple button

### Step 1: Change in Figma

1. Open your Figma file
2. Find variable: `indigo/600`
3. Change value: `#4f46e5` → `#64748b` (slate-500)

### Step 2: Sync

**Ask Cursor AI:**

```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Or run command:**

```bash
pnpm --filter design-system sync:figma:simple
```

### Step 3: Restart (if needed)

```bash
# Stop server (Ctrl+C) and restart
pnpm dev
```

### Result

- ✅ Component now shows slate-500 instead of purple!
- ✅ No code changes needed
- ✅ All components using `bg-indigo-600` update automatically

## Test Page

Visit: `http://localhost:3000/test-token-sync`

This page shows:

- Current token value
- Components using the token
- Instructions for testing

## What Gets Updated

When you sync, these update automatically:

1. **`src/tokens/figma-tokens.ts`**

   ```typescript
   colors: {
     'indigo-600': '#64748b', // ✅ New value!
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

## Common Variables to Change

| Variable          | What It Controls     |
| ----------------- | -------------------- |
| `indigo/600`      | Primary button color |
| `slate/50`        | Light text color     |
| `Radius/radii-xl` | Large border radius  |
| `Radius/radii-s`  | Small border radius  |

## Troubleshooting

**Color not updating?**

1. ✅ Check variable name matches exactly in Figma
2. ✅ Run sync command
3. ✅ Restart dev server
4. ✅ Clear browser cache

**Can't find variable?**

1. ✅ Check Figma file key: `rDLR9ZCB0Dq2AmRvxrifds`
2. ✅ Check node ID: `1:110`
3. ✅ Verify variable exists in Figma

## Pro Tips

1. **Use Cursor AI** - It's the fastest way!
2. **Test one at a time** - Change one variable to see effect clearly
3. **Use test page** - `/test-token-sync` shows current values
4. **Commit changes** - Save token updates to git

## Next Steps

1. ✅ Try changing `indigo/600` to a different color
2. ✅ Sync using Cursor AI
3. ✅ See component update
4. ✅ Celebrate! 🎉

---

**Remember:** Change in Figma → Sync → See it update!
