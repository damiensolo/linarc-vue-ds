# 🚀 Auto-Start Setup: No Terminal Needed!

## How It Works

1. **Start the auto-start helper once** (runs in background)
2. **Open Figma plugin** - it automatically starts the sync server when needed!
3. **No terminal commands needed** after initial setup

## ✨ The Magic

When you open the Figma plugin and click "Sync Tokens":
- Plugin checks: "Is sync server running?"
- If not: Plugin asks helper to start it automatically
- Helper starts sync server in background
- Plugin connects and syncs tokens
- **You don't do anything!** 🎉

## Setup (One Time)

### Step 1: Start Auto-Start Helper

```bash
pnpm --filter design-system dev:auto-start
```

**Keep this running in the background!** It will:
- ✅ Listen for plugin connections
- ✅ Auto-start sync server when plugin needs it
- ✅ Handle everything automatically

### Step 2: Use Figma Plugin

1. Open Figma plugin
2. Click "Sync Tokens"
3. **That's it!** The helper automatically starts the sync server

## Workflow

```
You open Figma plugin
    ↓
Plugin checks: Is sync server running?
    ↓ (No)
Plugin asks helper to start server
    ↓
Helper starts sync server automatically
    ↓
Plugin connects and syncs tokens
    ↓
✅ Done! No terminal needed!
```

## Benefits

- ✅ **No terminal commands** - Just open the plugin!
- ✅ **Automatic** - Server starts when needed
- ✅ **Background helper** - Runs once, handles everything
- ✅ **Smart** - Checks if server is already running

## Running the Helper

### Option 1: Manual Start (Current)

```bash
pnpm --filter design-system dev:auto-start
```

Keep this terminal open. The helper runs in the background.

### Option 2: Background Service (Future)

I can create a Windows service that:
- Starts automatically on boot
- Always available
- No manual start needed

**Would you like me to set this up?**

## What the Helper Does

1. **Listens on port 3000** for plugin requests
2. **Checks if sync server is running** (ports 3001-3005)
3. **Starts sync server automatically** if not running
4. **Returns server URL** to plugin
5. **Plugin connects** and syncs tokens

## Troubleshooting

### "Cannot connect to helper"
- Make sure helper is running: `pnpm --filter design-system dev:auto-start`
- Check port 3000 is available

### "Helper started but server won't start"
- Check if ports 3001-3005 are available
- Look at helper console for error messages

### "Server starts but plugin can't connect"
- Check helper console for server URL
- Verify the URL matches plugin Server URL field

---

**🎉 Now you can just open the plugin - no terminal needed!**

**Just start the helper once and leave it running!**

