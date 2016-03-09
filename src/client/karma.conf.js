'use strict';
var argv = require('yargs').argv;
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

module.exports = function(config){
  config.set({
    basePath: './',
    singleRun: !argv.watch,
    frameworks: ['jasmine'],
    files: [
      './tests/testIndex.js'
    ],
    preprocessors: {
      './tests/testIndex.js': ['webpack']
    },
    reporters: ['spec'],
    browsers: ['Chrome'],
    webpack: {
      devtool: 'inline-source-map',
      resolve: webpackConfig.resolve,
      plugins: [], // none required for testing ATM
      module: {
        loaders: webpackConfig.module.loaders,
        noParse: webpackConfig.module.noParse
      },
      sassLoader: webpackConfig.sassLoader,
      node: webpackConfig.node
    },
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter')
    ],
    webpackServer: {
      noInfo: true
    }
  });
};
