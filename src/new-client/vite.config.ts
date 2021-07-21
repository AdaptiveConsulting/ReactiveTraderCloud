import path, { resolve } from "path"
import { readdirSync } from "fs"
import { defineConfig, loadEnv } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

const TARGET = process.env.TARGET || "web"

function apiMockReplacerPlugin(): Plugin {
  return {
    name: "apiMockReplacerPlugin",
    enforce: "pre",
    resolveId: function (source, importer) {
      if (!source.endsWith(".ts")) return null

      const file = path.parse(source)
      const files = readdirSync("." + file.dir)

      // Only continue if we can find a .service-mock.ts file available.
      if (!files.includes(`${file.name}.service-mock.ts`)) return null

      // Set the id of this file to the one importing it marked with our suffix
      // so we can load it in the load hook below
      return this.resolve(
        path.join(file.dir, `${file.name}.service-mock.ts`),
        importer,
      )
    },
  }
}

// TODO: This is a workaround until the following issue gets
// confirmed/resolved: https://github.com/vitejs/vite/issues/2460
const customPreloadPlugin = () => {
  const result: any = {
    ...((modulepreload as any)({
      index: resolve(__dirname, "dist", "index.html"),
      prefix: process.env.BASE_URL || "/",
    }) as any),
    enforce: "post",
  }
  result.writeBundle = result.generateBundle
  delete result.generateBundle
  return result
}

const eslintPlugin = {
  ...eslint({ include: "src/**/*.+(js|jsx|ts|tsx)" }),
  enforce: "pre",
}

const typescriptPlugin = {
  ...typescript(),
  enforce: "pre",
}

const webManifestPlugin = (mode: string) =>
  injectManifest(
    {
      swSrc: "./src/Web/sw.js",
      swDest: "./dist/sw.js",
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      globDirectory: "dist",
      mode,
      modifyURLPrefix: { assets: "/assets" },
    },
    () => {},
  )

// https://vitejs.dev/config/
const setConfig = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const plugins =
    mode === "development"
      ? [eslintPlugin, typescriptPlugin, reactRefresh()]
      : [customPreloadPlugin(), TARGET === "web" && webManifestPlugin(mode)]

  if (process.env.VITE_MOCKS) {
    plugins.unshift(apiMockReplacerPlugin())
  }

  return defineConfig({
    base: process.env.BASE_URL || "/",
    define: {
      __TARGET__: JSON.stringify(TARGET),
    },
    esbuild: {
      jsxInject: `import React from 'react'`,
    },
    build: {
      sourcemap: true,
    },
    server: {
      port: 1917,
      proxy: TARGET === "openfin" ? { "/config": "http://localhost:8080" } : {},
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    plugins,
  })
}

export default setConfig
