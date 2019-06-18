'use strict'

const TradePage = require('../pages/tradePage.js')

let EC = protractor.ExpectedConditions
let max_wait_time = 10000;

exports.successfulTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkGBP), max_wait_time)
  TradePage.linkGBP.click()
  browser.wait(EC.visibilityOf(TradePage.buttonSellSecondCell), max_wait_time)
  TradePage.buttonSellSecondCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), max_wait_time)
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You sold')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeSuccess), max_wait_time)
  TradePage.buttonCloseTradeSuccess.click()
}

exports.failedTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkGBP), max_wait_time)
  TradePage.linkGBP.click()
  browser.wait(EC.visibilityOf(TradePage.buttonBuyFirstCell), max_wait_time)
  TradePage.buttonBuyFirstCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeRejectedMessage), max_wait_time)
  expect(TradePage.tradeRejectedMessage.getText()).toContain('Your trade has been rejected')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeRejected), max_wait_time)
  TradePage.buttonCloseTradeRejected.click()
}
