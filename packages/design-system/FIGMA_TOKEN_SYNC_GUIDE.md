# Figma Design Token Sync Guide

Complete guide to syncing design tokens from Figma to your Vue design system.

## Overview

This workflow syncs design variables from Figma to your design system, generating:

1. TypeScript token files (`figma-tokens.ts`)
2. Tailwind CSS configuration extensions
3. Design system component updates

## Architecture

```
Figma Design File
    ↓ (Figma MCP)
Variable Definitions (JSON)
    ↓ (Sync Script)
Parsed Tokens (TypeScript)
    ↓
Tailwind Config Extension
    ↓
Design System Components
```

## Methods

### Method 1: Manual Sync via Cursor AI (Recommended for Development)

**Step 1: Fetch Variables**
Ask Cursor AI:

```
Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 0:1 and sync them to the design system
```

**Step 2: Process Variables**
The AI will:

1. Fetch variables using `mcp_Figma_get_variable_defs`
2. Parse and convert to design tokens
3. Generate `figma-tokens.ts`
4. Update Tailwind config

**Step 3: Review and Apply**

1. Review generated tokens in `packages/design-system/src/tokens/figma-tokens.ts`
2. Check Tailwind extension in `packages/design-system/src/tokens/tailwind-extension.json`
3. Update `tailwind.config.js` to import the extension
4. Restart dev server

### Method 2: Automated Sync Script

**Setup:**

```bash
# Set environment variables
export FIGMA_FILE_KEY="rDLR9ZCB0Dq2AmRvxrifds"
export FIGMA_NODE_ID="0:1"  # Optional, defaults to root

# Run sync
pnpm --filter design-system sync:figma
```

**What it does:**

1. Fetches variables from Figma
2. Converts to design tokens
3. Generates TypeScript files
4. Updates Tailwind config

### Method 3: Production CI/CD Integration

See "Production Workflow" section below.

## Step-by-Step Process

### 1. Understanding Figma Variables

Figma variables are organized in collections:

- **Colors**: `indigo/600`, `slate/50`
- **Spacing**: `spacing/sm`, `spacing/lg`
- **Border Radius**: `Radius/radii-s`, `Radius/radii-xxl`
- **Shadows**: `Shadow/Light/400`
- **Typography**: `font/size/base`, `font/weight/bold`

### 2. Variable Naming Convention

Figma variables use `/` separators:

- `indigo/600` → Tailwind: `indigo-600`
- `Radius/radii-s` → Tailwind: `radii-s`
- `Shadow/Light/400` → Tailwind: `shadow-light-400`

### 3. Token Type Detection

The sync script automatically detects token types:

```typescript
// Color detection
if (
  value.startsWith("#") ||
  value.startsWith("rgb") ||
  value.startsWith("hsl")
) {
  type = "color";
}

// Spacing detection
if (name.includes("spacing") || name.includes("size")) {
  type = "spacing";
}

// Border radius detection
if (name.includes("radius") || name.includes("radii")) {
  type = "borderRadius";
}
```

### 4. Value Conversion

**Colors:**

- Hex: `#4f46e5` → `#4f46e5` (as-is)
- RGB: `rgb(79, 70, 229)` → `#4f46e5` (converted)
- HSL: `hsl(245, 76%, 59%)` → `hsl(245, 76%, 59%)` (as-is)

**Spacing:**

- Number: `16` → `16px`
- String: `16px` → `16px` (as-is)

**Border Radius:**

- Number: `999` → `999px`
- String: `999px` → `999px` (as-is)

## File Structure

```
packages/design-system/
├── src/
│   └── tokens/
│       ├── index.ts              # Token types and interfaces
│       ├── figma-tokens.ts       # Auto-generated from Figma
│       └── tailwind-extension.json # Tailwind config extension
├── scripts/
│   ├── sync-figma-tokens.ts      # Main sync script
│   └── sync-figma-mcp.ts         # MCP integration script
└── tailwind.config.js            # Updated with Figma tokens
```

## Generated Files

### figma-tokens.ts

```typescript
import type { DesignTokens } from "./index";

export const figmaTokens: DesignTokens = {
  colors: {
    "indigo-600": "#4f46e5",
    "slate-50": "#f8fafc",
    // ... more colors
  },
  spacing: {
    // ... spacing tokens
  },
  borderRadius: {
    "radii-xxl": "999px",
    "radii-s": "6px",
    // ... more radii
  },
  shadows: {
    "light-400": "0px 8px 16px 0px rgba(48, 49, 51, 0.1)",
    // ... more shadows
  },
};
```

### tailwind-extension.json

```json
{
  "colors": {
    "indigo-600": "#4f46e5",
    "slate-50": "#f8fafc"
  },
  "borderRadius": {
    "radii-xxl": "999px",
    "radii-s": "6px"
  },
  "boxShadow": {
    "light-400": "0px 8px 16px 0px rgba(48, 49, 51, 0.1)"
  }
}
```

## Integration with Tailwind Config

### Option 1: Import Extension (Recommended)

