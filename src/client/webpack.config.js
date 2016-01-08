'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var isProductionMode = process.env.NODE_ENV == 'production';

const webpackConfig = {
  name: 'client',
  target: 'web',
  entry: {
    app: [
      './src/app.js'
    ]
  },
  output: {
    filename: '[name].js',
    path: 'dist',
    publicPath: '/'
  },
  plugins: [
    // new webpack.DefinePlugin(config.get('globals')),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true,
      filename: 'index.html',
      inject: 'body'
    }),
    new CopyWebpackPlugin([
      {
        from: './src/ui/common/images',
        to: 'images'
      }
    ])
  ],
  // these break for node 5.3+ when building WS stuff
  node: {
    fs: 'empty',
    tls: 'empty'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      system: __dirname + '/src/system',
      services: __dirname + '/src/services'
    }
  },
  eslint: {
    configFile: './.eslintrc'
  },
  module: {
    // this breaks in node 5.3+ as it tries to parse the README.md for node-bindings
    noParse: /\/bindings\//,
    preLoaders: [
      {test: /\.js$/, loader: 'eslint-loader', exclude: /node_modules/}
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          stage: 0,
          optional: ['runtime'],
          env: {
            development: {
              plugins: ['react-transform'],
              extra: {
                'react-transform': {
                  transforms: [{
                    transform: 'react-transform-catch-errors',
                    imports: ['react', 'redbox-react']
                  }]
                }
              }
            }
          }
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'autoprefixer?browsers=last 2 version',
          'sass-loader'
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      /* eslint-disable */
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
      {test: /\.eot(\?.*)?$/, loader: 'file-loader?prefix=fonts/&name=fonts/[name].[ext]'},
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?prefix=fonts/&name=fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml'
      }
      /* eslint-enable */
    ]
  },
  sassLoader: {
    includePaths: './src/**/*.scss'
  }
};

if (isProductionMode){
  webpackConfig.module.loaders = webpackConfig.module.loaders.map(function(loader){
    if (/css/.test(loader.test)){
      var first = loader.loaders[0];
      var rest = loader.loaders.slice(1, loader.loaders.length);
      loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
      delete loader.loaders;
    }
    return loader;
  });
  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'unused': true,
        'dead_code': true
      }
    })
  );
} else {
  webpackConfig.devServer = {
    port: 3000
  };
  webpackConfig.devtool = 'source-map';
  webpackConfig.entry.app.push(
    'webpack-dev-server/client?http://0.0.0.0:3000/',
    'webpack/hot/dev-server'
  );
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
  // We need to apply the react-transform HMR plugin to the Babel configuration,
  // but _only_ when ModuleReplacement is enabled. Putting this in the default development
  // configuration will break other tasks such as test:unit because Webpack
  // HMR is not enabled there, and these transforms require it.
  webpackConfig.module.loaders = webpackConfig.module.loaders.map(loader =>{
    if (/js(?!on)/.test(loader.test)){
      loader.query.env.development.extra['react-transform'].transforms.push({
        transform: 'react-transform-hmr',
        imports: ['react'],
        locals: ['module']
      });
    }
    return loader;
  });
}

module.exports = webpackConfig;
