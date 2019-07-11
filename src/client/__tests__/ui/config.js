'use strict'

const { SpecReporter } = require('jasmine-spec-reporter')

exports.config = {
  framework: 'jasmine',
  directConnect: true,
  specs: ['tests/tradeTest.js', ],
  multiCapabilities: [{
    browserName: 'chrome',
    chromeOptions: {
      args: ['--start-maximized', '--disable-infobars', '--disable-notifications', '--headless', '--no-sandbox']
    }
  }],
  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true,
    showColors: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 300000
  },
  onPrepare: function() {
    //console logs configurations
    browser.manage().window().maximize()
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'all', // display stacktrace for each failed assertion, values: (all|specs|summary|none)
      displaySuccessesSummary: false, // display summary of all successes after execution
      displayFailuresSummary: true, // display summary of all failures after execution
      displayPendingSummary: true, // display summary of all pending specs after execution
      displaySuccessfulSpec: true, // display each successful spec
      displayFailedSpec: true, // display each failed spec
      displayPendingSpec: false, // display each pending spec
      displaySpecDuration: false, // display each spec duration
      displaySuiteNumber: false, // display each suite number (hierarchical)
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
    reactiveTraderCloud: 'http://localhost:3000/'
  }
}
