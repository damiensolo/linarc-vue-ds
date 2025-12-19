// Design tokens exported here
// These will be synced from Figma using MCP integration

export interface DesignTokens {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, any>
  shadows: Record<string, string>
  borderRadius: Record<string, string>
}

// Export Figma tokens (auto-synced)
export { figmaTokens } from './figma-tokens'

// Placeholder tokens - will be replaced by Figma sync
export const tokens: DesignTokens = {
  colors: {},
  spacing: {},
  typography: {},
  shadows: {},
  borderRadius: {},
}

