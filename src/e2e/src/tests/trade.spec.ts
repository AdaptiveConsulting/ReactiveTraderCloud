import { ProtractorBrowser } from 'protractor'
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
      'USD/JPY'
    ]
  ],
  ['eur', ['EUR/USD', 'EUR/AUD', 'EUR/CAD', 'EUR/JPY']],
  ['usd', ['EUR/USD', 'USD/JPY', 'GBP/USD', 'AUD/USD', 'NZD/USD']],
  ['gbp', ['GBP/USD', 'GBP/JPY']],
  ['aud', ['AUD/USD', 'EUR/AUD']],
  ['nzd', ['NZD/USD']]
]
const tradeList: [string, string, string, string, boolean][] = [
  ['eur', 'EUR/JPY', 'buy', 'Success', true],
  ['usd', 'USD/JPY', 'buy', 'Success', false],
  ['gbp', 'GBP/JPY', 'sell', 'Rejected', false]
]

const blotterTradeList: [string, string, string, string][] = [
  ['usd', 'USD/JPY', 'buy', 'Success'],
  ['gbp', 'GBP/JPY', 'sell', 'Rejected']
]

const notionalList = [
  ['999999', '999,999'],
  ['2345678.99', '2,345,678.99'],
  ['2m', '2,000,000'],
  ['45k', '45,000']
]

const envTitles = [
  'Reactive Trader® ',
  'Reactive Trader® (DEV)',
  'Reactive Trader® (LOCAL)',
  'Reactive Trader® (UAT)',
  'Reactive Trader® (UNKNOWN)'
]

describe('UI Tests for Reactive Trader Web Application', async () => {
  beforeAll(async () => {
    browser = await getBrowser()
    mainPage = new MainPage(browser)
  })

  beforeEach(async () => {
    await browser.refresh()
  })

  afterAll(async () => {
    await browser.close()
  })

  describe('Page', () => {
    it('Verify page title', async () => {
      const title = await browser.getTitle()
      const isValid = envTitles.includes(title)
      expect(isValid).toBeTruthy()
    })
  })

  describe('Blotter', () => {
    blotterTradeList.forEach(([selectedCurrency, currencyPair, direction, expectedResult]) => {
      it(`Should validate blotter for ${currencyPair} ${expectedResult}`, async () => {
        const today = new Date()
        const dd = String(today.getDate()).padStart(2, '0')
        const mm = today.toLocaleString('default', { month: 'short' })
        const yyyy = today.getFullYear()
        const todayBlotterDate = dd + '-' + mm + '-' + yyyy
        const latestTrade = await mainPage.blotter.getLatestTrade()
        const tradingCurrency = currencyPair.replace('/', 'To')
        await mainPage.workspace.selectCurrency(selectedCurrency)
        await mainPage.tile.selectSpotTile(tradingCurrency, direction)
        const newLatestTrade = await mainPage.blotter.getLatestTrade()
        expect(Number(newLatestTrade)).toEqual(Number(latestTrade) + 1)
        const latestStatus = await (await mainPage.blotter.getTradeStatus(newLatestTrade)).getText()
        if (expectedResult == 'Success') {
          expect(latestStatus).toEqual('Done')
        } else {
          expect(latestStatus).toEqual('Rejected')
        }
        const latestDate = await (await mainPage.blotter.getTradeDate(newLatestTrade)).getText()
        expect(latestDate).toEqual(todayBlotterDate)
        const latestDirection = await (
          await mainPage.blotter.getTradeDirection(newLatestTrade)
        ).getText()
        if (direction == 'buy') {
          expect(latestDirection).toEqual('Buy')
        } else {
          expect(latestDirection).toEqual('Sell')
        }
      })
    })
  })

  describe('Notional', () => {
    notionalList.forEach(([enteredNotional, expectedNotional]) => {
      it(`Should validate notional entry ${enteredNotional}`, async () => {
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
      const labelRFQ = await mainPage.tile.tradeType.initiateRFQ.buttonInitiateRFQ
      expect(labelRFQ.getText()).toEqual('Initiate RFQ')
      await mainPage.tile.resetNotional('EURToUSD')
      expect(notional.getAttribute('value')).toEqual('1,000,000')
    })

    it('Should validate zero notional', async () => {
      await mainPage.workspace.selectCurrency('usd')
      await mainPage.tile.setNotional('USDToJPY', '0')
      const tradeButton = await mainPage.tile.tradeType.USDToJPY.sell
      const disabledAttribute = await tradeButton.getAttribute('disabled')
      expect(disabledAttribute).toBe('true')
    })
  })

  describe('Currencies', () => {
    currencyList.forEach(([selectedCurrency, expectedCurrencies]) => {
      it(`Should validate filtering currencies by ${selectedCurrency}`, async () => {
        await mainPage.workspace.selectCurrency(selectedCurrency)
        await assertUtils.assertDisplayedCurrencies(expectedCurrencies)
      })
    })

    tradeList.forEach(([selectedCurrency, currencyPair, direction, expectedResult, timeout]) => {
      it(`Should validate ${currencyPair} ${direction}`, async () => {
        const tradingCurrency = currencyPair.replace('/', 'To')
        await mainPage.workspace.selectCurrency(selectedCurrency)
        const notional = await mainPage.tile.tradeType[tradingCurrency].notional
        await mainPage.tile.selectSpotTile(tradingCurrency, direction)
        await assertUtils.confirmationMessageAsserts(
          currencyPair,
          direction,
          expectedResult,
          notional.getAttribute('value'),
          timeout
        )
      })
    })
  })

  describe('RFQ', () => {
    it('should validate RFQ mode', async () => {
      await mainPage.workspace.selectCurrency('usd')
      await mainPage.tile.setNotional('USDToJPY', '10m')
      await mainPage.tile.initiateRFQ()
    })
  })
})
