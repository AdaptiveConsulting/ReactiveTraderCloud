'use strict'

const { EOL } = require('os')
const { SpecReporter } = require('jasmine-spec-reporter')
const colors = require('colors')


const CHROME_CAPABILITIES = {
  browserName: 'chrome',
  chromeOptions: {
    args: ['--start-maximized', '--disable-infobars', '--disable-notifications', '--no-sandbox']
  }
}

const CHROME_CAPABILITIES_HEADLESS = {
  browserName: 'chrome',
  chromeOptions: {
    args: [ ...CHROME_CAPABILITIES.chromeOptions.args, '---headless']
  }
}

const FIREFOX_CAPABILITIES = {
  browserName: 'firefox',
  'moz:firefoxOptions': {
    args: ['--start-maximized', '--disable-infobars', '--disable-notifications', '--headless', '--no-sandbox']
  }
}

function getBrowserCapabilities() {
  const browserName = process.env.BROWSER || 'chromeheadless'

  switch (browserName.toLowerCase()) {
    case 'chrome':
      return CHROME_CAPABILITIES
    case 'chromeheadless':
        return CHROME_CAPABILITIES_HEADLESS
    case 'firefox':
      return FIREFOX_CAPABILITIES
    default:
      throw new Error(`Unsupported browser ${browserName}`)
  }
}

const config = {
  allScriptsTimeout: 100000,
  framework: 'jasmine',
  directConnect: true,
  maxSessions: 10,
  specs: ['./tests/**/*.spec.ts'],
  capabilities: getBrowserCapabilities(),
  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 300000,
    print: () => { },
  },
  onPrepare: function () {
    setUpCustomLocators();
    require('ts-node').register()
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayDuration: true,
        displaySuccessful: true,
        displayFailed: true,
        displayErrorMessages: true,
        displayStacktrace: true
      },
      summary: {
        displayStacktrace: true,
        displaySuccessful: false,
        displayFailed: true,
        displayPending: true,
      },
      colors: {
        successful: 'green',
        failed: 'red',
        pending: 'yellow'
      },
      prefixes: {
        successful: '✓ ',
        failed: '✗ ',
        pending: '* '
      },
      customProcessors: []
    }));
  },
  baseUrl: 'http://localhost:3000'
}

module.exports.config = config;

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
