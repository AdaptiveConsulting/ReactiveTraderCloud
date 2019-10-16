const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      'rxjs': path.resolve(path.join(__dirname, 'node_modules', 'rxjs'))
    },
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /vertx/
    }),
    new CopyPlugin([
      { from:  path.resolve(path.join(__dirname, 'node_modules', 'protobufjs', 'google', 'protobuf')), to: path.join(__dirname, '../protos')},
      { from:  path.resolve(path.join(__dirname, 'node_modules', 'dialogflow', 'protos')), to: path.join(__dirname, '../protos')},
    ]),
  ],
  node: {
    __filename: false,
    __dirname: false
  }
};
