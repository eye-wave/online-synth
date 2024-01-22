import { createHtmlPlugin } from "vite-plugin-html"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import * as fs from "node:fs"
import injectHTML from "vite-plugin-html-inject"
import topLevelAwait from "vite-plugin-top-level-await"
import wasm from "vite-plugin-wasm"

const inject_data = {
  project_name: "Wavetable synth in svelte.js",
  project_description: "",
  project_version: "",
  project_keywords: "",
}

try {
  const package_json_file = fs.readFileSync("package.json", "utf-8")
  const package_json = JSON.parse(package_json_file)
  const version = package_json?.version ?? null

  const keywords = package_json?.keywords?.join(", ") ?? ""
  const description = package_json?.description + (version ? ` v${version}` : "")

  if (keywords) inject_data.project_keywords = keywords
  if (description) inject_data.project_description = description
} catch (err) {
  console.log(err)
}

let counter = 0

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: "/src",
      pkg: "/pkg",
    },
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
    svelte({
      preprocess: vitePreprocess(),
      compilerOptions: {
        customElement: true,
        discloseVersion: false,
        cssHash() {
          return `_${(++counter).toString(36)}`
        },
      },
    }),
    injectHTML(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          ...inject_data,
        },
      },
    }),
  ],
})
