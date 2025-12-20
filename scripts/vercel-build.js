#!/usr/bin/env node
/**
 * Vercel Build Script
 * Builds design system, then Nuxt app, then ensures output is accessible
 */

import { execSync } from 'child_process';
import { existsSync, cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');

process.chdir(repoRoot);

console.log('📦 Step 1: Building design system...');
execSync('pnpm --filter design-system build', { stdio: 'inherit' });

console.log('🚀 Step 2: Building Nuxt app...');
execSync('pnpm --filter nuxt-app build', { stdio: 'inherit' });

console.log('📁 Step 3: Ensuring output is accessible...');
const nuxtOutput = resolve(repoRoot, 'packages/nuxt-app/.vercel/output');
const rootOutput = resolve(repoRoot, '.vercel/output');

if (existsSync(nuxtOutput)) {
  // Ensure .vercel directory exists at root
  mkdirSync(resolve(repoRoot, '.vercel'), { recursive: true });
  
  // Copy output to root
  cpSync(nuxtOutput, rootOutput, { recursive: true, force: true });
  console.log('✅ Output copied to repo root: .vercel/output');
} else {
  console.error('❌ Error: Nuxt output not found at:', nuxtOutput);
  process.exit(1);
}

console.log('✅ Build complete!');

