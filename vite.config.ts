import { analyzer } from "vite-bundle-analyzer"
import { createHtmlPlugin } from "vite-plugin-html"
import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { VitePWA } from "vite-plugin-pwa"
import * as fs from "node:fs"
import deadFile from "vite-plugin-deadfile"
import injectHTML from "vite-plugin-html-inject"
import svg from "@poppanator/sveltekit-svg"
import topLevelAwait from "vite-plugin-top-level-await"
import TurboConsole from "unplugin-turbo-console/vite"
import wasm from "vite-plugin-wasm"

const prod = process.env.NODE_ENV === "production"
const mode = prod ? "production" : "development"
const analyze = process.env.VITE_ANALYZE === "true"

function injectData() {
  const data = {
    project_name: "Wavetable synth in svelte.js",
    project_description: "",
    project_version: "",
    project_keywords: "",
    timestamp: "",
  }

  try {
    const package_json_file = fs.readFileSync("package.json", "utf-8")
    const package_json = JSON.parse(package_json_file)
    const version = package_json?.version ?? null

    const keywords = package_json?.keywords?.join(", ") ?? ""
    const description = package_json?.description + (version ? ` v${version}` : "")

    data.timestamp = new Date().toLocaleDateString("en-UK", {
      hour: "2-digit",
      minute: "2-digit",
    })

    if (keywords) data.project_keywords = keywords
    if (version) data.project_version = version
    if (description) data.project_description = description
  } catch (err) {
    console.log(err)
  }

  return data
}

let counter = 0

// https://vitejs.dev/config/
export default defineConfig({
  mode,
  resolve: {
    alias: {
      src: "/src",
      ico: "/src/assets/icons",
      pkg: "/target/wasm-bundler",
    },
  },
  esbuild: {
    drop: prod ? ["console", "debugger"] : [],
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
    svg(),
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
    VitePWA({
      registerType: "autoUpdate",
    }),
    !prod && TurboConsole(),
    analyze &&
      analyzer({
        analyzerMode: "static",
        summary: true,
        fileName: "vite_bundle_analytics",
      }),
    prod &&
      deadFile({
        root: "src",
        include: ["**/*"],
        exclude: [
          "**/*.css",
          "**/*.html",
          "**/*.rs",
          "**/*.svg",
          "**/*.test.ts",
          "app.d.ts",
          "vite-env.d.ts",
        ],
      }),
    injectHTML(),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: injectData(),
      },
    }),
  ],
  server: {
    port: 3000,
  },
})
