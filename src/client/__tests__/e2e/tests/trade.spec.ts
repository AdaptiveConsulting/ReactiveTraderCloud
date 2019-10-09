// Import required pages
import { ProtractorBrowser, ElementFinder, by } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { getBrowser } from '../browser-manager'
import { wait } from '../utils/async.utils'
import { MainPage } from '../pages/main.page'
import * as assertUtils from '../utils/assert.utils'

let browser: ProtractorBrowser
let mainPage: MainPage
const currencyList: [string, string[]][] = [
  ['all', ['EUR/USD','USD/JPY','GBP/USD','GBP/JPY','AUD/USD','NZD/USD','EUR/AUD','EUR/CAD','EUR/JPY']],
  ['eur', ['EUR/USD','EUR/AUD','EUR/CAD','EUR/JPY']],
  ['usd', ['EUR/USD','USD/JPY','GBP/USD','AUD/USD','NZD/USD']],
  ['gbp', ['GBP/USD','GBP/JPY']],
  ['aud', ['AUD/USD','EUR/AUD']],
  ['nzd', ['NZD/USD']]
]
const tradeList = [
  ['usd', 'USD/JPY', 'buy', 'Success'],
  ['usd', 'USD/JPY', 'sell', 'Success'],
  ['gbp', 'GBP/JPY', 'buy', 'Rejected'],
  ['gbp', 'GBP/JPY', 'sell', 'Rejected'],
]

describe('UI Tests for Reactive Trader Cloud Web Application', async () => {

  beforeEach(async () => {
    browser = await getBrowser()
    mainPage = new MainPage(browser)
  })

  it('Verify page title', async () => {
    const title = await browser.getTitle()
    expect(title).toBe('Reactive Trader Cloud')
  })

  currencyList.forEach(([selectedCurrency, expectedCurrencies]) => {
    it(`should validate filtering currencies by ${selectedCurrency}`, async () => {
      await mainPage.workspace.selectCurrency(selectedCurrency)
      await assertUtils.assertDisplayedCurrencies(expectedCurrencies)
    })
  })

  tradeList.forEach(([selectedCurrency, currencyPair, direction, expectedResult]) => {
    it(`should validate ${currencyPair} ${direction}`, async () => {
      const tradingCurrency = currencyPair.replace('/', 'To');
      await mainPage.workspace.selectCurrency(selectedCurrency)
      const notional = await mainPage.tile.tradeType[tradingCurrency].notional
      await mainPage.tile.selectSpotTile(tradingCurrency, direction)
      await assertUtils.confirmationMessageAsserts(currencyPair, direction, expectedResult, notional.getAttribute('value'))
    })
  })

  afterAll(async () => {
    await browser.close()
  })

})
