#!/usr/bin/env node
/**
 * Build script for Vercel deployment
 * Ensures design system is built first, then builds Nuxt app
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const repoRoot = resolve(__dirname, '../..');
const nuxtAppDir = resolve(__dirname, '..');

process.chdir(repoRoot);

console.log('📦 Building design system...');
execSync('pnpm --filter design-system build', { stdio: 'inherit' });

console.log('🚀 Building Nuxt app...');
process.chdir(nuxtAppDir);
execSync('pnpm build', { stdio: 'inherit' });

console.log('✅ Build complete!');
console.log('📁 Output location: packages/nuxt-app/.vercel/output');

