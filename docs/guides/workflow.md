# Workflow Guide

Understanding how the Figma plugin and sync server work together.

## Why the Sync Server is Required

**Yes, you must start the sync server before using the plugin.**

### Why?

1. **Figma Plugin Limitations:**

   - Figma plugins run in a sandboxed environment
   - They **cannot** directly write files to your computer
   - They **cannot** make git commits or GitHub API calls directly
   - They can only make HTTP requests to allowed domains

2. **What the Server Does:**

   - Receives token data from the Figma plugin
   - Writes token files to your filesystem
   - Makes GitHub API calls (for production sync)
   - Handles file operations and git commits

3. **The Flow:**
   ```
   Figma Plugin (sandboxed)
       ↓ HTTP request
   Sync Server (localhost:3001)
       ↓ File operations / GitHub API
   Your Files / GitHub
   ```

## Workflow Options

### Option 1: Manual Start (Current)

**Before using plugin:**

```bash
pnpm --filter design-system dev:sync-server
```

**Keep terminal open** while using plugin.

**Pros:** Simple, explicit control  
**Cons:** Must remember to start it

### Option 2: Auto-Start Helper (Recommended)

**Start once:**

```bash
pnpm --filter design-system dev:auto-start
```

**Keep this running in the background!** The helper:

- ✅ Checks if server is running
- ✅ Starts it if not running
- ✅ Keeps it running in background
- ✅ Handles everything automatically

**Then just use the plugin** - no terminal commands needed!

### Option 3: Background Service (Future)

Run server as a background service that:

- Starts automatically on boot
- Always available
- No manual start needed

## Current Workflow

1. **Start sync server:**

   ```bash
   pnpm --filter design-system dev:sync-server
   ```

2. **Keep terminal open** (server runs in foreground)

3. **Use Figma plugin:**

   - Open plugin in Figma
   - Sync tokens (local or production)
   - Server handles the work

4. **Stop server:** Press `Ctrl+C` in terminal when done

## Easier Workflow: Auto-Start

### Quick Start

```bash
pnpm --filter design-system dev:sync-server:auto
```

**What it does:**

- ✅ Checks if server is already running
- ✅ Starts it if not running
- ✅ Shows you the server URL
- ✅ Opens server in new window

**Use this before opening the Figma plugin!**

### Recommended Workflow

1. **Before using plugin:**

   ```bash
   pnpm --filter design-system dev:sync-server:auto
   ```

2. **Use Figma plugin:**

   - Open plugin
   - Sync tokens
   - Server handles everything

3. **When done:**
   - Close server window (or press Ctrl+C)
   - Or leave it running for next time

## Making It Easier

I can create:

- ✅ **Auto-start script** - Checks and starts server automatically
- ✅ **Background mode** - Run server in background
- ✅ **System tray app** - Visual indicator when server is running
- ✅ **VS Code task** - One-click start from VS Code

## Cross-Platform Compatibility

The project works on Windows, macOS, and Linux:

- **Core functionality**: Fully cross-platform
- **Platform detection**: Automatic
- **Helper scripts**: Have cross-platform wrappers
- **Path handling**: Cross-platform via Node.js

See `docs/troubleshooting/quick-fixes.md` for platform-specific notes.

---

**Bottom line:** Server must run, but we can make it easier! Use the auto-start helper for the best experience.
