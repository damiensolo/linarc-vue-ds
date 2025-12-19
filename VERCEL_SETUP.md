# Vercel Deployment Setup

## Quick Setup (5 minutes)

### Option 1: Via Dashboard (Recommended)

1. **Go to Vercel**: [vercel.com](https://vercel.com)
2. **Sign in** with GitHub
3. **Add New Project**:
   - Click "Add New Project"
   - Import your `linarc-vue-ds` repository
4. **Configure** (Vercel auto-detects most settings):
   - **Framework Preset**: Nuxt.js (auto-detected)
   - **Root Directory**: Leave empty (uses repo root)
   - **Build Command**: `pnpm build:ds && pnpm --filter nuxt-app build` (from `vercel.json`)
   - **Output Directory**: `packages/nuxt-app/.output` (from `vercel.json`)
   - **Install Command**: `pnpm install` (from `vercel.json`)
5. **Deploy**: Click "Deploy"
6. **Done!** Your site is live at `https://your-project.vercel.app`

### Option 2: Via CLI

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy (from project root)
vercel

# Follow prompts:
# - Link to existing project or create new
# - Confirm settings
# - Deploy

# Deploy to production
vercel --prod
```

## Configuration

The `vercel.json` file contains:

```json
{
  "buildCommand": "pnpm build:ds && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install",
  "framework": "nuxtjs",
  "outputDirectory": "packages/nuxt-app/.output"
}
```

**Why this works:**
- `buildCommand`: Builds design system first, then Nuxt app (SSR)
- `installCommand`: Installs all workspace dependencies
- `outputDirectory`: Points to Nuxt's SSR output directory
- `framework`: Tells Vercel this is a Nuxt project

## Monorepo Structure

Vercel handles the monorepo correctly because:
1. **Root directory**: Uses repo root (allows workspace commands)
2. **Build command**: Uses pnpm workspace filters
3. **Dependencies**: Installs from root `package.json` (workspace protocol)

## Troubleshooting

### Build Fails: "Command build:app not found"

**Solution**: The `vercel.json` uses the correct command:
```json
"buildCommand": "pnpm build:ds && pnpm --filter nuxt-app build"
```

This ensures:
- Design system builds first (required dependency)
- Nuxt app builds using workspace filter
- Works from repository root

### Build Fails: "Cannot find module @linarc/design-system"

**Solution**: Ensure design system is built first:
- The build command includes `pnpm build:ds` first
- This builds the design system before the Nuxt app
- Workspace protocol (`workspace:*`) resolves correctly

### Output Directory Not Found

**Solution**: 
- For SSR: Output is `packages/nuxt-app/.output` ✅
- For static: Output would be `packages/nuxt-app/.output/public`
- Current config uses SSR (`.output`)

### Build Scripts Warning

If you see warnings about ignored build scripts:
- This is normal for some dependencies
- Vercel handles this automatically
- Not a blocking issue

## Environment Variables

Set in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add variables for:
   - **Production**: Live site
   - **Preview**: PR previews
   - **Development**: Local development

## Custom Domain

1. Go to Vercel Dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain
4. Follow DNS configuration instructions
5. Vercel handles SSL automatically

## Preview Deployments

Every PR automatically gets a preview:
- URL: `https://your-project-git-branch.vercel.app`
- Full SSR support
- Share URL in PR comments
- Updates automatically on new commits

## Monitoring

- **Analytics**: Built-in in dashboard
- **Logs**: Real-time in project dashboard
- **Performance**: Metrics and insights
- **Deployments**: History and rollback

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Verify site is accessible
3. ✅ Test automatic deployments
4. ✅ Set up custom domain (optional)
5. ✅ Configure environment variables
6. ✅ Enable production sync from Figma plugin

---

**Status**: ✅ Ready for Vercel deployment

