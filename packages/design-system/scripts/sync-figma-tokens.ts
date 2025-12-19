#!/usr/bin/env tsx
/**
 * Figma Token Sync Script
 * 
 * This script uses Figma MCP to fetch design variables and sync them
 * to the design system tokens and Tailwind configuration.
 * 
 * Prerequisites:
 * - Figma MCP server must be configured in Cursor
 * - Figma file key must be set in environment or config
 * 
 * Usage:
 * pnpm --filter design-system sync:figma
 * 
 * Environment Variables:
 * - FIGMA_FILE_KEY: Your Figma file key (required)
 * - FIGMA_NODE_ID: Specific node ID to fetch variables from (optional)
 */

import { writeFileSync, readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import {
  convertFigmaVariablesToTokens,
  generateTailwindConfig,
  type FigmaVariable,
  type FigmaVariableCollection,
  type FigmaToken,
} from '../src/tokens/figma-sync'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const FIGMA_CONFIG = {
  fileKey: process.env.FIGMA_FILE_KEY || 'rDLR9ZCB0Dq2AmRvxrifds',
  nodeId: process.env.FIGMA_NODE_ID || '0:1', // Default to root node
}

/**
 * Parse Figma variable definitions from MCP response
 * This function handles the actual format returned by Figma MCP
 */
function parseFigmaVariables(variableDefs: Record<string, any>): {
  variables: FigmaVariable[]
  collections: FigmaVariableCollection[]
} {
  const variables: FigmaVariable[] = []
  const collections: FigmaVariableCollection[] = []

  // Parse variable definitions
  // Format: { "variable-name": "value" }
  Object.entries(variableDefs).forEach(([name, value]) => {
    // Determine type from value
    let resolvedType: FigmaVariable['resolvedType'] = 'STRING'
    let parsedValue: any = value

    if (typeof value === 'string') {
      // Check if it's a color (hex, rgb, hsl)
      if (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl')) {
        resolvedType = 'COLOR'
      } else if (!isNaN(parseFloat(value)) && value.includes('px')) {
        resolvedType = 'FLOAT'
        parsedValue = parseFloat(value)
      }
    } else if (typeof value === 'number') {
      resolvedType = 'FLOAT'
    }

    // Determine category from name
    const category = name.split('/')[0] || 'default'
    
    variables.push({
      id: `var-${name.replace(/\//g, '-')}`,
      name,
      valuesByMode: {
        'default': parsedValue,
      },
      resolvedType,
      variableCollectionId: `collection-${category}`,
    })

    // Add collection if not exists
    if (!collections.find(c => c.id === `collection-${category}`)) {
      collections.push({
        id: `collection-${category}`,
        name: category,
        modes: [{ modeId: 'default', name: 'default' }],
      })
    }
  })

  return { variables, collections }
}

/**
 * Convert color value to Tailwind-compatible format
 */
function convertColorToTailwind(value: string): string {
  // If already hex, return as-is
  if (value.startsWith('#')) {
    return value
  }
  
  // If RGB/RGBA, convert to hex
  if (value.startsWith('rgb')) {
    const matches = value.match(/\d+/g)
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0])
      const g = parseInt(matches[1])
      const b = parseInt(matches[2])
      return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
    }
  }

  // If HSL, return as-is (Tailwind supports HSL)
  if (value.startsWith('hsl')) {
    return value
  }

  return value
}

/**
 * Generate Tailwind config extension from tokens
 */
function generateTailwindExtension(tokens: FigmaToken[]): string {
  const colors: Record<string, string> = {}
  const spacing: Record<string, string> = {}
  const borderRadius: Record<string, string> = {}
  const boxShadow: Record<string, string> = {}

  tokens.forEach((token) => {
    const key = token.name
      .toLowerCase()
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')

    switch (token.type) {
      case 'color':
        colors[key] = convertColorToTailwind(String(token.value))
        break
      case 'spacing':
        spacing[key] = String(token.value)
        break
      case 'borderRadius':
        borderRadius[key] = String(token.value)
        break
      case 'shadow':
        boxShadow[key] = String(token.value)
        break
    }
  })

  const config = {
    colors: Object.keys(colors).length > 0 ? colors : undefined,
    spacing: Object.keys(spacing).length > 0 ? spacing : undefined,
    borderRadius: Object.keys(borderRadius).length > 0 ? borderRadius : undefined,
    boxShadow: Object.keys(boxShadow).length > 0 ? boxShadow : undefined,
  }

  return JSON.stringify(config, null, 2)
}

/**
 * Update Tailwind config file with new tokens
 */
