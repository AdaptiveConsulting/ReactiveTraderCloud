'use strict'

const TradePage = require('../pages/tradePage.js')

const EC = protractor.ExpectedConditions
const maxWaitTime = 10000;

function fillNotional(newNotionalValue) {
  browser.wait(EC.visibilityOf(TradePage.textAmountFourthCell), maxWaitTime)
  const textNotional = TradePage.textAmountFourthCell.getAttribute('value')
  expect(textNotional).toEqual('1,000,000')
  TradePage.textAmountFourthCell.clear()
  TradePage.textAmountFourthCell.sendKeys(newNotionalValue)
}

exports.GBPToUSDTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkAll), maxWaitTime)
  TradePage.linkAll.click()
  fillNotional('1,111,111')
  browser.wait(EC.visibilityOf(TradePage.buttonSellFourthCell), maxWaitTime)
  TradePage.buttonSellFourthCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), maxWaitTime)
  expect(TradePage.tradeSuccessMessage.getText()).toBeTruthy()
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You sold')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeSuccess), maxWaitTime)
  TradePage.buttonCloseTradeSuccess.click()
}

exports.EURToJPYTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkAll), maxWaitTime)
  TradePage.linkAll.click()
  browser.wait(EC.visibilityOf(TradePage.buttonBuyFifthCell), maxWaitTime)
  TradePage.buttonBuyFifthCell.click()
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
  browser.wait(EC.visibilityOf(TradePage.buttonSellFirstCell), maxWaitTime)
  TradePage.buttonSellFirstCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeSuccessMessage), maxWaitTime)
  expect(TradePage.tradeSuccessMessage.getText()).toBeTruthy()
  expect(TradePage.tradeSuccessMessage.getText()).toContain('You sold')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeSuccess), maxWaitTime)
  TradePage.buttonCloseTradeSuccess.click()
}

exports.GBPToJPYTrade = () => {
  browser.wait(EC.visibilityOf(TradePage.linkAll), maxWaitTime)
  TradePage.linkAll.click()
  browser.wait(EC.visibilityOf(TradePage.buttonBuyThirdCell), maxWaitTime)
  TradePage.buttonBuyThirdCell.click()
  browser.sleep(2000)
  browser.wait(EC.visibilityOf(TradePage.tradeRejectedMessage), maxWaitTime)
  expect(TradePage.tradeRejectedMessage.getText()).toEqual('Your trade has been rejected')
  browser.wait(EC.visibilityOf(TradePage.buttonCloseTradeRejected), maxWaitTime)
  TradePage.buttonCloseTradeRejected.click()
}
