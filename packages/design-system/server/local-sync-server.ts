#!/usr/bin/env tsx
/**
 * Local Sync Server for Figma Plugin
 *
 * HTTP server that receives variable data from Figma plugin and updates token files.
 * Automatically tries alternative ports if default port is in use.
 */

import { createServer, IncomingMessage, ServerResponse, request } from "http";
import { exec } from "child_process";
import { promisify } from "util";
import { syncFromFigmaMCP } from "../scripts/sync-from-figma-mcp.js";
import { handleProductionSync } from "./production-sync-handler.js";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get package root directory (packages/design-system)
const PACKAGE_ROOT = resolve(__dirname, "..");

const DEFAULT_PORT = 3001;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

// Try alternative ports if default is in use
const ALTERNATIVE_PORTS = [3002, 3003, 3004, 3005];

interface SyncRequest {
  variables: Record<string, any>;
  fileKey?: string;
  nodeId?: string;
  syncMode?: "local" | "production";
  githubToken?: string;
  createPR?: boolean;
  branchName?: string;
}

function sendJSON(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

function handleSync(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    sendJSON(res, 200, {});
    return;
  }

  if (req.method !== "POST") {
    sendJSON(res, 405, { error: "Method not allowed" });
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data: SyncRequest = JSON.parse(body);

      if (!data.variables || Object.keys(data.variables).length === 0) {
        sendJSON(res, 400, {
          error: "No variables provided",
        });
        return;
      }

      const syncMode = data.syncMode || "local";

      if (syncMode === "production") {
        // Production sync: commit to GitHub
        console.log(`\n🚀 Production sync to GitHub...`);
        console.log(`📁 File: ${data.fileKey || "unknown"}`);
        console.log(`📍 Node: ${data.nodeId || "root"}\n`);

        try {
          const result = await handleProductionSync({
            variables: data.variables,
            fileKey: data.fileKey,
            nodeId: data.nodeId,
            githubToken: data.githubToken,
            createPR: data.createPR,
            branchName: data.branchName,
          });

          sendJSON(res, 200, {
            success: true,
            message: result.message,
            commitSha: result.commitSha,
            prUrl: result.prUrl,
            branch: result.branch,
            timestamp: new Date().toISOString(),
          });
        } catch (error: any) {
          console.error("❌ Production sync error:", error);
          sendJSON(res, 500, {
            error: "Failed to sync tokens to production",
            message: error.message,
          });
        }
      } else {
        // Local sync: update files locally
        console.log(`\n🔄 Syncing tokens from Figma plugin (local)...`);
        console.log(`📁 File: ${data.fileKey || "unknown"}`);
        console.log(`📍 Node: ${data.nodeId || "root"}\n`);

        const tokens = syncFromFigmaMCP(data.variables);

        sendJSON(res, 200, {
          success: true,
          message: "Tokens synced successfully",
          tokens: {
            colors: Object.keys(tokens.colors).length,
            borderRadius: Object.keys(tokens.borderRadius).length,
            spacing: Object.keys(tokens.spacing).length,
            shadows: Object.keys(tokens.shadows).length,
          },
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error: any) {
      console.error("❌ Sync error:", error);
      sendJSON(res, 500, {
        error: "Failed to sync tokens",
        message: error.message,
      });
    }
  });
}

async function handleRestart(req: IncomingMessage, res: ServerResponse) {
  if (req.method === "OPTIONS") {
    sendJSON(res, 200, {});
    return;
  }

  if (req.method !== "POST") {
    sendJSON(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    console.log("\n🔄 Restarting dev server...\n");

    // Detect OS and choose appropriate script
    const platform = process.platform;
    const isWindows = platform === "win32";
    const scriptName = isWindows
      ? "restart-dev-server.ps1"
      : "restart-dev-server.sh";
    
    // Path to restart script - resolve from package root
    const scriptPath = resolve(PACKAGE_ROOT, "scripts", scriptName);
    console.log(`📝 Script path: ${scriptPath}`);
    console.log(`📁 Package root: ${PACKAGE_ROOT}`);
    console.log(`🖥️  Platform: ${platform}`);

    // Check if script exists
    const fs = await import("fs");
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`Script not found at: ${scriptPath}`);
    }

    // Execute script based on platform
    let command: string;
    if (isWindows) {
      command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`;
    } else {
      // Make sure script is executable
      await execAsync(`chmod +x "${scriptPath}"`);
      command = `bash "${scriptPath}"`;
    }

    console.log(`🔧 Executing: ${command}`);

    const { stdout, stderr } = await execAsync(command, {
      cwd: PACKAGE_ROOT,
      shell: true,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    });

    // PowerShell often writes to stderr even for normal output
    // Bash scripts also write to stderr for info messages
    const output = stdout || stderr || "";

    if (output.trim()) {
      console.log("📤 Script output:");
      console.log(output);
    }

    // Check if server is ready by looking for success indicators in output
    const serverReady = output.includes("[SUCCESS] Server is up and running");
    const serverStarted =
      output.includes("[SUCCESS] Dev server process started") ||
      output.includes("Dev server process started!");

    // Poll server health endpoint to confirm it's running
    let healthCheckPassed = false;
    if (serverStarted) {
      console.log("🔍 Checking server health...");
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        try {
          const healthCheck = await new Promise<boolean>((resolve) => {
            const req = request(
              {
                hostname: "localhost",
                port: 3000,
                path: "/",
                method: "GET",
                timeout: 2000,
              },
              (res) => {
                resolve(res.statusCode === 200 || res.statusCode === 404); // 404 is ok, means server is up
              }
            );
            req.on("error", () => resolve(false));
            req.on("timeout", () => {
              req.destroy();
              resolve(false);
            });
            req.end();
          });

          if (healthCheck) {
            healthCheckPassed = true;
            console.log("✅ Server health check passed!");
            break;
          }
        } catch (error) {
          // Server not ready yet
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    sendJSON(res, 200, {
      success: true,
      message: healthCheckPassed
        ? "Dev server restarted and is running!"
        : serverStarted
        ? "Dev server restart initiated (still starting...)"
        : "Dev server restart initiated",
      serverReady: healthCheckPassed,
      serverStarted: serverStarted || healthCheckPassed,
      output: output,
    });
  } catch (error: any) {
    console.error("❌ Restart error:", error);
    console.error("   Error details:", {
      message: error.message,
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr,
    });
    sendJSON(res, 500, {
      error: "Failed to restart dev server",
      message: error.message,
      details: error.stderr || error.stdout || undefined,
    });
  }
}

async function handleCheckDevServer(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method === "OPTIONS") {
    sendJSON(res, 200, {});
    return;
  }

  if (req.method !== "GET") {
    sendJSON(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    // Check if dev server is responding on port 3000
    const devServerUrl = "http://localhost:3000";
    const maxAttempts = 1; // Just one quick check
    let isRunning = false;

    for (let i = 0; i < maxAttempts; i++) {
      try {
        const healthCheck = await new Promise<boolean>((resolve) => {
          const req = request(
            {
              hostname: "localhost",
              port: 3000,
              path: "/",
              method: "GET",
              timeout: 2000,
            },
            (res) => {
              // Any response (200, 404, etc.) means server is up
              resolve(true);
            }
          );
          req.on("error", () => resolve(false));
          req.on("timeout", () => {
            req.destroy();
            resolve(false);
          });
          req.end();
        });

        if (healthCheck) {
          isRunning = true;
          break;
        }
      } catch (error) {
        // Server not responding
      }
    }

    sendJSON(res, 200, {
      running: isRunning,
      url: devServerUrl,
      message: isRunning
        ? "Dev server is running"
        : "Dev server is not responding",
    });
  } catch (error: any) {
    console.error("❌ Check dev server error:", error);
    sendJSON(res, 500, {
      error: "Failed to check dev server",
      message: error.message,
      running: false,
    });
  }
}

function startServer(port: number, triedPorts: number[] = []): void {
  const server = createServer((req, res) => {
    // Log all incoming requests for debugging
    console.log(`📥 ${req.method} ${req.url}`);

    if (req.url === "/api/sync-tokens") {
      handleSync(req, res);
    } else if (req.url === "/api/sync-to-production") {
      handleSync(req, res); // Same handler, checks syncMode
    } else if (req.url === "/api/restart-dev-server") {
      console.log("🔄 Restart endpoint called");
      handleRestart(req, res);
    } else if (req.url === "/api/check-dev-server") {
      handleCheckDevServer(req, res);
    } else if (req.url === "/health") {
      sendJSON(res, 200, { status: "ok", port });
    } else {
      sendJSON(res, 404, { error: "Not found" });
    }
  });

  server.listen(port, () => {
    console.log(`🚀 Local sync server running on http://localhost:${port}`);
    console.log(`📡 Endpoint: POST http://localhost:${port}/api/sync-tokens`);
    console.log(
      `🔄 Endpoint: POST http://localhost:${port}/api/restart-dev-server`
    );
    console.log(
      `🔍 Endpoint: GET http://localhost:${port}/api/check-dev-server`
    );
    console.log(`💚 Health check: http://localhost:${port}/health\n`);
    if (port !== PORT) {
      console.log(`💡 Note: Using port ${port} (${PORT} was in use)`);
      console.log(`   Update plugin Server URL to: http://localhost:${port}\n`);
    }
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      const allTriedPorts = [...triedPorts, port];
      const nextPort = ALTERNATIVE_PORTS.find(
        (p) => !allTriedPorts.includes(p)
      );

      if (nextPort) {
        console.log(`⚠️  Port ${port} is in use, trying port ${nextPort}...\n`);
        startServer(nextPort, allTriedPorts);
      } else {
        console.error(`\n❌ All ports tried are in use!\n`);
        console.log("💡 Solutions:");
        console.log(
          `   1. Stop processes using ports: ${allTriedPorts.join(", ")}`
        );
        console.log(
          `   2. Use a specific port (PowerShell): $env:PORT=3006; pnpm dev:sync-server`
        );
        console.log(`   3. Kill processes on ports:`);
        allTriedPorts.forEach((p) => {
          console.log(
            `      Port ${p}: Get-NetTCPConnection -LocalPort ${p} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }`
          );
        });
        console.log();
        process.exit(1);
      }
    } else {
      throw error;
    }
  });
}

startServer(PORT);
