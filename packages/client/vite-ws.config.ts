import { existsSync, readdirSync } from "fs"
import path from "path"
import { defineConfig, loadEnv, Plugin } from "vite"
import { createHtmlPlugin } from "vite-plugin-html"
import { TransformOption, viteStaticCopy } from "vite-plugin-static-copy"

const localPort = Number(process.env.PORT) || 2017

const OPENFIN_RUNTIME = "31.112.75.4"

function getBaseUrl(dev: boolean) {
  return dev
    ? `http://localhost:${localPort}`
    : `${process.env.DOMAIN || ""}${process.env.URL_PATH || ""}` || ""
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
          console.log(`candidate is ${candidateTs}\n`)
          return candidateTs
        }
        const candidateTsx = `${candidatePath}.tsx`
        if (existsSync(candidateTsx)) {
          console.log(`candidate is ${candidateTsx}\n`)
          return candidateTsx
        }
      }
    },
  }
}

const copyOpenfinPlugin = (
  isDev: boolean,
  env: string,
  reactiveAnalyticsUrl: string,
): Plugin[] => {
  const transform: TransformOption | undefined = (contents) =>
    contents
      .replace(/<BASE_URL>/g, getBaseUrl(isDev))
      // Reactive Trader (FX) URL from .env
      .replace(
        /<RT_URL>/g,
        isDev && process.env.VITE_RT_URL
          ? process.env.VITE_RT_URL
          : getBaseUrl(isDev).replace("/workspace", ""),
      )
      // Reactive Analytics URL from .env
      .replace(/<RA_URL>/g, reactiveAnalyticsUrl)
      .replace(/<ENV_NAME>/g, env)
      // We don't want to show PROD in the app name
      .replace(/<ENV_SUFFIX>/g, env === "prod" ? "" : ` ${env.toUpperCase()}`)
      .replace('"<SHOW_PROVIDER_WINDOW>"', `${isDev}`)
      .replace(/<OPENFIN_RUNTIME>/g, OPENFIN_RUNTIME)

  return viteStaticCopy({
    flatten: true,
    targets: [
      {
        src: "src/workspace/config/*",
        dest: "config",
        transform,
      },
    ],
  })
}

const injectScriptIntoHtml = () =>
  createHtmlPlugin({
    pages: [
      {
        filename: "index.html",
        template: "index.html",
        injectOptions: {
          data: {
            injectScript: `"<!-- no manifest.json for OpenFin -->"`,
          },
        },
      },
      {
        filename: "workspaceProvider.html",
        template: "workspaceProvider.html",
      },
    ],
  })

const setConfig = ({ mode }) => {
  const env = process.env.ENVIRONMENT || "local"
  const reactiveAnalyticsUrl =
    env === "local"
      ? "http://localhost:3005"
      : `https://${
          env === "prod" ? "demo" : env
        }-reactive-analytics.adaptivecluster.com`

  // ensure we have a RA URL in the env for OpenFin substitution
  // AND in the code for use in Home search responses
  process.env = {
    VITE_RA_URL: reactiveAnalyticsUrl,
    ...process.env,
    ...loadEnv(mode, process.cwd()),
  }

  const isDev = mode === "development"
  const baseUrl = getBaseUrl(isDev)
  const plugins = [
    targetBuildPlugin(isDev, "openfin"),
    copyOpenfinPlugin(isDev, env, process.env.VITE_RA_URL!),
    injectScriptIntoHtml(),
  ]

  return defineConfig({
    base: baseUrl,
    publicDir: "public-workspace",
    build: {
      sourcemap: true,
    },
    preview: {
      port: localPort,
    },
    server: {
      port: localPort,
      proxy: {
        "/ws": {
          target:
            process.env.VITE_HYDRA_URL ||
            "wss://trading-web-gateway-rt-dev.demo.hydra.weareadaptive.com",
          changeOrigin: true,
          ws: true,
        },
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
  })
}

export default setConfig