```javascript
// tailwind.config.js
import figmaTokens from "./src/tokens/tailwind-extension.json";

export default {
  theme: {
    extend: {
      colors: {
        ...figmaTokens.colors,
        // ... existing colors
      },
      borderRadius: {
        ...figmaTokens.borderRadius,
        // ... existing radii
      },
      boxShadow: {
        ...figmaTokens.boxShadow,
        // ... existing shadows
      },
    },
  },
};
```

### Option 2: Direct Merge

```javascript
// tailwind.config.js
import { figmaTokens } from "./src/tokens/figma-tokens";

export default {
  theme: {
    extend: {
      colors: {
        ...Object.fromEntries(
          Object.entries(figmaTokens.colors).map(([k, v]) => [
            k.replace(/\//g, "-"),
            v,
          ])
        ),
      },
    },
  },
};
```

## Using Tokens in Components

### Direct Usage

```vue
<template>
  <button class="bg-indigo-600 rounded-radii-xxl shadow-light-400">
    Button
  </button>
</template>
```

### Via Design Tokens

```vue
<script setup lang="ts">
import { figmaTokens } from "@linarc/design-system/tokens";

const buttonColor = figmaTokens.colors["indigo-600"];
</script>
```

## Production Workflow

### CI/CD Integration

**GitHub Actions Example:**

```yaml
# .github/workflows/sync-figma-tokens.yml
name: Sync Figma Tokens

on:
  schedule:
    - cron: "0 0 * * *" # Daily at midnight
  workflow_dispatch: # Manual trigger

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Sync Figma tokens
        env:
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
        run: pnpm --filter design-system sync:figma

      - name: Check for changes
        id: git-check
        run: |
          git diff --exit-code || echo "changed=true" >> $GITHUB_OUTPUT

      - name: Create PR if changes
        if: steps.git-check.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          title: "chore: sync design tokens from Figma"
          body: "Automated sync of design tokens from Figma"
          branch: "chore/sync-figma-tokens"
```

### Webhook Integration

**Figma Plugin → Webhook → CI/CD**

1. Create Figma plugin that watches for variable changes
2. Plugin sends webhook to your CI/CD system
3. CI/CD triggers token sync
4. Creates PR with updated tokens

### Manual Production Sync

```bash
# Production sync script
#!/bin/bash
set -e

echo "🔄 Syncing Figma tokens..."

# Fetch latest variables
pnpm --filter design-system sync:figma

# Build design system
pnpm --filter design-system build

# Run tests
pnpm test

# If all passes, commit and tag
git add packages/design-system/src/tokens/
git commit -m "chore: sync design tokens from Figma [skip ci]"
git tag -a "tokens-$(date +%Y%m%d)" -m "Design tokens sync"
```

## Best Practices

### 1. Version Control

- ✅ Commit generated token files
- ✅ Tag releases with token versions
- ✅ Document token changes in CHANGELOG

### 2. Naming Conventions

- ✅ Use consistent naming in Figma: `category/subcategory/value`
- ✅ Avoid special characters except `/` and `-`
- ✅ Use lowercase for Tailwind compatibility

### 3. Token Organization

- ✅ Group related tokens in Figma collections
- ✅ Use clear category names: `Colors`, `Spacing`, `Radius`
- ✅ Document token purpose in Figma descriptions

### 4. Testing

```typescript
// tests/tokens.test.ts
import { figmaTokens } from "../src/tokens/figma-tokens";

describe("Figma Tokens", () => {
  it("should have valid color tokens", () => {
    expect(figmaTokens.colors).toBeDefined();
    expect(Object.keys(figmaTokens.colors).length).toBeGreaterThan(0);
  });

  it("should have valid color formats", () => {
    Object.values(figmaTokens.colors).forEach((color) => {
      expect(color).toMatch(/^#|^rgb|^hsl/);
    });
  });
});
```

### 5. Documentation

- Document token usage in component stories
- Maintain token reference in Storybook
- Keep Figma file organized and documented

## Troubleshooting

### Issue: Variables not syncing

**Solution:**

1. Check Figma file key is correct
2. Verify node ID exists
3. Ensure MCP server is configured
4. Check variable collection permissions

### Issue: Colors not appearing

**Solution:**

1. Verify color format (hex, rgb, hsl)
2. Check Tailwind config import
3. Restart dev server
4. Clear Tailwind cache

### Issue: Type detection wrong

**Solution:**

1. Review variable naming in Figma
2. Update type detection logic in sync script
3. Manually specify type in variable name

## Advanced: Custom Token Processors

```typescript
// scripts/custom-processors.ts
export const tokenProcessors = {
  color: (value: string) => {
    // Custom color processing
    return value.toUpperCase();
  },
  spacing: (value: number) => {
    // Convert to rem
    return `${value / 16}rem`;
  },
};
```

## Next Steps

1. ✅ Set up Figma MCP integration
2. ✅ Run initial token sync
3. ✅ Review generated tokens
4. ✅ Update components to use tokens
5. ✅ Set up CI/CD automation
6. ✅ Document token usage patterns

## Resources

- [Figma Variables Documentation](https://help.figma.com/hc/en-us/articles/15339657135383)
- [Design Tokens Community Group](https://www.designtokens.org/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)
