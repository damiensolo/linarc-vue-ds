import type { Plugin } from "vite";

/**
 * Vite plugin to suppress #app-manifest pre-transform errors
 * These errors occur because Nuxt handles manifest imports internally
 */
export function suppressAppManifestErrors(): Plugin {
  return {
    name: "suppress-app-manifest-errors",
    enforce: "pre",
    configResolved(config) {
      // Intercept Vite's logger to filter out app-manifest errors
      const originalError = config.logger.error;
      const originalWarn = config.logger.warn;
      
      // Helper to check if message should be suppressed
      const shouldSuppress = (msg: string | unknown): boolean => {
        if (typeof msg !== "string") return false;
        const lowerMsg = msg.toLowerCase();
        return (
          lowerMsg.includes("#app-manifest") ||
          lowerMsg.includes("failed to resolve import") ||
          lowerMsg.includes("pre-transform error") ||
          lowerMsg.includes("vite:import-analysis") ||
          (lowerMsg.includes("app-manifest") && lowerMsg.includes("does the file exist"))
        );
      };
      
      config.logger.error = (msg: string | unknown, options?: unknown) => {
        if (shouldSuppress(msg)) {
          // Suppress this error
          return;
        }
        originalError.call(config.logger, msg, options);
      };
      
      config.logger.warn = (msg: string | unknown, options?: unknown) => {
        if (shouldSuppress(msg)) {
          // Suppress this warning
          return;
        }
        originalWarn.call(config.logger, msg, options);
      };
    },
    // Also intercept transform errors
    transform(code, id) {
      // Don't transform, just pass through
      return null;
    },
  };
}

