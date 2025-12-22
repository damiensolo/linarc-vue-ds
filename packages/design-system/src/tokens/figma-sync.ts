/**
 * Figma MCP Integration Utilities
 * 
 * This module provides utilities to sync design tokens from Figma
 * using the Figma MCP server.
 * 
 * Usage:
 * 1. Ensure Figma MCP server is configured in Cursor
 * 2. Use the sync functions to fetch variables and convert to tokens
 * 3. Run sync script: pnpm --filter design-system sync:figma
 */

export interface FigmaVariable {
  id: string
  name: string
  valuesByMode: Record<string, any>
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING' | 'BOOLEAN'
  variableCollectionId: string
}

export interface FigmaVariableCollection {
  id: string
  name: string
  modes: Array<{ modeId: string; name: string }>
}

export interface FigmaToken {
  name: string
  value: string | number
  type: 'color' | 'spacing' | 'typography' | 'shadow' | 'borderRadius'
  category: string
}

/**
 * Resolve alias variables to their actual values
 * Handles semantic/alias variables that reference other variables
 */
export function resolveVariableAliases(
  variables: FigmaVariable[],
  variableMap: Map<string, FigmaVariable> = new Map()
): Map<string, string | number> {
  const resolved = new Map<string, string | number>()
  
  // Build variable map for quick lookup
  variables.forEach(v => variableMap.set(v.name, v))
  
  // First pass: collect direct values (non-aliases)
  variables.forEach((variable) => {
    const firstModeId = Object.keys(variable.valuesByMode)[0]
    const value = variable.valuesByMode[firstModeId]
    
    // If value is a direct color/number, store it
    if (typeof value === 'string' && (value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl'))) {
      resolved.set(variable.name, value)
    } else if (typeof value === 'number') {
      resolved.set(variable.name, value)
    }
  })
  
  // Second pass: resolve aliases by looking for matching variable names
  // Common Figma alias patterns:
  // - "bg-strong" might alias to "Background/bg-strong"
  // - "text-body" might alias to "Text/text-body"
  variables.forEach((variable) => {
    if (resolved.has(variable.name)) {
      return // Already resolved
    }
    
    const firstModeId = Object.keys(variable.valuesByMode)[0]
    const value = variable.valuesByMode[firstModeId]
    
    // Check if this is an alias - look for a corresponding variable
    const possibleAliases = [
      `Background/${variable.name}`,
      `Text/${variable.name}`,
      variable.name.replace(/^bg-/, 'Background/bg-'),
      variable.name.replace(/^text-/, 'Text/text-'),
    ]
    
    for (const aliasName of possibleAliases) {
      const aliasVar = variableMap.get(aliasName)
      if (aliasVar) {
        const aliasModeId = Object.keys(aliasVar.valuesByMode)[0]
        const aliasValue = aliasVar.valuesByMode[aliasModeId]
        if (typeof aliasValue === 'string' && (aliasValue.startsWith('#') || aliasValue.startsWith('rgb') || aliasValue.startsWith('hsl'))) {
          resolved.set(variable.name, aliasValue)
          break
        }
      }
    }
  })
  
  return resolved
}

/**
 * Converts Figma variables to design tokens
 * Now includes alias resolution for semantic variables
 */
export function convertFigmaVariablesToTokens(
  variables: FigmaVariable[],
  collections: FigmaVariableCollection[]
): FigmaToken[] {
  const tokens: FigmaToken[] = []
  
  // Resolve aliases first
  const variableMap = new Map<string, FigmaVariable>()
  variables.forEach(v => variableMap.set(v.name, v))
  const resolvedValues = resolveVariableAliases(variables, variableMap)

  variables.forEach((variable) => {
    const collection = collections.find((c) => c.id === variable.variableCollectionId)
    const category = collection?.name.toLowerCase() || 'default'

    // Determine token type based on resolved type and name
    let type: FigmaToken['type'] = 'color'
    if (variable.name.toLowerCase().includes('spacing') || variable.name.toLowerCase().includes('size')) {
      type = 'spacing'
    } else if (variable.name.toLowerCase().includes('font') || variable.name.toLowerCase().includes('text')) {
      type = 'typography'
    } else if (variable.name.toLowerCase().includes('radius')) {
      type = 'borderRadius'
    } else if (variable.name.toLowerCase().includes('shadow')) {
      type = 'shadow'
    } else if (variable.resolvedType === 'COLOR') {
      type = 'color'
    }

    // Use resolved alias value if available, otherwise extract from first mode
    let value: string | number
    if (resolvedValues.has(variable.name)) {
      value = resolvedValues.get(variable.name)!
    } else {
      const firstModeId = Object.keys(variable.valuesByMode)[0]
      value = variable.valuesByMode[firstModeId]
    }

    // Convert color value to CSS format if needed
    let tokenValue: string | number = value
    if (type === 'color' && typeof value === 'object' && 'r' in value) {
      // Convert RGB object to HSL or hex
      tokenValue = rgbToHsl(value.r * 255, value.g * 255, value.b * 255)
    } else if (type === 'spacing' && typeof value === 'number') {
      tokenValue = `${value}px`
    } else if (type === 'color' && typeof value === 'string') {
      // Ensure valid hex color
      if (value.startsWith('#') && !value.match(/^#[0-9A-Fa-f]{6}$/)) {
        console.warn(`⚠️  Invalid color value for ${variable.name}: ${value}`)
        return // Skip invalid colors
      }
      tokenValue = value
    }

    tokens.push({
      name: variable.name,
      value: tokenValue,
      type,
      category,
    })
  })

  return tokens
}

/**
 * Converts RGB to HSL format
 */
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

/**
 * Generates Tailwind config from Figma tokens
 */
export function generateTailwindConfig(tokens: FigmaToken[]): Record<string, any> {
  const config: Record<string, any> = {
    colors: {},
    spacing: {},
    typography: {},
    shadows: {},
    borderRadius: {},
  }

  tokens.forEach((token) => {
    const key = token.name.toLowerCase().replace(/\s+/g, '-')
    
    switch (token.type) {
      case 'color':
        config.colors[key] = `hsl(${token.value})`
        break
      case 'spacing':
        config.spacing[key] = token.value
        break
      case 'typography':
        config.typography[key] = token.value
        break
      case 'shadow':
        config.shadows[key] = token.value
        break
      case 'borderRadius':
        config.borderRadius[key] = token.value
        break
    }
  })

  return config
}

/**
 * Generates TypeScript tokens file from Figma tokens
 */
export function generateTokensFile(tokens: FigmaToken[]): string {
  const imports = "import type { DesignTokens } from './index'\n\n"
  const tokensObject = tokens.reduce((acc, token) => {
    const category = token.category
    if (!acc[category]) {
      acc[category] = {}
    }
    acc[category][token.name] = token.value
    return acc
  }, {} as Record<string, Record<string, any>>)

  return `${imports}export const figmaTokens: DesignTokens = ${JSON.stringify(tokensObject, null, 2)}`
}

