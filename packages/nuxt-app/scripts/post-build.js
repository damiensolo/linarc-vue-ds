#!/usr/bin/env node
/**
 * Post-build script for Vercel
 * Copies .vercel/output to repo root so Vercel can find it
 */

import { cpSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nuxtAppDir = resolve(__dirname, '..');
const repoRoot = resolve(__dirname, '../..');
const vercelOutput = resolve(nuxtAppDir, '.vercel/output');
const rootOutput = resolve(repoRoot, '.vercel/output');

if (existsSync(vercelOutput)) {
  console.log('📦 Copying .vercel/output to repo root...');
  cpSync(vercelOutput, rootOutput, { recursive: true, force: true });
  console.log('✅ Output copied successfully');
} else {
  console.warn('⚠️  .vercel/output not found, skipping copy');
}

