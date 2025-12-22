#!/usr/bin/env tsx
/**
 * Cleanup Script - Remove VariableID entries from token files
 * 
 * This script removes all VariableID entries from existing token files.
 * Run this once to clean up old token files before testing the new sync.
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function cleanTokenObject(obj: Record<string, any>): Record<string, any> {
  const cleaned: Record<string, any> = {};
  Object.entries(obj).forEach(([key, value]) => {
    // Skip VariableID entries (case-insensitive)
    if (key.toLowerCase().startsWith('variableid:')) {
      console.log(`   🗑️  Removing: ${key}`);
      return;
    }
    cleaned[key] = value;
  });
  return cleaned;
}

// Clean tailwind-extension.json
const extensionPath = resolve(__dirname, "../src/tokens/tailwind-extension.json");
const extension = JSON.parse(readFileSync(extensionPath, "utf-8"));

console.log("🧹 Cleaning tailwind-extension.json...");
extension.colors = cleanTokenObject(extension.colors || {});
extension.borderRadius = cleanTokenObject(extension.borderRadius || {});
extension.spacing = cleanTokenObject(extension.spacing || {});
extension.boxShadow = cleanTokenObject(extension.boxShadow || {});

writeFileSync(extensionPath, JSON.stringify(extension, null, 2));
console.log("✅ Cleaned: tailwind-extension.json");

// Clean figma-tokens.ts
const tokensPath = resolve(__dirname, "../src/tokens/figma-tokens.ts");
const tokensContent = readFileSync(tokensPath, "utf-8");

// Extract the tokens object from the TypeScript file
const tokensMatch = tokensContent.match(/export const figmaTokens: DesignTokens = ({[\s\S]*?});/);
if (tokensMatch) {
  const tokensStr = tokensMatch[1];
  const tokens = eval(`(${tokensStr})`); // Safe here as it's our own file
  
  console.log("🧹 Cleaning figma-tokens.ts...");
  tokens.colors = cleanTokenObject(tokens.colors || {});
  tokens.borderRadius = cleanTokenObject(tokens.borderRadius || {});
  tokens.spacing = cleanTokenObject(tokens.spacing || {});
  tokens.shadows = cleanTokenObject(tokens.shadows || {});
  tokens.typography = cleanTokenObject(tokens.typography || {});
  
  // Reconstruct the file
  const newContent = tokensContent.replace(
    /export const figmaTokens: DesignTokens = {[\s\S]*?};/,
    `export const figmaTokens: DesignTokens = ${JSON.stringify(tokens, null, 2)}`
  );
  
  writeFileSync(tokensPath, newContent);
  console.log("✅ Cleaned: figma-tokens.ts");
}

console.log("\n✨ Cleanup complete! Token files are now clean.");
console.log("💡 Next: Sync from Figma plugin to test the new implementation.");

