# Radius Tokens Sync Fix

## Problem

Radius tokens (FLOAT type variables) were not syncing from Figma plugin - only colors were syncing.

## Root Cause

1. **Plugin Issue**: The plugin was converting FLOAT values to plain strings, losing type information
2. **Sync Script Issue**: The sync script only detected radius tokens by checking if the name contained "radius" or "radii", which failed if variable names didn't include those words

## Solution

### 1. Updated Plugin (`figma-plugin/code.ts`)

- **Before**: FLOAT values were sent as plain strings

  ```typescript
  variables[name] = String(value);
  ```

- **After**: FLOAT values are sent as objects with metadata
  ```typescript
  variables[name] = {
    value: numValue,
    resolvedType: "FLOAT",
    collection: variable.variableCollectionId,
  };
  ```

### 2. Updated Sync Script (`scripts/sync-from-figma-mcp.ts`)

#### Updated `resolveAliases` function:

- Now preserves FLOAT objects with metadata instead of trying to resolve them as aliases
- Handles FLOAT objects in both first and second pass

#### Updated `processVariables` function:

- **Enhanced type detection**: Now checks `resolvedType` from plugin metadata first
- **Better categorization**: Uses type information + name patterns to categorize tokens
- **Improved radius detection**: Checks for:
  - `resolvedType === "FLOAT"` (from plugin metadata)
  - Name contains "radius" or "radii"
  - Key contains "radius" or "radii"

## How It Works Now

1. **Plugin sends FLOAT variables** as:

   ```json
   {
     "radius-sm": {
       "value": 4,
       "resolvedType": "FLOAT",
       "collection": "collection-id"
     }
   }
   ```

2. **Sync script detects** FLOAT type from `resolvedType` field

3. **Sync script categorizes** based on:

   - Type metadata (`resolvedType === "FLOAT"`)
   - Name patterns (`name.includes("radius")` or `name.includes("radii")`)
   - Key patterns (`key.includes("radius")` or `key.includes("radii")`)

4. **Output** to `tailwind-extension.json`:
   ```json
   {
     "borderRadius": {
       "radius-sm": "4px",
       "radius-md": "8px"
     }
   }
   ```

## Testing

1. **Rebuild plugin**:

   ```bash
   pnpm --filter design-system build:plugin
   ```

2. **Reload plugin in Figma**:

   - Close plugin
   - Restart Figma Desktop
   - Reopen plugin

3. **Sync tokens**:

   - Click "Sync Tokens" in plugin
   - Check sync server console for radius token logs:
     ```
     ✅ Radius: radius-sm → radius-sm = 4px
     ✅ Radius: radius-md → radius-md = 8px
     ```

4. **Verify output**:
   - Check `packages/design-system/src/tokens/tailwind-extension.json`
   - Should have entries in `borderRadius` object

## Files Changed

- ✅ `packages/design-system/figma-plugin/code.ts` - Send FLOAT as objects with metadata
- ✅ `packages/design-system/figma-plugin/dist/code.js` - Rebuilt plugin
- ✅ `packages/design-system/scripts/sync-from-figma-mcp.ts` - Enhanced detection and categorization

## Next Steps

1. **Reload plugin** in Figma (critical!)
2. **Sync tokens** from plugin
3. **Verify** radius tokens appear in `tailwind-extension.json`
