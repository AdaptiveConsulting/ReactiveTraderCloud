import { ElementFinder, ExpectedConditions as EC, ProtractorBrowser } from 'protractor'
import { MainPage } from '../pages/main.page'
import { getBrowser } from '../browser-manager'
import { waitForElementToBeClickable, waitForElementToBeVisible } from './browser.utils'
import { wait } from './async.utils'

let mainPage: MainPage
let browser: ProtractorBrowser

export async function confirmationMessageAsserts(currencies: string, transaction: string, expectedResult: string , notional: string, timeout: string) {
  browser = await getBrowser()
  mainPage = new MainPage(browser)
  let tradeWord: string
  let parsedTradeText: string
  const currency = currencies.slice(0, 3)
  const tradeSuccessMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage

  // Assert timeout message
  if (timeout === 'true') {
    parsedTradeText = (await tradeSuccessMessage.getText())
    expect(parsedTradeText).toEqual(`Trade Execution taking longer then Expected`)
    while (parsedTradeText == `Trade Execution taking longer then Expected`) {
        await wait(500)
        parsedTradeText = (await tradeSuccessMessage.getText())
    }
    } 
    
  // Assert trade success message string
  if (transaction === 'buy') {
    parsedTradeText = (await tradeSuccessMessage.getText()).slice(0, 14)
    tradeWord = 'bought'
  }
  else {
    parsedTradeText = (await tradeSuccessMessage.getText()).slice(0, 12)
    tradeWord = 'sold'
  }

  if (expectedResult === 'Success') {
    expect(parsedTradeText).toEqual(`You ${tradeWord} ${currency}`)
  }
  else {
    expect(await tradeSuccessMessage.getText()).toEqual('Your trade has been rejected')
  }

  // Assert trade currencies with executed currencies
  const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
  await waitForElementToBeVisible(browser, tradeCurrency)
  if (!tradeCurrency) {
    throw new Error(`could not find element with symbol ${tradeCurrency}$`)
  }
  const displayedCurrency = await tradeCurrency.getText()
  expect(displayedCurrency).toEqual(currencies)

  // Assert notional input value with executed trade notional value
  await waitForElementToBeVisible(browser, tradeSuccessMessage)
  const tradeSuccessString = await tradeSuccessMessage.getText()
  if (expectedResult === 'Success') {
    const regularExpression = new RegExp('(?<=You ' + tradeWord + ' ' + currency + ' )(\\d{1,3}(,\\d{1,3})?(,\\d{1,3})?(,\\d{1,3})?)+(\\.\\d{2})?')
    const confirmationNotional = tradeSuccessString.match(regularExpression)[0]
    expect(notional).toEqual(confirmationNotional)
  }

  // Close the confirmation screen
  const closeButton = await mainPage.tile.tradeType.confirmationScreen.pillButton
  await waitForElementToBeVisible(browser, closeButton)
  await closeButton.click()
}

export async function assertDisplayedCurrencies(expectedCurrencies: string[]) {
  const currencyPairs = ['EUR/USD', 'USD/JPY', 'GBP/USD', 'GBP/JPY', 'AUD/USD', 'NZD/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']
  for (let index in currencyPairs) {
    const convertedCurrency = currencyPairs[index].replace(/\//ig, "To")
    if (expectedCurrencies.includes(index)) {
      const tradeCurrency = await mainPage.tile.tradeType[convertedCurrency].labelCurrency
      const displayedCurrency = await tradeCurrency.getText()
      expect(displayedCurrency).toEqual(currencyPairs[index])
    }
  }
}
export async function assertblotter(currencies: string, transaction: string, expectedResult: string, notional: string) {
  // Assert trade id tile component with blotter component
  const tradeIdTile = await mainPage.tile.tradeType.confirmationScreen.labelTradeId
  if (!tradeIdTile) {
    throw new Error(`could not find element with symbol ${tradeIdTile}$`)
  }
  const parsedTradeId = (await tradeIdTile.getText()).slice(10, 14)
  if (!parsedTradeId) {
    throw new Error(`could not find element with symbol ${parsedTradeId}$`)
  }
  const tradeIdBlotter = await mainPage.blotter.tradesTable.executedTrades.tradeID
  if (!tradeIdBlotter) {
    throw new Error(`could not find element with symbol ${tradeIdBlotter}$`)
  }
  expect(tradeIdBlotter.getText()).toEqual(parsedTradeId)

  // Assert trade id banner background color in blotter section
  const tradeSuccessBanner = await mainPage.blotter.tradesTable.executedTrades.tradeBackGroundColour
  await waitForElementToBeVisible(browser, tradeSuccessBanner)
  if (expectedResult === 'Success') {
    expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(40, 201, 136, 1)')
  }
  else {
    expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(249, 76, 76, 1)')
  }
}