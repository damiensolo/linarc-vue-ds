/**
 * Figma Plugin Main Code
 *
 * Handles variable fetching via Plugin API and communication with local sync server.
 */

// Show the plugin UI
// Note: __html__ is injected by Figma's build process
// For development, we'll use a placeholder that gets replaced
figma.showUI(__html__ || "<html><body>Loading...</body></html>", {
  width: 400,
  height: 600,
  themeColors: true,
});

// Get current file info
const fileKey = figma.fileKey || "";
const fileName = figma.root.name;

// Send initial data to UI
figma.ui.postMessage({
  type: "init",
  fileKey,
  fileName,
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "sync-tokens") {
    try {
      // Get variables using Plugin API
      const localVariables = figma.variables.getLocalVariables();

      if (localVariables.length === 0) {
        figma.ui.postMessage({
          type: "error",
          message: "No variables found in this file",
        });
        return;
      }

      // Convert Figma variables to format expected by sync function
      const variables: Record<string, any> = {};

      localVariables.forEach((variable) => {
        const name = variable.name;
        const valuesByMode = variable.valuesByMode;

        // Get value from first mode (usually "default" or first mode)
        const modeId = Object.keys(valuesByMode)[0];
        const value = valuesByMode[modeId];

        // Convert value based on variable type
        let stringValue: string;

        if (variable.resolvedType === "COLOR") {
          // Convert RGB to hex
          const rgb = value as RGB;
          stringValue = rgbToHex(rgb);
        } else if (variable.resolvedType === "FLOAT") {
          stringValue = String(value);
        } else {
          stringValue = String(value);
        }

        variables[name] = stringValue;
      });

      // Send to sync server (handles both local and production)
      let serverUrl = msg.serverUrl || "http://localhost:3001";
      const syncMode = msg.syncMode || "local";
      
      // Auto-start server if not running
      try {
        const helperUrl = "http://localhost:2999";
        const checkResponse = await fetch(`${helperUrl}/check-sync-server`, {
          method: "GET",
          signal: AbortSignal.timeout(2000),
        });
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (!checkData.running) {
            // Server not running, try to start it
            console.log("🔄 Sync server not running, attempting to start...");
            const startResponse = await fetch(`${helperUrl}/start-sync-server`, {
              method: "POST",
              signal: AbortSignal.timeout(15000),
            });
            
            if (startResponse.ok) {
              const startData = await startResponse.json();
              serverUrl = startData.url;
              console.log(`✅ Sync server started: ${serverUrl}`);
              figma.notify("🔄 Starting sync server...", { timeout: 2000 });
              // Wait a moment for server to be ready
              await new Promise((resolve) => setTimeout(resolve, 2000));
            }
          } else if (checkData.url) {
            // Server is running, use the detected port
            serverUrl = checkData.url;
          }
        }
      } catch (helperError) {
        // Helper not running - that's ok, try direct connection
        console.log("⚠️  Auto-start helper not available, trying direct connection");
      }
      
      // Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      let response: Response;
      try {
        response = await fetch(`${serverUrl}/api/sync-tokens`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            variables,
            fileKey,
            nodeId: msg.nodeId || "0:1",
            syncMode: syncMode,
            githubToken: msg.githubToken,
            createPR: syncMode === "production", // Create PR for production sync
          }),
          signal: controller.signal,
        });
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === "AbortError") {
          throw new Error("Request timeout: Server took too long to respond");
        }
        if (fetchError.message?.includes("Failed to fetch")) {
          throw new Error(`Cannot connect to sync server at ${serverUrl}. Make sure the server is running: pnpm --filter design-system dev:sync-server`);
        }
        throw fetchError;
      }
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = "Failed to sync tokens";
        try {
          const error = await response.json();
          errorMessage = error.message || error.error || errorMessage;
        } catch (e) {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      figma.ui.postMessage({
        type: "success",
        message: "Tokens synced successfully!",
        result,
      });

      figma.notify("✅ Tokens synced successfully!");
    } catch (error: any) {
      console.error("Sync error:", error);
      figma.ui.postMessage({
        type: "error",
        message: error.message || "Failed to sync tokens",
      });
      figma.notify(`❌ Error: ${error.message}`, { error: true });
    }
  }

  if (msg.type === "restart-dev-server") {
    try {
      const serverUrl = msg.serverUrl || "http://localhost:3001";
      const response = await fetch(`${serverUrl}/api/restart-dev-server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to restart dev server");
      }

      const result = await response.json();

      figma.ui.postMessage({
        type: "restart-success",
        message: result.message || "Dev server restart initiated!",
        result,
      });

      if (result.serverReady) {
        figma.notify("✅ Dev server restarted and is running!");
      } else {
        figma.notify("✅ Dev server restart initiated!");
      }
    } catch (error: any) {
      console.error("Restart error:", error);
      figma.ui.postMessage({
        type: "restart-error",
        message: error.message || "Failed to restart dev server",
      });
      figma.notify(`❌ Error: ${error.message}`, { error: true });
    }
  }

  if (msg.type === "close") {
    figma.closePlugin();
  }
};

// Helper function to convert RGB to hex
function rgbToHex(rgb: RGB): string {
  const r = Math.round(rgb.r * 255);
  const g = Math.round(rgb.g * 255);
  const b = Math.round(rgb.b * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
