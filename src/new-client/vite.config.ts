import path, { resolve } from "path"
import { readdirSync, statSync } from "fs"
import { defineConfig, loadEnv } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import copy from "rollup-plugin-copy"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

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
      const mockPath = `${file.dir}/${file.name}.service-mock.ts`
      return this.resolve(mockPath, importer)
    },
  }
}

function indexSwitchPlugin(target: string): Plugin {
  return {
    name: "indexSwitchPlugin",
    enforce: "pre",
    resolveId: function (source: string, importer) {
      if (!source.startsWith("./main")) {
        return null
      }

      const importedFile = path.parse(source)
      const importerFile = path.parse(importer)

      const candidate = path.join(
        importerFile.dir,
        importedFile.dir,
        `${importedFile.name}.${target.toLowerCase()}.ts`,
      )

      try {
        statSync(candidate)
        return candidate
      } catch (e) {
        return null
      }
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

const copyOpenfinPlugin = (dev: boolean) => ({
  ...copy({
    targets: [
      {
        src: "./public-openfin/*",
        dest: "./dist/config",
        transform: (contents) =>
          contents
            .toString()
            .replace(
              /<BASE_URL>/g,
              process.env.OPENFIN_DOMAIN && process.env.BASE_URL
                ? `${process.env.OPENFIN_DOMAIN}${process.env.BASE_URL}`
                : process.env.PORT
                ? `http://localhost:${process.env.PORT}`
                : "http://localhost:1917",
            )
            .replace(/<ENV_NAME>/g, process.env.ENV_NAME || "local")
            .replace(/<ENV_SUFFIX>/g, process.env.ENV_SUFFIX || "LOCAL"),
      },
    ],
    verbose: true,
    // For dev, (most) output generation hooks are not called, so this needs to be buildStart.
    // For prod, writeBundle is the appropriate hook, otherwise it gets wiped by the dist clean.
    // Ref: https://vitejs.dev/guide/api-plugin.html#universal-hooks
    hook: dev ? "buildStart" : "writeBundle",
  }),
})

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
      : [customPreloadPlugin()]

  const TARGET = process.env.TARGET || "web"

  if (TARGET === "web") {
    plugins.push(webManifestPlugin(mode))
  }

  if (TARGET === "openfin" || TARGET === "launcher") {
    plugins.push(copyOpenfinPlugin(mode === "development"))
  }

  if (process.env.VITE_MOCKS) {
    plugins.unshift(apiMockReplacerPlugin())
  }

  plugins.unshift(indexSwitchPlugin(TARGET))

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
      port: Number(process.env.PORT) || 1917,
    },
    resolve: {
      alias: [
        {
          // see https://github.com/vitejs/vite/issues/279#issuecomment-773454743
          find: "@",
          replacement: "/src",
        },
      ],
    },
    plugins,
  })
}

export default setConfig
