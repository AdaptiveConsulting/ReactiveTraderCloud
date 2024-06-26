import js from "@eslint/js"
import react from "eslint-plugin-react"
import hooks from "eslint-plugin-react-hooks"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import globals from "globals"
import tseslint from "typescript-eslint"

// Tried to introduce typechecking to this file, but requires
// * .js to be added to tsconfig.json
// * // @ts-check at the top of this file
// * this /** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
// ... and even then eslint-plugin-react has no (useful) types .. sigh
//
export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      // https://github.com/lydell/eslint-plugin-simple-import-sort
      "simple-import-sort": simpleImportSort,
      // https://typescript-eslint.io/getting-started/
      "@typescript-eslint": tseslint.plugin,
      // https://github.com/jsx-eslint/eslint-plugin-react
      react,
      // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
      // compat with ESLint v9, see https://github.com/facebook/react/issues/28313
      "react-hooks": hooks,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    // note: many tseslint rules require the base eslint rule to be disabled
    rules: {
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
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // as hooks plugin does not play well with Flat Config right now, do this
      ...hooks.configs.recommended.rules,
    },
  },
  {
    // special blanket rules for mocks/tests
    files: ["**/*.{service-mock,mock,test,spec}.{ts,tsx}", "**/__mocks__/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
]
