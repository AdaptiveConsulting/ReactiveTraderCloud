'use strict'
// Import required pages
const TradePage = require('../pages/tradePage.js')
const TradeMethod = require('../steps/tradeMethod.js');

// function to dealy test runs
const origFn = browser.driver.controlFlow().execute
browser.driver.controlFlow().execute = function() {
  const args = arguments
  origFn.call(browser.driver.controlFlow(), function() {
    return protractor.promise.delayed(80)
  })
  return origFn.apply(browser.driver.controlFlow(), args)
}

describe('UI Smoke Tests for Reactive Trader Cloud App', function() {

  beforeEach(async() => {
    await browser.waitForAngularEnabled(false)
    await browser.get(browser.params.reactiveTraderCloud)
  })

  it('should validate the GBP to USD trade', async() => {
    expect(await browser.getTitle()).toEqual('Reactive Trader Cloud')
    await TradeMethod.GBPToUSDTrade()
    expect(await TradePage.textTradeStatus.getText()).toEqual('Done')
    expect(await TradePage.textBackGroundColour.getCssValue('background-color')).toEqual('rgba(40, 201, 136, 1)')
  })

  it('should  validate the EUR to JPY trade', async() => {
    await TradeMethod.EURToJPYTrade()
    expect(await TradePage.textTradeStatus.getText()).toEqual('Done')
  })

  it('should  validate the EUR to USD trade', async() => {
    await TradeMethod.EURToUSDTrade()
    expect(await TradePage.textTradeId.isPresent()).toBeTruthy()
    expect(await TradePage.textTradeStatus.getText()).toEqual('Done')
    expect(await TradePage.textTradeDate.isPresent()).toBeTruthy()
    expect(await TradePage.textTradeDirection.getText()).toEqual('Sell')
  })

  it('should  validate the GBP to JPY trade', async() => {
    await TradeMethod.GBPToJPYTrade()
    expect(await TradePage.textTradeStatus.getText()).toEqual('Rejected')
    expect(await TradePage.textBackGroundColour.getCssValue('background-color')).toEqual('rgba(249, 76, 76, 1)')
  })

  afterAll(async() => {
    await browser.close()
  })

})
