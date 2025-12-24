#!/usr/bin/env tsx
/**
 * Diagnostic Script for Figma Variable Format
 *
 * This script helps diagnose what format Figma MCP returns for variables,
 * especially alias variables like bg-subtle and bg-strong.
 *
 * Usage: After fetching variables with Cursor AI, pass them to this script
 * to see their exact format.
 */

/**
 * Analyze variable format and show detailed information
 */
export function diagnoseVariableFormat(variableDefs: Record<string, any>) {
  console.log("🔍 Figma Variable Format Diagnostic\n");
  console.log("=".repeat(60));

  // Find bg-subtle and bg-strong specifically
  const targetVars = [
    "bg-subtle",
    "bg-strong",
    "Background/bg-subtle",
    "Background/bg-strong",
  ];

  console.log("\n📋 Looking for alias variables (bg-subtle, bg-strong):\n");

  let foundAny = false;
  for (const varName of targetVars) {
    // Try exact match
    if (variableDefs[varName] !== undefined) {
      foundAny = true;
      console.log(`\n✅ Found: "${varName}"`);
      console.log(`   Type: ${typeof variableDefs[varName]}`);
      console.log(`   Value:`, variableDefs[varName]);

      if (
        typeof variableDefs[varName] === "object" &&
        variableDefs[varName] !== null
      ) {
        console.log(`   Structure:`);
        console.log(JSON.stringify(variableDefs[varName], null, 2));

        // Check for common alias patterns
        const val = variableDefs[varName];
        if (val.type) console.log(`   → Has 'type' property: ${val.type}`);
        if (val.id) console.log(`   → Has 'id' property: ${val.id}`);
        if (val.name) console.log(`   → Has 'name' property: ${val.name}`);
        if (val.valuesByMode) {
          console.log(`   → Has 'valuesByMode' property`);
          console.log(`     Modes:`, Object.keys(val.valuesByMode));
          const firstMode = Object.values(val.valuesByMode)[0];
          console.log(`     First mode value:`, firstMode);
          if (typeof firstMode === "object" && firstMode !== null) {
            if (firstMode.type) console.log(`       → type: ${firstMode.type}`);
            if (firstMode.id) console.log(`       → id: ${firstMode.id}`);
            if (firstMode.name) console.log(`       → name: ${firstMode.name}`);
          }
        }
      }
    }

    // Try case-insensitive match
    const lowerKey = Object.keys(variableDefs).find(
      (k) => k.toLowerCase() === varName.toLowerCase()
    );
    if (lowerKey && lowerKey !== varName) {
      foundAny = true;
      console.log(`\n✅ Found (case-insensitive): "${lowerKey}"`);
      console.log(`   Type: ${typeof variableDefs[lowerKey]}`);
      console.log(`   Value:`, variableDefs[lowerKey]);
    }
  }

  if (!foundAny) {
    console.log("   ⚠️  bg-subtle and bg-strong not found in exact names");
    console.log("\n   Searching for similar patterns...\n");

    // Search for any variable containing "bg-subtle" or "bg-strong"
    Object.keys(variableDefs).forEach((key) => {
      if (
        key.toLowerCase().includes("bg-subtle") ||
        key.toLowerCase().includes("bg-strong") ||
        key.toLowerCase().includes("subtle") ||
        key.toLowerCase().includes("strong")
      ) {
        console.log(`   Found: "${key}"`);
        console.log(`     Type: ${typeof variableDefs[key]}`);
        console.log(`     Value:`, variableDefs[key]);
        if (
          typeof variableDefs[key] === "object" &&
          variableDefs[key] !== null
        ) {
          console.log(
            `     Structure:`,
            JSON.stringify(variableDefs[key], null, 2)
          );
        }
      }
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📊 All Variables Summary:\n");
  console.log(`   Total variables: ${Object.keys(variableDefs).length}`);

  // Categorize variables
  const primitives: string[] = [];
  const aliases: string[] = [];
  const objects: string[] = [];
  const invalid: string[] = [];

  Object.entries(variableDefs).forEach(([name, value]) => {
    if (typeof value === "string") {
      if (
        value.startsWith("#") ||
        value.startsWith("rgb") ||
        value.startsWith("hsl")
      ) {
        primitives.push(name);
      } else if (value.includes("NaN")) {
        invalid.push(name);
      } else {
        aliases.push(name);
      }
    } else if (typeof value === "object" && value !== null) {
      objects.push(name);
    } else if (typeof value === "number") {
      primitives.push(name);
    } else {
      invalid.push(name);
    }
  });

  console.log(`   Primitives (direct values): ${primitives.length}`);
  console.log(`   Objects (possible aliases): ${objects.length}`);
  console.log(`   Invalid/NaN values: ${invalid.length}`);

  if (objects.length > 0) {
    console.log(`\n   Object variables (likely aliases):`);
    objects.slice(0, 5).forEach((name) => {
      console.log(`     - ${name}`);
    });
    if (objects.length > 5) {
      console.log(`     ... and ${objects.length - 5} more`);
    }
  }

  if (invalid.length > 0) {
    console.log(`\n   ⚠️  Invalid variables:`);
    invalid.forEach((name) => {
      console.log(`     - ${name}: ${variableDefs[name]}`);
    });
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Next Steps:");
  console.log("   1. Review the structure above for bg-subtle/bg-strong");
  console.log("   2. Update sync script based on the actual format");
  console.log("   3. Re-run sync to test alias resolution");
}

// If run directly with JSON input
if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2];
  if (input) {
    try {
      const variables = JSON.parse(input);
      diagnoseVariableFormat(variables);
    } catch (e) {
      console.error("❌ Invalid JSON input");
      console.error(
        'Usage: tsx diagnose-figma-variables.ts \'{"var": "value"}\''
      );
      process.exit(1);
    }
  } else {
    console.log("📋 Diagnostic Script for Figma Variables\n");
    console.log("Usage:");
    console.log("  1. Fetch variables using Cursor AI:");
    console.log(
      '     "Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds node 1:110"'
    );
    console.log("\n  2. Copy the JSON response");
    console.log("\n  3. Run this script:");
    console.log(
      "     tsx scripts/diagnose-figma-variables.ts '{\"bg-subtle\": {...}}'"
    );
    console.log("\n  Or import and use in code:");
    console.log(
      '     import { diagnoseVariableFormat } from "./diagnose-figma-variables"'
    );
    console.log("     diagnoseVariableFormat(variableDefs)");
  }
}
