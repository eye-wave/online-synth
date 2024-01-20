import { createHtmlPlugin } from "vite-plugin-html"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: "/src",
    },
  },
  build: {
    modulePreload: {
      resolveDependencies() {
        return []
      },
    },
  },
  plugins: [createHtmlPlugin({ minify: true }), svelte({ preprocess: vitePreprocess() })],
})
