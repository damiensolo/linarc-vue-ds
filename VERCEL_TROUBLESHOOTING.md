# Vercel Deployment Troubleshooting

## Current Configuration

```json
{
  "buildCommand": "pnpm --filter design-system build && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nuxtjs",
  "outputDirectory": "packages/nuxt-app/.output"
}
```

## Common Issues and Fixes

### Issue: Build Command Not Found

**Error**: `Command "build:ds" not found`

**Fix**: Updated to use explicit workspace filters:
- ✅ `pnpm --filter design-system build` (instead of `pnpm build:ds`)
- ✅ `pnpm --filter nuxt-app build` (explicit workspace command)

### Issue: Module Resolution Errors

**Error**: `Cannot find module '@linarc/design-system'`

**Solution**: 
1. Ensure design system builds first (already in build command)
2. Verify workspace protocol in `packages/nuxt-app/package.json`:
   ```json
   "@linarc/design-system": "workspace:*"
   ```
3. Check that `pnpm-lock.yaml` is committed

### Issue: Output Directory Not Found

**Error**: `Output directory "packages/nuxt-app/.output" not found`

**Possible Causes**:
1. Build failed before creating output
2. Wrong output directory path

**Solution**:
- Verify build completes successfully
- Check build logs for errors
- Ensure Nuxt build creates `.output` directory

### Issue: Installation Fails

**Error**: Installation errors or timeouts

**Solution**:
- Using `--frozen-lockfile` for consistent installs
- Ensure `pnpm-lock.yaml` is committed
- Check pnpm version (Vercel uses pnpm 10.x based on lockfile)

## Alternative Configuration

If the current config doesn't work, try setting root directory in Vercel Dashboard:

### Option 1: Root Directory in Dashboard

1. Go to Vercel Dashboard → Project Settings → General
2. **Root Directory**: Set to `packages/nuxt-app`
3. **Build Command**: `cd ../.. && pnpm --filter design-system build && cd packages/nuxt-app && pnpm build`
4. **Output Directory**: `.output` (relative to root directory)
5. **Install Command**: `cd ../.. && pnpm install --frozen-lockfile`

### Option 2: Updated vercel.json with Root Directory

```json
{
  "buildCommand": "cd ../.. && pnpm --filter design-system build && cd packages/nuxt-app && pnpm build",
  "rootDirectory": "packages/nuxt-app",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nuxtjs",
  "outputDirectory": ".output"
}
```

## Verification Steps

1. **Check build logs** in Vercel Dashboard:
   - Look for "Running buildCommand"
   - Verify design system builds first
   - Check Nuxt build completes

2. **Verify output**:
   - Check that `.output` directory is created
   - Verify it contains server files (not just `public`)

3. **Test locally**:
   ```bash
   pnpm --filter design-system build
   pnpm --filter nuxt-app build
   ls packages/nuxt-app/.output
   ```

## Debugging

### Enable Verbose Logging

Add to `vercel.json`:
```json
{
  "buildCommand": "pnpm --filter design-system build && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nuxtjs",
  "outputDirectory": "packages/nuxt-app/.output",
  "devCommand": "pnpm --filter nuxt-app dev"
}
```

### Check Build Logs

In Vercel Dashboard:
1. Go to Deployments
2. Click on failed deployment
3. Check "Build Logs" tab
4. Look for specific error messages

### Common Error Patterns

1. **"Command not found"**: Script name issue → Use explicit workspace filters
2. **"Module not found"**: Dependency issue → Check workspace protocol
3. **"Output not found"**: Build failed → Check build logs
4. **"Timeout"**: Build too slow → Optimize build or increase timeout

## Next Steps

If issues persist:
1. Check Vercel build logs for specific errors
2. Test build locally with same commands
3. Try alternative configuration (root directory approach)
4. Contact Vercel support with build logs

