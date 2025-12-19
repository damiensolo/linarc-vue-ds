#!/bin/bash
# Build script for Vercel deployment
# Builds design system first, then Nuxt app, then ensures output is in correct location

set -e

# Get the repository root (two levels up from this script)
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO_ROOT"

# Build design system
echo "Building design system..."
pnpm --filter design-system build

# Build Nuxt app
echo "Building Nuxt app..."
cd packages/nuxt-app
pnpm build

# Nuxt creates .vercel/output, but we need to ensure it's accessible
# The output is already in the right place for Vercel when rootDirectory is set
echo "Build complete. Output in .vercel/output"

