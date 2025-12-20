# Vercel Deployment Troubleshooting

## What Should Happen

When you push to GitHub, Vercel should:
1. ✅ Detect the push (if connected to GitHub)
2. ✅ Trigger a new deployment
3. ✅ Run the build command: `node scripts/vercel-build.mjs`
4. ✅ Deploy the updated site
5. ✅ Show changes live

## Common Issues & Fixes

### Issue 1: Vercel Not Connected to GitHub

**Symptoms:**
- No deployments appear in Vercel dashboard
- Pushing to GitHub doesn't trigger builds

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Verify repository is connected
3. If not connected:
   - Click "Connect Git Repository"
   - Select your GitHub repository
   - Authorize Vercel

### Issue 2: Wrong Branch Watched

**Symptoms:**
- Deployments only happen on certain branches
- Pushing to `main` doesn't trigger deployment

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Git
2. Check "Production Branch" setting
3. Ensure it's set to `main` (or your default branch)
4. Check "Deploy Hooks" if you want to deploy other branches

### Issue 3: Build Failing Silently

**Symptoms:**
- Deployments appear but fail
- No error messages visible

**Fix:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the build logs for errors
4. Common issues:
   - Build script not found
   - Missing dependencies
   - TypeScript errors
   - Path resolution issues

### Issue 4: Token Changes Not Included in Build

**Symptoms:**
- Build succeeds but tokens don't update
- Old token values still showing

**Fix:**
1. Verify token files are committed:
   ```bash
   git ls-files packages/design-system/src/tokens/
   ```
2. Check if tokens are in `.gitignore` (they shouldn't be)
3. Ensure build script processes tokens correctly
4. Check Tailwind config loads tokens dynamically

### Issue 5: Cache Issues

**Symptoms:**
- Changes don't appear even after successful build
- Old content still showing

**Fix:**
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click "Redeploy" → "Use existing Build Cache" → **Uncheck**
3. Or clear cache via CLI:
   ```bash
   vercel --force
   ```

## Step-by-Step Debugging

### Step 1: Verify Vercel Connection

```bash
# Check if Vercel CLI is connected
vercel whoami

# List projects
vercel ls

# Check project settings
vercel inspect
```

### Step 2: Check Recent Deployments

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Check if new deployments appear when you push

### Step 3: Verify Build Command

Check `vercel.json`:
```json
{
  "buildCommand": "node scripts/vercel-build.mjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".vercel/output"
}
```

### Step 4: Test Build Locally

```bash
# Test the exact build command Vercel uses
node scripts/vercel-build.mjs

# Check if output is created
ls -la .vercel/output
```

### Step 5: Check Build Logs

1. Go to Vercel Dashboard → Deployments
2. Click on latest deployment
3. Check "Build Logs" tab
4. Look for:
   - ✅ "Build complete"
   - ❌ Any error messages
   - ⚠️ Warnings about missing files

## Quick Fixes

### Force a New Deployment

```bash
# Via CLI
vercel --prod

# Or trigger via dashboard
# Deployments → Redeploy → Use existing Build Cache (unchecked)
```

### Verify Token Files Are Committed

```bash
# Check if token files are tracked
git ls-files packages/design-system/src/tokens/

# Should show:
# packages/design-system/src/tokens/figma-tokens.ts
# packages/design-system/src/tokens/tailwind-extension.json
# packages/design-system/src/tokens/index.ts
```

### Check What Branch Vercel Is Watching

1. Vercel Dashboard → Settings → Git
2. Production Branch: Should be `main`
3. Preview Branches: Check if your branch is included

## Expected Workflow

1. **Make token changes** in Figma
2. **Sync locally** (test first)
3. **Commit changes:**
   ```bash
   git add packages/design-system/src/tokens/
   git commit -m "chore: sync tokens from Figma"
   git push origin main
   ```
4. **Vercel should:**
   - Detect push within seconds
   - Start building automatically
   - Deploy when build completes
   - Show new deployment in dashboard

## Still Not Working?

1. **Check Vercel Dashboard:**
   - Are there any deployments?
   - Do they show errors?
   - What's the build status?

2. **Check GitHub:**
   - Are commits actually pushed?
   - Is the branch correct?
   - Are token files in the commit?

3. **Check Build Script:**
   - Does `scripts/vercel-build.mjs` exist?
   - Does it run locally?
   - Does it create `.vercel/output`?

4. **Manual Trigger:**
   ```bash
   vercel --prod
   ```

---

**Next Steps:** Check your Vercel dashboard and share what you see!

