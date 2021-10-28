import path, { resolve } from "path"
import { fstat, readdirSync, statSync } from "fs"
import { defineConfig, loadEnv } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import copy from "rollup-plugin-copy"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

function getBaseUrl(dev: boolean) {
  return dev ? "http://localhost:1917" : process.env.BASE_URL || ""
}

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

function targetBuildPlugin(dev: boolean, target: string): Plugin {
  return {
    name: "targetBuildPlugin",
    enforce: "pre",
    resolveId: function (source, importer) {
      if (!source.endsWith(".ts")) return null

      const file = path.parse(source)
      const files = readdirSync("." + file.dir)

      // Only continue if we can find a .<target>.ts file
      if (!files.includes(`${file.name}.${target}.ts`)) return null

      // Set the id of this file to the one importing it marked with our suffix
      // so we can load it in the load hook below
      const mockPath = `${file.dir}/${file.name}.${target}.ts`
      return this.resolve(mockPath, importer)
    },
    hook: dev ? "buildStart" : "writeBundle",
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
      prefix: process.env.BASE_URL || "",
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

const copyOpenfinPlugin = (dev: boolean) => {
  const env = process.env.ENVIRONMENT || "local"
  return {
    ...copy({
      targets: [
        {
          src: "./public-openfin/*",
          dest: "./dist/config",
          transform: (contents) =>
            contents
              .toString()
              .replace(/<BASE_URL>/g, getBaseUrl(dev))
              .replace(/<ENV_NAME>/g, env)
              .replace(
                /<ENV_SUFFIX>/g,
                env === "prod" ? "" : env.toUpperCase(),
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
              .replace(/<BASE_URL>/g, getBaseUrl(dev))
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

const htmlPlugin = (dev: boolean) => {
  return {
    name: "html-transform",
    transformIndexHtml(html) {
      return html.replace(
        /href="\/manifest.json"/,
        `href="${getBaseUrl(dev)}/manifest.json"`,
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
      modifyURLPrefix: {
        assets: `${getBaseUrl(mode === "development")}/assets`,
      },
    },
    () => {},
  )

// https://vitejs.dev/config/
const setConfig = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const isDev = mode === "development"
  const plugins = isDev
    ? [eslintPlugin, typescriptPlugin, reactRefresh()]
    : [customPreloadPlugin()]

  const TARGET = process.env.TARGET || "web"

  if (TARGET === "web") {
    plugins.push(injectWebServiceWorkerPlugin(mode))
  }

  if (TARGET === "openfin") {
    plugins.push(copyOpenfinPlugin(isDev))
  }

  if (process.env.VITE_MOCKS) {
    plugins.unshift(apiMockReplacerPlugin())
  }

  plugins.unshift(indexSwitchPlugin(TARGET))
  plugins.unshift(targetBuildPlugin(isDev, TARGET))
  plugins.push(copyWebManifestPlugin(mode === "development"))
  plugins.push(htmlPlugin(isDev))

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
