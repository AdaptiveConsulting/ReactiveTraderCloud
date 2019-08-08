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