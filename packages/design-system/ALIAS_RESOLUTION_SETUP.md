# Figma Alias Variable Resolution

## Problem

Alias variables (semantic tokens that reference primitive tokens) like `bg-subtle` and `bg-strong` were showing up as `#NaNNaNNaN` in the synced tokens instead of their resolved primitive values.

## Solution

Updated `sync-from-figma-mcp.ts` with comprehensive alias resolution that handles multiple formats:

### Supported Alias Formats

1. **Name Reference**: `{ name: "slate-50" }`
2. **ID Reference**: `{ type: "VARIABLE_ALIAS", id: "VariableID:123:456" }`
3. **ValuesByMode**: `{ valuesByMode: { "default": { type: "VARIABLE_ALIAS", id: "..." } } }`
4. **RGB Object**: `{ r: 0.968, g: 0.98, b: 0.988 }` (converts to hex)
5. **String ID**: `"VariableID:123:456"`

### Features

- ✅ Recursive alias resolution (handles nested aliases)
- ✅ Prevents infinite loops with depth limiting
- ✅ Skips unresolved aliases instead of creating `#NaNNaNNaN`
- ✅ Diagnostic logging to see exact format of alias variables
- ✅ Multiple resolution strategies (by ID, by name, by pattern)

## Testing

Run the test script to verify resolution logic:

```bash
pnpm --filter design-system tsx scripts/test-alias-resolution.ts
```

## Next Steps

### 1. Run Real Sync with Diagnostics

Ask Cursor AI to sync tokens from Figma:

```
Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110 and sync them to the design system
```

The diagnostic output will show:
- Exact format of `bg-subtle` and `bg-strong`
- Whether they're being resolved successfully
- Any warnings about unresolved aliases

### 2. Review Diagnostic Output

Look for this section in the sync output:

```
🔍 Diagnostic: Checking alias variable formats...

   bg-subtle:
     Type: object
     Value: {...}
     Structure: {...}
```

This will show you the exact format Figma MCP returns.

### 3. Adjust if Needed

If aliases still don't resolve:
- Check the diagnostic output structure
- Update `resolveAliasValue()` function based on the actual format
- The code already handles many formats, but Figma might use a different one

## Current Status

✅ Alias resolution implemented
✅ Diagnostic logging added
✅ Test cases passing for name-based and RGB aliases
⚠️ ID-based aliases may need adjustment based on actual Figma format

## Files Modified

- `packages/design-system/scripts/sync-from-figma-mcp.ts` - Main sync script with alias resolution
- `packages/design-system/scripts/diagnose-figma-variables.ts` - Diagnostic utility
- `packages/design-system/scripts/test-alias-resolution.ts` - Test cases

## Example Output

When aliases resolve successfully, you'll see:

```
🔗 Resolved alias: bg-subtle → #f8fafc
✅ Color: bg-subtle → bg-subtle = #f8fafc
```

When they can't be resolved:

```
⚠️  Could not resolve alias for bg-subtle: {...}
```

The variable will be skipped (not added to tokens) instead of creating `#NaNNaNNaN`.


