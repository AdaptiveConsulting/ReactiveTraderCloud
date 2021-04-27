const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin")
const fs = require("fs")
const webpack = require("webpack")

function toMock(pathStr) {
  const [, name, extension] = pathStr.match(/^(.*)\.(ts|tsx|js|jsx)$/)
  return [name, "mock", extension].join(".")
}

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({}))

    return {
      ...config,
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /\.(ts|tsx|js|jsx)$/,
          (resource) => {
            if (!resource.resource) return

            const resourceMock = toMock(resource.resource)
            if (fs.existsSync(resourceMock)) {
              resource.request = toMock(resource.request)
              resource.resource = resourceMock
            }
          },
        ),
        ...config.plugins,
      ],
    }
  },
}
