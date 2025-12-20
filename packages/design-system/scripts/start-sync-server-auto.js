#!/usr/bin/env node
/**
 * Cross-platform script to auto-start sync server
 * Detects OS and runs the appropriate script
 */

import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const platform = process.platform;
const isWindows = platform === "win32";

const scriptName = isWindows
  ? "start-sync-server-auto.ps1"
  : "start-sync-server-auto.sh";
const scriptPath = join(__dirname, scriptName);

if (!existsSync(scriptPath)) {
  console.error(`❌ Script not found: ${scriptPath}`);
  process.exit(1);
}

try {
  if (isWindows) {
    execSync(
      `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { stdio: "inherit", cwd: process.cwd() }
    );
  } else {
    execSync(`bash "${scriptPath}"`, {
      stdio: "inherit",
      cwd: process.cwd(),
    });
  }
} catch (error) {
  console.error(`❌ Failed to auto-start sync server: ${error.message}`);
  process.exit(1);
}

