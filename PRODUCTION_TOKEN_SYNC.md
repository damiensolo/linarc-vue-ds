# Production Token Sync Workflow

Complete guide for syncing design tokens from Figma to production (GitHub) with automated deployment.

## Overview

This workflow enables designers to sync token changes from Figma directly to production, creating a Pull Request for review before deployment.

## Architecture

```
Figma Plugin → GitHub API → Create PR → Review → Merge → Auto-Deploy
```

## Prerequisites

1. ✅ **Deployment working** (Vercel/GitHub Pages)
2. ✅ **Local sync working** (Figma plugin + local server)
3. ✅ **GitHub Personal Access Token** (for creating PRs)
4. ✅ **GitHub repository** with write access

## Setup Steps

### Step 1: Create GitHub Personal Access Token

1. Go to: **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Name: `Figma Token Sync`
4. Scopes needed:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### Step 2: Store Token Securely

**Option A: Environment Variable (Recommended for local development)**

Add to your `.env.local` file (create if doesn't exist):
```bash
GITHUB_TOKEN=your_token_here
```

**Option B: GitHub Secrets (For CI/CD)**

1. Go to your repository → **Settings → Secrets and variables → Actions**
2. Click **"New repository secret"**
3. Name: `FIGMA_SYNC_TOKEN`
4. Value: Your GitHub token
5. Click **"Add secret"**

### Step 3: Update Figma Plugin UI

The plugin UI needs a toggle for "Sync Mode":
- **Local**: Syncs to localhost (current behavior)
- **Production**: Syncs to GitHub (creates PR)

### Step 4: Create Production Sync Server Endpoint

Add a new endpoint to handle GitHub PR creation.

### Step 5: Test the Workflow

1. Make a token change in Figma
2. Sync via plugin (Production mode)
3. Verify PR is created
4. Review and merge PR
5. Verify auto-deployment triggers

## Workflow Details

### Local Sync (Current)

```
Figma Plugin → Local Server (localhost:3001) → Update Files → Restart Dev Server
```

### Production Sync (New)

```
Figma Plugin → Production Server → GitHub API → Create PR → Auto-Deploy on Merge
```

## Implementation Plan

### Phase 1: GitHub API Integration

1. Create `packages/design-system/server/production-sync-server.ts`
2. Add endpoint: `POST /api/sync-to-github`
3. Implement GitHub API client
4. Create PR with token changes

### Phase 2: Update Figma Plugin

1. Add sync mode selector (Local/Production)
2. Add GitHub token input field
3. Update UI to show PR creation status
4. Handle both sync modes

### Phase 3: CI/CD Integration

1. Update GitHub Actions workflow
2. Trigger deployment on PR merge
3. Add status checks

## Next Steps

1. **Set up GitHub token** (Step 1-2 above)
2. **Implement production sync server** (I can help with this)
3. **Update Figma plugin** (I can help with this)
4. **Test end-to-end workflow**

---

**Ready to proceed?** Let me know which step you'd like to start with!

