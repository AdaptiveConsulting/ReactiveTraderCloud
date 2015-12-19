import { argv }      from 'yargs';
import config        from '../config';
import webpackConfig from '../webpack.config';

const KARMA_ENTRY_FILE = 'karma.entry.js';

function makeDefaultConfig () {
    const karma = {
    files: [
      'tests/testIndex.js'
    ],
    singleRun  : !argv.watch,
    frameworks : ['jasmine'],
    preprocessors: {
      'tests/testIndex.js': ['webpack']
    },
    reporters : ['spec'],
    browsers: ['Chrome'],
    webpack : {
      devtool : 'inline-source-map',
      resolve : webpackConfig.resolve,
      plugins : webpackConfig.plugins
        .filter(plugin => !plugin.__KARMA_IGNORE__),
      module  : {
        loaders : webpackConfig.module.loaders
      },
      sassLoader : webpackConfig.sassLoader
    },
    webpackMiddleware : {
      noInfo : true
    },
    coverageReporter : {
      reporters : config.get('coverage_reporters')
    },
    plugins : [
      require('karma-webpack'),
      require("karma-jasmine"),
      require('karma-coverage'),
      require("karma-chrome-launcher"),
      require('karma-spec-reporter')
    ]
  };

  if (config.get('coverage_enabled')) {
    karma.reporters.push('coverage');
    karma.webpack.module.preLoaders = [{
      test    : /\.(js|jsx)$/,
      include : /src/,
      loader  : 'isparta'
    }];
  }

  return karma;
}

export default (karmaConfig) => karmaConfig.set(makeDefaultConfig());
