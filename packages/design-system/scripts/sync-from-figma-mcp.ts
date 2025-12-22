#!/usr/bin/env tsx
/**
 * Sync Tokens from Figma MCP
 *
 * This script processes variables fetched via Figma MCP and updates tokens.
 *
 * Usage: Call this after fetching variables with Cursor AI
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FIGMA_FILE_KEY = "rDLR9ZCB0Dq2AmRvxrifds";

/**
 * Process Figma variables from MCP and sync to design system
 *
 * @param variableDefs - Variables from mcp_Figma_get_variable_defs
 */
export function syncFromFigmaMCP(variableDefs: Record<string, any>) {
  console.log("🔄 Processing Figma variables from MCP...\n");
  
  // Diagnostic: Log format of alias variables
  console.log("🔍 Diagnostic: Checking alias variable formats...\n");
  const aliasVars = ['bg-subtle', 'bg-strong', 'Background/bg-subtle', 'Background/bg-strong'];
  aliasVars.forEach(varName => {
    if (variableDefs[varName] !== undefined) {
      console.log(`   ${varName}:`);
      console.log(`     Type: ${typeof variableDefs[varName]}`);
      console.log(`     Value:`, variableDefs[varName]);
      if (typeof variableDefs[varName] === 'object' && variableDefs[varName] !== null) {
        console.log(`     Structure:`, JSON.stringify(variableDefs[varName], null, 4));
      }
    }
  });
  console.log("");

  // Resolve aliases first
  const resolvedVariables = resolveAliases(variableDefs);
  
  const tokens = processVariables(resolvedVariables);
  updateTokenFiles(tokens);

  console.log("\n✅ Sync complete! Restart dev server to see changes.");
  return tokens;
}

/**
 * Resolve alias variables to their primitive values
 * Handles multiple possible alias formats from Figma MCP
 */
function resolveAliases(
  variableDefs: Record<string, any>
): Record<string, any> {
  const resolved: Record<string, any> = {};
  const variableMap = new Map<string, any>();
  
  // Build map of all variables for lookup (by name and normalized name)
  Object.entries(variableDefs).forEach(([name, value]) => {
    variableMap.set(name, value);
    variableMap.set(name.toLowerCase(), value);
    // Also store without collection prefix
    const nameWithoutPrefix = name.split('/').pop() || name;
    if (nameWithoutPrefix !== name) {
      variableMap.set(nameWithoutPrefix, value);
      variableMap.set(nameWithoutPrefix.toLowerCase(), value);
    }
  });

  // First pass: collect all primitive values (non-aliases) and metadata objects
  Object.entries(variableDefs).forEach(([name, value]) => {
    // Skip VariableID entries
    if (name.toLowerCase().startsWith('variableid:')) {
      return;
    }
    
    if (isPrimitiveValue(value)) {
      resolved[name] = value;
    } else if (typeof value === 'object' && value !== null) {
      // Keep metadata objects (FLOAT, STRING, COLOR with collection info)
      if (value.resolvedType && value.value !== undefined) {
        resolved[name] = value;
      }
    }
  });

  // Second pass: resolve aliases and handle metadata objects
  Object.entries(variableDefs).forEach(([name, value]) => {
    // Skip VariableID entries
    if (name.toLowerCase().startsWith('variableid:')) {
      return;
    }
    
    if (resolved[name]) {
      return; // Already resolved
    }

    // Handle metadata objects from plugin (not aliases, just objects with type info)
    if (typeof value === 'object' && value !== null && value.resolvedType && value.value !== undefined) {
      // This is a metadata object (FLOAT, STRING, COLOR) - keep the structure for processVariables
      resolved[name] = value;
      return;
    }

    // Check if this is an alias variable
    const aliasValue = resolveAliasValue(value, variableMap, variableDefs, new Set());
    
    if (aliasValue !== null && aliasValue !== undefined) {
      // Preserve collection metadata if available
      if (typeof value === 'object' && value !== null && value.collection) {
        resolved[name] = {
          value: aliasValue,
          resolvedType: value.resolvedType || (typeof aliasValue === 'string' && aliasValue.startsWith('#') ? 'COLOR' : 'FLOAT'),
          collection: value.collection,
        };
      } else {
        resolved[name] = aliasValue;
      }
      console.log(`   🔗 Resolved alias: ${name} → ${aliasValue}`);
    } else {
      // If we can't resolve it, log it for debugging but skip it
      console.warn(`   ⚠️  Could not resolve alias for ${name}:`, 
        typeof value === 'object' ? JSON.stringify(value, null, 2) : value);
      // Don't add unresolved aliases - skip them instead of creating #NaNNaNNaN
    }
  });

  return resolved;
}

