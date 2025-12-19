#!/usr/bin/env tsx
/**
 * Webhook Handler for CI/CD Integration (Optional)
 *
 * Handles webhook requests from Figma plugin for CI/CD workflows.
 * Creates GitHub commits/PRs with token updates.
 */

import { createServer, IncomingMessage, ServerResponse } from "http";
import { syncFromFigmaMCP } from "../scripts/sync-from-figma-mcp.js";

const PORT = process.env.WEBHOOK_PORT ? parseInt(process.env.WEBHOOK_PORT) : 3002;
const API_KEY = process.env.WEBHOOK_API_KEY || "";

interface WebhookRequest {
  variables: Record<string, any>;
  fileKey: string;
  nodeId?: string;
  apiKey?: string;
}

function sendJSON(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(data));
}

function validateAuth(req: IncomingMessage, apiKey?: string): boolean {
  if (!API_KEY) {
    return true; // No auth required if API_KEY not set
  }

  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${API_KEY}`) {
    return true;
  }

  // Check API key in body (for webhook)
  if (apiKey === API_KEY) {
    return true;
  }

  return false;
}

async function handleWebhook(req: IncomingMessage, res: ServerResponse) {
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
      const data: WebhookRequest = JSON.parse(body);

      // Validate authentication
      if (!validateAuth(req, data.apiKey)) {
        sendJSON(res, 401, { error: "Unauthorized" });
        return;
      }

      if (!data.variables || Object.keys(data.variables).length === 0) {
        sendJSON(res, 400, {
          error: "No variables provided",
        });
        return;
      }

      console.log(`\n🔄 Processing webhook sync...`);
      console.log(`📁 File: ${data.fileKey || "unknown"}`);

      // Sync tokens
      const tokens = syncFromFigmaMCP(data.variables);

      // TODO: Implement GitHub integration
      // For now, just return success
      // In production, you would:
      // 1. Create a git commit with token changes
      // 2. Create a PR (optional)
      // 3. Return PR URL

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
        note: "GitHub integration not yet implemented",
      });
    } catch (error: any) {
      console.error("Webhook error:", error);
      sendJSON(res, 500, {
        error: "Failed to process webhook",
        message: error.message,
      });
    }
  });
}

const server = createServer((req, res) => {
  if (req.url === "/webhook/sync-tokens") {
    handleWebhook(req, res);
  } else if (req.url === "/health") {
    sendJSON(res, 200, { status: "ok", port: PORT });
  } else {
    sendJSON(res, 404, { error: "Not found" });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Webhook server running on http://localhost:${PORT}`);
  console.log(`📡 Endpoint: POST http://localhost:${PORT}/webhook/sync-tokens`);
  console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  if (API_KEY) {
    console.log(`🔐 API Key authentication enabled`);
  } else {
    console.log(`⚠️  API Key not set - webhook is open (set WEBHOOK_API_KEY env var)`);
  }
});

