# Quick Start Guide

Get up and running with the Linarc Vue Design System in minutes.

## Initial Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Build the design system:**

   ```bash
   pnpm build:ds
   ```

3. **Start the Nuxt app:**
   ```bash
   pnpm dev
   ```

The app will be available at `http://localhost:3000`

## Project Structure

```
linarc-vue-ds/
├── packages/
│   ├── design-system/     # Vue 3 component library
│   └── nuxt-app/          # Nuxt 3 application
├── .cursorrules           # Cursor AI instructions
└── CURSOR_PROMPTS.md      # Prompt templates
```

## Using Cursor AI

1. **Read `.cursorrules`** - Contains all development guidelines
2. **Use `CURSOR_PROMPTS.md`** - Copy prompts for common tasks
3. **Figma Integration** - Use Figma MCP tools with prompts from the guide

## Common Commands

```bash
# Development
pnpm dev                    # Start Nuxt app
pnpm build                  # Build all packages
pnpm build:ds              # Build design system only
pnpm build:app             # Build Nuxt app only

# Design System
pnpm --filter design-system sync:figma  # Sync tokens from Figma
```

## Auto-Start Helper (No Terminal Needed!)

For the easiest workflow:

1. **Start the auto-start helper once**:

   ```bash
   pnpm --filter design-system dev:auto-start
   ```

2. **Keep this running in the background!** The helper:

   - ✅ Listens for plugin connections
   - ✅ Auto-starts sync server when plugin needs it
   - ✅ Handles everything automatically

3. **Use Figma plugin**:
   - Open Figma plugin
   - Click "Sync Tokens"
   - **That's it!** No terminal commands needed

## Designer Quick Start

### For Designers: Just 2 Steps!

1. **Change variable in Figma**
2. **Ask Cursor AI:** "Sync tokens from Figma"

That's it! Component updates automatically.

### Real Example: Change indigo-600 Color

**Current State:**

- **Figma:** `indigo/600` = `#4f46e5` (purple)
- **Component:** Shows purple button

**Step 1: Change in Figma**

1. Open your Figma file
2. Find variable: `indigo/600`
3. Change value: `#4f46e5` → `#64748b` (slate-500)

**Step 2: Sync**
Ask Cursor AI:

```
Sync design tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110
```

Or run command:

```bash
pnpm --filter design-system sync:figma:simple
```

**Step 3: Restart (if needed)**

```bash
# Stop server (Ctrl+C) and restart
pnpm dev
```

**Result:**

- ✅ Component now shows slate-500 instead of purple!
- ✅ No code changes needed
- ✅ All components using `bg-indigo-600` update automatically

## Test Page

Visit: `http://localhost:3000/test-token-sync`

This page shows:

- Current token value
- Components using the token
- Instructions for testing

## Next Steps

1. **Set up Figma Integration:**

   - Configure Figma MCP in Cursor
   - See `packages/design-system/FIGMA_SETUP.md`

2. **Add More Components:**

   - Use ShadCN Vue CLI: `npx shadcn-vue@latest add [component]`
   - Or ask Cursor to create components following patterns

3. **Build Your App:**
   - Create pages in `packages/nuxt-app/pages/`
   - Use design system components
   - See `CURSOR_PROMPTS.md` for examples

## Resources

- **Cursor Rules**: `.cursorrules`
- **Prompt Templates**: `CURSOR_PROMPTS.md`
- **Figma Setup**: `packages/design-system/FIGMA_SETUP.md`
- **Design System Docs**: `packages/design-system/README.md`
- **Token Sync Guide**: `docs/figma/token-sync.md`
- **Deployment Guide**: `docs/deployment/README.md`

## Getting Help

Use Cursor AI with prompts from `CURSOR_PROMPTS.md` or ask questions about:

- Creating components
- Figma integration
- Nuxt app development
- Design token management
