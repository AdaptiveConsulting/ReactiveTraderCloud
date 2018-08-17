const { injectBabelPlugin, getLoader, getBabelLoader, loaderNameMatches } = require('react-app-rewired')

module.exports = function override(config, env) {
  // Inject all babel plugins before rewiring typescript

  // Inject babel-plugin-emotion
  config = injectBabelPlugin(
    [
      'emotion',
      {
        autoLabel: true,
        hoist: env === 'production',
        labelFormat: '[filename]--[local]'
      }
    ],
    config
  )

  // Rewire typescript with our rewired babel config
  const babelLoader = getBabelLoader(config.module.rules)
  const tsLoader = getLoader(config.module.rules, rule => /ts|tsx/.test(rule.test))
  tsLoader.use.unshift({
    loader: babelLoader.loader,
    options: babelLoader.options
  })

  return config
}
