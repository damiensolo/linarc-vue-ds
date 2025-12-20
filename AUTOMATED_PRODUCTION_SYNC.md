# 🚀 Automated Production Token Sync

## Overview

The Figma plugin now supports **two sync modes**:
1. **Local**: Syncs tokens to localhost (for testing)
2. **Production**: Syncs tokens directly to GitHub (triggers Vercel auto-deploy)

## How It Works

### Local Sync (Existing)
```
Figma Plugin → Local Server → Update Files → Restart Dev Server
```

### Production Sync (New)
```
Figma Plugin → Local Server → GitHub API → Create Commit → Vercel Auto-Deploys
```

## Setup

### Step 1: Get GitHub Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `Figma Token Sync`
4. Scopes needed:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token** (starts with `ghp_`)

### Step 2: Build and Load Plugin

```bash
# Build the plugin
pnpm --filter design-system build:plugin

# Load in Figma:
# Plugins → Development → Import plugin from manifest...
# Select: packages/design-system/figma-plugin/dist/manifest.json
```

### Step 3: Start Sync Server

```bash
# Start the sync server (handles both local and production)
pnpm --filter design-system dev:sync-server
```

## Usage

### Local Sync

1. Open Figma plugin
2. **Sync Mode**: Select "Local (localhost)"
3. Click **"Sync Tokens"**
4. Tokens update locally
5. Click **"Restart Dev Server"** to see changes

### Production Sync

1. Open Figma plugin
2. **Sync Mode**: Select "Production (GitHub)"
3. **GitHub Token**: Paste your token (starts with `ghp_`)
4. Click **"Sync Tokens"**
5. Plugin will:
   - Sync tokens locally
   - Create a commit on GitHub
   - Push to your main branch
   - Vercel will auto-deploy within ~30 seconds

## What Happens During Production Sync

1. ✅ **Figma Plugin** fetches variables from Figma
2. ✅ **Sync Server** processes variables and updates token files
3. ✅ **GitHub API** creates a commit with token changes
4. ✅ **GitHub** pushes commit to main branch
5. ✅ **Vercel** detects push and starts deployment
6. ✅ **Vercel** builds and deploys updated site
7. ✅ **Changes go live** automatically!

## Security Notes

- ⚠️ **GitHub Token**: Store securely, never commit to git
- ⚠️ **Token Scope**: Only grant `repo` and `workflow` permissions
- ⚠️ **Token Expiry**: Set expiration date (recommended: 90 days)
- ✅ **Local Sync**: No token needed, safe for testing

## Troubleshooting

### "GitHub token is required"
- Make sure you selected "Production (GitHub)" mode
- Paste your token in the GitHub Token field

### "Failed to sync tokens to production"
- Check your GitHub token is valid
- Verify token has `repo` scope
- Check repository owner/name is correct
- Check build logs in sync server console

### "Failed to create commit"
- Verify you have write access to the repository
- Check the branch name is correct (default: `main`)
- Ensure token has `repo` scope

### Vercel Not Deploying
- Check Vercel dashboard for new deployments
- Verify Vercel is connected to GitHub
- Check Vercel project settings → Git → Production Branch

## Files Changed

- ✅ `packages/design-system/server/production-sync-handler.ts` - GitHub API integration
- ✅ `packages/design-system/server/local-sync-server.ts` - Added production sync endpoint
- ✅ `packages/design-system/figma-plugin/ui.html` - Added sync mode selector
- ✅ `packages/design-system/figma-plugin/code.ts` - Updated to handle both modes

## Next Steps

1. **Test Local Sync**: Make sure it still works
2. **Get GitHub Token**: Follow Step 1 above
3. **Test Production Sync**: Make a small token change and sync
4. **Verify Deployment**: Check Vercel dashboard for auto-deployment
5. **Share with Team**: Document the workflow for designers

---

**🎉 You can now sync tokens directly to production from Figma!**

