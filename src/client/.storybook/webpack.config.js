const path = require('path')

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [require.resolve('awesome-typescript-loader')]
  })
  defaultConfig.resolve.extensions.push('.ts', '.tsx', '.js')
  defaultConfig.resolve.alias = {
    'rt-components': path.resolve(__dirname, '../src', 'rt-components'),
    'rt-util': path.resolve(__dirname, '../src', 'rt-util'),
    'rt-types': path.resolve(__dirname, '../src', 'rt-types'),
    'rt-actions': path.resolve(__dirname, '../src', 'rt-actions'),
    'rt-storybook': path.resolve(__dirname, '../src', 'rt-storybook'),
    'rt-styleguide': path.resolve(__dirname, '../src', 'rt-styleguide'),
    'rt-system': path.resolve(__dirname, '../src', 'rt-storybook'),
    'rt-themes': path.resolve(__dirname, '../src', 'rt-themes'),
    'rt-theme': path.resolve(__dirname, '../src', 'rt-theme'),
    'rt-system': path.resolve(__dirname, '../src', 'rt-system'),
    ui: path.resolve(__dirname, '../src', 'ui'),
    system: path.resolve(__dirname, '../src', 'system'),
    shell: path.resolve(__dirname, '../src', 'shell')
  }
  defaultConfig = require('../config-overrides')(defaultConfig, env)

  return defaultConfig
}
