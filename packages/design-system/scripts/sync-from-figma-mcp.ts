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

  const tokens = processVariables(variableDefs);
  updateTokenFiles(tokens);

  console.log("\n✅ Sync complete! Restart dev server to see changes.");
  return tokens;
}

function processVariables(variables: Record<string, any>) {
  const tokens: any = {
    colors: {},
    borderRadius: {},
    spacing: {},
    shadows: {},
  };

  console.log("📥 Processing variables:");
  Object.entries(variables).forEach(([name, value]) => {
    // Normalize key: remove common prefixes, convert to kebab-case
    let key = name
      .toLowerCase()
      .replace(/^(radius|radii|spacing|shadow)\//gi, "") // Remove prefix like "radius/" or "Radius/"
      .replace(/\//g, "-")
      .replace(/\s+/g, "-");

    // Special mapping for radius values to match component usage
    // Map radii-xl to radii-xxl (for full circle)
    if (key === "radii-xl") {
      key = "radii-xxl";
    }

    // Detect type
    if (
      typeof value === "string" &&
      (value.startsWith("#") ||
        value.startsWith("rgb") ||
        value.startsWith("hsl"))
    ) {
      tokens.colors[key] = value;
      console.log(`   ✅ Color: ${name} → ${key} = ${value}`);
    } else if (
      name.toLowerCase().includes("radius") ||
      name.toLowerCase().includes("radii")
    ) {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      tokens.borderRadius[key] = `${numValue}px`;
      console.log(`   ✅ Radius: ${name} → ${key} = ${numValue}px`);
    } else if (
      name.toLowerCase().includes("spacing") ||
      name.toLowerCase().includes("size")
    ) {
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      tokens.spacing[key] = `${numValue}px`;
      console.log(`   ✅ Spacing: ${name} → ${key} = ${numValue}px`);
    } else if (name.toLowerCase().includes("shadow")) {
      tokens.shadows[key] = value;
      console.log(`   ✅ Shadow: ${name} → ${key}`);
    }
  });

  return tokens;
}

function updateTokenFiles(tokens: any) {
  console.log("\n📝 Updating token files...\n");

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
  };
  writeFileSync(extensionPath, JSON.stringify(extension, null, 2));
  console.log(`✅ Updated: tailwind-extension.json`);

  // Show summary
  console.log("\n📊 Token Summary:");
  console.log(`   Colors: ${Object.keys(tokens.colors).length}`);
  Object.entries(tokens.colors).forEach(([key, value]) => {
    console.log(`     - ${key}: ${value}`);
  });
  console.log(`   Border Radius: ${Object.keys(tokens.borderRadius).length}`);
  console.log(`   Spacing: ${Object.keys(tokens.spacing).length}`);
  console.log(`   Shadows: ${Object.keys(tokens.shadows).length}`);
}

// If run directly, process example
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleVars = {
    "indigo/600": "#4f46e5",
    "slate/50": "#f8fafc",
  };
  syncFromFigmaMCP(exampleVars);
}
