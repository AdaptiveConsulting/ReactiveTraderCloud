const _ = require('lodash');
const mergeWith = require('lodash.mergewith');
const path = require('path');
// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

// load the default config generator.
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config');
module.exports = (baseConfig, env) => {
  const defaultConfig = genDefaultConfig(baseConfig, env);

  const config = {
    module: {
      rules: [
         {
          test: /\.jsx?$/,
          exclude: /node_modules/,
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
         {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, 'non_existing_path_as_a_workaround')
          ],
          loader: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 100000
              }
            },
          ]
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      // 'dist/rx.all.js': 'rx/dist/rx.all.js' is needed for webpack 2 and rx 4
      alias: {
       'dist/rx.all.js': 'rx/dist/rx.all.js',
        system: path.join(__dirname, 'src/system'),
        services: path.join(__dirname, 'src/services')
      }
    },
  };

  // merging customizer to concatenate arrays and remove duplicates
  function unionIfArray(objValue, srcValue) {
    if(objValue && (_.isArray(srcValue) !== _.isArray(objValue))) {
      throw new Error('trying to assign non-array to array');
    }
    if (_.isArray(srcValue) && _.isArray(objValue)) {
      return _.union(srcValue, objValue);
    }
  }

  return mergeWith(config, defaultConfig, unionIfArray);
};
