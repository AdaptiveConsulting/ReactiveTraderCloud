import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {
    // these are global ignores, cascading down to each config block, which can have its own
    // more targeted ignores, if necessary
    ignores: ['build'],
  },

  // ESLint's own core recommended rules
  // the FlatConfig equivalent of:  extends: [ 'eslint:recommended' ]
  js.configs.recommended,

  // https://typescript-eslint.io/getting-started/
  // Note:
  //   it is an array (base, recommended), so we have to spread it...
  //   see node_modules/typescript-eslint/dist/configs/base.js
  //   "base" contains the parser/plugin config, so we don't have to include that manually below
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    // note: many tseslint rules require the base eslint rule to be disabled
    rules: {
      eqeqeq: 'error',
    },
  },
];
