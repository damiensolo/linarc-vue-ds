#!/usr/bin/env tsx
/**
 * Simple Figma Token Sync
 *
 * ⚠️ IMPORTANT: This script processes variables but CANNOT fetch from Figma directly.
 *
 * To actually sync from Figma, you have TWO options:
 *
 * Option 1: Ask Cursor AI (Recommended)
 *   "Sync tokens from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"
 *
 * Option 2: Pass variables as JSON argument
 *   pnpm sync:figma:simple '{"indigo/600":"#e54646","slate/50":"#f8fafc"}'
 *
 * Usage:
 * pnpm --filter design-system sync:figma:simple
 *
 * Or with variables:
 * pnpm --filter design-system sync:figma:simple '{"indigo/600":"#e54646"}'
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { syncFromFigmaMCP } from "./sync-from-figma-mcp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your Figma file configuration
const FIGMA_FILE_KEY = "rDLR9ZCB0Dq2AmRvxrifds";
const FIGMA_NODE_ID = "1:110";

/**
 * Simple sync function - processes variables and updates tokens
 */
async function simpleSync() {
  console.log("🎨 Simple Figma Token Sync\n");
  console.log(`📁 File: ${FIGMA_FILE_KEY}`);
  console.log(`📍 Node: ${FIGMA_NODE_ID}\n`);

  // Check if variables were passed as argument
  const variablesArg = process.argv[2];
  let variables: Record<string, any>;

  if (variablesArg) {
    try {
      variables = JSON.parse(variablesArg);
      console.log("✅ Using variables from command line argument\n");
    } catch (error) {
      console.error("❌ Invalid JSON in argument. Using example values.\n");
      variables = getExampleVariables();
    }
  } else {
    console.log("⚠️  No variables provided. Using example values.");
    console.log("💡 To sync real values from Figma, ask Cursor AI:");
    console.log(
      `   "Sync tokens from Figma file ${FIGMA_FILE_KEY} node ${FIGMA_NODE_ID}"\n`
    );
    console.log("💡 Or pass variables as JSON:");
    console.log(`   pnpm sync:figma:simple '{"indigo/600":"#e54646"}'\n`);
    variables = getExampleVariables();
  }

  console.log("📥 Processing variables:");
  Object.entries(variables).forEach(([name, value]) => {
    console.log(`   ${name}: ${value}`);
  });

  // Use the sync function from sync-from-figma-mcp.ts
  syncFromFigmaMCP(variables);

  console.log("\n🔄 Restart dev server to see changes!");
}

function getExampleVariables() {
  return {
    "indigo/600": "#4f46e5", // Example - change this in Figma!
    "slate/50": "#f8fafc",
    "Radius/radii-xl": "100",
    "Radius/radii-xs": "4",
    "Radius/radii-s": "6",
  };
}

// Run sync
simpleSync();
