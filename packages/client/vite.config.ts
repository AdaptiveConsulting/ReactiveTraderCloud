import react from "@vitejs/plugin-react"
import { existsSync, readdirSync, statSync } from "fs"
import path, { resolve } from "path"
import type { InputOption } from "rollup"
import { injectManifest } from "rollup-plugin-workbox"
import Unfonts from "unplugin-fonts/vite"
import {
  ConfigEnv,
  loadEnv,
  Plugin,
  PluginOption,
  UserConfigExport,
} from "vite"
import { createHtmlPlugin } from "vite-plugin-html"
import { TransformOption, viteStaticCopy } from "vite-plugin-static-copy"
import { defineConfig } from "vitest/config"

type BuildTarget = "web" | "openfin" | "finsemble"

const localPort = Number(process.env.PORT) || 1917
const showOpenFinProvider = !!process.env.OPENFIN_SHOW_PROVIDER

const OPENFIN_RUNTIME = "33.116.77.11"
const WORKSPACE_OPENFIN_RUNTIME = "33.116.77.11"

function getBaseUrl(isLocal: boolean) {
  return isLocal
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
function targetBuildPlugin(dev: boolean, target: string): Plugin {
  return {
    name: "targetBuildPlugin",
    enforce: "pre",
    resolveId: function (source, importer) {
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
        return candidateTs
      }
      const candidateTsx = `${candidatePath}.tsx`
      if (existsSync(candidateTsx)) {
        return candidateTsx
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
      } catch {
        return null
      }
    },
  }
}

