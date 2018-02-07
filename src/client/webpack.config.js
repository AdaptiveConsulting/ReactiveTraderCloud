'use strict'

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const chalk = require('chalk')
const path = require('path')


module.exports = function (env = {}) {

  const isProductionMode = process.env.NODE_ENV == 'production'
  const config = env.endpoint ? env.endpoint + '.config.json' : 'default.config.json'
  const babelPlugins = []

  const productionStyleLoaderConfig = {
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'sass-loader']
    })
  }

  const styleLoaderConfig = {
    test: /\.(css|scss)$/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: ['./src/**/*.scss']
        }
      }
    ]
  }

  const getStyleLoader = (isProductionMode) => {
    return isProductionMode ? Object.assign({}, styleLoaderConfig, productionStyleLoaderConfig) : styleLoaderConfig
  }
// in production you should not have hot reloader etc
  if (!isProductionMode) babelPlugins.push(['react-transform', {
    transforms: [
      {
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      },
      {
        transform: 'react-transform-catch-errors',
        imports: ['react', 'redbox-react']
      }
    ]
  }])

  const webpackConfig = {
    name: 'client',
    target: 'web',
    entry: {
      app: ['./src/appBootstrapper.tsx'],
      notification: ['./src/notificationBootstrapper.tsx'],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        hash: true,
        filename: 'index.html',
        inject: 'body',
        excludeChunks: ['notification']
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        hash: true,
        filename: 'notification.html',
        inject: 'body',
        excludeChunks: ['app']
      }),

      new CopyWebpackPlugin([
        {
          from: './src/ui/common/images/splash-screen.jpg',
          to: 'images/splash-screen.jpg'
        },
        {
          from: './src/ui/common/images/adaptive-mark-large.png',
          to: 'images/adaptive-mark-large.png'
        },
        {
          from: './src/ui/common/images/icon.ico',
          to: 'images/icon.ico'
        },
        {
          from: './src/ui/common/images/favicon.ico',
          to: 'images/favicon.ico'
        }
      ]),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          return module.context && module.context.indexOf('node_modules') !== -1
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      new webpack.DefinePlugin({
        __VERSION__: JSON.stringify(require(path.resolve(__dirname, './package.json')).version)
      })
    ],
    // these break for node 5.3+ when building WS stuff
    node: {
      fs: 'empty',
      tls: 'empty'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // You might notice that though out the app we don't really make use of alisa and instead have relative paths.
      // This is purely for ide object/type discoverability.
      // Until our ide (intellij/webstorm) understands import aliass we feel the benefits of object discoverability outweigh the relative path cost.

      // 'dist/rx.all.js': 'rx/dist/rx.all.js' is needed for webpack 2 and rx 4
      alias: {
        'config.json': path.join(__dirname, 'config', config),
        system: path.join(__dirname, 'src/system'),
        services: path.join(__dirname, 'src/services')
      }
    },
    module: {
      // this breaks in node 5.3+ as it tries to parse the client.md for node-bindings
      noParse: /\/bindings\//,
      rules: [
        {
          test: /\.jsx?$/,
          exclude: function(modulePath) {
            return /node_modules/.test(modulePath)
              && !/node_modules[\/\\]cbor/.test(modulePath);
          },
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'flow', 'react'],
              plugins: [
                'transform-decorators-legacy',
                'transform-class-properties'
              ]
            }
          }
        },
        {
          test: /\.tsx?$/,
          loader: 'awesome-typescript-loader',
          query: {
            configFileName: './tsconfig.json'
          }
        },
        getStyleLoader(isProductionMode),
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.woff(\?.*)?$/,
          loader: 'url-loader?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.woff2(\?.*)?$/,
          loader: 'url-loader?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2'
        },
        {
          test: /\.ttf(\?.*)?$/,
          loader: 'url-loader?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?.*)?$/, loader: 'file-loader?prefix=fonts/&name=fonts/[name].[ext]'
        },
        {
          test: /\.svg(\?.*)?$/,
          loader: 'url-loader?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml'
        },
        {
          test: /\.(jpg|jpeg|gif|png)$/,
          loader: 'file-loader'
        }
      ]
    },
    stats: { // for "npm run stats" and analyse stats.json result here http://webpack.github.io/analyse/#modules
       exclude: [
          'node_modules',
       ]
    },
  }

  if (isProductionMode) {
    console.log('Starting a ' + chalk.red('production') + ' build...')

    webpackConfig.plugins.push(
      new ExtractTextPlugin('[name].css?[contenthash]'),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        }
      })
    )
    // can work in any sub-folder
    webpackConfig.output.publicPath = './'
    webpackConfig.devtool = 'source-map'
  } else {
    webpackConfig.devServer = {
      port: 3000,
      contentBase: path.join(process.cwd(), 'src'),
      historyApiFallback: true,
      stats: {
        colors: true
      },
      noInfo: false,
      quiet: false,
      hot: true
    }

    webpackConfig.devtool = 'source-map'

    webpackConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
    )
  }

  return webpackConfig
}
