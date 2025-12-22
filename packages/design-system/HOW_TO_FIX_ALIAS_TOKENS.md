# How to Fix Alias Tokens - Step by Step

## ✅ Status: Alias Resolution is Working!

The alias resolution code is implemented and tested. The test successfully resolved:
- `bg-subtle` → `#f8fafc` ✅
- `bg-strong` → `#0f172a` ✅

## 🔧 What You Need to Do

### Step 1: Sync Tokens from Figma

You need to run a sync from your actual Figma file. The alias resolution will work automatically.

**Option A: Using Cursor AI (Easiest)**

1. Open Figma: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
2. Select any layer in the file
3. Ask Cursor:
   ```
   Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110 and sync them using the syncFromFigmaMCP function from packages/design-system/scripts/sync-from-figma-mcp.ts
   ```

**Option B: Using the Simple Sync Script**

```bash
cd packages/design-system
pnpm sync:figma:simple
```

Then when prompted, paste the variables from Figma (or ask Cursor to get them first).

### Step 2: Check the Diagnostic Output

When the sync runs, you'll see diagnostic output like:

```
🔍 Diagnostic: Checking alias variable formats...

   bg-subtle:
     Type: object
     Value: { name: 'slate-50' }
     Structure: {...}

   🔗 Resolved alias: bg-subtle → #f8fafc
   🔗 Resolved alias: bg-strong → #0f172a
```

This confirms aliases are being resolved.

### Step 3: Verify Token Files

After sync, check these files:

**`packages/design-system/src/tokens/tailwind-extension.json`**
```json
{
  "colors": {
    "bg-subtle": "#f8fafc",  // ✅ Should be resolved, not #NaNNaNNaN
    "bg-strong": "#0f172a"    // ✅ Should be resolved, not #NaNNaNNaN
  }
}
```

**`packages/design-system/src/tokens/figma-tokens.ts`**
```typescript
export const figmaTokens: DesignTokens = {
  colors: {
    "bg-subtle": "#f8fafc",  // ✅ Should be resolved
    "bg-strong": "#0f172a"    // ✅ Should be resolved
  }
}
```

### Step 4: Restart Dev Server

After syncing tokens:
```bash
# Stop dev server (Ctrl+C)
pnpm dev
```

### Step 5: Test in Components

Components using `bg-subtle` or `bg-strong` should now show the correct colors.

## 🐛 Troubleshooting

### If aliases still show #NaNNaNNaN:

1. **Check diagnostic output** - Did you see the resolution messages?
2. **Check variable format** - What structure did Figma return?
3. **Verify sync used correct function** - Make sure `syncFromFigmaMCP` was called

### If sync doesn't include bg-subtle/bg-strong:

1. Make sure Figma file has these variables defined
2. Check they're in the variable definitions returned from Figma
3. Try selecting a different node in Figma

### If resolution fails:

The diagnostic output will show the exact format. Share that format and we can update the resolution logic.

## 📋 Quick Test

To verify alias resolution works with your actual data:

1. Get variables from Figma (using Cursor or MCP)
2. Copy the JSON response
3. Run:
   ```bash
   cd packages/design-system
   pnpm tsx scripts/check-figma-aliases.ts '<paste JSON here>'
   ```

This will show you the exact format and whether resolution works.

## ✅ Expected Result

After successful sync:
- ✅ `bg-subtle` = resolved color (e.g., `#f8fafc`)
- ✅ `bg-strong` = resolved color (e.g., `#0f172a`)
- ✅ No `#NaNNaNNaN` values
- ✅ Components use correct colors

## 🎯 Next Steps

1. **Run sync from Figma** (Step 1 above)
2. **Check diagnostic output** (Step 2)
3. **Verify token files updated** (Step 3)
4. **Restart dev server** (Step 4)
5. **Test in components** (Step 5)

The alias resolution code is ready - you just need to run a sync from Figma to apply it!


