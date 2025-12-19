# Complete Figma Token Sync Workflow

## Overview

This document explains the complete process of syncing design tokens from Figma to your Vue design system, from development to production.

## Architecture Diagram

```
┌─────────────────┐
│  Figma Design   │
│     File        │
└────────┬────────┘
         │
         │ Figma MCP API
         ▼
┌─────────────────┐
│ Variable Defs   │
│   (JSON)        │
└────────┬────────┘
         │
         │ Parse & Convert
         ▼
┌─────────────────┐
│ Design Tokens   │
│  (TypeScript)   │
└────────┬────────┘
         │
         ├──► figma-tokens.ts
         ├──► tailwind-extension.json
         └──► tailwind.config.js (updated)
```

## Method 1: Using Cursor AI (Recommended for Development)

### Step-by-Step Process

**1. Ask Cursor AI to fetch and sync:**

```
Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 0:1 and sync them to the design system. Update figma-tokens.ts and regenerate Tailwind config.
```

**2. Cursor AI will:**

1. Call `mcp_Figma_get_variable_defs` with your file key and node ID
2. Receive variable definitions like:
   ```json
   {
     "indigo/600": "#4f46e5",
     "slate/50": "#f8fafc",
     "Radius/radii-xxl": "999",
     "Shadow/Light/400": "Effect(...)"
   }
   ```

3. Parse variables using `sync-figma-mcp.ts`:
   - Detect token types (color, spacing, borderRadius, shadow)
   - Convert values to proper formats
   - Organize by category

4. Generate files:
   - `src/tokens/figma-tokens.ts` - TypeScript tokens
   - `src/tokens/tailwind-extension.json` - Tailwind extension

5. Tailwind config automatically picks up changes (via import)

**3. Review generated files:**

```typescript
// src/tokens/figma-tokens.ts
export const figmaTokens: DesignTokens = {
  colors: {
    'indigo-600': '#4f46e5',
    'slate-50': '#f8fafc',
    // ...
  },
  borderRadius: {
    'radii-xxl': '999px',
    // ...
  }
}
```

**4. Use tokens in components:**

```vue
<template>
  <button class="bg-indigo-600 rounded-radii-xxl">
    Button
  </button>
</template>
```

## Method 2: Automated Script (Production Ready)

### Setup

**1. Create sync script wrapper:**

```typescript
// scripts/sync-figma-production.ts
import { syncFromFigmaMCP } from './sync-figma-mcp'

// Fetch from Figma API (not MCP - for CI/CD)
async function fetchFromFigmaAPI() {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`,
    {
      headers: {
        'X-Figma-Token': process.env.FIGMA_API_TOKEN!
      }
    }
  )
  return response.json()
}

async function main() {
  const variables = await fetchFromFigmaAPI()
  await syncFromFigmaMCP(variables)
}

main()
```

**2. Add to package.json:**

```json
{
  "scripts": {
    "sync:figma:production": "tsx scripts/sync-figma-production.ts"
  }
}
```

**3. Set environment variables:**

```bash
export FIGMA_FILE_KEY="rDLR9ZCB0Dq2AmRvxrifds"
export FIGMA_API_TOKEN="your-figma-api-token"
```

## Production CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/sync-figma-tokens.yml
name: Sync Figma Design Tokens

on:
  # Daily sync at midnight UTC
  schedule:
    - cron: '0 0 * * *'
  # Manual trigger
  workflow_dispatch:
  # On Figma webhook (if configured)
  repository_dispatch:
    types: [figma-updated]

jobs:
  sync-tokens:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Sync Figma tokens
        env:
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
          FIGMA_API_TOKEN: ${{ secrets.FIGMA_API_TOKEN }}
        run: |
          pnpm --filter design-system sync:figma:production

      - name: Check for changes
        id: git-check
        run: |
          git diff --exit-code packages/design-system/src/tokens/ || echo "changed=true" >> $GITHUB_OUTPUT
          git diff --exit-code packages/design-system/src/tokens/tailwind-extension.json || echo "changed=true" >> $GITHUB_OUTPUT

      - name: Create Pull Request
        if: steps.git-check.outputs.changed == 'true'
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'chore: sync design tokens from Figma'
          title: 'chore: sync design tokens from Figma'
          body: |
            Automated sync of design tokens from Figma.
            
            This PR updates design tokens based on the latest Figma variables.
            
            **Review checklist:**
            - [ ] Verify color values match design
            - [ ] Check spacing/radius values
            - [ ] Test components with new tokens
            - [ ] Update component documentation if needed
          branch: chore/sync-figma-tokens
          delete-branch: true
          labels: |
            design-system
            automated
            tokens
```

### Figma Webhook Setup (Optional)

**1. Create Figma Plugin:**

