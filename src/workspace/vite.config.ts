import { defineConfig, loadEnv, Plugin } from "vite"
import { TransformOption, viteStaticCopy } from "vite-plugin-static-copy"

const PORT = Number(process.env.PORT) || 2017

function getBaseUrl(dev: boolean) {
  return dev
    ? `http://localhost:${PORT}`
    : `${process.env.DOMAIN || ""}${process.env.URL_PATH || ""}` || ""
}

const copyOpenfinPlugin = (isDev: boolean): Plugin[] => {
  const env = process.env.ENVIRONMENT || "local"

  const reactiveAnalyticsUrl =
    env === "local"
      ? "http://localhost:3005"
      : `https://${
          env === "prod" ? "demo" : env
        }-reactive-analytics.adaptivecluster.com`

  const transform: TransformOption | undefined = (contents) =>
    contents
      // Reactive Trader (FX) URL from .env
      .replace(
        /<RT_URL>/g,
        isDev && process.env.VITE_RT_URL
          ? process.env.VITE_RT_URL
          : getBaseUrl(isDev).replace("/workspace", ""),
      )
      // Reactive Analytics URL from .env
      .replace(/<RA_URL>/g, process.env.VITE_RA_URL || reactiveAnalyticsUrl)
      .replace(/<BASE_URL>/g, getBaseUrl(isDev))
      .replace(/<ENV_NAME>/g, env)
      .replace(/<ENV_SUFFIX>/g, env === "prod" ? "" : env.toUpperCase())
      .replace('"<SHOW_PROVIDER_WINDOW>"', `${isDev}`)

  return viteStaticCopy({
    flatten: true,
    targets: [
      {
        src: "config/*",
        dest: "config",
        transform,
      },
    ],
  })
}

const setConfig = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  const isDev = mode === "development"
  const plugins = [copyOpenfinPlugin(isDev)]

  return defineConfig({
    base: getBaseUrl(isDev),
    build: {
      sourcemap: true,
    },
    server: {
      port: PORT,
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
    plugins,
  })
}

export default setConfig
