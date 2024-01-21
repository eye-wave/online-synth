import { createHtmlPlugin } from "vite-plugin-html"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["*.wasm"],
  resolve: {
    alias: {
      src: "/src",
      pkg: "/pkg",
    },
  },
  optimizeDeps: {
    exclude: ["@syntect/wasm"],
  },
  build: {
    modulePreload: {
      resolveDependencies() {
        return []
      },
    },
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    svelte({ preprocess: vitePreprocess() }),
    createHtmlPlugin({ minify: true }),
  ],
})
