const { injectBabelPlugin } = require('react-app-rewired')

module.exports = function override(config, env) {
  if (env === 'production') {
    config = injectBabelPlugin(
      [
        'emotion',
        {
          hoist: true,
          autoLabel: true
        }
      ],
      config
    )
  } else {
    config = injectBabelPlugin(
      [
        'emotion',
        {
          sourceMap: false,
          autoLabel: true,
          labelFormat: '[filename]--[local]'
        }
      ],
      config
    )
  }

  return config
}
