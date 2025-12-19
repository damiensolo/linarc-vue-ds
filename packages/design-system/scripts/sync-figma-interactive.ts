#!/usr/bin/env tsx
/**
 * Interactive Figma Token Sync
 * 
 * This script provides an interactive way to sync tokens.
 * It will prompt you to paste Figma variables or use Cursor AI.
 * 
 * Usage:
 * pnpm --filter design-system sync:figma:interactive
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function interactiveSync() {
  console.log('🎨 Interactive Figma Token Sync\n')
  console.log('Choose an option:')
  console.log('1. Use Cursor AI to fetch (recommended)')
  console.log('2. Paste variables manually (JSON format)')
  console.log('3. Use example variables (for testing)\n')

  const choice = await question('Enter choice (1-3): ')

  let variables: Record<string, any> = {}

  if (choice === '1') {
    console.log('\n📋 Ask Cursor AI:')
    console.log('   "Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"')
    console.log('\n   Then paste the result here (or press Enter to use example):')
    const input = await question('Variables (JSON): ')
    
    if (input.trim()) {
      try {
        variables = JSON.parse(input)
      } catch (e) {
        console.error('❌ Invalid JSON, using example instead')
        variables = getExampleVariables()
      }
    } else {
      variables = getExampleVariables()
    }
  } else if (choice === '2') {
    console.log('\n📋 Paste Figma variables as JSON:')
    console.log('   Example: {"indigo/600": "#4f46e5", "slate/50": "#f8fafc"}')
    const input = await question('Variables (JSON): ')
    
    try {
      variables = JSON.parse(input)
    } catch (e) {
      console.error('❌ Invalid JSON format')
      process.exit(1)
    }
  } else {
    variables = getExampleVariables()
    console.log('\n📋 Using example variables for testing')
  }

  console.log('\n🔄 Processing variables...\n')

  // Process and update
  const tokens = processVariables(variables)
  updateTokenFiles(tokens)

  console.log('\n✅ Done! Restart your dev server to see changes.')
  
  rl.close()
}

function getExampleVariables() {
  return {
    'indigo/600': '#4f46e5',
    'slate/50': '#f8fafc',
    'Radius/radii-xl': '100',
    'Radius/radii-xs': '4',
    'Radius/radii-s': '6',
  }
}

function processVariables(variables: Record<string, any>) {
  const tokens: any = {
    colors: {},
    borderRadius: {},
    spacing: {},
    shadows: {},
  }

  Object.entries(variables).forEach(([name, value]) => {
    const key = name.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
    
    if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))) {
      tokens.colors[key] = value
    } else if (name.toLowerCase().includes('radius') || name.toLowerCase().includes('radii')) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      tokens.borderRadius[key] = `${numValue}px`
    } else if (name.toLowerCase().includes('spacing') || name.toLowerCase().includes('size')) {
      const numValue = typeof value === 'string' ? parseFloat(value) : value
      tokens.spacing[key] = `${numValue}px`
    } else if (name.toLowerCase().includes('shadow')) {
      tokens.shadows[key] = value
    }
  })

  return tokens
}

function updateTokenFiles(tokens: any) {
  const tokensPath = resolve(__dirname, '../src/tokens/figma-tokens.ts')
  const tokensContent = `/**
 * Figma Design Tokens
 * 
 * Auto-synced from Figma. Run 'pnpm sync:figma:simple' to update.
 * Last synced: ${new Date().toISOString()}
 */

import type { DesignTokens } from './index'

export const figmaTokens: DesignTokens = ${JSON.stringify(tokens, null, 2)}
`
  writeFileSync(tokensPath, tokensContent)
  console.log(`✅ Updated: ${tokensPath}`)

  const extensionPath = resolve(__dirname, '../src/tokens/tailwind-extension.json')
  const extension = {
    colors: tokens.colors,
    borderRadius: tokens.borderRadius,
    spacing: tokens.spacing,
    boxShadow: tokens.shadows,
  }
  writeFileSync(extensionPath, JSON.stringify(extension, null, 2))
  console.log(`✅ Updated: ${extensionPath}`)

  console.log('\n📊 Summary:')
  console.log(`   Colors: ${Object.keys(tokens.colors).length}`)
  console.log(`   Border Radius: ${Object.keys(tokens.borderRadius).length}`)
  console.log(`   Spacing: ${Object.keys(tokens.spacing).length}`)
  console.log(`   Shadows: ${Object.keys(tokens.shadows).length}`)
}

interactiveSync()

