# Deployment Quick Start

## 🚀 Vercel (Recommended - 5 minutes)

### Option 1: Via Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `linarc-vue-ds` repository
4. Vercel will auto-detect Nuxt 3 - **no configuration needed!**
5. Click **"Deploy"**
6. Your site is live! 🎉

### Option 2: Via CLI

```bash
# Install Vercel CLI (one-time)
npm i -g vercel

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

**That's it!** Your site will be at `https://your-project.vercel.app`

---

## 📄 GitHub Pages (Free Alternative)

### Setup Steps

1. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Select **"GitHub Actions"**
   - Click Save

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "chore: add deployment configuration"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to Actions tab in GitHub
   - Watch the "Deploy to GitHub Pages" workflow
   - When complete, your site is at:
     - `https://your-username.github.io/linarc-vue-ds/`
     - OR your custom domain if configured

### Manual Build (for testing)

```bash
# Build for GitHub Pages
pnpm build:pages

# Preview locally
pnpm preview
```

---

## ✅ Verify Deployment

### Vercel
- Check Vercel Dashboard → Deployments
- Each push to `main` auto-deploys
- Each PR gets a preview URL

### GitHub Pages
- Check GitHub → Actions tab
- Look for "Deploy to GitHub Pages" workflow
- Green checkmark = deployed successfully

---

## 🔧 Troubleshooting

### Vercel Build Fails
- Check build logs in Vercel Dashboard
- Ensure `pnpm` is installed (configured in `vercel.json`)
- Verify all dependencies are in `package.json`

### GitHub Pages Build Fails
- Check Actions tab for error logs
- Ensure `pnpm-lock.yaml` is committed
- Verify Node.js 18+ is used (configured in workflow)

### 404 Errors
- **Vercel**: Check `vercel.json` rewrites
- **GitHub Pages**: Check `app.baseURL` in `nuxt.config.ts`
  - For root: `baseURL: "/"`
  - For subdirectory: `baseURL: "/repository-name/"`

---

## 📋 Next Steps

Once deployment is working:

1. ✅ **Test both platforms** - verify sites are live
2. ✅ **Set up custom domain** (optional)
3. ✅ **Configure environment variables** if needed
4. ✅ **Enable production sync** from Figma plugin
5. ✅ **Set up branch protection** on `main`

---

## 📚 Full Documentation

See [`DEPLOYMENT.md`](DEPLOYMENT.md) for:
- Detailed configuration
- Custom domain setup
- Environment variables
- Preview deployments
- Advanced troubleshooting