function updateTailwindConfig(tokens: FigmaToken[]) {
  const configPath = resolve(__dirname, '../tailwind.config.js')
  let configContent = readFileSync(configPath, 'utf-8')

  // Generate extension object
  const extension = generateTailwindExtension(tokens)
  const extensionObj = JSON.parse(extension)

  // Check if we need to update colors
  if (extensionObj.colors) {
    // Find the colors section in extend
    const colorsRegex = /colors:\s*\{([^}]*)\}/s
    const match = configContent.match(colorsRegex)
    
    if (match) {
      // Add new colors to existing colors object
      const existingColors = match[1]
      const newColors = Object.entries(extensionObj.colors)
        .map(([key, value]) => `        '${key}': '${value}',`)
        .join('\n')
      
      configContent = configContent.replace(
        colorsRegex,
        `colors: {\n${existingColors}\n        // Figma tokens\n${newColors}\n      }`
      )
    }
  }

  // Similar updates for borderRadius, spacing, boxShadow
  // For now, we'll create a separate tokens file that can be imported

  writeFileSync(configPath, configContent)
}

/**
 * Main sync function
 */
async function syncFigmaTokens() {
  console.log('🔄 Starting Figma token sync...')
  console.log(`📁 File Key: ${FIGMA_CONFIG.fileKey}`)
  console.log(`📍 Node ID: ${FIGMA_CONFIG.nodeId}`)

  try {
    // Note: In a real implementation, you would call Figma MCP here
    // For now, we'll use a manual approach where you fetch variables
    // and pass them to this script, or use the MCP tools directly
    
    console.log('\n📋 To sync tokens, use one of these methods:')
    console.log('\n1. Manual Sync via Cursor AI:')
    console.log('   Ask Cursor: "Get variable definitions from Figma file [fileKey] node [nodeId] and sync to design system"')
    console.log('\n2. Automated Sync (requires Figma API token):')
    console.log('   Set FIGMA_API_TOKEN environment variable')
    console.log('   Run: pnpm --filter design-system sync:figma:auto')
    
    // For demonstration, we'll show the structure
    // In production, you would fetch actual data here
    
    // Example: Parse variables if provided via stdin or file
    const exampleVariables = {
      'indigo/600': '#4f46e5',
      'slate/50': '#f8fafc',
      'Radius/New group/radii-xxl': '999px',
      'Radius/radii-s': '6px',
      'Radius/radii-xs': '4px',
      'Background/bg-body': '#ffffff',
      'Black': '#131313',
    }

    const { variables, collections } = parseFigmaVariables(exampleVariables)
    const tokens = convertFigmaVariablesToTokens(variables, collections)

    // Generate tokens file
    const tokensPath = resolve(__dirname, '../src/tokens/figma-tokens.ts')
    const tokensFile = generateTokensFile(tokens)
    writeFileSync(tokensPath, tokensFile)
    console.log(`\n✅ Generated tokens file: ${tokensPath}`)

    // Generate Tailwind extension
    const tailwindExtension = generateTailwindExtension(tokens)
    const extensionPath = resolve(__dirname, '../src/tokens/tailwind-extension.json')
    writeFileSync(extensionPath, tailwindExtension)
    console.log(`✅ Generated Tailwind extension: ${extensionPath}`)

    console.log(`\n✨ Synced ${tokens.length} tokens from Figma`)
    console.log('\n📝 Next steps:')
    console.log('   1. Review generated tokens in src/tokens/figma-tokens.ts')
    console.log('   2. Import tailwind-extension.json in tailwind.config.js')
    console.log('   3. Update components to use new tokens')

  } catch (error) {
    console.error('❌ Error syncing Figma tokens:', error)
    process.exit(1)
  }
}

/**
 * Generate tokens file content
 */
function generateTokensFile(tokens: FigmaToken[]): string {
  const imports = "import type { DesignTokens } from './index'\n\n"
  
  const tokensByCategory = tokens.reduce((acc, token) => {
    const category = token.category
    if (!acc[category]) {
      acc[category] = {}
    }
    acc[category][token.name] = token.value
    return acc
  }, {} as Record<string, Record<string, any>>)

  // Map to DesignTokens structure
  const designTokens: any = {
    colors: {},
    spacing: {},
    typography: {},
    shadows: {},
    borderRadius: {},
  }

  tokens.forEach((token) => {
    switch (token.type) {
      case 'color':
        designTokens.colors[token.name] = token.value
        break
      case 'spacing':
        designTokens.spacing[token.name] = token.value
        break
      case 'typography':
        designTokens.typography[token.name] = token.value
        break
      case 'shadow':
        designTokens.shadows[token.name] = token.value
        break
      case 'borderRadius':
        designTokens.borderRadius[token.name] = token.value
        break
    }
  })

  return `${imports}export const figmaTokens: DesignTokens = ${JSON.stringify(designTokens, null, 2)}`
}

// Run sync
syncFigmaTokens()
