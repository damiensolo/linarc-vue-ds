# Deployment Guide

This project supports deployment to both **Vercel** (recommended) and **GitHub Pages** (backup). Both platforms are configured and ready to use.

## Quick Start

### Vercel (Recommended - Primary)

**Option 1: Via Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `linarc-vue-ds` repository
4. Vercel will auto-detect Nuxt 3
5. **Configure settings**:
   - **Root Directory**: Leave empty (uses repo root)
   - **Build Command**: `pnpm build:ds && pnpm --filter nuxt-app build`
   - **Output Directory**: `packages/nuxt-app/.output`
   - **Install Command**: `pnpm install`
   - **Framework Preset**: Nuxt.js (auto-detected)
6. Click **"Deploy"**
7. Your site is live! 🎉

**Option 2: Via CLI**

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

**Features:**

- ✅ Automatic deployments on every push to `main`
- ✅ Preview deployments for every PR
- ✅ Zero configuration needed (uses `vercel.json`)
- ✅ Global CDN
- ✅ Free tier with generous limits
- ✅ SSR (Server-Side Rendering) support

### GitHub Pages (Backup - Static)

1. **Enable GitHub Pages**:

   - Go to your repository Settings → Pages
   - Source: Select **"GitHub Actions"**

2. **Push to main branch**:

   ```bash
   git push origin main
   ```

3. **Wait for deployment**:
   - Check Actions tab for deployment status
   - Your site will be live at `https://your-username.github.io/linarc-vue-ds/`

**Features:**

- ✅ Free hosting
- ✅ Automatic deployments on push to `main`
- ✅ Integrated with GitHub workflow
- ✅ Uses static site generation (SSG)
- ✅ Good backup option if Vercel is unavailable

## Deployment Configuration

### Vercel Configuration

The `vercel.json` file configures:

- **Build Command**: `pnpm build:ds && pnpm --filter nuxt-app build`
- **Output Directory**: `packages/nuxt-app/.output` (SSR)
- **Framework**: Nuxt.js (auto-detected)
- **Install Command**: `pnpm install`

**How it works:**

1. Installs all dependencies (monorepo workspace)
2. Builds design system first (required dependency)
3. Builds Nuxt app (SSR mode)
4. Serves from `.output` directory

**Custom Domain:**

1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### GitHub Pages Configuration

The `.github/workflows/deploy.yml` workflow:

- Builds design system first
- Generates static site using `nuxt generate` (SSG)
- Deploys to GitHub Pages automatically

**Workflow Steps:**

1. Checkout repository
2. Setup pnpm and Node.js
3. Install dependencies
4. Build design system
5. Generate static site (SSG)
6. Upload artifact to GitHub Pages
7. Deploy to GitHub Pages

**Custom Domain:**

1. Create `CNAME` file in `packages/nuxt-app/public/` with your domain
2. Configure DNS records as per GitHub Pages documentation
3. Update `nuxt.config.ts` `app.baseURL` if needed

## Build Process

### Local Build (Testing)

**For Vercel (SSR):**

```bash
pnpm build:ds
pnpm --filter nuxt-app build
pnpm --filter nuxt-app preview
```

**For GitHub Pages (SSG):**

```bash
pnpm build:pages
pnpm preview
```

**Step by step:**

```bash
# 1. Build design system
pnpm build:ds

# 2a. Build Nuxt (SSR for Vercel)
pnpm --filter nuxt-app build

# 2 b. Generate static (SSG for GitHub Pages)
pnpm --filter nuxt-app generate

# 3. Preview
pnpm preview
```

### Production Build

**Vercel:**

- Automatically runs `pnpm build:ds && pnpm --filter nuxt-app build` (SSR)
- Serves from `packages/nuxt-app/.output`

**GitHub Pages:**

- Automatically runs `pnpm build:ds && pnpm --filter nuxt-app generate` (SSG)
- Serves from `packages/nuxt-app/.output/public`

## Environment Variables

### Vercel

Set environment variables in Vercel Dashboard:

- Project Settings → Environment Variables
- Available for Production, Preview, and Development
- Automatically injected during build and runtime

### GitHub Pages

Set environment variables in GitHub:

- Repository Settings → Secrets and variables → Actions
- Add secrets as needed
- Access in workflow with `${{ secrets.SECRET_NAME }}`

## Preview Deployments

### Vercel

Every pull request automatically gets a preview deployment:

