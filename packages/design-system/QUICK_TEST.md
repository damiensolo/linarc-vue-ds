# Quick Testing Steps

## ✅ Ready to Test!

The implementation is complete. Here's how to test:

## Step 1: Reload Plugin in Figma

**CRITICAL**: You must reload the plugin for changes to take effect!

1. **Close the plugin** if it's open
2. **Restart Figma Desktop App** (completely quit and reopen)
3. **Reopen plugin**:
   - Plugins → Development → Design Token Sync

## Step 2: Start Sync Server

```bash
pnpm --filter design-system dev:sync-server
```

Wait for: `🚀 Local sync server running on http://localhost:3001`

## Step 3: Sync from Plugin

1. In Figma plugin, click **"Sync Tokens"**
2. Watch the console output - you should see:
   ```
   📥 Processing variables:
      ✅ Color: slate-50 → slate-50 = #f8fafc
      ✅ Color: bg-subtle → bg-subtle = #e2e8f0
      ...
   ```

## Step 4: Verify Results

### Check 1: VariableID Removal
Open `packages/design-system/src/tokens/tailwind-extension.json`

**Before**: Has entries like `"variableid:1:27": "#0f172a"`  
**After**: Should have NO `variableid:` entries (they'll be automatically removed)

### Check 2: Token Categories
Verify these objects exist:
- ✅ `colors` - Your color tokens
- ✅ `borderRadius` - If you have radius variables
- ✅ `spacing` - If you have spacing variables  
- ✅ `typography` - If you have typography variables (in `figma-tokens.ts` only)
- ✅ `boxShadow` - If you have shadow variables

### Check 3: Typography (if you have typography variables)
Open `packages/design-system/src/tokens/figma-tokens.ts`

Look for `typography` object:
```typescript
typography: {
  "font-size-sm": { fontSize: "14px" },
  "font-weight-bold": { fontWeight: "700" }
}
```

## What to Test

### Test 1: Existing Colors ✅
- Should sync as before
- VariableID entries should be removed automatically

### Test 2: Collection-Based Categorization
If you organize variables in collections:
- Collection: "Colors" → Should go to `colors`
- Collection: "Typography" → Should go to `typography`
- Collection: "Spacing" → Should go to `spacing`
- Collection: "Radius" → Should go to `borderRadius`

### Test 3: Typography Tokens (NEW)
Create a STRING variable:
- Name: `font-size-sm`
- Type: STRING
- Value: `"14px"`
- Collection: "Typography" (optional but recommended)

Should appear in `figma-tokens.ts` → `typography` object

### Test 4: Radius Tokens
Create a FLOAT variable:
- Name: `radius-sm`
- Type: FLOAT
- Value: `4`
- Collection: "Radius" (optional)

Should appear in `borderRadius` object

## Expected Console Output

```
🔄 Processing Figma variables from MCP...

📥 Processing variables:
   ✅ Color: slate-50 → slate-50 = #f8fafc
   ✅ Color: bg-subtle → bg-subtle = #e2e8f0
   ✅ Radius: radius-sm → radius-sm = 4px
   ✅ Spacing: spacing-4 → spacing-4 = 16px
   ✅ Typography: font-size-sm → font-size-sm = { fontSize: "14px" }

📝 Updating token files...

✅ Updated: figma-tokens.ts
✅ Updated: tailwind-extension.json

📊 Token Summary:
   Colors: 25
   Border Radius: 5
   Spacing: 12
   Typography: 8
   Shadows: 4
```

## Troubleshooting

### Issue: VariableID entries still there
- **Solution**: The new code will remove them on next sync. Just sync again from plugin.

### Issue: Typography not appearing
- **Check**: Variable type is STRING (not FLOAT)
- **Check**: Collection name contains "Typography" or variable name contains "font"

### Issue: Collection categorization not working
- **Check**: Plugin was reloaded (restart Figma completely)
- **Check**: Collection names are set in Figma variables

## Success Criteria

✅ No `variableid:` entries in output  
✅ Colors sync correctly  
✅ Typography tokens appear (if you have them)  
✅ Collection-based categorization works  
✅ All tokens validated correctly  

## Next Steps

Once testing is complete:
1. Report any issues
2. Verify all token types work
3. Proceed to Priority 2 if all tests pass

