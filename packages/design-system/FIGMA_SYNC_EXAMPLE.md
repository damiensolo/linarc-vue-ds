# Figma Token Sync - Quick Start Example

## Using Cursor AI to Sync Tokens

### Step 1: Fetch Variables from Figma

Ask Cursor AI:
```
Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 0:1 and sync them to the design system. Update figma-tokens.ts and regenerate Tailwind config.
```

### Step 2: What Happens Behind the Scenes

1. **Figma MCP fetches variables:**
   ```typescript
   mcp_Figma_get_variable_defs({
     fileKey: 'rDLR9ZCB0Dq2AmRvxrifds',
     nodeId: '0:1'
   })
   ```

2. **Variables are parsed:**
   ```json
   {
     "indigo/600": "#4f46e5",
     "slate/50": "#f8fafc",
     "Radius/radii-xxl": "999px"
   }
   ```

3. **Converted to tokens:**
   ```typescript
   {
     name: "indigo/600",
     value: "#4f46e5",
     type: "color",
     category: "indigo"
   }
   ```

4. **Files are generated:**
   - `src/tokens/figma-tokens.ts` - TypeScript tokens
   - `src/tokens/tailwind-extension.json` - Tailwind config extension

5. **Tailwind config is updated** (automatically via import)

### Step 3: Manual Sync Example

If you want to sync manually with example data:

```bash
# Set environment variables
export FIGMA_FILE_KEY="rDLR9ZCB0Dq2AmRvxrifds"
export FIGMA_NODE_ID="0:1"

# Run sync
pnpm --filter design-system sync:figma
```

## Example: Syncing Current Figma Variables

Based on your Figma file, here's what gets synced:

### Input (from Figma):
```json
{
  "indigo/600": "#4f46e5",
  "slate/50": "#f8fafc",
  "Radius/New group/radii-xxl": "999",
  "Radius/radii-s": "6",
  "Radius/radii-xs": "4",
  "Background/bg-body": "#ffffff",
  "Black": "#131313",
  "Shadow/Light/400": "Effect(type: DROP_SHADOW, ...)"
}
```

### Output (figma-tokens.ts):
```typescript
export const figmaTokens: DesignTokens = {
  colors: {
    'indigo-600': '#4f46e5',
    'slate-50': '#f8fafc',
    'bg-body': '#ffffff',
    'black': '#131313',
  },
  borderRadius: {
    'radii-xxl': '999px',
    'radii-s': '6px',
    'radii-xs': '4px',
  },
  shadows: {
    'light-400': '0px 8px 16px 0px rgba(48, 49, 51, 0.1), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)',
  },
}
```

### Output (tailwind-extension.json):
```json
{
  "colors": {
    "indigo-600": "#4f46e5",
    "slate-50": "#f8fafc",
    "bg-body": "#ffffff",
    "black": "#131313"
  },
  "borderRadius": {
    "radii-xxl": "999px",
    "radii-s": "6px",
    "radii-xs": "4px"
  },
  "boxShadow": {
    "light-400": "0px 8px 16px 0px rgba(48, 49, 51, 0.1), 0px 0px 1px 0px rgba(48, 49, 51, 0.05)"
  }
}
```

## Using Synced Tokens

### In Components:
```vue
<template>
  <!-- Use Tailwind classes directly -->
  <button class="bg-indigo-600 rounded-radii-xxl shadow-light-400">
    Button
  </button>
</template>
```

### In TypeScript:
```typescript
import { figmaTokens } from '@linarc/design-system/tokens'

const primaryColor = figmaTokens.colors['indigo-600']
```

## Production Workflow

### Option 1: Scheduled Sync (CI/CD)
```yaml
# .github/workflows/sync-tokens.yml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily
```

### Option 2: Webhook Trigger
When Figma variables change → Webhook → CI/CD → Sync → PR

### Option 3: Manual Production Sync
```bash
# Production sync
pnpm --filter design-system sync:figma
git add packages/design-system/src/tokens/
git commit -m "chore: sync design tokens from Figma"
```