- URL format: `https://your-project-git-branch.vercel.app`
- Share preview URL in PR comments
- Preview updates automatically on new commits
- Full SSR support in previews

### GitHub Pages

Currently deploys only from `main` branch. To enable PR previews:

1. Update `.github/workflows/deploy.yml` to add PR preview job
2. Use GitHub Actions artifacts for PR previews
3. Or use Vercel for previews, GitHub Pages for production

## Troubleshooting

### Vercel Deployment Issues

**Build fails:**

- Check build logs in Vercel Dashboard
- Ensure `pnpm` is used (configured in `vercel.json`)
- Verify all dependencies are in `package.json`
- Check that design system builds first

**"Command build:app not found":**

- ✅ Fixed: Using `pnpm build:ds && pnpm --filter nuxt-app build`
- This ensures design system is built before Nuxt app

**404 errors:**

- Vercel auto-handles Nuxt routing
- Check that `outputDirectory` is `packages/nuxt-app/.output`
- Verify Nuxt routing is configured correctly

**Module resolution errors:**

- Ensure design system is built first
- Check workspace dependencies are correct
- Verify `@linarc/design-system` is in `package.json`

### GitHub Pages Issues

**Build fails:**

- Check GitHub Actions logs
- Ensure `pnpm-lock.yaml` is committed
- Verify Node.js version (18+) in workflow

**404 errors:**

- Check `app.baseURL` in `nuxt.config.ts`
- Ensure repository name matches base URL
- Verify GitHub Pages is enabled in repository settings

**Assets not loading:**

- Check that `baseURL` is correct for your repository structure
- For root domain: `baseURL: "/"`
- For subdirectory: `baseURL: "/repository-name/"`

## Deployment Workflow

### Standard Workflow

1. **Make changes** in your code
2. **Test locally**:

   ```bash
   # For Vercel (SSR)
   pnpm build:ds && pnpm --filter nuxt-app build
   pnpm preview

   # For GitHub Pages (SSG)
   pnpm build:pages
   pnpm preview
   ```

3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: update design tokens"
   git push origin main
   ```
4. **Automatic deployment**:
   - **Vercel**: Deploys immediately (SSR)
   - **GitHub Pages**: Deploys via GitHub Actions (SSG)

### With Production Sync (Coming Soon)

1. **Designer updates tokens** in Figma
2. **Sync to production** via Figma plugin
3. **Plugin creates PR** with token changes
4. **Preview deployment** automatically created (Vercel)
5. **Review and merge** PR
6. **Production deployment** automatically triggered (both platforms)

## Monitoring

### Vercel

- **Analytics**: Built-in in Vercel Dashboard
- **Logs**: Available in project dashboard
- **Performance**: Real-time metrics
- **Deployments**: History and rollback options

### GitHub Pages

- **Actions Logs**: Check `.github/workflows/deploy.yml` runs
- **Pages Status**: Repository Settings → Pages
- **Deployment History**: Actions tab → Deploy to GitHub Pages workflow

## Best Practices

1. **Always test locally** before pushing

   ```bash
   # Test Vercel build
   pnpm build:ds && pnpm --filter nuxt-app build

   # Test GitHub Pages build
   pnpm build:pages
   ```

2. **Use preview deployments** for review (Vercel)

3. **Monitor build times** and optimize if needed

4. **Set up custom domains** for production

5. **Use environment variables** for secrets

6. **Enable branch protection** on `main` branch

7. **Keep both platforms** as backup options

## Platform Comparison

| Feature                 | Vercel             | GitHub Pages    |
| ----------------------- | ------------------ | --------------- |
| **Rendering**           | SSR (Server-Side)  | SSG (Static)    |
| **Preview Deployments** | ✅ Automatic (PRs) | ⚠️ Manual setup |
| **Build Speed**         | Fast               | Moderate        |
| **CDN**                 | Global             | GitHub CDN      |
| **Free Tier**           | Generous           | Unlimited       |
| **Custom Domain**       | ✅ Easy            | ✅ Supported    |
| **Best For**            | Primary deployment | Backup/Static   |

## Next Steps

Once deployment is working:

1. ✅ Set up custom domain (optional)
2. ✅ Configure environment variables
3. ✅ Enable production sync from Figma plugin
4. ✅ Set up monitoring and analytics
5. ✅ Configure branch protection rules
6. ✅ Test both platforms

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
- **Nuxt Deployment**: [nuxt.com/docs/getting-started/deployment](https://nuxt.com/docs/getting-started/deployment)
