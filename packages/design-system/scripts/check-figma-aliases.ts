#!/usr/bin/env tsx
/**
 * Check Figma Alias Format
 * 
 * This script helps diagnose the format of alias variables from Figma.
 * 
 * Usage:
 * 1. Open Figma file: https://www.figma.com/design/rDLR9ZCB0Dq2AmRvxrifds/Mini-Test-Design-System
 * 2. Select any layer in the file
 * 3. Ask Cursor: "Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds and show me bg-subtle and bg-strong"
 * 4. Copy the JSON response
 * 5. Run: pnpm tsx scripts/check-figma-aliases.ts '<paste JSON here>'
 */

import { diagnoseVariableFormat } from './diagnose-figma-variables';

const input = process.argv[2];

if (!input) {
  console.log("📋 Check Figma Alias Format\n");
  console.log("Usage:");
  console.log("  1. In Figma, select any layer");
  console.log("  2. Ask Cursor: 'Get variable definitions from Figma file rDLR9ZCB0Dq2AmRvxrifds'");
  console.log("  3. Copy the JSON response");
  console.log("  4. Run: pnpm tsx scripts/check-figma-aliases.ts '<paste JSON here>'\n");
  console.log("Example:");
  console.log('  pnpm tsx scripts/check-figma-aliases.ts \'{"bg-subtle": {...}, "bg-strong": {...}}\'');
  process.exit(0);
}

try {
  const variables = JSON.parse(input);
  console.log("\n" + "=".repeat(70));
  console.log("🔍 Analyzing Figma Variable Format");
  console.log("=".repeat(70) + "\n");
  
  diagnoseVariableFormat(variables);
  
  // Specifically check bg-subtle and bg-strong
  console.log("\n" + "=".repeat(70));
  console.log("🎯 Focus: bg-subtle and bg-strong");
  console.log("=".repeat(70) + "\n");
  
  ['bg-subtle', 'bg-strong', 'Background/bg-subtle', 'Background/bg-strong'].forEach(name => {
    // Try exact match
    if (variables[name] !== undefined) {
      console.log(`\n✅ Found: "${name}"`);
      console.log(`   Type: ${typeof variables[name]}`);
      console.log(`   Value:`, variables[name]);
      
      if (typeof variables[name] === 'object' && variables[name] !== null) {
        console.log(`   Full Structure:`);
        console.log(JSON.stringify(variables[name], null, 2));
        
        const val = variables[name];
        
        // Check all possible properties
        console.log(`   Properties:`);
        Object.keys(val).forEach(key => {
          console.log(`     - ${key}: ${typeof val[key]}`, 
            typeof val[key] === 'object' ? JSON.stringify(val[key]) : val[key]);
        });
        
        // Check for alias indicators
        if (val.type) console.log(`   → type: ${val.type}`);
        if (val.id) console.log(`   → id: ${val.id}`);
        if (val.name) console.log(`   → name: ${val.name}`);
        if (val.valuesByMode) {
          console.log(`   → valuesByMode:`, Object.keys(val.valuesByMode));
          const firstMode = Object.values(val.valuesByMode)[0];
          if (firstMode && typeof firstMode === 'object') {
            console.log(`     First mode structure:`, JSON.stringify(firstMode, null, 2));
          }
        }
      }
    }
    
    // Try case-insensitive search
    const found = Object.keys(variables).find(k => 
      k.toLowerCase() === name.toLowerCase() || 
      k.toLowerCase().includes(name.toLowerCase())
    );
    if (found && found !== name) {
      console.log(`\n✅ Found similar: "${found}"`);
      console.log(`   Type: ${typeof variables[found]}`);
      console.log(`   Value:`, variables[found]);
    }
  });
  
  console.log("\n" + "=".repeat(70));
  console.log("💡 Next Steps:");
  console.log("  1. Review the structure above");
  console.log("  2. Update resolveAliasValue() in sync-from-figma-mcp.ts if needed");
  console.log("  3. Re-run sync to test resolution");
  console.log("=".repeat(70) + "\n");
  
} catch (e) {
  console.error("❌ Invalid JSON input");
  console.error("Error:", e.message);
  console.error("\nMake sure to wrap the JSON in quotes:");
  console.error('  pnpm tsx scripts/check-figma-aliases.ts \'{"key": "value"}\'');
  process.exit(1);
}



