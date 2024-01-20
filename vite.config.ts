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
    rollupOptions: {
      // output: {
      //   chunkFileNames: "[name].js",
      //   entryFileNames: "[name].js",
      //   assetFileNames: "[name].[ext]",
      // },
    },
    modulePreload: {
      resolveDependencies() {
        return []
      },
    },
  },
  plugins: [svelte({ preprocess: vitePreprocess() }), createHtmlPlugin({ minify: true })],
})
