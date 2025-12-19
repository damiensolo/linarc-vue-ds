#!/usr/bin/env tsx
/**
 * Figma MCP Token Sync Script
 *
 * This script is designed to be run via Cursor AI with Figma MCP integration.
 * It processes variable definitions fetched from Figma and syncs them to the design system.
 *
 * Usage via Cursor AI:
 * "Get variable definitions from Figma file [fileKey] node [nodeId] and sync to design system"
 *
 * Or manually:
 * 1. Fetch variables using Figma MCP: mcp_Figma_get_variable_defs
 * 2. Pass the result to this script
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import {
  convertFigmaVariablesToTokens,
  generateTailwindConfig,
  type FigmaToken,
} from "../src/tokens/figma-sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Process Figma variable definitions from MCP and sync to design system
 */
export async function syncFromFigmaMCP(variableDefs: Record<string, any>) {
  console.log("🔄 Processing Figma variables from MCP...");

  // Parse variables (simplified - adjust based on actual MCP response format)
  const variables = Object.entries(variableDefs).map(([name, value]) => ({
    id: `var-${name.replace(/\//g, "-")}`,
    name,
    valuesByMode: { default: value },
    resolvedType: determineType(name, value),
    variableCollectionId: `collection-${name.split("/")[0]}`,
  }));

  const collections = Array.from(
    new Set(variables.map((v) => v.variableCollectionId))
  ).map((id) => ({
    id,
    name: id.replace("collection-", ""),
    modes: [{ modeId: "default", name: "default" }],
  }));

  const tokens = convertFigmaVariablesToTokens(variables, collections);

  // Generate files
  await generateTokenFiles(tokens);

  return tokens;
}

function determineType(
  name: string,
  value: any
): "COLOR" | "FLOAT" | "STRING" | "BOOLEAN" {
  if (
    typeof value === "string" &&
    (value.startsWith("#") ||
      value.startsWith("rgb") ||
      value.startsWith("hsl"))
  ) {
    return "COLOR";
  }
  if (
    typeof value === "number" ||
    (typeof value === "string" && !isNaN(parseFloat(value)))
  ) {
    return "FLOAT";
  }
  if (typeof value === "boolean") {
    return "BOOLEAN";
  }
  return "STRING";
}

async function generateTokenFiles(tokens: FigmaToken[]) {
  // Generate figma-tokens.ts
  const tokensPath = resolve(__dirname, "../src/tokens/figma-tokens.ts");
  const tokensFile = generateTokensFile(tokens);
  writeFileSync(tokensPath, tokensFile);
  console.log(`✅ Generated: ${tokensPath}`);

  // Generate Tailwind extension
  const extensionPath = resolve(
    __dirname,
    "../src/tokens/tailwind-extension.json"
  );
  const extension = generateTailwindExtension(tokens);
  writeFileSync(extensionPath, extension);
  console.log(`✅ Generated: ${extensionPath}`);

  console.log(`\n✨ Synced ${tokens.length} tokens`);
}

function generateTokensFile(tokens: FigmaToken[]): string {
  const imports = "import type { DesignTokens } from './index'\n\n";

  const designTokens: any = {
    colors: {},
    spacing: {},
    typography: {},
    shadows: {},
    borderRadius: {},
  };

  tokens.forEach((token) => {
    const key = token.name
      .toLowerCase()
      .replace(/\//g, "-")
      .replace(/\s+/g, "-");

    switch (token.type) {
      case "color":
        designTokens.colors[key] = token.value;
        break;
      case "spacing":
        designTokens.spacing[key] = token.value;
        break;
      case "typography":
        designTokens.typography[key] = token.value;
        break;
      case "shadow":
        designTokens.shadows[key] = token.value;
        break;
      case "borderRadius":
        designTokens.borderRadius[key] = token.value;
        break;
    }
  });

  return `${imports}export const figmaTokens: DesignTokens = ${JSON.stringify(
    designTokens,
    null,
    2
  )}`;
}

function generateTailwindExtension(tokens: FigmaToken[]): string {
  const colors: Record<string, string> = {};
  const spacing: Record<string, string> = {};
  const borderRadius: Record<string, string> = {};
  const boxShadow: Record<string, string> = {};

  tokens.forEach((token) => {
    const key = token.name
      .toLowerCase()
      .replace(/\//g, "-")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    switch (token.type) {
      case "color":
        colors[key] = String(token.value);
        break;
      case "spacing":
        spacing[key] = String(token.value);
        break;
      case "borderRadius":
        borderRadius[key] = String(token.value);
        break;
      case "shadow":
        boxShadow[key] = String(token.value);
        break;
    }
  });

  return JSON.stringify(
    {
      colors: Object.keys(colors).length > 0 ? colors : undefined,
      spacing: Object.keys(spacing).length > 0 ? spacing : undefined,
      borderRadius:
        Object.keys(borderRadius).length > 0 ? borderRadius : undefined,
      boxShadow: Object.keys(boxShadow).length > 0 ? boxShadow : undefined,
    },
    null,
    2
  );
}
