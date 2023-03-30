import react from "@vitejs/plugin-react"
import { readdirSync, statSync } from "fs"
import path, { resolve } from "path"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"
import {
  ConfigEnv,
  loadEnv,
  Plugin,
  splitVendorChunkPlugin,
  UserConfigExport,
} from "vite"
import { createHtmlPlugin } from "vite-plugin-html"
import { TransformOption, viteStaticCopy } from "vite-plugin-static-copy"
import { defineConfig } from "vitest/config"

type BuildTarget = "web" | "openfin" | "finsemble"

const localPort = Number(process.env.PORT) || 1917

function getBaseUrl(dev: boolean) {
  return dev
    ? `http://localhost:${localPort}`
    : `${process.env.DOMAIN || ""}${process.env.URL_PATH || ""}` || ""
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

// Replace files with .<target> if they exist
// Note - resolveId source and importer args are different between dev and build
// Some more investigation and work should be done to improve this when possible
function targetBuildPlugin(dev: boolean, target: string): Plugin {
  return {
    name: "targetBuildPlugin",
    enforce: "pre",
    resolveId: function (source, importer, options) {
      if (dev) {
        const extension = source.split(".")[1]
        if (extension !== "ts" && extension !== "tsx") return null

        const file = path.parse(source)
        const files = readdirSync("." + file.dir)

        // Only continue if we can find a .<target>.<extension> file
        if (!files.includes(`${file.name}.${target}.${extension}`)) return null

        const mockPath = `${file.dir}/${file.name}.${target}.${extension}`
        return this.resolve(mockPath, importer)
      } else {
        const rootPrefix = "client/src/"
        const thisImporter = (importer || "").replace(/\\/g, "/")
        if (
          !importer ||
          !thisImporter.includes(rootPrefix) ||
          source === "./main"
        ) {
          return null
        }

        const importedFile = path.parse(source)
        const importerFile = path.parse(thisImporter)
        const candidatePath = path.join(
          // If imported file starts with /src we can not append it to importer dir
          // so we need to strip the path by the rootPrefix first
          importedFile.dir.startsWith("/src") &&
            importerFile.dir.includes(rootPrefix)
            ? `${importerFile.dir.split(rootPrefix)[0]}/client`
            : importerFile.dir,
          importedFile.dir,
          `${importedFile.name}.${target.toLowerCase()}`,
        )

        // Source doesn't have file extension, so try all extensions
        let candidate: string | null = null
        const extensions = ["ts", "tsx"]
        for (let i = 0; i < extensions.length; i++) {
          try {
            candidate = `${candidatePath}.${extensions[i]}`
            statSync(candidate)
            console.log("candidate good", candidate)
          } catch (e) {
            // console.log("Error with candidate", candidate, e)
            candidate = null
          }

          if (candidate) {
            break
          }
        }

        return candidate
      }
    },
  }
}

function indexSwitchPlugin(target: string): Plugin {
  return {
    name: "indexSwitchPlugin",
    enforce: "pre",
    resolveId: function (source: string, importer) {
      if (!source.startsWith("./main") || !importer) {
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
      prefix: getBaseUrl(false) || "",
    }) as any),
    enforce: "post",
  }
  result.writeBundle = result.generateBundle
  delete result.generateBundle
  return result
}

const copyPlugin = (isDev: boolean, buildTarget: BuildTarget): Plugin[] => {
  const env = process.env.ENVIRONMENT || "local"

  const transform: TransformOption | undefined = (contents) =>
    contents
      .replace(/<BASE_URL>/g, getBaseUrl(isDev || env === "local"))

      // We want the PWA banner to show on www.reactivetrader.com
      .replace(/web\.prod\./g, "www.")

      .replace(/<ENV_NAME>/g, env)
      // We don't want to show PROD in the PWA name
      .replace(/<ENV_SUFFIX>/g, env === "prod" ? "" : env.toUpperCase())

  return viteStaticCopy({
    flatten: true,
    targets:
      buildTarget === "openfin"
        ? [
            {
              src: "public-openfin/*.json",
              dest: "config",
              transform,
            },
            // for back compat to existing RT installations (that will expect an app.json)
            {
              src: "public-openfin/rt-fx.json",
              dest: "config",
              rename: "app.json",
              transform,
            },
            {
              src: "public-openfin/plugin/*",
              dest: "plugin",
            },
          ]
        : [
            {
              src: "public-pwa/manifest.json",
              dest: "",
              transform,
            },
            {
              src: "public-pwa/splashscreens/*",
              dest: "splashscreens",
            },
          ],
  })
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

const injectScriptIntoHtml = () =>
  createHtmlPlugin({
    inject: {
      data: {
        injectScript: `
          <script>
            // Hydra dependency references BigInt at run time even when the application isn't explicitly started
            // Detect this as supportsBigInt so we  can show a 'browser unsupported' message
            // Set BigInt to an anon function to prevent the runtime error 
            window.supportsBigInt = typeof BigInt !== 'undefined';
            window.BigInt = supportsBigInt ? BigInt : function(){};
          </script>
        `,
      },
    },
  })

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
    ({ swDest, count }) => {
      console.log(
        "Created service worker: ",
        swDest,
        "- injected ",
        count,
        " files",
      )
    },
  )

// Main Ref: https://vitejs.dev/config/
const setConfig: (env: ConfigEnv) => UserConfigExport = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const isDev = mode === "development"
  const viteBaseUrl = isDev ? "/" : getBaseUrl(false)

  const plugins: any[] = [react()] // stays as any[] as WB injectManifest does not return PluginOption

  if (!isDev) {
    plugins.push(splitVendorChunkPlugin(), customPreloadPlugin())
  }

  const buildTarget: BuildTarget = (process.env.TARGET as BuildTarget) || "web"

  if (buildTarget === "web") {
    plugins.push(injectWebServiceWorkerPlugin(mode))
  }

  if (process.env.VITE_MOCKS) {
    plugins.unshift(apiMockReplacerPlugin())
  }

  const proxy = process.env.VITE_MOCKS
    ? undefined
    : {
        "/ws": {
          // To test local execution of nginx gateway in Docker,
          // use e.g.target: "http://localhost:55000", (no need for changeOrigin in that case)
          target:
            process.env.VITE_HYDRA_URL ||
            "wss://trading-web-gateway-rt-dev.demo.hydra.weareadaptive.com",
          changeOrigin: true,
          ws: true,
        },
      }

  plugins.unshift(indexSwitchPlugin(buildTarget))
  plugins.unshift(targetBuildPlugin(isDev, buildTarget))
  plugins.push(copyPlugin(isDev, buildTarget))
  plugins.push(injectScriptIntoHtml())
  plugins.push(htmlPlugin(isDev))

  return defineConfig({
    base: viteBaseUrl,
    build: {
      sourcemap: true,
    },
    preview: {
      port: localPort,
    },
    server: {
      port: localPort,
      proxy,
    },
    resolve: {
      // see https://vitejs.dev/config/shared-options.html#resolve-alias
      // then https://github.com/rollup/plugins/tree/master/packages/alias#entries
      // originally inspired by https://github.com/vitejs/vite/issues/279
      alias: [
        {
          find: "@",
          replacement: "/src",
        },
      ],
    },
    plugins,
    test: {
      globals: true,
      environment: "jsdom",
      include: ["**/*.test.{tsx,ts}", "**/__tests__/*"],
    },
  })
}

export default setConfig
