const tsc = require('typescript');
const tsConfig = require('./tsconfig.json');
const babelJest = require('babel-jest');

module.exports = {
  process(src, path) {
    if (path.endsWith('.ts') || path.endsWith('.tsx')) {
      return tsc.transpile(src, tsConfig.compilerOptions, path, []);
    }
    if (path.endsWith('.js') || path.endsWith('.jsx')) {
      return babelJest.process(src, path);
    }
    return src;
  },
};
