# Vercel Deployment - DEFINITIVE FIX

## The Problem
Vercel can't find the output directory because we're in a monorepo and Nuxt creates `.vercel/output` in `packages/nuxt-app/`, but Vercel looks from the repo root.

## The Solution
**You MUST set the Root Directory in Vercel Dashboard.** This is the ONLY way to make monorepos work with Vercel.

### Step-by-Step Fix:

1. **Go to Vercel Dashboard**: https://vercel.com
2. **Select your project**: `linarc-vue-ds`
3. **Go to Settings** → **General**
4. **Find "Root Directory"** section
5. **Click "Edit"**
6. **Set to**: `packages/nuxt-app`
7. **Click "Save"**

### What This Does:
- Tells Vercel that `packages/nuxt-app` is the project root
- Vercel will look for `.vercel/output` in that directory (which Nuxt creates)
- Build commands run from repo root (for workspace commands to work)
- Output is found automatically

### Current Configuration:

**Root `vercel.json`** (for reference, but Root Directory setting overrides):
```json
{
  "buildCommand": "pnpm --filter design-system build && pnpm --filter nuxt-app build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nuxtjs"
}
```

**`packages/nuxt-app/vercel.json`** (alternative, if you want project-specific config):
```json
{
  "buildCommand": "cd ../.. && pnpm --filter design-system build && cd packages/nuxt-app && pnpm build",
  "installCommand": "cd ../.. && pnpm install --frozen-lockfile",
  "framework": "nuxtjs"
}
```

## Why This Is Required

Vercel's `vercel.json` does NOT support `rootDirectory` property. It MUST be set in the dashboard for monorepos. This is a Vercel limitation, not a code issue.

## After Setting Root Directory

1. **Redeploy** your project
2. **Build should succeed**
3. **Output will be found** at `packages/nuxt-app/.vercel/output`

## Verification

After setting Root Directory, the build should:
- ✅ Install dependencies from repo root
- ✅ Build design system first
- ✅ Build Nuxt app
- ✅ Find output at `.vercel/output` (relative to `packages/nuxt-app`)
- ✅ Deploy successfully

---

**This is the ONLY way to fix Vercel monorepo deployments. There is no code-only solution.**

