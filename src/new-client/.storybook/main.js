const path = require("path")

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  webpackFinal: async (config) => {
    config.resolve.alias = {
      "@/components": path.resolve(__dirname, "../src", "components"),
      "@/services": path.resolve(__dirname, "../src", "services"),
      "@/theme": path.resolve(__dirname, "../src", "theme"),
      "@/generated": path.resolve(__dirname, "../src", "generated"),
    }
    return config
  },
}
