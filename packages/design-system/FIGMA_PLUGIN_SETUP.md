# Figma Plugin Setup Instructions

## Installation Steps

### 1. Install Plugin Dependencies

```bash
cd packages/design-system/figma-plugin
pnpm install
```

This installs:
- `@figma/plugin-typings` - TypeScript types for Figma Plugin API
- `typescript` - For compiling plugin code
- `@types/node` - Node.js types

### 2. Build the Plugin

```bash
# From plugin directory
pnpm build

# Or from root
pnpm --filter design-system build:plugin
```

This will:
- Compile `code.ts` → `code.js`
- Copy `ui.html` to dist
- Copy `manifest.json` to dist
- Create `dist/` folder ready for Figma

### 3. Load Plugin in Figma

1. Open Figma Desktop app
2. Open any file (or create a new one)
3. Go to: **Plugins → Development → Import plugin from manifest...**
4. Navigate to: `packages/design-system/figma-plugin/dist/manifest.json`
5. Click "Open"

The plugin is now installed!

### 4. Start Sync Server

In a separate terminal:

```bash
pnpm --filter design-system dev:sync-server
```

Server will run on `http://localhost:3001`

### 5. Use the Plugin

1. In Figma, go to: **Plugins → Development → Design Token Sync**
2. Plugin UI opens showing:
   - File key (auto-detected)
   - File name
   - Server URL (editable)
3. Click **"Sync Tokens"**
4. Wait for success message
5. Check `packages/design-system/src/tokens/` - files should be updated!

## Development Workflow

### Making Changes

1. Edit `code.ts` or `ui.html` in `figma-plugin/` directory
2. Rebuild: `pnpm build` (or use `pnpm watch` for auto-rebuild)
3. In Figma: **Plugins → Development → Design Token Sync** (reloads automatically)

### Watch Mode

```bash
cd packages/design-system/figma-plugin
pnpm watch
```

Automatically rebuilds on file changes.

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors about `figma` types:

```bash
cd packages/design-system/figma-plugin
pnpm install @figma/plugin-typings --save-dev
```

### Plugin Not Loading

- Check `manifest.json` syntax is valid JSON
- Verify `code.js` exists in `dist/` folder
- Check Figma console for errors: **Plugins → Development → Open Console**

### Server Connection Issues

- Verify server is running: `http://localhost:3001/health`
- Check CORS settings in server code
- Try different port if 3001 is in use

## File Structure

```
figma-plugin/
├── code.ts          # Main plugin logic (TypeScript)
├── ui.html          # Plugin UI (HTML + JS)
├── manifest.json     # Plugin configuration
├── tsconfig.json    # TypeScript config
├── build.js         # Build script
├── package.json     # Dependencies
└── dist/            # Built files (generated)
    ├── code.js      # Compiled plugin code
    ├── ui.html      # Plugin UI
    └── manifest.json
```

## Next Steps

See `FIGMA_PLUGIN_GUIDE.md` for detailed usage instructions.