/**
 * Check if a value is a primitive (direct color/number, not an alias)
 */
function isPrimitiveValue(value: any): boolean {
  if (typeof value === 'string') {
    return value.startsWith('#') || value.startsWith('rgb') || value.startsWith('hsl');
  }
  if (typeof value === 'number') {
    return true;
  }
  return false;
}

/**
 * Resolve an alias value by following references
 * Handles multiple alias formats from Figma MCP
 */
function resolveAliasValue(
  value: any,
  variableMap: Map<string, any>,
  variableDefs: Record<string, any>,
  visited: Set<string>,
  depth: number = 0
): string | number | null {
  // Prevent infinite loops
  if (depth > 10) {
    console.warn(`   ⚠️  Max recursion depth reached for alias resolution`);
    return null;
  }

  // If it's already a primitive, return it
  if (isPrimitiveValue(value)) {
    return value;
  }

  // Handle different alias formats
  let aliasId: string | null = null;
  let aliasName: string | null = null;

  if (typeof value === 'object' && value !== null) {
    // Format 1: { type: "VARIABLE_ALIAS", id: "VariableID:123:456", name: "slate-50" }
    // Prioritize name over ID when both are available (name is more reliable)
    if (value.type === 'VARIABLE_ALIAS') {
      if (value.name && typeof value.name === 'string') {
        aliasName = value.name;
      }
      if (value.id && typeof value.id === 'string') {
        aliasId = value.id;
      }
    }
    // Format 2: { id: "VariableID:123:456" }
    else if (value.id && typeof value.id === 'string') {
      aliasId = value.id;
    }
    // Format 3: { name: "slate-50" } - reference by name
    else if (value.name && typeof value.name === 'string') {
      aliasName = value.name;
    }
    // Format 4: valuesByMode format { "default": { type: "VARIABLE_ALIAS", id: "..." } }
    else if (value.valuesByMode) {
      const firstMode = Object.values(value.valuesByMode)[0];
      if (firstMode && typeof firstMode === 'object') {
        if (firstMode.type === 'VARIABLE_ALIAS' && firstMode.id) {
          aliasId = firstMode.id;
        } else if (firstMode.id) {
          aliasId = firstMode.id;
        } else if (firstMode.name) {
          aliasName = firstMode.name;
        } else if (isPrimitiveValue(firstMode)) {
          return firstMode;
        }
      }
    }
    // Format 5: RGB object that needs conversion
    else if ('r' in value && 'g' in value && 'b' in value) {
      return rgbToHex(value.r * 255, value.g * 255, value.b * 255);
    }
  }
  // Format 6: String ID reference
  else if (typeof value === 'string' && value.startsWith('VariableID:')) {
    aliasId = value;
  }

  // Try to resolve by name first (more reliable than ID)
  // Only try ID if name resolution fails
  let resolved: string | number | null = null;
  
  if (aliasName) {
    // Try exact match first
    if (variableDefs[aliasName] !== undefined) {
      const referencedValue = variableDefs[aliasName];
      if (isPrimitiveValue(referencedValue)) {
        return referencedValue;
      }
      resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Try via variableMap
    if (variableMap.has(aliasName)) {
      const referencedValue = variableMap.get(aliasName);
      resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Try case-insensitive match
    if (variableMap.has(aliasName.toLowerCase())) {
      const referencedValue = variableMap.get(aliasName.toLowerCase());
      resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }

    // Try common patterns (Background/, Text/, Color/, etc.)
    const possibleNames = [
      `Background/${aliasName}`,
      `Text/${aliasName}`,
      `Color/${aliasName}`,
      aliasName.replace(/^bg-/, 'Background/bg-'),
      aliasName.replace(/^text-/, 'Text/text-'),
    ];

    for (const possibleName of possibleNames) {
      if (variableDefs[possibleName] !== undefined) {
        const referencedValue = variableDefs[possibleName];
        if (isPrimitiveValue(referencedValue)) {
          return referencedValue;
        }
        resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
        if (resolved !== null) {
          return resolved;
        }
      }
      if (variableMap.has(possibleName)) {
        const referencedValue = variableMap.get(possibleName);
        resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
        if (resolved !== null) {
          return resolved;
        }
      }
    }
  }

  // Try to resolve by ID if name resolution failed
  if (aliasId && resolved === null) {
    // First, try direct lookup by ID as key name (format: "VariableID:123:456")
    if (variableDefs[aliasId] !== undefined) {
      const referencedValue = variableDefs[aliasId];
      // If it's a primitive, return it; otherwise resolve recursively
      if (isPrimitiveValue(referencedValue)) {
        return referencedValue;
      }
      const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Also try without "VariableID:" prefix (Figma might use just the ID)
    const idWithoutPrefix = aliasId.replace(/^VariableID:/, '');
    if (idWithoutPrefix !== aliasId && variableDefs[`VariableID:${idWithoutPrefix}`] !== undefined) {
      const referencedValue = variableDefs[`VariableID:${idWithoutPrefix}`];
      if (isPrimitiveValue(referencedValue)) {
        return referencedValue;
      }
      const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Look for variable with matching ID property
    for (const [varName, varValue] of Object.entries(variableDefs)) {
      // Check if this variable has the matching ID
      if (typeof varValue === 'object' && varValue !== null) {
        // Check direct id property
        if (varValue.id === aliasId) {
          const resolved = resolveAliasValue(varValue, variableMap, variableDefs, visited, depth + 1);
          if (resolved !== null) {
            return resolved;
          }
        }
        // Check valuesByMode format
        if (varValue.valuesByMode) {
          const firstMode = Object.values(varValue.valuesByMode)[0];
          if (firstMode && typeof firstMode === 'object' && firstMode.id === aliasId) {
            const resolved = resolveAliasValue(varValue, variableMap, variableDefs, visited, depth + 1);
            if (resolved !== null) {
              return resolved;
            }
          }
        }
      }
    }
    
    // If ID lookup fails, try extracting variable name from ID pattern
    // Some IDs might be in format "VariableID:collection:variable" or similar
    const idParts = aliasId.split(':');
    if (idParts.length > 1) {
      // Try using the last part as a variable name
      const possibleName = idParts[idParts.length - 1];
      if (variableMap.has(possibleName)) {
        const referencedValue = variableMap.get(possibleName);
        return resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      }
    }
  }

  // Try to resolve by name (this is often more reliable than ID)
  if (aliasName) {
    // Try exact match first
    if (variableDefs[aliasName] !== undefined) {
      const referencedValue = variableDefs[aliasName];
      if (isPrimitiveValue(referencedValue)) {
        return referencedValue;
      }
      const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Try via variableMap
    if (variableMap.has(aliasName)) {
      const referencedValue = variableMap.get(aliasName);
      const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }
    
    // Try case-insensitive match
    if (variableMap.has(aliasName.toLowerCase())) {
      const referencedValue = variableMap.get(aliasName.toLowerCase());
      const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
      if (resolved !== null) {
        return resolved;
      }
    }

    // Try common patterns (Background/, Text/, Color/, etc.)
    const possibleNames = [
      `Background/${aliasName}`,
      `Text/${aliasName}`,
      `Color/${aliasName}`,
      aliasName.replace(/^bg-/, 'Background/bg-'),
      aliasName.replace(/^text-/, 'Text/text-'),
    ];

    for (const possibleName of possibleNames) {
      if (variableDefs[possibleName] !== undefined) {
        const referencedValue = variableDefs[possibleName];
        if (isPrimitiveValue(referencedValue)) {
          return referencedValue;
        }
        const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
        if (resolved !== null) {
          return resolved;
        }
      }
      if (variableMap.has(possibleName)) {
        const referencedValue = variableMap.get(possibleName);
        const resolved = resolveAliasValue(referencedValue, variableMap, variableDefs, visited, depth + 1);
        if (resolved !== null) {
          return resolved;
        }
      }
    }
  }

  return null;
}

/**
 * Convert RGB values to hex color
 */
function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
}

/**
 * Map collection names to token categories
 * Priority-based: exact match > partial match
 */
function categorizeByCollection(collectionName: string | undefined): string | null {
  if (!collectionName) return null;
  
  const lower = collectionName.toLowerCase();
  
  // Exact matches (highest priority)
  if (lower === 'colors' || lower === 'color') return 'colors';
  if (lower === 'typography' || lower === 'font' || lower === 'fonts') return 'typography';
  if (lower === 'spacing' || lower === 'space') return 'spacing';
  if (lower === 'radius' || lower === 'radii' || lower === 'border-radius') return 'borderRadius';
  if (lower === 'shadows' || lower === 'shadow' || lower === 'elevation') return 'shadows';
  
  // Partial matches (collection paths like "Primitives/Colors")
  if (lower.includes('color')) return 'colors';
  if (lower.includes('typography') || lower.includes('font')) return 'typography';
  if (lower.includes('spacing') || lower.includes('space') || lower.includes('size')) return 'spacing';
  if (lower.includes('radius') || lower.includes('radii')) return 'borderRadius';
  if (lower.includes('shadow') || lower.includes('elevation')) return 'shadows';
  
  return null;
}

/**
 * Validate token values
 */
function validateToken(category: string, key: string, value: any): boolean {
  switch (category) {
    case 'colors':
      if (typeof value !== 'string') return false;
      const colorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$|^rgb\(|^rgba\(|^hsl\(|^hsla\(/;
      return colorRegex.test(value) && !value.includes('NaN');
    
    case 'borderRadius':
    case 'spacing':
      const numValue = typeof value === 'string' 
        ? parseFloat(value.replace('px', '')) 
        : value;
      return !isNaN(numValue) && numValue >= 0;
    
    case 'typography':
      // Typography can be string or object
      return typeof value === 'string' || typeof value === 'object';
    
    case 'shadows':
      return typeof value === 'string' && value.length > 0;
    
    default:
      return true;
  }
}

/**
 * Process typography token
 */
function processTypographyToken(
  name: string,
  value: any,
  collection: string | undefined
): Record<string, any> | null {
  const lowerName = name.toLowerCase();
  const result: Record<string, any> = {};
  
  // Individual typography properties
  if (lowerName.includes('font-size') || lowerName.includes('text-size') || lowerName.includes('size-')) {
    const size = typeof value === 'string' ? value : `${value}px`;
    result.fontSize = size;
    return result;
  }
  
  if (lowerName.includes('font-weight') || lowerName.includes('text-weight') || lowerName.includes('weight-')) {
    const weight = typeof value === 'string' ? value : String(value);
    result.fontWeight = weight;
    return result;
  }
  
  if (lowerName.includes('line-height') || lowerName.includes('leading-')) {
    const lineHeight = typeof value === 'string' ? value : String(value);
    result.lineHeight = lineHeight;
    return result;
  }
  
  if (lowerName.includes('font-family') || lowerName.includes('font-family-')) {
    result.fontFamily = String(value);
    return result;
  }
  
  if (lowerName.includes('letter-spacing') || lowerName.includes('tracking-')) {
    const letterSpacing = typeof value === 'string' ? value : `${value}px`;
    result.letterSpacing = letterSpacing;
    return result;
  }
  
  // Composite typography tokens (typography-heading-1, text-body, etc.)
  if (lowerName.startsWith('typography-') || lowerName.startsWith('text-')) {
    // For now, store as string - can be enhanced later to parse composite values
    result.value = String(value);
    return result;
  }
  
  return null;
}

function processVariables(variables: Record<string, any>) {
  const tokens: any = {
    colors: {},
    borderRadius: {},
    spacing: {},
    shadows: {},
    typography: {},
  };

  console.log("📥 Processing variables:");
  
  Object.entries(variables).forEach(([name, value]) => {
    // Skip VariableID entries (pollution cleanup)
    if (name.toLowerCase().startsWith('variableid:')) {
      return;
    }
    
    // Skip null/undefined values (unresolved aliases)
    if (value === null || value === undefined) {
      return;
    }
    
    // Skip invalid color values (#NaNNaNNaN or similar)
    if (typeof value === 'string' && (value.includes('NaN') || value === '#NaNNaNNaN')) {
      console.warn(`   ⚠️  Skipping invalid value for ${name}: ${value}`);
      return;
    }
    
    // Extract metadata from plugin objects
    let actualValue = value;
    let resolvedType: string | undefined = undefined;
    let collection: string | undefined = undefined;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Extract metadata
      if (value.value !== undefined) {
        actualValue = value.value;
      }
      if (value.resolvedType) {
        resolvedType = value.resolvedType;
      }
      if (value.collection) {
        collection = value.collection;
      }
      
      // Skip unresolved aliases
      if (value.type === 'VARIABLE_ALIAS') {
        console.warn(`   ⚠️  Unresolved alias for ${name}, skipping`);
        return;
      }
    }
    
    // Normalize key: remove common prefixes, convert to kebab-case
    let key = name
      .toLowerCase()
      .replace(/^(radius|radii|spacing|shadow|typography|font|color|text)\//gi, "")
      .replace(/\//g, "-")
      .replace(/\s+/g, "-");

    // Special mapping for radius values
    if (key === "radii-xl") {
      key = "radii-xxl";
    }

    // Categorization priority:
    // 1. Collection-based (most reliable)
    // 2. Type + name patterns
    // 3. Value analysis
    
    let category: string | null = null;
    
    // Priority 1: Collection-based categorization
    category = categorizeByCollection(collection);
    
    // Priority 2: Type + name-based categorization
    if (!category) {
      const lowerName = name.toLowerCase();
      
      // Typography detection
      if (
        resolvedType === 'STRING' &&
        (lowerName.includes('font') || 
         lowerName.includes('typography') || 
         lowerName.includes('text-size') ||
         lowerName.includes('line-height') ||
         lowerName.includes('font-weight') ||
         lowerName.includes('font-family') ||
         lowerName.includes('letter-spacing'))
      ) {
        category = 'typography';
      }
      // Color detection
      else if (
        (resolvedType === 'COLOR' || 
         (typeof actualValue === 'string' && 
          (actualValue.startsWith('#') || actualValue.startsWith('rgb') || actualValue.startsWith('hsl')))) &&
        !actualValue.includes('NaN')
      ) {
        category = 'colors';
      }
      // Radius detection
      else if (
        resolvedType === 'FLOAT' &&
        (lowerName.includes('radius') || lowerName.includes('radii') || key.includes('radius') || key.includes('radii'))
      ) {
        category = 'borderRadius';
      }
      // Spacing detection
      else if (
        resolvedType === 'FLOAT' &&
        (lowerName.includes('spacing') || lowerName.includes('size') || key.includes('spacing') || key.includes('size'))
      ) {
        category = 'spacing';
      }
      // Shadow detection
      else if (
        (resolvedType === 'STRING' || typeof actualValue === 'string') &&
        (lowerName.includes('shadow') || key.includes('shadow'))
      ) {
        category = 'shadows';
      }
      // Default FLOAT to spacing
      else if (resolvedType === 'FLOAT') {
        category = 'spacing';
      }
    }
    
    // Process token based on category
    if (category === 'colors') {
      const colorValue = typeof actualValue === 'string' ? actualValue : String(actualValue);
      if (validateToken('colors', key, colorValue)) {
        tokens.colors[key] = colorValue;
        console.log(`   ✅ Color: ${name} → ${key} = ${colorValue}`);
      } else {
        console.warn(`   ⚠️  Invalid color for ${name}: ${colorValue}`);
      }
    }
    else if (category === 'borderRadius') {
      const numValue = typeof actualValue === 'string' ? parseFloat(actualValue) : actualValue;
      const pxValue = `${numValue}px`;
      if (validateToken('borderRadius', key, pxValue)) {
        tokens.borderRadius[key] = pxValue;
        console.log(`   ✅ Radius: ${name} → ${key} = ${pxValue}`);
      } else {
        console.warn(`   ⚠️  Invalid radius for ${name}: ${numValue}`);
      }
    }
    else if (category === 'spacing') {
      const numValue = typeof actualValue === 'string' ? parseFloat(actualValue) : actualValue;
      const pxValue = `${numValue}px`;
      if (validateToken('spacing', key, pxValue)) {
        tokens.spacing[key] = pxValue;
        console.log(`   ✅ Spacing: ${name} → ${key} = ${pxValue}`);
      } else {
        console.warn(`   ⚠️  Invalid spacing for ${name}: ${numValue}`);
      }
    }
    else if (category === 'typography') {
      const typographyToken = processTypographyToken(name, actualValue, collection);
      if (typographyToken) {
        // Store typography as object or merge with existing
        if (tokens.typography[key]) {
          tokens.typography[key] = { ...tokens.typography[key], ...typographyToken };
        } else {
          tokens.typography[key] = typographyToken;
        }
        console.log(`   ✅ Typography: ${name} → ${key}`, typographyToken);
      } else {
        // Fallback: store as string value
        tokens.typography[key] = String(actualValue);
        console.log(`   ✅ Typography: ${name} → ${key} = ${actualValue}`);
      }
    }
    else if (category === 'shadows') {
      const shadowValue = String(actualValue);
      if (validateToken('shadows', key, shadowValue)) {
        tokens.shadows[key] = shadowValue;
        console.log(`   ✅ Shadow: ${name} → ${key} = ${shadowValue}`);
      } else {
        console.warn(`   ⚠️  Invalid shadow for ${name}: ${shadowValue}`);
      }
    }
    else {
      console.warn(`   ⚠️  Could not categorize ${name} (collection: ${collection}, type: ${resolvedType})`);
    }
  });

  return tokens;
}

function updateTokenFiles(tokens: any) {
  console.log("\n📝 Updating token files...\n");

  // Clean up tokens: remove VariableID entries and invalid values
  const cleanTokens = (tokenObj: Record<string, any>): Record<string, any> => {
    const cleaned: Record<string, any> = {};
    Object.entries(tokenObj || {}).forEach(([key, value]) => {
      // Skip VariableID entries
      if (key.toLowerCase().startsWith('variableid:')) {
        return;
      }
      // Skip invalid values
      if (value === null || value === undefined) {
        return;
      }
      if (typeof value === 'string' && value.includes('NaN')) {
        console.warn(`   ⚠️  Removing invalid value: ${key} = ${value}`);
        return;
      }
      cleaned[key] = value;
    });
    return cleaned;
  };

  tokens.colors = cleanTokens(tokens.colors || {});
  tokens.borderRadius = cleanTokens(tokens.borderRadius || {});
  tokens.spacing = cleanTokens(tokens.spacing || {});
  tokens.shadows = cleanTokens(tokens.shadows || {});
  tokens.typography = cleanTokens(tokens.typography || {});

  // Update TypeScript tokens file
  const tokensPath = resolve(__dirname, "../src/tokens/figma-tokens.ts");
  const tokensContent = `/**
 * Figma Design Tokens
 * 
 * Auto-synced from Figma via MCP.
 * Last synced: ${new Date().toISOString()}
 * File: ${FIGMA_FILE_KEY}
 */

import type { DesignTokens } from './index'

export const figmaTokens: DesignTokens = ${JSON.stringify(tokens, null, 2)}
`;
  writeFileSync(tokensPath, tokensContent);
  console.log(`✅ Updated: figma-tokens.ts`);

  // Update Tailwind extension
  const extensionPath = resolve(
    __dirname,
    "../src/tokens/tailwind-extension.json"
  );
  const extension = {
    colors: tokens.colors,
    borderRadius: tokens.borderRadius,
    spacing: tokens.spacing,
    boxShadow: tokens.shadows,
    // Note: Typography tokens are stored in figma-tokens.ts but not in Tailwind extension
    // as Tailwind handles typography differently (theme.extend.fontSize, etc.)
  };
  writeFileSync(extensionPath, JSON.stringify(extension, null, 2));
  console.log(`✅ Updated: tailwind-extension.json`);

  // Show summary
  console.log("\n📊 Token Summary:");
  console.log(`   Colors: ${Object.keys(tokens.colors).length}`);
  if (Object.keys(tokens.colors).length > 0) {
    Object.entries(tokens.colors).slice(0, 5).forEach(([key, value]) => {
      console.log(`     - ${key}: ${value}`);
    });
    if (Object.keys(tokens.colors).length > 5) {
      console.log(`     ... and ${Object.keys(tokens.colors).length - 5} more`);
    }
  }
  console.log(`   Border Radius: ${Object.keys(tokens.borderRadius).length}`);
  if (Object.keys(tokens.borderRadius).length > 0) {
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      console.log(`     - ${key}: ${value}`);
    });
  }
  console.log(`   Spacing: ${Object.keys(tokens.spacing).length}`);
  if (Object.keys(tokens.spacing).length > 0) {
    Object.entries(tokens.spacing).slice(0, 5).forEach(([key, value]) => {
      console.log(`     - ${key}: ${value}`);
    });
    if (Object.keys(tokens.spacing).length > 5) {
      console.log(`     ... and ${Object.keys(tokens.spacing).length - 5} more`);
    }
  }
  console.log(`   Typography: ${Object.keys(tokens.typography).length}`);
  if (Object.keys(tokens.typography).length > 0) {
    Object.entries(tokens.typography).forEach(([key, value]) => {
      console.log(`     - ${key}:`, typeof value === 'object' ? JSON.stringify(value) : value);
    });
  }
  console.log(`   Shadows: ${Object.keys(tokens.shadows).length}`);
  if (Object.keys(tokens.shadows).length > 0) {
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      console.log(`     - ${key}: ${value}`);
    });
  }
}

// If run directly, process example
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleVars = {
    "indigo/600": "#4f46e5",
    "slate/50": "#f8fafc",
  };
  syncFromFigmaMCP(exampleVars);
}
