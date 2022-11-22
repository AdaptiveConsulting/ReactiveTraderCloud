// Only used by Jest
//
// https://stackoverflow.com/questions/71618517/cannot-use-import-meta-outside-a-module-vite-testing
// see also https://github.com/OpenSourceRaidGuild/babel-vite/blob/main/packages/babel-plugin-transform-vite-meta-env/src/index.ts
// if more control is needed over import.meta.env.XXX
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      { useBuiltIns: "entry", corejs: "2", targets: { node: "current" } },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    function () {
      return {
        visitor: {
          MetaProperty(path) {
            path.replaceWithSourceString("process")
          },
        },
      }
    },
  ],
}
