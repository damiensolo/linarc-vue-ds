# Figma Plugin - Quick Start Guide

## Overview

The Figma Plugin enables one-click syncing of design tokens from Figma to your design system. No command line or Cursor AI needed!

## Prerequisites

- Figma Desktop app installed
- Local development environment set up
- Design tokens/variables defined in your Figma file

## Quick Start

### Step 1: Build the Plugin

```bash
pnpm --filter design-system build:plugin
```

This compiles the plugin TypeScript code and prepares it for Figma.

### Step 2: Load Plugin in Figma

1. Open Figma Desktop app
2. Open your design file with variables
3. Go to: **Plugins → Development → Import plugin from manifest...**
4. Navigate to: `packages/design-system/figma-plugin/dist/manifest.json`
5. Click "Open"

The plugin will now appear in: **Plugins → Development → Design Token Sync**

### Step 3: Start Local Sync Server

In a terminal:

```bash
pnpm --filter design-system dev:sync-server
```

You should see:
```
🚀 Local sync server running on http://localhost:3001
📡 Endpoint: POST http://localhost:3001/api/sync-tokens
```

### Step 4: Sync Tokens

1. In Figma, run the plugin: **Plugins → Development → Design Token Sync**
2. Plugin UI will show:
   - Current file key (auto-detected)
   - File name
   - Server URL (default: `http://localhost:3001`)
3. Click **"Sync Tokens"** button
4. Wait for success message
5. Check your token files - they should be updated!

## How It Works

```
┌─────────────┐
│   Figma     │
│   Plugin    │
└──────┬──────┘
       │
       │ 1. Get variables via Plugin API
       │
       ▼
┌─────────────┐
│   Process   │
│  Variables  │
└──────┬──────┘
       │
       │ 2. Send to local server
       │
       ▼
┌─────────────┐
│   Local     │
│   Server    │
└──────┬──────┘
       │
       │ 3. Update token files
       │
       ▼
┌─────────────┐
│   Token     │
│   Files     │
└─────────────┘
```

## Troubleshooting

### Plugin can't connect to server

**Problem:** Plugin shows connection error

**Solution:**
1. Verify server is running: Check terminal for "Local sync server running"
2. Check server URL in plugin UI matches server port
3. Try accessing `http://localhost:3001/health` in browser (should return `{"status":"ok"}`)

### No variables found

**Problem:** Plugin says "No variables found"

**Solution:**
1. Ensure your Figma file has variables defined
2. Variables must be "Local" (not published to library)
3. Check variable names - they should follow naming conventions

### Build errors

**Problem:** `pnpm build:plugin` fails

**Solution:**
1. Install plugin dependencies: `cd figma-plugin && pnpm install`
2. Check TypeScript version matches project
3. Verify `@figma/plugin-typings` is installed

### Token files not updating

**Problem:** Sync succeeds but files don't change

**Solution:**
1. Check file permissions in `packages/design-system/src/tokens/`
2. Verify server has write access
3. Check server console for errors
4. Restart dev server after sync

## Advanced Usage

### Custom Server Port

If port 3001 is in use:

```bash
PORT=3002 pnpm --filter design-system dev:sync-server
```

Then update Server URL in plugin UI to `http://localhost:3002`

### CI/CD Integration

For automated syncing via webhook:

1. Start webhook server:
   ```bash
   WEBHOOK_API_KEY=secret-key pnpm --filter design-system dev:webhook-server
   ```

2. Configure plugin to use webhook URL instead of local server

3. Webhook will create GitHub commits/PRs (when implemented)

## Plugin Development

### Watch Mode

```bash
cd packages/design-system/figma-plugin
pnpm watch
```

This rebuilds plugin automatically on file changes.

### Manual Rebuild

After making changes to `code.ts` or `ui.html`:

```bash
pnpm build:plugin
```

Then reload plugin in Figma: **Plugins → Development → Design Token Sync**

## File Locations

- **Plugin source:** `packages/design-system/figma-plugin/`
- **Built plugin:** `packages/design-system/figma-plugin/dist/`
- **Token files:** `packages/design-system/src/tokens/`
- **Sync server:** `packages/design-system/server/local-sync-server.ts`

## Next Steps

1. ✅ Build and load plugin
2. ✅ Start sync server
3. ✅ Sync tokens from Figma
4. ✅ Verify token files updated
5. ✅ Test components with new tokens
6. 🎉 Celebrate!

For more details, see `packages/design-system/figma-plugin/README.md`

