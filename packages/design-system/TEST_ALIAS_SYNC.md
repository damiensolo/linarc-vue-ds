# Testing Alias Variable Sync - Step by Step Guide

## Current Problem
- `bg-subtle` and `bg-strong` show as `#NaNNaNNaN` in token files
- Alias variables aren't being resolved to their primitive values

## Solution Status
✅ Alias resolution code is implemented in `sync-from-figma-mcp.ts`
⚠️ Need to actually run a sync to test it

## Step-by-Step Testing Guide

### Step 1: Get Variables from Figma

**Option A: Using Cursor AI (Recommended)**
1. Open Figma: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
2. Select any layer in the file
3. Ask Cursor:
   ```
   Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110 and sync them to the design system using syncFromFigmaMCP
   ```

**Option B: Manual Test with Example Data**
```bash
cd packages/design-system
pnpm tsx scripts/sync-from-figma-mcp.ts
```

### Step 2: Check Diagnostic Output

When you run the sync, look for this section:
```
🔍 Diagnostic: Checking alias variable formats...

   bg-subtle:
     Type: object
     Value: {...}
     Structure: {...}
```

This shows the exact format Figma returns for alias variables.

### Step 3: Verify Resolution

Look for these messages:
- ✅ `🔗 Resolved alias: bg-subtle → #f8fafc` (success)
- ⚠️ `Could not resolve alias for bg-subtle` (needs adjustment)

### Step 4: Check Token Files

After sync, check:
- `packages/design-system/src/tokens/figma-tokens.ts`
- `packages/design-system/src/tokens/tailwind-extension.json`

They should have:
- ✅ `"bg-subtle": "#f8fafc"` (resolved value)
- ❌ NOT `"bg-subtle": "#NaNNaNNaN"`

### Step 5: Restart Dev Server

After syncing:
```bash
# Stop dev server (Ctrl+C)
pnpm dev
```

### Step 6: Test in Components

Check if components using `bg-subtle` or `bg-strong` now show the correct colors.

## Quick Test Command

To test with sample data that includes aliases:

```bash
cd packages/design-system
pnpm tsx -e "
import { syncFromFigmaMCP } from './scripts/sync-from-figma-mcp.ts';
syncFromFigmaMCP({
  'slate-50': '#f8fafc',
  'bg-subtle': { name: 'slate-50' },
  'bg-strong': { name: 'slate-900' },
  'slate-900': '#0f172a'
});
"
```

## Troubleshooting

### If aliases still show #NaNNaNNaN:

1. **Check diagnostic output** - What format is shown?
2. **Check resolution logs** - Are aliases being resolved?
3. **Update resolution logic** - Based on actual format from Figma

### If sync doesn't run:

1. Make sure you're using `syncFromFigmaMCP` function
2. Check that variables include `bg-subtle` and `bg-strong`
3. Verify Figma file has these variables defined

## Expected Result

After successful sync:
- ✅ `bg-subtle` resolves to a color (e.g., `#f8fafc`)
- ✅ `bg-strong` resolves to a color (e.g., `#0f172a`)
- ✅ No `#NaNNaNNaN` values in token files
- ✅ Components use correct colors