const copyPlugin = (
  baseUrl: string,
  buildTarget: BuildTarget,
  env: string,
): Plugin[] => {
  const transform: TransformOption = (contents) =>
    contents
      .replace(/<BASE_URL>/g, baseUrl)
      .replace(/<RT_URL>/g, process.env.VITE_RT_URL || baseUrl)
      // We want the PWA banner to show on www.reactivetrader.com
      .replace(/web\.prod\./g, "www.")
      // for environment disambiguation, in OpenFin uuids
      .replace(/<ENV_NAME>/g, env)
      // for (visible) env naming - OpenFin and PWA - but not for PROD
      .replace(/<ENV_SUFFIX>/g, env === "prod" ? "" : ` ${env.toUpperCase()}`)
      // to keep consistent runtime version across our manifests
      .replace(/<OPENFIN_RUNTIME>/g, OPENFIN_RUNTIME)
      .replace(/<WORKSPACE_OPENFIN_RUNTIME>/g, WORKSPACE_OPENFIN_RUNTIME)
      .replace('"<SHOW_PROVIDER_WINDOW>"', `${showOpenFinProvider}`)

  return viteStaticCopy({
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
            {
              src: "public-workspace/config/*",
              dest: "workspace/config",
              transform,
            },
            {
              src: "public-workspace/images/*",
              dest: "workspace/images",
            },
            {
              src: "public-workspace/*.ico",
              dest: "workspace",
            },
            {
              src: "public-workspace/*.json",
              dest: "",
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
) => {
  // type from "vite-plugin-html", which should be exported but .. is not :-/
  interface PageOption {
    filename: string
    template: string
    entry?: string
    injectOptions?: { data?: { injectScript: string } }
  }
  const pages: PageOption[] = [
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
  ]
  if (buildTarget === "openfin") {
    pages.push(
      {
        filename: "openfinContainerProvider.html",
        template: "openfinContainerProvider.html",
      },
      {
        filename: "openfinWorkspaceProvider.html",
        template: "openfinWorkspaceProvider.html",
      },
    )
  }

  return createHtmlPlugin({
    pages,
  })
}

const injectWebServiceWorkerPlugin = (mode: string, baseUrl: string) =>
  injectManifest({
    swSrc: "./src/client/Web/sw.js",
    swDest: "./dist/sw.js",
    dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
    globDirectory: "dist",
    modifyURLPrefix: {
      assets: `${baseUrl}/assets`,
    },
  })

const fontFacePreload = Unfonts({
  google: {
    families: [
      {
        name: "Work Sans",
        styles: "ital,wght@0,100..900;1,100..900",
      },
    ],
    preconnect: true,
    display: "block",
  },
})

const generateHydraUrl = (env: string) => {
  const hydraEnv = env === "prod" || env === "uat" ? env : "dev"
  return `wss://trading-web-gateway-rt-${hydraEnv}.demo.hydra.weareadaptive.com`
}

// Main Ref: https://vitejs.dev/config/
const setConfig: (env: ConfigEnv) => UserConfigExport = ({ mode }) => {
  const externalEnv = {
    ...loadEnv(mode, process.cwd()),
    ...process.env,
  }
  const env = externalEnv.ENVIRONMENT || "local"

  process.env = {
    VITE_HYDRA_URL: generateHydraUrl(env),
    // so we can directly override Hydra gateway address if we ever want to
    ...externalEnv,
  }

  const buildTarget: BuildTarget = (process.env.TARGET as BuildTarget) || "web"
  const isDev = mode === "development"
  // quick look-up (command from 2nd arg of setConfig) .. expecting to optimise plugins later
  // vite ..         mode: development  command: serve  (building with esbuild AND serving)
  // vite preview .. mode: production   command: serve  (just running static, so don't need any plugins etc.)
  // vitest ..       mode: test         command: serve  (still need the plugins to e.g. switch in openfin code)

  const baseUrl = getBaseUrl(env === "local")

  const devPlugins: PluginOption[] = []

  devPlugins.push(targetBuildPlugin(isDev, buildTarget))
  devPlugins.push(indexSwitchPlugin(buildTarget))

  if (process.env.VITE_MOCKS) {
    devPlugins.push(apiMockReplacerPlugin())
  }

  devPlugins.push(react())

  if (buildTarget === "web") {
    devPlugins.push(injectWebServiceWorkerPlugin(mode, baseUrl) as Plugin)
  }

  devPlugins.push(copyPlugin(baseUrl, buildTarget, env))

  if (mode !== "test") {
    // !! plays havoc with vitest browser mode !!
    devPlugins.push(injectScriptIntoHtml(isDev, buildTarget, env))
  }

  const plugins = process.env.STORYBOOK === "true" ? [] : devPlugins

  plugins.push(fontFacePreload)

  const input: InputOption = {
    main: resolve(__dirname, "index.html"),
  }
  if (buildTarget === "openfin") {
    input["openfin/containerProvider"] = resolve(
      __dirname,
      "openfinContainerProvider.html",
    )
    input["openfin/workspaceProvider"] = resolve(
      __dirname,
      "openfinWorkspaceProvider.html",
    )
  }

  return defineConfig({
    base: baseUrl,
    build: {
      sourcemap: true,
      chunkSizeWarningLimit: 750,
      // More Info: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload
      // but basically this tells the browser to fetch (or get from SW cache), parse and load into module map
      modulePreload: {
        resolveDependencies: (url, deps, _context) => {
          // vite built-in modulepreload handling now supersedes our custom setup based on the rollup plugin
          // (it just needs a minor tweak, hence this verbose preamble), use this to illustrate:
          // console.log(`modulePreload; url: ${url}, deps: ${deps}, hostId: ${hostId}, hostType: ${hostType}`)
          //
          // per various examples, include main itself in the modulepreload list
          // ref https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/modulepreload#examples
          // ref https://web.dev/articles/modulepreload
          return url.startsWith("assets/main") ? [url, ...deps] : deps
        },
      },
      rollupOptions: {
        input,
        output: {
          manualChunks: (id: string) => {
            if (id.includes("node_modules/@openfin")) return "vendor-openfin"
            if (id.includes("node_modules")) return "vendor"
          },
        },
      },
    },
    preview: {
      port: localPort,
      strictPort: true, // due to substitution, dynamic ports won't work - use PORT=1234 <cmd>
    },
    server: {
      host: "127.0.0.1",
      port: localPort,
      strictPort: true, // due to substitution, dynamic ports won't work - use PORT=1234 <cmd>
      // would be nice if this was as .gitignore, per this:
      // https://github.com/vitejs/vite/issues/15250
      watch: {
        ignored: ["**/coverage/**", "**/playwright-report/**"],
      },
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
      browser: {
        // enabled: true,
        //
        // MAIN FAIL - all cases, run all tests but then do not complete
        //
        // .. for default "preview" provider, just need chrome as the name
        name: "chrome",
        //
        // .. "webdriverio" can fail on mac with missing chromedriver
        // .. see https://github.com/puppeteer/puppeteer/issues/11691, remove offending folder
        // provider: "webdriverio",
        // name: "chrome",
        //
        // .. playwright also works as a browser controller (default: webdriverio)
        // .. and runs up in incognito window, rather than current Chrome ..
        // provider: "playwright",
        // name: "chromium",
        //
        // headless only with playwright or webdriverio
        // headless: true,
        fileParallelism: false, // seems to make little difference
      },
      include: ["**/*.test.{tsx,ts}"],
      setupFiles: "./src/client/setupTests.ts",
    },
  })
}

export default setConfig
