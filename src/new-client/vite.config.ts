import { resolve } from "path"
import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"
import { injectManifest } from "rollup-plugin-workbox"

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

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  plugins:
    mode === "development"
      ? [
          {
            ...eslint({ include: "src/**/*.+(js|jsx|ts|tsx)" }),
            enforce: "pre",
          },
          {
            ...typescript(),
            enforce: "pre",
          },
          reactRefresh(),
        ]
      : [
          customPreloadPlugin(),
          injectManifest(
            {
              swSrc: "./src/sw.js",
              swDest: "./dist/sw.js",
              dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
              globDirectory: "dist",
              mode,
              modifyURLPrefix: { assets: "/assets" },
            },
            () => {},
          ) as any,
        ],
}))
