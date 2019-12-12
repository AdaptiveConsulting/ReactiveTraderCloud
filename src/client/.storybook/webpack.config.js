const path = require('path')

module.exports = ({config}) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      plugins: ["babel-plugin-styled-components"],
      presets: [['react-app', { flow: false, typescript: true }]]
    }
  })
  config.resolve.extensions.push('.ts', '.tsx', '.js')
  config.resolve.alias = {
    'rt-components': path.resolve(__dirname, '../src', 'rt-components'),
    'rt-util': path.resolve(__dirname, '../src', 'rt-util'),
    'rt-types': path.resolve(__dirname, '../src', 'rt-types'),
    'rt-actions': path.resolve(__dirname, '../src', 'rt-actions'),
    'rt-storybook': path.resolve(__dirname, '../src', 'rt-storybook'),
    'rt-styleguide': path.resolve(__dirname, '../src', 'rt-styleguide'),
    'rt-theme': path.resolve(__dirname, '../src', 'rt-theme'),
    'rt-system': path.resolve(__dirname, '../src', 'rt-system'),
    ui: path.resolve(__dirname, '../src', 'ui'),
    system: path.resolve(__dirname, '../src', 'system'),
    shell: path.resolve(__dirname, '../src', 'shell')
  }

  return config
}
