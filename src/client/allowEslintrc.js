/*
Per this Create React App issue: https://github.com/facebook/create-react-app/issues/808
Allows a custom eslintrc file in the root directory.
Without it, global configurations would be inflexible, requiring inline overrides for the app to successfully compile.
*/

const fs = require('fs');
const path = require('path');

const reactScriptsWebpackConfig = path.join(__dirname, 'node_modules', 'react-scripts', 'config', 'webpack.config.js');
const webpack = fs.readFileSync(reactScriptsWebpackConfig, 'utf8');
const customConfig = webpack.replace(/(?<=useEslintrc:\s)false/gm, 'true');

fs.writeFile(reactScriptsWebpackConfig, customConfig, 'utf8', function(err) {
  if (err) {
    process.exit(1);
  }
  process.exit(0);
});