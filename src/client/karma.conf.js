'use strict';
var argv = require('yargs').argv;
var webpack = require('webpack');
var webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: './',
    singleRun  : !argv.watch,
    frameworks: [ 'jasmine' ],
    files: [
      './tests/test-index.js'
    ],
    preprocessors: {
      './tests/test-index.js': [ 'webpack' ]
    },
    reporters: [ 'spec' ],
    browsers: [ 'Chrome' ],
    webpack : {
      devtool : 'inline-source-map',
      resolve : webpackConfig.resolve,
      plugins : [], // none required for testing ATM
      module  : {
        loaders : webpackConfig.module.loaders
      },
      sassLoader : webpackConfig.sassLoader
    },
    plugins : [
      require('karma-webpack'),
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require('karma-spec-reporter')
    ],
    webpackServer: {
      noInfo: true
    }
  });
};
