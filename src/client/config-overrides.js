const { compose, getBabelLoader, injectBabelPlugin } = require('react-app-rewired')

module.exports = function override(config, env) {
  const babelLoader = getBabelLoader(config.module.rules)

  if (env === 'production') {
    config = injectBabelPlugin([['emotion', { hoist: true, autoLabel: true }]], config)
  } else {
    config = injectBabelPlugin(
      ['emotion', { sourceMap: true, autoLabel: true, labelFormat: '[filename]--[local]' }],
      config
    )
  }

  return config
}
