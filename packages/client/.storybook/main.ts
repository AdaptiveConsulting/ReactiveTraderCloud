export default {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-dark-mode",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config, { configType }) => {
    // per https://storybook.js.org/docs/builders/vite#configuration
    const { mergeConfig } = await import("vite")
    const common = {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ["storybook-dark-mode"],
      },
    }
    return configType === "DEVELOPMENT"
      ? // define is required so we are not overriding any use of `process.env` but have it defined in dev
        mergeConfig(config, {
          ...common,
          define: { "process.env.NODE_DEBUG": false },
        })
      : mergeConfig(config, { ...common, base: "/storybook/" })
  },
}
