#!/usr/bin/env tsx
/**
 * Auto-Start Helper for Figma Plugin
 * 
 * This runs in the background and automatically starts the sync server
 * when the plugin tries to connect. No manual terminal needed!
 */

import { spawn } from "child_process";
import { createServer, IncomingMessage, ServerResponse, request } from "http";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PACKAGE_ROOT = resolve(__dirname, "..");
const REPO_ROOT = resolve(__dirname, "../..");

const HELPER_PORT = 2999; // Different port for the helper (avoid conflict with Nuxt on 3000)
const SYNC_SERVER_PORT = 3001;
const SYNC_SERVER_SCRIPT = resolve(PACKAGE_ROOT, "server/local-sync-server.ts");

let syncServerProcess: any = null;
let syncServerPort = SYNC_SERVER_PORT;

// Check if sync server is running
async function checkSyncServer(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = request(
      {
        hostname: "localhost",
        port: port,
        path: "/health",
        method: "GET",
        timeout: 1000,
      },
      (res) => {
        resolve(res.statusCode === 200);
      }
    );

    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Start the sync server
function startSyncServer(): Promise<number> {
  return new Promise((resolve, reject) => {
    if (syncServerProcess) {
      console.log("⚠️  Sync server already starting...");
      resolve(syncServerPort);
      return;
    }

    console.log("🚀 Starting sync server...");

    // Try ports 3001-3005
    const ports = [3001, 3002, 3003, 3004, 3005];
    let currentPortIndex = 0;

    const tryStart = (portIndex: number) => {
      if (portIndex >= ports.length) {
        reject(new Error("All ports are in use"));
        return;
      }

      const port = ports[portIndex];
      syncServerPort = port;

      // Start server process
      syncServerProcess = spawn("npx", ["tsx", SYNC_SERVER_SCRIPT], {
        cwd: REPO_ROOT,
        shell: true,
        stdio: "pipe",
        env: {
          ...process.env,
          PORT: port.toString(),
        },
      });

      syncServerProcess.stdout?.on("data", (data: Buffer) => {
        const output = data.toString();
        console.log(`[Sync Server] ${output.trim()}`);
        
        // Check if server started successfully
        if (output.includes("Local sync server running")) {
          console.log(`✅ Sync server started on port ${port}`);
          resolve(port);
        }
      });

      syncServerProcess.stderr?.on("data", (data: Buffer) => {
        const output = data.toString();
        // Check if port is in use
        if (output.includes("EADDRINUSE") || output.includes("address already in use")) {
          console.log(`⚠️  Port ${port} in use, trying next port...`);
          syncServerProcess.kill();
          syncServerProcess = null;
          tryStart(portIndex + 1);
        } else {
          console.error(`[Sync Server Error] ${output.trim()}`);
        }
      });

      syncServerProcess.on("exit", (code: number) => {
        if (code !== 0 && code !== null) {
          console.log(`⚠️  Sync server exited with code ${code}`);
        }
        syncServerProcess = null;
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        if (syncServerProcess && !syncServerProcess.killed) {
          // Check if server is actually running
          checkSyncServer(port).then((running) => {
            if (running) {
              resolve(port);
            } else {
              console.log(`⚠️  Port ${port} didn't start, trying next...`);
              syncServerProcess?.kill();
              syncServerProcess = null;
              tryStart(portIndex + 1);
            }
          });
        }
      }, 10000);
    };

    tryStart(0);
  });
}

// Helper server that auto-starts sync server on demand
const helperServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === "/start-sync-server" && req.method === "POST") {
    try {
      // Check if server is already running
      const ports = [3001, 3002, 3003, 3004, 3005];
      let runningPort = null;

      for (const port of ports) {
        const running = await checkSyncServer(port);
        if (running) {
          runningPort = port;
          break;
        }
      }

      if (runningPort) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            success: true,
            message: "Sync server already running",
            port: runningPort,
            url: `http://localhost:${runningPort}`,
          })
        );
        return;
      }

      // Start the server
      const port = await startSyncServer();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Sync server started",
          port: port,
          url: `http://localhost:${port}`,
        })
      );
    } catch (error: any) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          success: false,
          error: error.message,
        })
      );
    }
  } else if (req.url === "/check-sync-server" && req.method === "GET") {
    // Check if sync server is running
    const ports = [3001, 3002, 3003, 3004, 3005];
    let runningPort = null;

    for (const port of ports) {
      const running = await checkSyncServer(port);
      if (running) {
        runningPort = port;
        break;
      }
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        running: runningPort !== null,
        port: runningPort,
        url: runningPort ? `http://localhost:${runningPort}` : null,
      })
    );
  } else if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", type: "auto-start-helper" }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

// Start helper server
helperServer.listen(HELPER_PORT, () => {
  console.log(`🤖 Auto-start helper running on http://localhost:${HELPER_PORT}`);
  console.log(`📡 Ready to auto-start sync server when plugin connects`);
  console.log(`\n💡 Keep this running in the background!`);
  console.log(`   The Figma plugin will automatically start the sync server when needed.`);
  console.log(`   Note: Helper uses port ${HELPER_PORT} (Nuxt uses 3000)\n`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down...");
  if (syncServerProcess) {
    syncServerProcess.kill();
  }
  helperServer.close();
  process.exit(0);
});

