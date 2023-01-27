module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globals: {
    "ts-jest": {
      babelConfig: true,
      diagnostics: {
        ignoreCodes: [1343], // otherwise throws error about "import.meta" before babel can help
      },
    },
  },
  // for jest > 27 ..
  // transform: {
  //   "^.+\\.tsx?$": [
  //     "ts-jest",
  //     {
  //       diagnostics: {
  //         warnOnly: true,
  //         ignoreCodes: [1343], // otherwise throws error about "import.meta" before babel can help
  //       },
  //       babelConfig: true,
  //     },
  //   ],
  // },
}
