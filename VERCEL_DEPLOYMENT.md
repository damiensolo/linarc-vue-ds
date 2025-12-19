# Vercel Deployment Configuration

## Current Configuration

The `vercel.json` is configured for a monorepo structure:

```json
{
  "buildCommand": "pnpm build:ds && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install",
  "framework": "nuxtjs",
  "outputDirectory": "packages/nuxt-app/.output"
}
```

## How It Works

1. **Install**: Runs `pnpm install` from repository root (installs all workspace dependencies)
2. **Build**: 
   - First builds the design system: `pnpm build:ds`
   - Then builds the Nuxt app: `pnpm --filter nuxt-app build`
3. **Output**: Vercel serves from `packages/nuxt-app/.output` (Nuxt 3 SSR output)

## Alternative: Using Root Directory

If the above doesn't work, you can configure Vercel to use `packages/nuxt-app` as the root directory:

### Option 1: Via Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Settings → General
3. **Root Directory**: Set to `packages/nuxt-app`
4. **Build Command**: Leave empty (auto-detected) OR set to `pnpm build`
5. **Install Command**: Set to `cd ../.. && pnpm install`
6. **Output Directory**: Leave empty (auto-detected as `.output`)

### Option 2: Update vercel.json

```json
{
  "buildCommand": "cd ../.. && pnpm build:ds && pnpm --filter nuxt-app build",
  "rootDirectory": "packages/nuxt-app",
  "installCommand": "cd ../.. && pnpm install",
  "framework": "nuxtjs"
}
```

## Troubleshooting

### Error: "Command build:app not found"

**Solution**: The build command should use workspace commands:
- ✅ `pnpm build:ds && pnpm --filter nuxt-app build`
- ❌ `pnpm build:app` (might not work in all contexts)

### Error: "Cannot find module @linarc/design-system"

**Solution**: Ensure design system is built first:
- Build command must include `pnpm build:ds` before building the app

### Error: "Output directory not found"

**Solution**: 
- For SSR: Output directory is `packages/nuxt-app/.output`
- For static: Output directory is `packages/nuxt-app/.output/public`
- Current config uses SSR (`.output`)

### Build Scripts Warning

If you see warnings about ignored build scripts:
- This is normal for some dependencies
- Run `pnpm approve-builds` locally if needed
- Vercel will handle this automatically

## Recommended Settings in Vercel Dashboard

1. **Framework Preset**: Nuxt.js (auto-detected)
2. **Root Directory**: Leave empty (uses repo root) OR set to `packages/nuxt-app`
3. **Build Command**: `pnpm build:ds && pnpm --filter nuxt-app build`
4. **Output Directory**: `packages/nuxt-app/.output`
5. **Install Command**: `pnpm install`
6. **Node.js Version**: 18.x or higher
7. **PNPM Version**: 8.x or higher

## Environment Variables

If you need environment variables:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add variables for Production, Preview, and Development
3. Variables are available during build and runtime

## Testing Locally

Test the Vercel build locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Build (simulates Vercel build)
pnpm build:ds && pnpm --filter nuxt-app build

# Preview
pnpm --filter nuxt-app preview
```

## Next Steps

Once deployment works:
1. ✅ Verify site is accessible
2. ✅ Test automatic deployments on push
3. ✅ Test preview deployments for PRs
4. ✅ Configure custom domain (optional)
5. ✅ Set up production sync from Figma plugin

