# Super Simple Token Sync - Visual Guide

## The Easiest Way: 3 Steps

```
┌─────────────┐
│   Figma     │  Change indigo/600: #4f46e5 → #64748b
└──────┬──────┘
       │
       │ Step 1: Change variable
       ▼
┌─────────────┐
│   Cursor    │  "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"
└──────┬──────┘
       │
       │ Step 2: Ask Cursor AI
       ▼
┌─────────────┐
│   Tokens    │  figma-tokens.ts updated automatically
└──────┬──────┘
       │
       │ Step 3: Restart server
       ▼
┌─────────────┐
│ Component   │  bg-indigo-600 now shows slate-500!
└─────────────┘
```

## Real Example: Change indigo-600 to slate-500

### Before Sync

**Figma:**

```
indigo/600 = #4f46e5 (purple)
```

**Component:**

```vue
<button class="bg-indigo-600">Button</button>
<!-- Shows purple -->
```

### Step 1: Change in Figma

1. Open: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
2. Find variable: `indigo/600`
3. Change value: `#4f46e5` → `#64748b`

### Step 2: Sync

**Option A: Cursor AI** (Recommended!)

```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Option B: Command**

```bash
pnpm --filter design-system sync:figma:simple
```

### Step 3: Restart

```bash
# Stop server (Ctrl+C)
pnpm dev
```

### After Sync

**Token File:**

```typescript
// figma-tokens.ts
colors: {
  'indigo-600': '#64748b', // ✅ Updated!
}
```

**Component:**

```vue
<button class="bg-indigo-600">Button</button>
<!-- Now shows slate-500! -->
```

## Test It Right Now!

1. **Visit test page:** `http://localhost:3000/test-token-sync`
2. **See current color:** Purple (#4f46e5)
3. **Change in Figma:** `indigo/600` → `#64748b`
4. **Sync:** Ask Cursor or run command
5. **Restart:** `pnpm dev`
6. **See change:** Color is now slate-500!

## What Happens Automatically

1. ✅ `figma-tokens.ts` updates
2. ✅ `tailwind-extension.json` updates
3. ✅ Tailwind config picks up changes
4. ✅ Components use new color
5. ✅ No code changes needed!

## Pro Tips

### Tip 1: Use Cursor AI

Just ask: "Sync tokens from Figma" - it's instant!

### Tip 2: Test Page

Visit `/test-token-sync` to see current token values

### Tip 3: Multiple Variables

Change multiple variables at once - they all sync together!

### Tip 4: Revert Test

Change back to original color to test reverting works

## Common Variables to Test

| Variable          | Current   | Try Changing To       |
| ----------------- | --------- | --------------------- |
| `indigo/600`      | `#4f46e5` | `#64748b` (slate-500) |
| `indigo/600`      | `#4f46e5` | `#ef4444` (red)       |
| `Radius/radii-xl` | `100`     | `50`                  |
| `Radius/radii-s`  | `6`       | `12`                  |

## That's It!

Super simple: **Change → Sync → See it update!** 🚀
