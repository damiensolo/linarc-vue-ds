# Testing Guide - Priority 1 Implementation

## Prerequisites

1. ✅ Plugin rebuilt (already done)
2. ✅ Sync server ready
3. ✅ Figma file with variables

## Step-by-Step Testing

### 1. Reload Plugin in Figma

**Important**: You must reload the plugin for changes to take effect!

1. **Close the plugin** if it's currently open
2. **Restart Figma Desktop App** (not browser)
3. **Reopen plugin**:
   - Plugins → Development → Design Token Sync
   - Or: Right-click → Plugins → Development → Design Token Sync

### 2. Start Sync Server

```bash
pnpm --filter design-system dev:sync-server
```

You should see:
```
🚀 Local sync server running on http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/sync-tokens
```

### 3. Test with Existing Variables

#### Test 1: Colors (Should work as before)
- Sync tokens from plugin
- Check console for: `✅ Color: slate-50 → slate-50 = #f8fafc`
- Verify `tailwind-extension.json` has colors (no VariableID entries)

#### Test 2: Radius Tokens (FLOAT type)
- Ensure you have radius variables in Figma (FLOAT type)
- Collection name should contain "radius" or "Radius"
- Or variable name should contain "radius"/"radii"
- Sync and check for: `✅ Radius: radius-sm → radius-sm = 4px`
- Verify `borderRadius` object in `tailwind-extension.json`

#### Test 3: Spacing Tokens (FLOAT type)
- Ensure you have spacing variables (FLOAT type)
- Collection name should contain "spacing" or "Spacing"
- Or variable name should contain "spacing"/"size"
- Sync and check for: `✅ Spacing: spacing-4 → spacing-4 = 16px`
- Verify `spacing` object in `tailwind-extension.json`

#### Test 4: Typography Tokens (STRING type) - NEW
- Create typography variables in Figma:
  - Variable type: STRING
  - Collection: "Typography" or "Primitives/Typography"
  - Examples:
    - `font-size-sm` = "14px"
    - `font-weight-bold` = "700"
    - `line-height-normal` = "1.5"
- Sync and check for: `✅ Typography: font-size-sm → font-size-sm`
- Verify `typography` object in `figma-tokens.ts` (not in tailwind-extension.json)

#### Test 5: Shadow Tokens (STRING type)
- Ensure you have shadow variables (STRING type)
- Collection name should contain "shadow" or "Shadow"
- Or variable name should contain "shadow"
- Sync and check for: `✅ Shadow: shadow-sm → shadow-sm`
- Verify `shadows` object in `tailwind-extension.json`

### 4. Test Collection-Based Categorization

#### Test 6: Collection Name Priority
Create variables with collection names:
- Collection: "Colors" → Should categorize as `colors`
- Collection: "Typography" → Should categorize as `typography`
- Collection: "Spacing" → Should categorize as `spacing`
- Collection: "Radius" → Should categorize as `borderRadius`
- Collection: "Shadows" → Should categorize as `shadows`

#### Test 7: Nested Collections
- Collection: "Primitives/Colors" → Should categorize as `colors`
- Collection: "Semantic/Colors" → Should categorize as `colors`
- Collection: "Primitives/Typography" → Should categorize as `typography`

### 5. Test Variable ID Pollution Removal

#### Test 8: Verify Clean Output
- Sync tokens
- Open `packages/design-system/src/tokens/tailwind-extension.json`
- **Verify**: No entries starting with `"variableid:"` (case-insensitive)
- **Verify**: Only human-readable names like `"slate-50"`, `"radius-sm"`

### 6. Test Token Validation

#### Test 9: Invalid Colors
- Create a color variable with invalid value (if possible)
- Sync should log: `⚠️  Invalid color for {name}: {value}`
- Invalid token should NOT appear in output

#### Test 10: Invalid Numbers
- Create a radius/spacing variable with negative value
- Sync should log: `⚠️  Invalid radius/spacing for {name}: {value}`
- Invalid token should NOT appear in output

### 7. Test Alias Resolution

#### Test 11: Alias Colors
- Create semantic color aliases (e.g., `bg-subtle` → `slate-50`)
- Sync should show: `🔗 Resolved alias: bg-subtle → #f8fafc`
- Verify resolved value in output

#### Test 12: Alias with Collection Metadata
- Create alias in "Semantic/Colors" collection
- Should preserve collection info for categorization
- Should resolve correctly

## Expected Console Output

```
🔄 Processing Figma variables from MCP...

📥 Processing variables:
   ✅ Color: slate-50 → slate-50 = #f8fafc
   ✅ Color: bg-subtle → bg-subtle = #f8fafc
   ✅ Radius: radius-sm → radius-sm = 4px
   ✅ Spacing: spacing-4 → spacing-4 = 16px
   ✅ Typography: font-size-sm → font-size-sm = { fontSize: "14px" }
   ✅ Shadow: shadow-sm → shadow-sm = 0 1px 2px rgba(0,0,0,0.05)

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

## Verification Checklist

After syncing, verify:

- [ ] `tailwind-extension.json` has no `variableid:` entries
- [ ] `figma-tokens.ts` has no `variableid:` entries
- [ ] Colors appear in `colors` object
- [ ] Radius tokens appear in `borderRadius` object
- [ ] Spacing tokens appear in `spacing` object
- [ ] Typography tokens appear in `typography` object (in figma-tokens.ts only)
- [ ] Shadow tokens appear in `shadows` object
- [ ] All values are valid (no NaN, no invalid formats)
- [ ] Alias tokens are resolved to primitive values

## Troubleshooting

### Issue: Typography tokens not appearing
- **Check**: Variable type is STRING (not FLOAT)
- **Check**: Collection name contains "Typography" or "Font"
- **Check**: Variable name contains font-related keywords

### Issue: Collection-based categorization not working
- **Check**: Plugin was reloaded after rebuild
- **Check**: Collection names are set in Figma
- **Check**: Console logs show collection names

### Issue: VariableID entries still appearing
- **Check**: Plugin was rebuilt and reloaded
- **Check**: Sync script was updated (check file timestamp)
- **Check**: No cached token files

### Issue: Invalid tokens appearing
- **Check**: Validation logic is working (check console warnings)
- **Check**: Token values are in correct format

## Next Steps After Testing

1. **Report any issues** found during testing
2. **Verify all token types** work correctly
3. **Confirm collection-based categorization** works
4. **Proceed to Priority 2** if all tests pass

## Quick Test Command

To quickly verify the sync script works:

```bash
# In packages/design-system directory
pnpm tsx scripts/sync-from-figma-mcp.ts
```

This will run with example data and show the processing logic.

