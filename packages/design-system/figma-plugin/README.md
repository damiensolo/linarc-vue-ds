# Figma Plugin - Design Token Sync

Figma plugin for syncing design tokens from Figma to your design system.

## Features

- One-click token sync from Figma
- Uses Figma Plugin API (no Enterprise plan required)
- Connects to local dev server for immediate updates
- Supports CI/CD webhook integration

## Setup

### 1. Install Dependencies

```bash
cd packages/design-system/figma-plugin
pnpm install
```

### 2. Build Plugin

```bash
pnpm build
```

This creates a `dist` folder with:
- `code.js` - Compiled plugin code
- `ui.html` - Plugin UI
- `manifest.json` - Plugin manifest

### 3. Load Plugin in Figma

1. Open Figma Desktop app
2. Go to Plugins → Development → Import plugin from manifest...
3. Select `packages/design-system/figma-plugin/dist/manifest.json`
4. Plugin will appear in Plugins → Development → Design Token Sync

## Usage

### Local Development Mode

1. **Start local sync server:**
   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Open plugin in Figma:**
   - Plugins → Development → Design Token Sync
   - Plugin UI will show current file info
   - Click "Sync Tokens" button

3. **Plugin will:**
   - Fetch variables using Figma Plugin API
   - Send to local server at `http://localhost:3001`
   - Update token files automatically
   - Show success notification

### CI/CD Mode (Optional)

1. **Start webhook server:**
   ```bash
   WEBHOOK_API_KEY=your-secret-key pnpm --filter design-system dev:webhook-server
   ```

2. **Configure plugin to use webhook URL:**
   - Update Server URL in plugin UI
   - Add API key if required

## Development

### Watch Mode

```bash
cd packages/design-system/figma-plugin
pnpm watch
```

This watches for changes and rebuilds automatically.

### Manual Build

```bash
pnpm build
```

## Plugin API Usage

The plugin uses Figma Plugin API to access variables:

```typescript
// Get all local variables
const variables = figma.variables.getLocalVariables();

// Access variable properties
variables.forEach(variable => {
  const name = variable.name;
  const value = variable.valuesByMode;
  const type = variable.resolvedType; // COLOR, FLOAT, etc.
});
```

## Architecture

```
Figma Plugin (Plugin API)
  ↓ Fetch Variables
  ↓ Process & Convert
  ↓ Send to Server
Local Sync Server (localhost:3001)
  ↓ Receive Variables
  ↓ Update Token Files
  ↓ Return Success
```

## Troubleshooting

### Plugin can't connect to server

- Ensure local sync server is running: `pnpm dev:sync-server`
- Check server URL in plugin UI (default: `http://localhost:3001`)
- Verify network access in `manifest.json`

### No variables found

- Ensure file has variables defined
- Variables must be "Local" (not published)
- Check variable names match expected format

### Build errors

- Ensure TypeScript is installed: `pnpm install`
- Check `tsconfig.json` configuration
- Verify `@figma/plugin-typings` is installed

## File Structure

```
figma-plugin/
├── code.ts          # Plugin main code (TypeScript)
├── ui.html          # Plugin UI (HTML)
├── manifest.json    # Plugin manifest
├── tsconfig.json    # TypeScript config
├── build.js         # Build script
├── package.json     # Plugin dependencies
└── dist/            # Built plugin (generated)
    ├── code.js
    ├── ui.html
    └── manifest.json
```

