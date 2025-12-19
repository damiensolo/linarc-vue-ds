#!/usr/bin/env node
/**
 * Build script for Figma plugin
 * Copies code.js and ui.html to dist folder
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distDir = resolve(__dirname, "dist");

// Create dist directory
try {
  mkdirSync(distDir, { recursive: true });
} catch (error) {
  // Directory might already exist
}

// Copy code.js
const codeJs = readFileSync(resolve(__dirname, "code.js"), "utf-8");
writeFileSync(resolve(distDir, "code.js"), codeJs);

// Copy ui.html
const uiHtml = readFileSync(resolve(__dirname, "ui.html"), "utf-8");
writeFileSync(resolve(distDir, "ui.html"), uiHtml);

// Copy manifest.json
const manifest = readFileSync(resolve(__dirname, "manifest.json"), "utf-8");
writeFileSync(resolve(distDir, "manifest.json"), manifest);

console.log("✅ Plugin built successfully!");
console.log(`📦 Output: ${distDir}`);
