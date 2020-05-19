module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      issuePrefixes: ['ARTP-'],
    },
  },
  rules: {
    'references-empty': [1, 'never'],
  },
}
