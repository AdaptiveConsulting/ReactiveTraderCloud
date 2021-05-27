import fs from "fs/promises"
import { resolve } from "path"
import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"
import eslint from "@rollup/plugin-eslint"
import typescript from "rollup-plugin-typescript2"
import modulepreload from "rollup-plugin-modulepreload"

// TODO: This is a workaround until the following issue gets
// confirmed/resolved: https://github.com/vitejs/vite/issues/2460
const customPreloadPlugin = () => {
  const result: any = {
    ...((modulepreload as any)({
      index: resolve(__dirname, "openfin-dist", "index.html"),
      prefix: "",
    }) as any),
    enforce: "post",
  }
  result.writeBundle = result.generateBundle
  delete result.generateBundle
  return result
}

const customIndexPlugin = () => ({
  name: "custom-index-plugin",
  async transformIndexHtml() {
    return await fs.readFile(
      resolve(__dirname, "openfin", "index.html"),
      "utf8",
    )
  },
})

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  server: {
    proxy: {
      "/config": "http://localhost:8080",
    },
  },
  build: {
    outDir: "openfin-dist",
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
          customIndexPlugin(),
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
      : [customIndexPlugin(), customPreloadPlugin()],
}))
