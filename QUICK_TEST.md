# Quick Test: Change indigo-600 to slate-500

## The Simplest Test Ever 🎯

### What You'll Do

Change one color variable in Figma and watch it update in your Vue component automatically!

### Step-by-Step

#### 1. Open Figma
- File: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
- Find variable: `indigo/600` (currently `#4f46e5`)

#### 2. Change the Color
- Change `indigo/600` value to: `#64748b` (slate-500)
- Or try: `#ef4444` (red) for dramatic effect!

#### 3. Sync (Choose One Method)

**Method A: Ask Cursor AI** (Easiest!)
```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

**Method B: Run Command**
```bash
pnpm --filter design-system sync:figma:simple
```

#### 4. Restart Dev Server
```bash
# Stop server (Ctrl+C)
pnpm dev
```

#### 5. See the Magic! ✨

Visit: `http://localhost:3000/test-token-sync`

You'll see:
- The color swatch shows the new color
- The FloatingActionButton uses the new color
- All components using `bg-indigo-600` now show slate-500!

### What Gets Updated

1. ✅ `packages/design-system/src/tokens/figma-tokens.ts`
   ```typescript
   colors: {
     'indigo-600': '#64748b', // ✅ Changed!
   }
   ```

2. ✅ `packages/design-system/src/tokens/tailwind-extension.json`
   ```json
   {
     "colors": {
       "indigo-600": "#64748b" // ✅ Changed!
     }
   }
   ```

3. ✅ Tailwind config auto-updates (via import)

4. ✅ Components automatically use new color!

### Test It Now!

1. **Current state:** `indigo-600` = `#4f46e5` (purple)
2. **Change in Figma:** `indigo-600` = `#64748b` (slate)
3. **Sync:** Run command or ask Cursor
4. **Result:** Component shows slate color!

### Pro Tips

- Use Cursor AI - it's the fastest way
- Test page at `/test-token-sync` shows the current value
- Change back to original to test reverting
- Multiple components update automatically!

## That's It!

Super simple: Change in Figma → Sync → See it update! 🚀

