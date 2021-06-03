import { resolve } from "path"
import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

const TARGET = process.env.TARGET || "web"

// TODO: This is a workaround until the following issue gets
// confirmed/resolved: https://github.com/vitejs/vite/issues/2460
const customPreloadPlugin = () => {
  const result: any = {
    ...((modulepreload as any)({
      index: resolve(__dirname, "dist", "index.html"),
      prefix: "",
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
export default defineConfig(({ mode }) => ({
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
    proxy: TARGET === "openfin" ? { "/config": "http://localhost:8080" } : {},
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins:
    mode === "development"
      ? [eslintPlugin, typescriptPlugin, reactRefresh()]
      : [customPreloadPlugin(), webManifestPlugin(mode)],
}))
