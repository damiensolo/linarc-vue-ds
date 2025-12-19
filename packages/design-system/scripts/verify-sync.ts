#!/usr/bin/env tsx
/**
 * Verify Token Sync
 * 
 * Checks if tokens are synced correctly and shows current values
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🔍 Verifying Token Sync...\n')

// Check TypeScript tokens
const tokensPath = resolve(__dirname, '../src/tokens/figma-tokens.ts')
const tokensContent = readFileSync(tokensPath, 'utf-8')
const indigoMatch = tokensContent.match(/'indigo-600':\s*'([^']+)'/)
const indigoValue = indigoMatch ? indigoMatch[1] : 'NOT FOUND'

console.log('📄 figma-tokens.ts:')
console.log(`   indigo-600: ${indigoValue}`)
if (indigoValue === '#e54646') {
  console.log('   ✅ Correct (RED - synced from Figma)')
} else if (indigoValue === '#4f46e5') {
  console.log('   ⚠️  Old value (PURPLE - needs sync)')
} else {
  console.log('   ❌ Unexpected value')
}

// Check JSON extension
const extensionPath = resolve(__dirname, '../src/tokens/tailwind-extension.json')
const extensionContent = JSON.parse(readFileSync(extensionPath, 'utf-8'))
const jsonIndigo = extensionContent.colors?.['indigo-600']

console.log('\n📄 tailwind-extension.json:')
console.log(`   indigo-600: ${jsonIndigo || 'NOT FOUND'}`)
if (jsonIndigo === '#e54646') {
  console.log('   ✅ Correct (RED - synced from Figma)')
} else if (jsonIndigo === '#4f46e5') {
  console.log('   ⚠️  Old value (PURPLE - needs sync)')
} else {
  console.log('   ❌ Unexpected value')
}

// Verify match
if (indigoValue === jsonIndigo) {
  console.log('\n✅ Token files are in sync!')
} else {
  console.log('\n❌ Token files are OUT OF SYNC!')
  console.log('   Run sync script to fix.')
}

console.log('\n💡 Next steps:')
console.log('   1. Restart dev server: pnpm dev')
console.log('   2. Visit: http://localhost:3000/test-token-sync')
console.log('   3. Check if colors are RED (#e54646)')

