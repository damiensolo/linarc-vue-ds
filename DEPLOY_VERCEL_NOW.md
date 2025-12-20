# ✅ Vercel Deployment - READY TO DEPLOY

## What's Fixed

1. **Custom Build Script**: `scripts/vercel-build.js` that:
   - Builds the design system first
   - Builds the Nuxt app
   - Copies `.vercel/output` from `packages/nuxt-app/` to repo root
   - Ensures Vercel can find the output

2. **Updated `vercel.json`**:
   - Uses the custom build script
   - Points to `.vercel/output` at repo root
   - Configured for monorepo with pnpm

## Next Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Import your repository**: `damiensolo/linarc-vue-ds`
3. **Configure Project**:
   - **Framework Preset**: Nuxt.js (auto-detected)
   - **Root Directory**: Leave empty (uses repo root)
   - **Build Command**: `node scripts/vercel-build.mjs` (already in vercel.json)
   - **Output Directory**: `.vercel/output` (already in vercel.json)
   - **Install Command**: `pnpm install --frozen-lockfile` (already in vercel.json)

4. **Click "Deploy"**

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from repo root)
vercel

# For production deployment
vercel --prod
```

## What Happens During Build

1. ✅ Vercel installs dependencies: `pnpm install --frozen-lockfile`
2. ✅ Build script runs: `node scripts/vercel-build.mjs`
3. ✅ Design system builds: `pnpm --filter design-system build`
4. ✅ Nuxt app builds: `pnpm --filter nuxt-app build`
5. ✅ Output copied to repo root: `packages/nuxt-app/.vercel/output` → `.vercel/output`
6. ✅ Vercel finds output at `.vercel/output` and deploys

## Verification

After deployment, check:
- ✅ Build completes without errors
- ✅ Application is accessible at your Vercel URL
- ✅ All pages load correctly
- ✅ Design system components render properly

## Troubleshooting

If build fails:

1. **Check build logs** in Vercel dashboard
2. **Verify Node version**: Should be 18+ (set in Vercel project settings)
3. **Check pnpm version**: Should be 8+ (auto-detected from lockfile)
4. **Verify script exists**: `scripts/vercel-build.mjs` should be in repo root

## Current Configuration

**`vercel.json`**:
```json
{
  "buildCommand": "node scripts/vercel-build.mjs",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nuxtjs",
  "outputDirectory": ".vercel/output"
}
```

**`scripts/vercel-build.mjs`**:
- Builds design system
- Builds Nuxt app
- Copies output to repo root

---

**🚀 You're ready to deploy!**

