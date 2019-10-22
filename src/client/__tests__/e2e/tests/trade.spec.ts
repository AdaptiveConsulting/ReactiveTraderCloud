// Import required pages
import { ProtractorBrowser, ElementFinder, by } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { getBrowser } from '../browser-manager'
import { wait } from '../utils/async.utils'
import { MainPage } from '../pages/main.page'
import * as assertUtils from '../utils/assert.utils'
import { TileComponent } from '../pages/tile.component'

let browser: ProtractorBrowser
let mainPage: MainPage
const currencyList: [string, string[]][] = [
  ['eur', ['EUR/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']],
  ['usd', ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'NZD/USD']],
  ['gbp', ['GBP/USD', 'GBP/JPY']],
  ['aud', ['AUD/USD', 'EUR/AUD']],
  ['nzd', ['NZD/USD']],
  ['all', ['EUR/USD', 'USD/JPY', 'GBP/USD', 'GBP/JPY', 'AUD/USD', 'NZD/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']]
]
const tradeList: [string, string, string, string, boolean][] = [
  ['eur', 'EUR/JPY', 'buy', 'Success', true],
  ['usd', 'USD/JPY', 'buy', 'Success', false],
  ['gbp', 'GBP/JPY', 'sell', 'Rejected', false]
]

const notionalList = [
  ['999999', '999,999'],
  ['2m', '2,000,000'],
  ['45k', '45,000']
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

  notionalList.forEach(([enteredNotional, expectedNotional]) => {
    it(`should validate notional entry ${enteredNotional}`, async () => {
      await mainPage.tile.setNotional('EURToUSD', enteredNotional)
      const notional = await mainPage.tile.tradeType.EURToUSD.notional
      const returnedNotional = notional.getAttribute('value')
      expect(returnedNotional).toEqual(expectedNotional)
    })
  })

  currencyList.forEach(([selectedCurrency, expectedCurrencies]) => {
    it(`should validate filtering currencies by ${selectedCurrency}`, async () => {
      await mainPage.workspace.selectCurrency(selectedCurrency)
      await assertUtils.assertDisplayedCurrencies(expectedCurrencies)
    })
  })

  tradeList.forEach(([selectedCurrency, currencyPair, direction, expectedResult, timeout]) => {
    it(`should validate ${currencyPair} ${direction}`, async () => {
      const tradingCurrency = currencyPair.replace('/', 'To');
      await mainPage.workspace.selectCurrency(selectedCurrency)
      const notional = await mainPage.tile.tradeType[tradingCurrency].notional
      await mainPage.tile.selectSpotTile(tradingCurrency, direction)
      await assertUtils.confirmationMessageAsserts(currencyPair, direction, expectedResult, notional.getAttribute('value'), timeout)
    })
  })

  it('should validate RFQ mode', async () => {
    await mainPage.workspace.selectCurrency('usd')
    await mainPage.tile.setNotional('USDToJPY', '10m')
    await mainPage.tile.initiateRFQ('initiateRFQ')
  })

  it('should validate unavailable streaming', async () => {
    await mainPage.workspace.selectCurrency('nzd')
    const textStreaming = await mainPage.tile.tradeType.initiateRFQ.labelTextStreamingUnavailable
    expect(textStreaming.getText()).toEqual('STREAMING PRICE UNAVAILABLE')
    await mainPage.tile.NZDToUSDRFQ('NZDToUSD')
  })

  afterAll(async () => {
    await browser.close()
  })

})
