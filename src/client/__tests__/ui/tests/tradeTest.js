'use strict'
// Import required pages
const TradePage = require('../pages/tradePage.js')
const TradeMethod = require('../steps/tradeMethod.js');

// function to dealy test runs
let origFn = browser.driver.controlFlow().execute
browser.driver.controlFlow().execute = function() {
  let args = arguments
  origFn.call(browser.driver.controlFlow(), function() {
    return protractor.promise.delayed(60)
  })
  return origFn.apply(browser.driver.controlFlow(), args)
}

describe('UI Tests for Reactive Trader Cloud App', function() {

  beforeEach(function() {
    browser.waitForAngularEnabled(false)
    browser.get(browser.params.reactiveTraderCloud)
  })

  it('should validate the successful trade', function() {
    expect(browser.getTitle()).toEqual('Reactive Trader Cloud')
    TradeMethod.successfulTrade()
    expect(TradePage.textTradeStatus.getText()).toEqual('Done')
  })

  it('should  validate the rejected trade', function() {
    expect(browser.getTitle()).toEqual('Reactive Trader Cloud')
    TradeMethod.failedTrade()
    expect(TradePage.textTradeStatus.getText()).toEqual('Rejected')
  })

  afterAll(function() {
    browser.close()
  })

})
