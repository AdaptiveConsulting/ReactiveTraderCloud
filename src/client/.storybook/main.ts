import { mergeConfig } from "vite"

export default {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    return configType === "DEVELOPMENT"
      ? // define is required so we are not overriding any use of `process.env` but have it defined in dev
        mergeConfig(config, { define: { "process.env.NODE_DEBUG": false } })
      : mergeConfig(config, { base: "/storybook/" })
  },
}
