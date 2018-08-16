const { injectBabelPlugin, getLoader, getBabelLoader, loaderNameMatches } = require('react-app-rewired')

module.exports = function override(config, env) {
  // Inject all babel plugins before rewiring typescript
  // Inject babel-plugin-emotion
  config = injectBabelPlugin(
    [
      'emotion',
      {
        hoist: env === 'production',
        autoLabel: true,
        labelFormat: '[filename]--[local]'
      }
    ],
    config
  )
  // Rewire typescript with our rewired babel config
  let babelLoader = getBabelLoader(config.module.rules)
  let tsLoader = getLoader(config.module.rules, rule => /ts|tsx/.test(rule.test))
  console.log(babelLoader)
  console.log(tsLoader)
  // process.exit(0)
  try {
    tsLoader.use.unshift({
      loader: babelLoader.loader,
      options: babelLoader.options
    })
  } catch (e) {
    console.error('Failed to add babel to typescript loader')
    console.error(e)
  }

  return config
}
