'use strict';

const webpack           = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const chalk             = require('chalk');
const path              = require('path');
const parseArgs         = require('minimist');

const isProductionMode  = process.env.NODE_ENV == 'production';
const args              = parseArgs(process.argv.slice(2));
const config            = args.endpoint ? args.endpoint + '.config.json' : 'default.config.json';
const babelPlugins      = [
  'transform-decorators-legacy'
];

// in production you should not have hot reloader etc
if (!isProductionMode) babelPlugins.push(['react-transform', {
  transforms: [
    {
      transform: 'react-transform-hmr',
      imports: ['react'],
      locals: ['module'],
    }, {
      transform: 'react-transform-catch-errors',
      imports: ['react', 'redbox-react'],
    },
  ]
}]);

const webpackConfig = {
  name: 'client',
  target: 'web',
  entry: {
    app: [
      './src/bootstrapper.js'
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
    ]),
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */'vendor', /* filename= */'vendor.js', function(module){
      return module.resource && module.resource.indexOf('node_modules') !== -1;
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
    extensions: ['', '.js', '.jsx'],
    // You might notice that though out the app we don't really make use of alisa and instead have relative paths.
    // This is purely for ide object/type discoverability.
    // Until our ide (intellij/webstorm) understands import aliass we feel the benefits of object discoverability outweigh the relative path cost.
    alias: {
      'config.json': path.join(__dirname, 'config', config),
      system: path.join(__dirname, 'src/system'),
      services: path.join(__dirname, 'src/services'),
      // reverse alias so we can use ES6 from node modules and get IDE support but not actually transpile it
      'esp-js/src' : path.join(__dirname, 'node_modules/esp-js')
    }
  },
  eslint: {
    configFile: './.eslintrc'
  },
  module: {
    // this breaks in node 5.3+ as it tries to parse the client.md for node-bindings
    noParse: /\/bindings\//,
    preLoaders: [
      {
        test: /\.j(s|sx)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.j(s|sx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          presets: [
            'react',
            'es2015',
            'stage-0',
          ],
          plugins: babelPlugins
        }
      },
      {
        test: /\.(css|scss)$/,
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
        loader: 'file'
      }
    ]
  },
  sassLoader: {
    includePaths: './src/**/*.scss'
  }
};



if (isProductionMode){
  console.log('Starting a ' + chalk.red('production') + ' build...');

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
    new ExtractTextPlugin('[name].css?[contenthash]'),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'unused': true,
        'dead_code': true
      },
      output: {
       comments: false
      }
    })
  );
  // can work in any sub-folder
  webpackConfig.output.publicPath = './';
  webpackConfig.devtool = 'source-map';
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
}

module.exports = webpackConfig;
