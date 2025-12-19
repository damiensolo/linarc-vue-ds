# Designer Workflow - Super Simple Token Sync

## The Simplest Way to Update Design Tokens

### For Designers: 3-Step Process

1. **Change variable in Figma** (e.g., change `indigo/600` color value)
2. **Run one command:** `pnpm sync:figma:simple`
3. **See it update!** Component automatically uses new color

That's it! 🎉

## Step-by-Step Example

### Scenario: Change Button Color

**Before:**

- Figma variable: `indigo/600` = `#4f46e5` (purple)
- Component uses: `bg-indigo-600`

**Step 1: Change in Figma**

1. Open Figma file: `rDLR9ZCB0Dq2AmRvxrifds`
2. Find variable: `indigo/600`
3. Change value to: `#64748b` (slate-500)

**Step 2: Sync**

You have **two options**:

**Option A: Ask Cursor AI (Recommended)** ✨

```
Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Option B: Run script with variables**

```bash
# Script works but uses example values by default
pnpm --filter design-system sync:figma:simple

# Or pass real variables as JSON:
pnpm --filter design-system sync:figma:simple '{"indigo/600":"#64748b"}'
```

> **Note:** The script cannot fetch from Figma directly - it only processes variables you provide. Use Cursor AI for automatic fetching!

**Step 3: Restart Dev Server**

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

**Result:**

- Component now uses `#64748b` instead of `#4f46e5`
- No code changes needed!

## Even Simpler: Using Cursor AI

Instead of running commands, just ask Cursor:

```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

Cursor will:

1. Fetch latest variables from Figma
2. Update token files
3. Tell you to restart dev server

## What Gets Updated

When you sync, these files update automatically:

1. **`src/tokens/figma-tokens.ts`** - TypeScript tokens
2. **`src/tokens/tailwind-extension.json`** - Tailwind config
3. **`tailwind.config.js`** - Auto-imports new tokens

## Testing the Flow

### Test 1: Change a Color

1. In Figma, change `indigo/600` from `#4f46e5` to `#ef4444` (red)
2. Run: `pnpm sync:figma:simple`
3. Check `src/tokens/figma-tokens.ts` - should show `#ef4444`
4. Restart dev server
5. Component using `bg-indigo-600` now shows red!

### Test 2: Change Border Radius

1. In Figma, change `Radius/radii-xl` from `100` to `50`
2. Run: `pnpm sync:figma:simple`
3. Component using `rounded-radii-xl` now has smaller radius!

## Quick Reference

### Common Variables to Change

**Colors:**

- `indigo/600` → Button primary color
- `slate/50` → Text color on dark backgrounds

**Border Radius:**

- `Radius/radii-xl` → Large rounded corners
- `Radius/radii-s` → Small rounded corners

**Spacing:**

- `Spacing/base` → Base spacing unit
- `Spacing/lg` → Large spacing

### Sync Command

**Recommended: Use Cursor AI** ✨

```
Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Alternative: Run script**

```bash
# Uses example values (for testing only)
pnpm --filter design-system sync:figma:simple

# Or pass variables as JSON
pnpm --filter design-system sync:figma:simple '{"indigo/600":"#e54646"}'
```

> ⚠️ **Important:** The script cannot fetch from Figma directly. It only processes variables you provide. For automatic syncing, use Cursor AI!

## Troubleshooting

### Colors not updating?

1. ✅ Check Figma variable name matches exactly
2. ✅ Run sync command
3. ✅ Restart dev server
4. ✅ Clear browser cache

### Variables not found?

1. ✅ Check Figma file key: `rDLR9ZCB0Dq2AmRvxrifds`
2. ✅ Check node ID: `1:110`
3. ✅ Verify variable exists in Figma

## Pro Tips

### Tip 1: Use Cursor AI

Ask Cursor to sync - it's faster than running commands!

### Tip 2: Test in Isolation

Change one variable at a time to see the effect clearly.

### Tip 3: Document Changes

Add comments in Figma variable descriptions for future reference.

### Tip 4: Version Control

Commit token changes so team can see what changed:

```bash
git add packages/design-system/src/tokens/
git commit -m "chore: update indigo-600 color from designer"
```

## Next Steps

1. ✅ Try changing `indigo/600` color in Figma
2. ✅ Run sync command
3. ✅ See component update automatically
4. ✅ Celebrate! 🎉
