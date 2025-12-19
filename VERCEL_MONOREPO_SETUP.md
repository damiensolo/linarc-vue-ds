# Vercel Monorepo Setup Instructions

Since `vercel.json` doesn't support `rootDirectory`, you need to configure it in the Vercel Dashboard.

## Dashboard Configuration

1. **Go to Vercel Dashboard** → Your Project → Settings → General

2. **Configure Root Directory**:
   - Scroll to "Root Directory"
   - Click "Edit"
   - Set to: `packages/nuxt-app`
   - Click "Save"

3. **Verify Build Settings** (should auto-detect from `vercel.json`):
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `pnpm --filter design-system build && pnpm --filter nuxt-app build`
   - **Output Directory**: Leave empty (auto-detects `.vercel/output`)
   - **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`

## Alternative: Update vercel.json Build Command

If you prefer to keep everything in `vercel.json`, update the build command to work from the nuxt-app directory:

```json
{
  "buildCommand": "cd ../.. && pnpm --filter design-system build && pnpm build",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nuxtjs"
}
```

Then set Root Directory to `packages/nuxt-app` in the dashboard.

## Current vercel.json

The current `vercel.json` works when Root Directory is set in the dashboard:

```json
{
  "buildCommand": "pnpm --filter design-system build && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nuxtjs"
}
```

**Important**: Set Root Directory to `packages/nuxt-app` in Vercel Dashboard for this to work correctly.

