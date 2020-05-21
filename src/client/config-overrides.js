const CopyPlugin = require('copy-webpack-plugin')

module.exports = function override(config, env) {

  // only in development mode, use the webpack copy plugin to replace tokens in the manifest file
  // with values from the .env.development file
  if (process.env.NODE_ENV === 'development') {
    if (!config.plugins) {
      config.plugins = []
    }

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'public/manifest.json',
            to: 'manifest.json',
            transform(content) {
              return content
                .toString()
                .replace(/{{environment_suffix}}/g, ` (${process.env.ENVIRONMENT_NAME.toUpperCase()})`)
            },
          },
        ],
      })
    )
  }

  return config
}
