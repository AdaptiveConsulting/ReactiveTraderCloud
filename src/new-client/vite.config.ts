import path, { resolve } from "path"
import { readdirSync, statSync } from "fs"
import { defineConfig, loadEnv } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import copy from "rollup-plugin-copy"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

const BASE_URL = "http://localhost:1917"

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
            .replace(/<BASE_URL>/g, dev ? BASE_URL : process.env.BASE_URL || "")
            .replace(/<ENV_NAME>/g, process.env.ENVIRONMENT || "local")
            .replace(
              /<ENV_SUFFIX>/g,
              process.env.ENVIRONMENT
                ? process.env.ENVIRONMENT.toUpperCase()
                : "LOCAL",
            ),
      },
    ],
    verbose: true,
    // For dev, (most) output generation hooks are not called, so this needs to be buildStart.
    // For prod, writeBundle is the appropriate hook, otherwise it gets wiped by the dist clean.
    // Ref: https://vitejs.dev/guide/api-plugin.html#universal-hooks
    hook: dev ? "buildStart" : "writeBundle",
  }),
})

const copyWebManifestPlugin = (dev: boolean) => {
  const envSuffix = (process.env.ENVIRONMENT || "local").toUpperCase()
  return {
    ...copy({
      targets: [
        {
          src: "./public/.manifest.json",
          dest: dev ? "./public" : "./dist",
          rename: "manifest.json",
          transform: (contents) =>
            contents
              .toString()
              .replace(
                /<BASE_URL>/g,
                dev ? BASE_URL : process.env.BASE_URL || "",
              )
              // We don't want to show PROD in the PWA name
              .replace(
                /{{environment_suffix}}/g,
                envSuffix === "PROD" ? "" : envSuffix,
              ),
        },
      ],
      verbose: true,
      // For dev, (most) output generation hooks are not called, so this needs to be buildStart.
      // For prod, writeBundle is the appropriate hook, otherwise it gets wiped by the dist clean.
      // Ref: https://vitejs.dev/guide/api-plugin.html#universal-hooks
      hook: dev ? "buildStart" : "writeBundle",
    }),
  }
}

const htmlPlugin = () => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return html.replace(
        /href="\/manifest.json"/,
        `href="${process.env.BASE_URL || BASE_URL}/manifest.json"`,
      )
    },
  }
}

const injectWebServiceWorkerPlugin = (mode: string) =>
  injectManifest(
    {
      swSrc: "./src/Web/sw.js",
      swDest: "./dist/sw.js",
      dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
      globDirectory: "dist",
      mode,
      modifyURLPrefix: { assets: `${process.env.BASE_URL || BASE_URL}/assets` },
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
    plugins.push(injectWebServiceWorkerPlugin(mode))
    plugins.push(copyWebManifestPlugin(mode === "development"))
  }

  if (TARGET === "openfin") {
    plugins.push(copyOpenfinPlugin(mode === "development"))
  }

  if (process.env.VITE_MOCKS) {
    plugins.unshift(apiMockReplacerPlugin())
  }

  plugins.unshift(indexSwitchPlugin(TARGET))
  plugins.push(htmlPlugin())

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
      proxy: !process.env.VITE_MOCKS && {
        "/ws": {
          // To test local execution of nginx gateway in Docker,
          // use e.g.target: "http://localhost:55000", (no need for changeOrigin in that case)
          target:
            process.env.VITE_HYDRA_URL ||
            "wss://trading-web-gateway-rt-dev.demo.hydra.weareadaptive.com",
          changeOrigin: true,
          ws: true,
        },
      },
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
