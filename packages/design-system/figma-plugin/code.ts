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
      // IMPORTANT: Preserve alias structure so syncFromFigmaMCP can resolve them
      const variables: Record<string, any> = {};
      
      // Build a map of variables by ID and name for alias resolution
      const variableById = new Map<string, Variable>();
      const variableIdByName = new Map<string, string>(); // Map name -> ID
      
      // Build a map of collections by ID for collection name lookup
      const collectionById = new Map<string, VariableCollection>();
      try {
        const collections = figma.variables.getLocalVariableCollections();
        collections.forEach((collection) => {
          collectionById.set(collection.id, collection);
        });
      } catch (error) {
        console.warn("Could not fetch collections:", error);
      }
      
      localVariables.forEach((v) => {
        variableById.set(v.id, v);
        variableIdByName.set(v.name, v.id);
      });

      localVariables.forEach((variable) => {
        const name = variable.name;
        const valuesByMode = variable.valuesByMode;

        // Get value from first mode (usually "default" or first mode)
        const modeId = Object.keys(valuesByMode)[0];
        const value = valuesByMode[modeId];

        // Get collection information for categorization
        const collection = variable.variableCollectionId 
          ? collectionById.get(variable.variableCollectionId)
          : null;
        const collectionName = collection ? collection.name : undefined;

        // Normalize variable ID format (Figma might use different formats)
        const normalizedId = variable.id.startsWith("VariableID:") 
          ? variable.id 
          : `VariableID:${variable.id}`;
        
        // Check if this is an alias variable
        // In Figma Plugin API, alias values are VariableAlias objects with an 'id' property
        // They don't have 'r', 'g', 'b' properties like RGB objects
        if (value && typeof value === "object" && "id" in value && !("r" in value) && !("g" in value)) {
          // This is an alias - preserve the structure for resolution
          const alias = value as VariableAlias;
          const referencedVar = variableById.get(alias.id);
          
          // Normalize the alias ID format
          const aliasId = alias.id.startsWith("VariableID:") 
            ? alias.id 
            : `VariableID:${alias.id}`;
          
          // Store alias with both ID and name reference for better resolution
          // Include resolvedType and collection so sync script can categorize correctly
          variables[name] = {
            type: "VARIABLE_ALIAS",
            id: aliasId,
            resolvedType: variable.resolvedType, // Include type for categorization
            collection: collectionName, // Include collection name for categorization
            // Include referenced variable name if available (helps with resolution)
            name: referencedVar ? referencedVar.name : undefined,
          };
        } else if (variable.resolvedType === "COLOR") {
          // Direct color value - convert RGB to hex
          const rgb = value as RGB;
          const hexValue = rgbToHex(rgb);
          // Include collection metadata for categorization
          if (collectionName) {
            variables[name] = {
              value: hexValue,
              resolvedType: "COLOR",
              collection: collectionName,
            };
          } else {
            variables[name] = hexValue;
          }
          // Also store by normalized ID for alias resolution (without metadata)
          variables[normalizedId] = hexValue;
        } else if (variable.resolvedType === "FLOAT") {
          // For FLOAT values, include metadata to help with categorization
          const numValue = typeof value === "number" ? value : parseFloat(String(value));
          // Store as object with type info so sync script can categorize correctly
          variables[name] = {
            value: numValue,
            resolvedType: "FLOAT",
            collection: collectionName, // Include collection name for categorization
          };
          // Also store by normalized ID for alias resolution
          variables[normalizedId] = {
            value: numValue,
            resolvedType: "FLOAT",
          };
        } else if (variable.resolvedType === "STRING") {
          // For STRING values, include metadata for typography/shadow detection
          const stringValue = String(value);
          variables[name] = {
            value: stringValue,
            resolvedType: "STRING",
            collection: collectionName, // Include collection name for categorization
          };
          // Also store by normalized ID for alias resolution
          variables[normalizedId] = stringValue;
        } else {
          const stringValue = String(value);
          variables[name] = collectionName ? {
            value: stringValue,
            resolvedType: variable.resolvedType,
            collection: collectionName,
          } : stringValue;
          variables[normalizedId] = stringValue;
        }
      });

      // Send to sync server (handles both local and production)
      let serverUrl = msg.serverUrl || "http://localhost:3001";
      const syncMode = msg.syncMode || "local";
      
      // Auto-start server if not running
      try {
        const helperUrl = "http://localhost:2999";
        const checkResponse = await fetchWithTimeout(
          `${helperUrl}/check-sync-server`,
          { method: "GET" },
          2000
        );
        
        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (!checkData.running) {
            // Server not running, try to start it
            console.log("🔄 Sync server not running, attempting to start...");
            const startResponse = await fetchWithTimeout(
              `${helperUrl}/start-sync-server`,
              { method: "POST" },
              15000
            );
            
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
      let response: Response;
      try {
        response = await fetchWithTimeout(
          `${serverUrl}/api/sync-tokens`,
          {
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
          },
          30000 // 30 second timeout
        );
      } catch (fetchError: any) {
        if (fetchError.message && fetchError.message.includes("timeout")) {
          throw new Error("Request timeout: Server took too long to respond");
        }
        if (fetchError.message && fetchError.message.includes("Failed to fetch")) {
          throw new Error(`Cannot connect to sync server at ${serverUrl}. Make sure the server is running: pnpm --filter design-system dev:sync-server`);
        }
        throw fetchError;
      }

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

// Helper function to get variable name by ID (for alias resolution)
function getVariableNameById(
  id: string,
  variables: Variable[]
): string | undefined {
  const variable = variables.find((v) => v.id === id);
  return variable ? variable.name : undefined;
}

// Helper function to fetch with timeout (AbortController not available in Figma)
function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), timeoutMs)
    ),
  ]);
}
