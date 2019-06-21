'use strict'

const TradePage = require('../pages/tradePage.js')

let EC = protractor.ExpectedConditions
let maxWaitTime = 10000;

function fillNotional(newNotionalValue) {
  browser.wait(EC.visibilityOf(TradePage.textAmountSecondCell), )
  let textNotional = TradePage.textAmountSecondCell.getAttribute('value')
  expect(textNotional).toEqual('1,000,000')
  TradePage.textAmountSecondCell.clear()
  TradePage.textAmountSecondCell.sendKeys(newNotionalValue)
}

exports.GBPToUSDTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkGBP), maxWaitTime)
  TradePage.linkGBP.click()
  fillNotional('1,111,111')
  browser.wait(EC.visibilityOf(TradePage.buttonSellSecondCell), maxWaitTime)
  TradePage.buttonSellSecondCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), maxWaitTime)
  expect(TradePage.tradeSuccessMessage.getText()).toBeTruthy()
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You sold')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeSuccess), maxWaitTime)
  TradePage.buttonCloseTradeSuccess.click()
}

exports.GBPToJPYTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkGBP), maxWaitTime)
  TradePage.linkGBP.click()
  browser.wait(EC.visibilityOf(TradePage.buttonBuyFirstCell), maxWaitTime)
  TradePage.buttonBuyFirstCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeRejectedMessage), maxWaitTime)
  expect(TradePage.tradeRejectedMessage.getText()).toEqual('Your trade has been rejected')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeRejected), maxWaitTime)
  TradePage.buttonCloseTradeRejected.click()
}

exports.EURToJPYTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkEUR), maxWaitTime)
  TradePage.linkEUR.click()
  browser.wait(EC.visibilityOf(TradePage.buttonBuySecondCell), maxWaitTime)
  TradePage.buttonBuySecondCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeExecutionTimeOutMessage), maxWaitTime)
  expect(TradePage.tradeExecutionTimeOutMessage.getText()).toEqual('Trade Execution taking longer then Expected')
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), maxWaitTime)
  expect(TradePage.tradeSuccessMessage.getText()).toBeTruthy()
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You bought')
}

exports.EURToUSDTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkAll), maxWaitTime)
  TradePage.linkAll.click()
  browser.wait(EC.visibilityOf(TradePage.buttonSellSecondCell), maxWaitTime)
  TradePage.buttonSellSecondCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), maxWaitTime)
  expect(TradePage.tradeSuccessMessage.getText()).toBeTruthy()
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You sold')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeSuccess), maxWaitTime)
  TradePage.buttonCloseTradeSuccess.click()
}
