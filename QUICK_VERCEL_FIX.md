# Quick Vercel Fix Checklist

## What Should Happen

When you push token changes to GitHub:
1. ✅ Vercel detects the push (within seconds)
2. ✅ Starts a new deployment automatically
3. ✅ Builds your app with new tokens
4. ✅ Deploys the updated site
5. ✅ Changes appear live

## Quick Diagnostic Steps

### Step 1: Check Vercel Dashboard

1. Go to: https://vercel.com/dashboard
2. Click on your project
3. Go to **"Deployments"** tab
4. **Question:** Do you see new deployments when you push?

**If NO deployments appear:**
- ❌ Vercel isn't connected to GitHub
- **Fix:** Settings → Git → Connect Repository

**If deployments appear but fail:**
- ❌ Build is failing
- **Fix:** Click on deployment → Check build logs

**If deployments succeed but changes don't show:**
- ❌ Cache or build issue
- **Fix:** See Step 3 below

### Step 2: Verify Token Files Are Committed

Run this command:
```bash
git ls-files packages/design-system/src/tokens/
```

**Should show:**
- `packages/design-system/src/tokens/figma-tokens.ts`
- `packages/design-system/src/tokens/tailwind-extension.json`

**If files are missing:**
- They're not committed
- **Fix:** `git add packages/design-system/src/tokens/ && git commit -m "sync tokens" && git push`

### Step 3: Force a Fresh Deployment

**Option A: Via Dashboard**
1. Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment
3. **Uncheck** "Use existing Build Cache"
4. Click **"Redeploy"**

**Option B: Via CLI**
```bash
vercel --prod --force
```

### Step 4: Check Build Logs

1. Vercel Dashboard → Deployments → Latest deployment
2. Click **"Build Logs"**
3. Look for:
   - ✅ "📦 Step 1: Building design system..."
   - ✅ "🚀 Step 2: Building Nuxt app..."
   - ✅ "📁 Step 3: Ensuring output is accessible..."
   - ✅ "✅ Build complete!"

**If you see errors:**
- Share the error message and I'll help fix it

## Most Common Issues

### Issue 1: Vercel Not Connected

**Fix:**
1. Vercel Dashboard → Settings → Git
2. If no repository shown → Click "Connect Git Repository"
3. Select your GitHub repo
4. Authorize Vercel

### Issue 2: Wrong Branch

**Fix:**
1. Vercel Dashboard → Settings → Git
2. Check "Production Branch"
3. Should be `main` (or your default branch)
4. If different, change it

### Issue 3: Build Cache

**Fix:**
1. Redeploy with cache cleared (Step 3 above)
2. Or add to `vercel.json`:
```json
{
  "buildCommand": "node scripts/vercel-build.mjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "outputDirectory": ".vercel/output",
  "cleanUrls": true
}
```

## Test Right Now

1. **Check your Vercel dashboard** - Are there deployments?
2. **Check latest deployment** - Did it succeed?
3. **Check build logs** - Any errors?
4. **Force redeploy** - Does it work now?

## Still Not Working?

Share:
1. What you see in Vercel dashboard (deployments tab)
2. Latest deployment status (success/failed)
3. Any error messages from build logs

---

**Quick Test:**
```bash
# Make a small change to test
echo "// test" >> packages/design-system/src/tokens/figma-tokens.ts
git add packages/design-system/src/tokens/figma-tokens.ts
git commit -m "test: trigger deployment"
git push origin main

# Then check Vercel dashboard - should see new deployment within 30 seconds
```

