import { ProtractorBrowser, by } from 'protractor'
import { getBrowser } from '../browser-manager'
import { MainPage } from '../pages/main.page'
import * as assertUtils from '../utils/assert.utils'

let browser: ProtractorBrowser
let mainPage: MainPage
const currencyList: [string, string[]][] = [
  [
    'all',
    [
      'AUD/USD',
      'EUR/AUD',
      'EUR/CAD',
      'EUR/JPY',
      'EUR/USD',
      'GBP/JPY',
      'GBP/USD',
      'NZD/USD',
      'USD/JPY',
    ],
  ],
  ['eur', ['EUR/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']],
  ['usd', ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'NZD/USD']],
  ['gbp', ['GBP/USD', 'GBP/JPY']],
  ['aud', ['AUD/USD', 'EUR/AUD']],
  ['nzd', ['NZD/USD']],
]
const tradeList: [string, string, string, string, boolean][] = [
  ['eur', 'EUR/JPY', 'buy', 'Success', true],
  ['usd', 'USD/JPY', 'buy', 'Success', false],
  ['gbp', 'GBP/JPY', 'sell', 'Rejected', false],
]

const notionalList = [
  ['999999', '999,999'],
  ['2345678.99', '2,345,678.99'],
  ['2m', '2,000,000'],
  ['45k', '45,000'],
]

const envTitles = [
  'Reactive Trader Cloud',
  'Reactive Trader Cloud (DEV)',
  'Reactive Trader Cloud (LOCAL)',
  'Reactive Trader Cloud (UAT)',
  'Reactive Trader Cloud (UNKNOWN)',
]

describe('UI Tests for Reactive Trader Cloud Web Application', async () => {
  beforeEach(async () => {
    browser = await getBrowser()
    mainPage = new MainPage(browser)
  })

  it('Verify page title', async () => {
    const title = await browser.getTitle()
    const isValid = envTitles.includes(title)
    expect(isValid).toBeTruthy()
  })

  notionalList.forEach(([enteredNotional, expectedNotional]) => {
    it(`should validate notional entry ${enteredNotional}`, async () => {
      await mainPage.tile.setNotional('EURToUSD', enteredNotional)
      const notional = await mainPage.tile.tradeType.EURToUSD.notional
      const returnedNotional = notional.getAttribute('value')
      expect(returnedNotional).toEqual(expectedNotional)
    })
  })

  it('Should validate a notional value larger than the maximum allowed', async () => {
    await mainPage.tile.setNotional('EURToUSD', '99999999')
    const notional = await mainPage.tile.tradeType.EURToUSD.notional
    expect(notional.getAttribute('value')).toEqual('99,999,999')
    const pricesButton = browser.element(by.qaTag('workspace-view-normal'))
    await pricesButton.click()
    const labelRFQ = await mainPage.tile.tradeType.initiateRFQ.buttonInitiateRFQ
    expect(labelRFQ.getText()).toEqual('Initiate RFQ')
    await mainPage.tile.resetNotional('EURToUSD')
    expect(notional.getAttribute('value')).toEqual('1,000,000')
  })

  currencyList.forEach(([selectedCurrency, expectedCurrencies]) => {
    it(`should validate filtering currencies by ${selectedCurrency}`, async () => {
      await mainPage.workspace.selectCurrency(selectedCurrency)
      await assertUtils.assertDisplayedCurrencies(expectedCurrencies)
    })
  })

  tradeList.forEach(([selectedCurrency, currencyPair, direction, expectedResult, timeout]) => {
    it(`should validate ${currencyPair} ${direction}`, async () => {
      const tradingCurrency = currencyPair.replace('/', 'To')
      await mainPage.workspace.selectCurrency(selectedCurrency)
      const notional = await mainPage.tile.tradeType[tradingCurrency].notional
      await mainPage.tile.selectSpotTile(tradingCurrency, direction)
      await assertUtils.confirmationMessageAsserts(
        currencyPair,
        direction,
        expectedResult,
        notional.getAttribute('value'),
        timeout,
      )
    })
  })

  it('should validate RFQ mode', async () => {
    await mainPage.workspace.selectCurrency('usd')
    await mainPage.tile.setNotional('USDToJPY', '10m')
    await mainPage.tile.initiateRFQ()
  })

  it('should validate zero notional', async () => {
    await mainPage.workspace.selectCurrency('usd')
    await mainPage.tile.setNotional('USDToJPY', '0')
    const tradeButton = await mainPage.tile.tradeType.USDToJPY.sell
    const disabledAttribute = await tradeButton.getAttribute('disabled')
    expect(disabledAttribute).toBe('true')
  })

  afterAll(async () => {
    await browser.close()
  })
})
