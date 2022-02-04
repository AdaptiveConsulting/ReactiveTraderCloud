import { defineConfig, loadEnv } from 'vite'
import copy from 'rollup-plugin-copy'
import typescript from 'rollup-plugin-typescript2'

const PORT = Number(process.env.PORT) || 2017

function getBaseUrl(dev: boolean) {
  return dev
    ? `http://localhost:${PORT}`
    : `${process.env.DOMAIN || ''}${process.env.URL_PATH || ''}` || ''
}

const typescriptPlugin = {
  ...typescript(),
  enforce: 'pre'
}

const copyOpenfinPlugin = (dev: boolean) => {
  const env = process.env.ENVIRONMENT || 'local'
  return {
    ...copy({
      targets: [
        {
          src: `./config/*.json`,
          dest: './public/config',
          transform: contents =>
            contents
              .toString()
              .replace(/<RT_URL>/g, process.env.VITE_RT_URL)
              .replace(/<RA_URL>/g, process.env.VITE_RA_URL)
              .replace(/<BASE_URL>/g, getBaseUrl(dev))
              .replace(/<ENV_NAME>/g, env)
              .replace(/<ENV_SUFFIX>/g, env === 'prod' ? '' : env.toUpperCase())
        }
      ],
      verbose: true,
      // For dev, (most) output generation hooks are not called, so this needs to be buildStart.
      // For prod, writeBundle is the appropriate hook, otherwise it gets wiped by the dist clean.
      // Ref: https://vitejs.dev/guide/api-plugin.html#universal-hooks
      hook: dev ? 'buildStart' : 'writeBundle'
    })
  }
}

const setConfig = ({ mode }) => {
  require('dotenv').config({ path: `./.env` })

  const isDev = mode === 'development'
  const plugins = isDev ? [typescriptPlugin] : []

  // @ts-ignore
  plugins.push(copyOpenfinPlugin(isDev))

  return defineConfig({
    base: getBaseUrl(isDev),
    build: {
      sourcemap: true
    },
    server: {
      port: PORT,
      proxy: {
        '/ws': {
          target:
            process.env.VITE_HYDRA_URL ||
            'wss://trading-web-gateway-rt-dev.demo.hydra.weareadaptive.com',
          changeOrigin: true,
          ws: true
        }
      }
    },
    // @ts-ignore
    plugins
  })
}

export default setConfig
