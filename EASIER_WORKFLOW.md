# Easier Workflow: Auto-Start Sync Server

## The Problem

You have to remember to start the sync server before using the plugin.

## The Solution

Use the **auto-start script** that checks and starts the server automatically!

## Quick Start

### Option 1: Auto-Start (Easiest)

```bash
pnpm --filter design-system dev:sync-server:auto
```

**What it does:**
- ✅ Checks if server is already running
- ✅ Starts it if not running
- ✅ Shows you the server URL
- ✅ Opens server in new window

**Use this before opening the Figma plugin!**

### Option 2: Manual Start (Current)

```bash
pnpm --filter design-system dev:sync-server
```

**Keep terminal open** while using plugin.

## Recommended Workflow

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

## Even Easier: VS Code Task

I can create a VS Code task so you can:
- Press `Ctrl+Shift+P` → "Start Sync Server"
- One-click start from VS Code

**Would you like me to add this?**

## Background Mode (Future)

For ultimate convenience, I can create:
- Background service that auto-starts
- System tray indicator
- No manual start needed

**Interested in this?**

---

**For now:** Use `dev:sync-server:auto` - it's the easiest!

