# 🚀 Production Sync Setup Guide

## Quick Start

### 1. Get GitHub Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Figma Token Sync`
4. Scopes: ✅ `repo`, ✅ `workflow`
5. Copy token (starts with `ghp_`)

### 2. Build Plugin

```bash
pnpm --filter design-system build:plugin
```

### 3. Load Plugin in Figma

1. Open Figma Desktop
2. **Plugins → Development → Import plugin from manifest...**
3. Select: `packages/design-system/figma-plugin/dist/manifest.json`

### 4. Start Sync Server

```bash
pnpm --filter design-system dev:sync-server
```

### 5. Use Production Sync

1. Run plugin: **Plugins → Development → Design Token Sync**
2. **Sync Mode**: Select "Production (GitHub)"
3. **GitHub Token**: Paste your token
4. Click **"Sync Tokens"**
5. ✅ Tokens commit to GitHub → Vercel auto-deploys!

## How It Works

```
Figma Plugin
    ↓
Sync Server (localhost:3001)
    ↓
GitHub API (creates commit)
    ↓
GitHub Repository (main branch)
    ↓
Vercel (detects push)
    ↓
Auto-Deploy (live site updated!)
```

## Features

- ✅ **Two Sync Modes**: Local (test) or Production (deploy)
- ✅ **GitHub Integration**: Direct commits via GitHub API
- ✅ **Auto-Deploy**: Vercel automatically deploys on push
- ✅ **Secure**: Token stored only in plugin (not committed)
- ✅ **Fast**: Changes live in ~30 seconds

## Troubleshooting

### Token Issues
- Make sure token starts with `ghp_`
- Verify token has `repo` scope
- Check token hasn't expired

### GitHub API Errors
- Verify repository owner/name is correct
- Check you have write access
- Ensure branch name is correct (default: `main`)

### Vercel Not Deploying
- Check Vercel dashboard for deployments
- Verify Vercel is connected to GitHub
- Check Production Branch setting in Vercel

---

**Ready to sync?** Follow the Quick Start steps above!

