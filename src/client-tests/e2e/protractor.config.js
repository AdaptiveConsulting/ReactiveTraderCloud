'use strict'

const { SpecReporter } = require('jasmine-spec-reporter')
const colors = require('colors')
const { EOL } = require('os')

const CHROME_CAPABILITIES = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--start-maximized', '--disable-infobars', '--disable-notifications', '--headless', '--no-sandbox']
  }
}

const FIREFOX_CAPABILITIES = {
  browserName: 'firefox',
  'moz:firefoxOptions': {
    args: ['--start-maximized', '--disable-infobars', '--disable-notifications', '--headless', '--no-sandbox']
  }
}

function getBrowserCapabilities() {
  const browserName = process.env.BROWSER || 'chrome'

  switch (browserName.toLowerCase()) {
    case 'chrome':
      return CHROME_CAPABILITIES
    case 'firefox':
      return FIREFOX_CAPABILITIES
    default:
      throw new Error(`Unsupported browser ${browserName}`)
  }
}

exports.config = {
  allScriptsTimeout: 100000,
  framework: 'jasmine',
  directConnect: true,
  maxSessions: 10,
  specs: ['tmp/*/*.js'],
  capabilities: getBrowserCapabilities(),
  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 300000,
    print: () => {},
  },
  onPrepare: function() {
    setUpCustomLocators()
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'all',
      displaySuccessesSummary: false,
      displayFailuresSummary: true,
      displayPendingSummary: true,
      displaySuccessfulSpec: true,
      displayFailedSpec: true,
      displayPendingSpec: false,
      displaySpecDuration: false,
      displaySuiteNumber: false,
      colors: {
        success: 'green',
        failure: 'red',
        pending: 'yellow'
      },
      prefixes: {
        success: '✓ ',
        failure: '✗ ',
        pending: '* '
      },
      customProcessors: []
    }))
  },
  params: {
    baseUrl: 'http://localhost:3000/'
  }
}

function setUpCustomLocators() {
  by.addLocator('qaTag', (qaTag, parentElement) => {
    const parent = parentElement || document
    return parent.querySelector(`[data-qa-id=${qaTag}]`)
  })

  by.addLocator('qaTagAll', (qaTag, parentElement) => {
    const parent = parentElement || document
    return parent.querySelectorAll(`[data-qa-id=${qaTag}]`)
  })

  by.addLocator('qa', (qa, parentElement) => {
    const parent = parentElement || document
    return parent.querySelector(`[data-qa=${qa}]`)
  })

  by.addLocator('qaAll', (qa, parentElement) => {
    const parent = parentElement || document
    return parent.querySelectorAll(`[data-qa=${qa}]`)
  })
}

function setupBrowserErrorsLogging() {
  afterEach(() => {
    return browser
      .manage()
      .logs()
      .get('browser')
      .then(logs => {
        const filteredLogs = logs.filter(
          l =>
          !l.message.includes('/polyfills') &&
          !l.message.includes('401 (Unauthorized)') &&
          !l.message.includes('HttpErrorResponse')
        );

        if (filteredLogs.length > 0) {
          const prettyPrint = filteredLogs
            .map(log => JSON.stringify(log, null, 2))
            .join(`;${EOL}`)

          console.warn(colors.blue('BROWSER LOGS RETRIEVED'))
          console.warn(colors.grey(prettyPrint))
        }
      })
  })
}
