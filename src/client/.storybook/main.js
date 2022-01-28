const path = require("path")

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/react",
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    })

    config.output.publicPath = '/storybook/';

    config.resolve.alias = {
      "@/components": path.resolve(__dirname, "../src", "components"),
      "@/constants": path.resolve(__dirname, "../src", "constants"),
      "@/services": path.resolve(__dirname, "../src", "services"),
      "@/theme": path.resolve(__dirname, "../src", "theme"),
      "@/generated": path.resolve(__dirname, "../src", "generated"),
      "@/utils": path.resolve(__dirname, "../src", "utils"),
    }
    return config
  },
  managerWebpack: async (config) => {
    config.output.publicPath = '/storybook/';
    return config;
  },
}
