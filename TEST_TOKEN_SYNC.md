# Test Token Sync - Quick Guide

## Super Simple Test Flow

### Step 1: Change Variable in Figma

1. Open Figma file: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
2. Find variable: `indigo/600` 
3. Change its value from `#4f46e5` to `#ef4444` (red) or `#64748b` (slate-500)

### Step 2: Sync Tokens

**Option A: Using Cursor AI (Easiest!)**
```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Option B: Using Simple Script**
```bash
pnpm --filter design-system sync:figma:simple
```

**Option C: Interactive Mode**
```bash
pnpm --filter design-system sync:figma:interactive
```

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### Step 4: See the Change!

Your FloatingActionButton component (or any component using `bg-indigo-600`) will now show the new color!

## What Happens Behind the Scenes

1. **Figma** → Variable changed: `indigo/600` = `#ef4444`
2. **Sync Script** → Fetches variables, updates `figma-tokens.ts`
3. **Tailwind Config** → Auto-imports new tokens
4. **Component** → Uses new color automatically!

## Testing Checklist

- [ ] Change `indigo/600` color in Figma
- [ ] Run sync command
- [ ] Check `packages/design-system/src/tokens/figma-tokens.ts` updated
- [ ] Restart dev server
- [ ] Verify component shows new color
- [ ] Change back to original color
- [ ] Sync again
- [ ] Verify component reverts

## Example: Change indigo-600 to slate-500

**In Figma:**
- Variable: `indigo/600`
- Old value: `#4f46e5`
- New value: `#64748b`

**After sync:**
```typescript
// figma-tokens.ts
colors: {
  'indigo-600': '#64748b', // ✅ Updated!
}
```

**In Component:**
```vue
<!-- This automatically uses the new color -->
<button class="bg-indigo-600">Button</button>
```

## Pro Tip: Use Cursor AI

The easiest way is to just ask Cursor:

```
Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110 and sync them to the design system
```

Cursor will handle everything automatically!

