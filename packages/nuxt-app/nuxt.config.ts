import { suppressAppManifestErrors } from "./vite-plugin-suppress-app-manifest";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },

  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@vueuse/nuxt"],

  css: ["../design-system/src/style.css"],

  alias: {
    "@linarc/design-system": "../design-system/src",
  },

  vite: {
    resolve: {
      alias: {
        "@linarc/design-system": new URL(
          "../design-system/src",
          import.meta.url
        ).pathname,
      },
    },
    plugins: [
      // Suppress #app-manifest pre-transform errors
      suppressAppManifestErrors(),
    ],
    logLevel: "warn",
    // Exclude manifest-related files from optimization
    optimizeDeps: {
      exclude: ["#app-manifest"],
    },
  },

  typescript: {
    typeCheck: false, // Disable in dev for faster startup, use `pnpm typecheck` separately
  },

  // Deployment configuration
  // For GitHub Pages: uses static generation (SSG)
  // For Vercel: uses SSR by default (can be overridden)
  ssr:
    process.env.NODE_ENV === "production" && process.env.GITHUB_PAGES === "true"
      ? false
      : true,

  // GitHub Pages base URL configuration
  // For root domain: baseURL: "/"
  // For subdirectory (e.g., /linarc-vue-ds/): baseURL: "/linarc-vue-ds/"
  app: {
    baseURL:
      process.env.GITHUB_PAGES === "true"
        ? process.env.GITHUB_REPOSITORY
          ? `/${process.env.GITHUB_REPOSITORY.split("/")[1]}/`
          : "/"
        : "/",
    head: {
      title: "Linarc Data Management Platform",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
});
