# Quick Start Guide

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

## Getting Help

Use Cursor AI with prompts from `CURSOR_PROMPTS.md` or ask questions about:
- Creating components
- Figma integration
- Nuxt app development
- Design token management

