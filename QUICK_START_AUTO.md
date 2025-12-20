# ⚡ Quick Start: Auto-Start (No Terminal Needed!)

## One-Time Setup

**Start the auto-start helper:**

```bash
pnpm --filter design-system dev:auto-start
```

**Keep this terminal open!** The helper runs in the background.

## Using the Plugin

1. **Open Figma plugin**
2. **Click "Sync Tokens"**
3. **That's it!** 🎉

The plugin automatically:
- ✅ Checks if sync server is running
- ✅ Starts it if needed (via helper)
- ✅ Connects and syncs tokens
- ✅ Works for both local and production sync

## What Happens Behind the Scenes

```
You click "Sync Tokens" in plugin
    ↓
Plugin: "Is sync server running?" → Helper
    ↓ (No)
Helper: Starts sync server automatically
    ↓
Plugin: Connects to sync server
    ↓
Sync server: Updates token files
    ↓
✅ Done! No terminal commands needed!
```

## Keep Helper Running

- **Start once:** `pnpm --filter design-system dev:auto-start`
- **Keep terminal open** (helper runs in background)
- **Use plugin anytime** - it handles everything!

## Troubleshooting

### "Cannot connect to helper"
- Make sure helper is running: `pnpm --filter design-system dev:auto-start`
- Check port 3000 is available

### "Helper started but server won't start"
- Check ports 3001-3005 are available
- Look at helper console for errors

---

**🎉 That's it! Just start the helper once, then use the plugin normally!**

