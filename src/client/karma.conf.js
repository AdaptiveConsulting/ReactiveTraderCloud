'use strict';
var argv = require('yargs').argv;
var webpack = require('webpack');
var config1 = require('./webpack.config');
var webpackConfig = config1({});

const path = require('path');

const TEST_BUNDLER = './tests/testIndex.js';

module.exports = function(config){
  config.set({
    basePath: './',
    singleRun: !argv.watch,
    frameworks: ['jasmine'],
    files: [{
      pattern  : TEST_BUNDLER,
      watched  : false,
      served   : true,
      included : true
    }],
    preprocessors: {
      [TEST_BUNDLER]: ['webpack']
    },
    reporters: ['spec'],
    browsers: ['Chrome'],
    webpack: {
      devtool: 'inline-source-map',
      resolve: webpackConfig.resolve,
      plugins: [],
      module: webpackConfig.module,
      node: webpackConfig.node
    },
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter')
    ],
    stats: {
      colors: true,
      modules: true,
      reasons: true,
      errorDetails: true
    },
    webpackServer: {
      quiet: false,
      noInfo: false,
    }
  });
};
