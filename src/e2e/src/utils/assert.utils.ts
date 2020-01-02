import { ProtractorBrowser } from 'protractor'
import { MainPage } from '../pages/main.page'
import { getBrowser } from '../browser-manager'
import { waitForElementToBeVisible } from './browser.utils'

let mainPage: MainPage
let browser: ProtractorBrowser

export async function confirmationMessageAsserts(
  currencies: string,
  transaction: string,
  expectedResult: string,
  notional: string,
  timeout: boolean,
) {
  browser = await getBrowser()
  mainPage = new MainPage(browser)
  const tradeWord: string = transaction === 'buy' ? 'bought' : 'sold'
  const currency = currencies.slice(0, 3)
  const tradeSuccessElement = await mainPage.tile.tradeType.confirmationScreen.labelMessage
  let tradeText: string = await tradeSuccessElement.getText()
  // Assert timeout message
  if (timeout === true) {
    expect(tradeText).toEqual(`Trade Execution taking longer then Expected`)

    await browser.wait(async () => {
      try {
        await waitForElementToBeVisible(browser, tradeSuccessElement)
        tradeText = await tradeSuccessElement.getText()
        return tradeText !== `Trade Execution taking longer then Expected`
      } catch (ex) {
        // swallow
        return false
      }
    }, 10_000)
  }

  const tradeCurrency = mainPage.tile.tradeType.confirmationScreen.labelCurrency
  await waitForElementToBeVisible(browser, tradeCurrency)
  const displayedCurrency = await tradeCurrency.getText()
  expect(displayedCurrency).toEqual(currencies)

  if (expectedResult === 'Success') {
    const shortMessage = transaction === 'buy' ? tradeText.slice(0, 14) : tradeText.slice(0, 12)
    if (transaction === 'buy') {
      expect(shortMessage).toEqual(`You bought ${currency}`)
    } else {
      expect(shortMessage).toEqual(`You sold ${currency}`)
    }

    const regularExpression = new RegExp(
      '(?<=You ' +
        tradeWord +
        ' ' +
        currency +
        ' )(\\d{1,3}(,\\d{1,3})?(,\\d{1,3})?(,\\d{1,3})?)+(\\.\\d{2})?',
    )
    const confirmationNotional = tradeText.match(regularExpression)[0]
    expect(notional).toEqual(confirmationNotional)
  } else {
    expect(tradeText).toEqual('Your trade has been rejected')
  }

  // Close the confirmation screen
  const closeButton = await mainPage.tile.tradeType.confirmationScreen.pillButton
  await waitForElementToBeVisible(browser, closeButton)
  await closeButton.click()
}

export async function assertDisplayedCurrencies(expectedCurrencies: string[]) {
  const currencyPairs = [
    'EUR/USD',
    'USD/JPY',
    'GBP/USD',
    'GBP/JPY',
    'AUD/USD',
    'NZD/USD',
    'EUR/AUD',
    'EUR/CAD',
    'EUR/JPY',
  ]
  for (const index in currencyPairs) {
    const convertedCurrency = currencyPairs[index].replace(/\//gi, 'To')
    if (expectedCurrencies.includes(index)) {
      const tradeCurrency = await mainPage.tile.tradeType[convertedCurrency].labelCurrency
      const displayedCurrency = await tradeCurrency.getText()
      expect(displayedCurrency).toEqual(currencyPairs[index])
    }
  }
}
export async function assertblotter(
  currencies: string,
  transaction: string,
  expectedResult: string,
) {
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
  } else {
    expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(249, 76, 76, 1)')
  }
}