```javascript
// figma-plugin/watch-variables.js
figma.on('variablechange', () => {
  // Send webhook to your CI/CD
  fetch('https://api.github.com/repos/your-org/your-repo/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `token ${FIGMA_WEBHOOK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      event_type: 'figma-updated'
    })
  })
})
```

**2. Configure GitHub Secret:**

Add `FIGMA_WEBHOOK_TOKEN` to GitHub secrets.

## Token Processing Pipeline

### 1. Variable Detection

```typescript
function detectTokenType(name: string, value: any): TokenType {
  // Color detection
  if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
    return 'color'
  }
  
  // Spacing detection
  if (name.toLowerCase().includes('spacing') || 
      name.toLowerCase().includes('size') ||
      (typeof value === 'number' && value < 100)) {
    return 'spacing'
  }
  
  // Border radius detection
  if (name.toLowerCase().includes('radius') || 
      name.toLowerCase().includes('radii')) {
    return 'borderRadius'
  }
  
  // Shadow detection
  if (name.toLowerCase().includes('shadow')) {
    return 'shadow'
  }
  
  return 'color' // Default
}
```

### 2. Value Conversion

```typescript
function convertValue(type: TokenType, value: any): string {
  switch (type) {
    case 'color':
      // Convert RGB to hex if needed
      if (typeof value === 'object' && 'r' in value) {
        return rgbToHex(value.r, value.g, value.b)
      }
      return String(value)
    
    case 'spacing':
    case 'borderRadius':
      // Ensure px suffix
      if (typeof value === 'number') {
        return `${value}px`
      }
      return String(value)
    
    case 'shadow':
      // Parse Figma shadow effect
      return parseShadowEffect(value)
    
    default:
      return String(value)
  }
}
```

### 3. Name Normalization

```typescript
function normalizeTokenName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\//g, '-')      // indigo/600 → indigo-600
    .replace(/\s+/g, '-')     // Radius/radii-xxl → radius-radii-xxl
    .replace(/[^a-z0-9-]/g, '') // Remove special chars
}
```

## File Structure After Sync

```
packages/design-system/
├── src/
│   └── tokens/
│       ├── index.ts                    # Token types
│       ├── figma-tokens.ts            # ✅ Auto-generated
│       └── tailwind-extension.json    # ✅ Auto-generated
├── scripts/
│   ├── sync-figma-tokens.ts          # Main sync script
│   └── sync-figma-mcp.ts             # MCP integration
└── tailwind.config.js                 # ✅ Auto-updated
```

## Verification Steps

### 1. Check Generated Files

```bash
# Verify tokens file
cat packages/design-system/src/tokens/figma-tokens.ts

# Verify Tailwind extension
cat packages/design-system/src/tokens/tailwind-extension.json
```

### 2. Test in Component

```vue
<template>
  <div class="bg-indigo-600 rounded-radii-xxl p-4">
    <p class="text-slate-50">Test token usage</p>
  </div>
</template>
```

### 3. Build Verification

```bash
# Build design system
pnpm --filter design-system build

# Check for errors
pnpm --filter design-system typecheck
```

## Troubleshooting

### Issue: Tokens not appearing in Tailwind

**Solution:**
1. Check `tailwind-extension.json` exists
2. Verify Tailwind config imports it
3. Restart dev server
4. Clear Tailwind cache: `rm -rf .nuxt .vite`

### Issue: Wrong token types

**Solution:**
1. Review variable names in Figma
2. Update type detection logic
3. Use explicit naming: `Color/indigo-600`, `Spacing/sm`

### Issue: CI/CD sync failing

**Solution:**
1. Verify `FIGMA_API_TOKEN` is set
2. Check file key is correct
3. Review API rate limits
4. Add error handling and retries

## Best Practices

### 1. Naming Conventions

✅ **Good:**
- `Color/Primary/600`
- `Spacing/Base/16`
- `Radius/Button/Large`

❌ **Bad:**
- `primaryColor600`
- `spacing16`
- `button-radius`

### 2. Token Organization

- Group related tokens in Figma collections
- Use consistent naming patterns
- Document token purpose in Figma descriptions

### 3. Version Control

- Commit generated token files
- Tag releases with token versions
- Document breaking changes

### 4. Testing

```typescript
// tests/tokens.test.ts
describe('Figma Tokens', () => {
  it('should have valid structure', () => {
    expect(figmaTokens.colors).toBeDefined()
    expect(figmaTokens.borderRadius).toBeDefined()
  })

  it('should have valid color formats', () => {
    Object.values(figmaTokens.colors).forEach(color => {
      expect(color).toMatch(/^#|^rgb|^hsl/)
    })
  })
})
```

## Next Steps

1. ✅ Set up Figma MCP in Cursor
2. ✅ Run initial sync
3. ✅ Review generated tokens
4. ✅ Update components to use tokens
5. ✅ Set up CI/CD automation
6. ✅ Configure webhook (optional)
7. ✅ Document token usage patterns

## Resources

- [Figma Variables API](https://www.figma.com/developers/api#variables)
- [Design Tokens Format](https://tr.designtokens.org/format/)
- [Tailwind CSS Configuration](https://tailwindcss.com/docs/configuration)

