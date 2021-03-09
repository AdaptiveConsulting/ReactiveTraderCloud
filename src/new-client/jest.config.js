module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testRegex: "\.test.[t]sx?$",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
}
