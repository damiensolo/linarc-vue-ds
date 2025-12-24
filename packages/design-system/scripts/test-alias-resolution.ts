#!/usr/bin/env tsx
/**
 * Test Alias Resolution
 * 
 * This script tests different alias formats to ensure our resolution logic works correctly.
 * Run this to verify alias resolution before syncing from Figma.
 */

import { syncFromFigmaMCP } from './sync-from-figma-mcp';

console.log("🧪 Testing Alias Resolution\n");
console.log("=".repeat(60));

// Test Case 1: Alias as object with type and id
console.log("\n📋 Test Case 1: Alias with type and id\n");
const test1 = {
  "slate-50": "#f8fafc",
  "bg-subtle": {
    type: "VARIABLE_ALIAS",
    id: "VariableID:123:456"
  },
  "VariableID:123:456": {
    name: "slate-50",
    value: "#f8fafc"
  }
};
console.log("Input:", JSON.stringify(test1, null, 2));
console.log("\nResult:");
syncFromFigmaMCP(test1);

console.log("\n" + "=".repeat(60));

// Test Case 2: Alias as object with name reference
console.log("\n📋 Test Case 2: Alias with name reference\n");
const test2 = {
  "slate-50": "#f8fafc",
  "bg-subtle": {
    name: "slate-50"
  }
};
console.log("Input:", JSON.stringify(test2, null, 2));
console.log("\nResult:");
syncFromFigmaMCP(test2);

console.log("\n" + "=".repeat(60));

// Test Case 3: Alias in valuesByMode format
console.log("\n📋 Test Case 3: Alias in valuesByMode format\n");
const test3 = {
  "slate-50": "#f8fafc",
  "bg-subtle": {
    valuesByMode: {
      "default": {
        type: "VARIABLE_ALIAS",
        id: "VariableID:123:456"
      }
    }
  },
  "VariableID:123:456": "#f8fafc"
};
console.log("Input:", JSON.stringify(test3, null, 2));
console.log("\nResult:");
syncFromFigmaMCP(test3);

console.log("\n" + "=".repeat(60));

// Test Case 4: Nested alias (alias pointing to another alias)
console.log("\n📋 Test Case 4: Nested alias\n");
const test4 = {
  "slate-50": "#f8fafc",
  "bg-subtle": {
    name: "bg-base"
  },
  "bg-base": {
    name: "slate-50"
  }
};
console.log("Input:", JSON.stringify(test4, null, 2));
console.log("\nResult:");
syncFromFigmaMCP(test4);

console.log("\n" + "=".repeat(60));

// Test Case 5: RGB object (should convert to hex)
console.log("\n📋 Test Case 5: RGB object\n");
const test5 = {
  "bg-subtle": {
    r: 0.968,
    g: 0.980,
    b: 0.988
  }
};
console.log("Input:", JSON.stringify(test5, null, 2));
console.log("\nResult:");
syncFromFigmaMCP(test5);

console.log("\n" + "=".repeat(60));
console.log("\n✅ All test cases completed!");
console.log("\n💡 Next steps:");
console.log("   1. Run actual sync from Figma to see real format");
console.log("   2. Check diagnostic output for bg-subtle and bg-strong");
console.log("   3. Adjust resolution logic if needed based on actual format");



