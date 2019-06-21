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

describe('UI Smoke Tests for Reactive Trader Cloud App', function() {

  beforeEach(function() {
    browser.waitForAngularEnabled(false)
    browser.get(browser.params.reactiveTraderCloud)
  })

  it('should validate the GBP to USD trade', function() {
    expect(browser.getTitle()).toEqual('Reactive Trader Cloud')
    TradeMethod.GBPToUSDTrade()
    expect(TradePage.textTradeStatus.getText()).toEqual('Done')
    expect(TradePage.textBackGroundColour.getCssValue('background-color')).toEqual('rgba(40, 201, 136, 1)')
  })

  it('should  validate the GBP to JPY trade', function() {
    TradeMethod.GBPToJPYTrade()
    expect(TradePage.textTradeStatus.getText()).toEqual('Rejected')
    expect(TradePage.textBackGroundColour.getCssValue('background-color')).toEqual('rgba(249, 76, 76, 1)')
  })

  it('should  validate the EUR to JPY trade', function() {
    TradeMethod.EURToJPYTrade()
    expect(TradePage.textTradeStatus.getText()).toEqual('Done')
  })

  it('should  validate the EUR to USD trade', function() {
    TradeMethod.EURToUSDTrade()
    expect(TradePage.textTradeId.isPresent()).toBeTruthy()
    expect(TradePage.textTradeStatus.getText()).toEqual('Done')
    expect(TradePage.textTradeDate.isPresent()).toBeTruthy()
    expect(TradePage.textTradeDirection.getText()).toEqual('Sell')
  })

  afterAll(function() {
    browser.close()
  })

})
