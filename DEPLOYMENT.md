# Deployment Guide

This project supports deployment to both **Vercel** (recommended) and **GitHub Pages**. Both platforms are configured and ready to use.

## Quick Start

### Vercel (Recommended - 5 minutes)

1. **Install Vercel CLI** (optional, for local testing):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Nuxt 3
   - Click "Deploy"

3. **Deploy via CLI** (alternative):
   ```bash
   vercel
   ```

4. **That's it!** Your site will be live at `https://your-project.vercel.app`

**Features:**
- ✅ Automatic deployments on every push to `main`
- ✅ Preview deployments for every PR
- ✅ Zero configuration needed
- ✅ Global CDN
- ✅ Free tier with generous limits

### GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository Settings → Pages
   - Source: "GitHub Actions"

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

## Deployment Configuration

### Vercel Configuration

The `vercel.json` file configures:
- Build command: `pnpm build:app`
- Output directory: `packages/nuxt-app/.output/public`
- Framework: Nuxt.js (auto-detected)

**Custom Domain:**
1. Go to Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### GitHub Pages Configuration

The `.github/workflows/deploy.yml` workflow:
- Builds design system first
- Generates static site using `nuxt generate`
- Deploys to GitHub Pages automatically

**Custom Domain:**
1. Create `CNAME` file in `packages/nuxt-app/public/` with your domain
2. Configure DNS records as per GitHub Pages documentation
3. Update `nuxt.config.ts` `app.baseURL` if needed

## Environment Variables

### Vercel

Set environment variables in Vercel Dashboard:
- Project Settings → Environment Variables
- Available for Production, Preview, and Development

### GitHub Pages

Set environment variables in GitHub:
- Repository Settings → Secrets and variables → Actions
- Add secrets as needed

## Build Process

### Local Build (Testing)

**For Vercel (SSR):**
```bash
pnpm build:app
pnpm --filter nuxt-app preview
```

**For GitHub Pages (SSG):**
```bash
pnpm build:ds
pnpm --filter nuxt-app generate
pnpm --filter nuxt-app preview
```

### Production Build

Both platforms handle builds automatically:
- **Vercel**: Runs `pnpm build:app` (SSR)
- **GitHub Pages**: Runs `pnpm build:ds && pnpm --filter nuxt-app generate` (SSG)

## Preview Deployments

### Vercel

Every pull request automatically gets a preview deployment:
- URL format: `https://your-project-git-branch.vercel.app`
- Share preview URL in PR comments
- Preview updates automatically on new commits

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

**404 errors:**
- Check `vercel.json` rewrites configuration
- Ensure Nuxt routing is configured correctly

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
2. **Test locally**: `pnpm dev`
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: update design tokens"
   git push origin main
   ```
4. **Automatic deployment**:
   - Vercel: Deploys immediately
   - GitHub Pages: Deploys via GitHub Actions

### With Production Sync (Coming Soon)

1. **Designer updates tokens** in Figma
2. **Sync to production** via Figma plugin
3. **Plugin creates PR** with token changes
4. **Preview deployment** automatically created
5. **Review and merge** PR
6. **Production deployment** automatically triggered

## Monitoring

### Vercel

- **Analytics**: Built-in in Vercel Dashboard
- **Logs**: Available in project dashboard
- **Performance**: Real-time metrics

### GitHub Pages

- **Actions Logs**: Check `.github/workflows/deploy.yml` runs
- **Pages Status**: Repository Settings → Pages

## Best Practices

1. **Always test locally** before pushing
2. **Use preview deployments** for review
3. **Monitor build times** and optimize if needed
4. **Set up custom domains** for production
5. **Use environment variables** for secrets
6. **Enable branch protection** on `main` branch

## Next Steps

Once deployment is working:
1. ✅ Set up custom domain (optional)
2. ✅ Configure environment variables
3. ✅ Enable production sync from Figma plugin
4. ✅ Set up monitoring and analytics
5. ✅ Configure branch protection rules

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)
- **Nuxt Deployment**: [nuxt.com/docs/getting-started/deployment](https://nuxt.com/docs/getting-started/deployment)

