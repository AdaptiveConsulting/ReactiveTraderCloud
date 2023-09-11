import react from "@vitejs/plugin-react"
import { existsSync, readdirSync, statSync } from "fs"
import path, { resolve } from "path"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"
import Unfonts from "unplugin-fonts/vite"
import {
  ConfigEnv,
  loadEnv,
  Plugin,
  PluginOption,
  splitVendorChunkPlugin,
  UserConfigExport,
} from "vite"
import { createHtmlPlugin } from "vite-plugin-html"
import { TransformOption, viteStaticCopy } from "vite-plugin-static-copy"
import { defineConfig } from "vitest/config"

type BuildTarget = "web" | "openfin" | "finsemble"

const localPort = Number(process.env.PORT) || 1917

const OPENFIN_RUNTIME = "31.112.75.7"

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
    resolveId: function (source, importer) {
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
        if (
          !importer ||
          importer.includes("node_modules") ||
          source === "./main"
        ) {
          return null
        }

        if (!source.startsWith(".") && !source.startsWith("/")) {
          return null
        }

        const sourcePath = path.parse(source)
        const importerPath = path.parse(importer.replace(/\\/g, "/"))

        // If imported file starts with /src we can not append it to importer dir
        // so we need to strip the path by the rootPrefix first
        const aliasedSourceRootPrefix = "/src"
        const baseCandidatePath =
          sourcePath.dir.startsWith(aliasedSourceRootPrefix) &&
          importerPath.dir.includes(aliasedSourceRootPrefix)
            ? `${importerPath.dir.split(aliasedSourceRootPrefix)[0]}/`
            : importerPath.dir
        const targetFileName = `${sourcePath.name}.${target.toLowerCase()}`

        const candidatePath = path.join(
          baseCandidatePath,
          sourcePath.dir,
          targetFileName,
        )

        // Source doesn't have file extension, so try all extensions
        const candidateTs = `${candidatePath}.ts`
        if (existsSync(candidateTs)) {
          console.log(`\ncandidate is ${candidateTs}\n`)
          return candidateTs
        }
        const candidateTsx = `${candidatePath}.tsx`
        if (existsSync(candidateTsx)) {
          console.log(`\ncandidate is ${candidateTsx}\n`)
          return candidateTsx
        }
      }
    },
  }
}

function indexSwitchPlugin(target: string): Plugin {
  return {
    name: "indexSwitchPlugin",
    enforce: "pre",
    resolveId: function (source, importer) {
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

const copyPlugin = (
  isDev: boolean,
  buildTarget: BuildTarget,
  env: string,
): Plugin[] => {
  const transform: TransformOption = (contents) =>
    contents
      .replace(/<BASE_URL>/g, getBaseUrl(isDev || env === "local"))
      // We want the PWA banner to show on www.reactivetrader.com
      .replace(/web\.prod\./g, "www.")
      // for environment disambiguation, in OpenFin uuids
      .replace(/<ENV_NAME>/g, env)
      // for (visible) env naming - OpenFin and PWA - but not for PROD
      .replace(/<ENV_SUFFIX>/g, env === "prod" ? "" : ` ${env.toUpperCase()}`)
      // to keep consistent runtime version across our manifests
      .replace(/<OPENFIN_RUNTIME>/g, OPENFIN_RUNTIME)

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

const injectScriptIntoHtml = (
  isDev: boolean,
  buildTarget: BuildTarget,
  env: string,
) =>
  createHtmlPlugin({
    pages: [
      {
        filename: "index.html",
        template: "index.html",
        injectOptions: {
          data: {
            injectScript: `
              ${
                buildTarget === "web"
                  ? `<link rel="manifest" href="${getBaseUrl(
                      isDev,
                    )}/manifest.json" />`
                  : "<!-- no manifest.json for OpenFin -->"
              }
              
              <script>
                // Hydra dependency references BigInt at run time even when the application isn't explicitly started
                // Detect this as supportsBigInt so we  can show a 'browser unsupported' message
                // Set BigInt to an anon function to prevent the runtime error
    
                window.supportsBigInt = typeof BigInt !== 'undefined';
                window.BigInt = supportsBigInt ? BigInt : function(){};
              </script>
              
              <script async src="https://www.googletagmanager.com/gtag/js?id=${
                env === "prod" ? "G-Z3PC9MRCH9" : "G-Y28QSEPEC8"
              }"></script>
            `,
          },
        },
      },
      // TODO - make OpenFin-only
      {
        filename: "provider.html",
        template: "provider.html",
      },
    ],
  })

const injectWebServiceWorkerPlugin = (mode: string) =>
  injectManifest(
    {
      swSrc: "./src/client/Web/sw.js",
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

const fontFacePreload = Unfonts({
  google: {
    families: [
      {
        name: "Lato",
        styles:
          "ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900",
      },
      {
        name: "Roboto",
        styles:
          "ital,wght@0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900",
      },
      {
        name: "Montserrat",
        styles:
          "ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900",
      },
    ],
    preconnect: true,
    display: "block",
  },
})

// Main Ref: https://vitejs.dev/config/
const setConfig: (env: ConfigEnv) => UserConfigExport = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const env = process.env.ENVIRONMENT || "local"
  const buildTarget: BuildTarget = (process.env.TARGET as BuildTarget) || "web"
  const isDev = mode === "development"
  const viteBaseUrl = isDev ? "/" : getBaseUrl(false)

  const devPlugins: PluginOption[] = []

  devPlugins.push(targetBuildPlugin(isDev, buildTarget))
  devPlugins.push(indexSwitchPlugin(buildTarget))

  if (process.env.VITE_MOCKS) {
    devPlugins.push(apiMockReplacerPlugin())
  }

  devPlugins.push(react())

  if (!isDev) {
    devPlugins.push(splitVendorChunkPlugin(), customPreloadPlugin())
  }

  if (buildTarget === "web") {
    devPlugins.push(injectWebServiceWorkerPlugin(mode) as Plugin)
  }

  devPlugins.push(copyPlugin(isDev, buildTarget, env))
  devPlugins.push(injectScriptIntoHtml(isDev, buildTarget, env))

  const plugins = process.env.STORYBOOK === "true" ? [] : devPlugins
  plugins.push(fontFacePreload)

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

  return defineConfig({
    base: viteBaseUrl,
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          // TODO - use the opportunity for OpenFin- or PWA-specific root html
          main: resolve(__dirname, "index.html"),
          // TODO - make OpenFin-only, move to /OpenFin
          ofProvider: resolve(__dirname, "provider.html"),
        },
      },
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
      setupFiles: "./src/client/setupTests.ts",
    },
  })
}

export default setConfig
