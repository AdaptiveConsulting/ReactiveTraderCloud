import js from "@eslint/js"
import pluginImport from "eslint-plugin-import"
import pluginPlaywright from "eslint-plugin-playwright"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import pluginSimpleImportSort from "eslint-plugin-simple-import-sort"
import pluginVitest from "@vitest/eslint-plugin"
import globals from "globals"
import pluginTypescriptEslint from "typescript-eslint"

// Use standard array of config blocks (rather than typescript-eslint wrapper)
// Plugins should be a one-shot entry in this (per typescript-eslint, and most recent react)
//
// Tried to introduce typechecking to this file, but requires
// * .js to be added to tsconfig.json
// * // @ts-check at the top of this file
// * this /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
// ... and even then eslint-plugin-react has no (useful) types .. sigh
//
export default [
  {
    // these are global ignores, cascading down to each config block, which can have its own
    // more targeted ignores, if necessary
    ignores: [
      "dist",
      "test-results",
      "coverage",
      "playwright-report",
      "*.config.js",
    ],
  },

  // ESLint's own core recommended rules
  // the FlatConfig equivalent of:  extends: [ 'eslint:recommended' ]
  js.configs.recommended,

  // https://typescript-eslint.io/getting-started/
  // Note:
  //   it is an array (base, recommended), so we have to spread it...
  //   see node_modules/typescript-eslint/dist/configs/base.js
  //   "base" contains the parser/plugin config, so we don't have to include that manually below
  ...pluginTypescriptEslint.configs.recommended,

  // https://github.com/jsx-eslint/eslint-plugin-react?tab=readme-ov-file#flat-configs
  // all flat configs include "plugins" entry and "parserOptions"
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],

  // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
  pluginReactHooks.configs["recommended-latest"],

  // https://github.com/import-js/eslint-plugin-import
  //
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,

  {
    // all files - main block - no "files" restriction
    plugins: {
      // https://github.com/lydell/eslint-plugin-simple-import-sort
      "simple-import-sort": pluginSimpleImportSort,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    linterOptions: {
      // useful to help clear up old eslint comments that are no longer applicable
      reportUnusedDisableDirectives: "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // note: many typescript-eslint rules require the base eslint rule to be disabled
      //
      // https://typescript-eslint.io/rules/no-unused-vars/
      // with options to ignore _-prefixed args
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // https://eslint.org/docs/latest/rules/no-loss-of-precision
      "no-loss-of-precision": "off",
      "@typescript-eslint/no-loss-of-precision": "off",
      // https://typescript-eslint.io/rules/no-unused-expressions/
      // with options to allow terse conditionals in functions (debatable)
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          enforceForJSX: true,
        },
      ],

      // with new flat config, we need to "switch on" the import errors
      // ref https://github.com/lydell/eslint-plugin-simple-import-sort#usage
      // per example: https://github.com/lydell/eslint-plugin-simple-import-sort#example-configuration
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // import already switches off import/named as TypeScript compiler already covers this
      // need to suppress no-unresolved, as it cannot cope with the vite aliasing :rolleyes:
      "import/no-unresolved": "off",

      "react-hooks/exhaustive-deps": "error",
    },
  },
  {
    // special blanket rules for mocks/tests
    files: ["**/*.{service-mock,mock,test,spec}.{ts,tsx}", "**/__mocks__/*"],
    plugins: {
      // https://github.com/vitest-dev/eslint-plugin-vitest
      vitest: pluginVitest,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
  {
    // special blanket rules for e2e
    files: ["e2e/**"],
    plugins: {
      // https://github.com/playwright-community/eslint-plugin-playwright
      playwright: pluginPlaywright,
    },
    rules: {
      "no-console": "off",
      // playwright rules - note: plugin docs config does not work:
      // https://github.com/playwright-community/eslint-plugin-playwright?tab=readme-ov-file#with-playwright-test-runner
      // but this does!
      ...pluginPlaywright.configs.recommended.rules,

      // clashes with "use()"
      "react-hooks/rules-of-hooks": "off",
    },
  },
]
