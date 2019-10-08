// Import required pages
import { ProtractorBrowser, ElementFinder, by } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { getBrowser } from '../browser-manager'
import { wait } from '../utils/async.utils'
import { MainPage } from '../pages/main.page'
import * as tileUtils from '../utils/tile.utils'

let browser: ProtractorBrowser
let mainPage: MainPage

describe('UI Tests for Reactive Trader Cloud Web Application', async () => {

  beforeEach(async () => {
    browser = await getBrowser()
    mainPage = new MainPage(browser)
  })

  it('Verify page title', async () => {
    const title = await browser.getTitle()
    expect(title).toBe('Reactive Trader Cloud')
  })

  it('should validate filtering by currencies', async () => {
    let expectedCurrencies: string[]
    await mainPage.workspace.selectCurrency('eur')
    expectedCurrencies = ['EUR/USD','EUR/AUD','EUR/CAD','EUR/JPY']
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)
    await mainPage.workspace.selectCurrency('usd')
    expectedCurrencies = ['EUR/USD','USD/JPY','GBP/USD','AUD/USD','NZD/USD']
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)
    await mainPage.workspace.selectCurrency('gbp')
    expectedCurrencies = ['GBP/USD','GBP/JPY']
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)     
    await mainPage.workspace.selectCurrency('aud')
    expectedCurrencies = ['AUD/USD','EUR/AUD']
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)
    await mainPage.workspace.selectCurrency('nzd')
    expectedCurrencies = ['NZD/USD']
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)
    await mainPage.workspace.selectCurrency('all')
    expectedCurrencies = ['EUR/USD','USD/JPY','GBP/USD','GBP/JPY','AUD/USD','NZD/USD','EUR/AUD','EUR/CAD','EUR/JPY']    
    await tileUtils.assertDisplayedCurrencies(expectedCurrencies)
  })

  it('should validate successful USD to JPY purchase', async () => {
    await mainPage.workspace.selectCurrency('usd')
    const notional = await mainPage.tile.tradeType.USDToJPY.notional
    await mainPage.tile.selectSpotTile('USDToJPY', 'buy')
    await tileUtils.confirmationMessageAsserts('USD/JPY','buy','Success', notional.getAttribute('value'))
  })

  it('should validate successful USD to JPY Sale', async () => {
    await mainPage.workspace.selectCurrency('usd')
    const notional = await mainPage.tile.tradeType.USDToJPY.notional
    await mainPage.tile.selectSpotTile('USDToJPY', 'sell')
    await tileUtils.confirmationMessageAsserts('USD/JPY','sell','Success', notional.getAttribute('value'))
  })

  it('should validate successful GBP to USD sale', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    const notional = await mainPage.tile.tradeType.GBPToUSD.notional
    await mainPage.tile.selectSpotTile('GBPToUSD', 'sell')
    await tileUtils.confirmationMessageAsserts('GBP/USD','sell','Success', notional.getAttribute('value'))
  })

  it('should validate successful GBP to USD purchase', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    const notional = await mainPage.tile.tradeType.GBPToUSD.notional
    await mainPage.tile.selectSpotTile('GBPToUSD', 'buy')
    await tileUtils.confirmationMessageAsserts('GBP/USD','buy','Success', notional.getAttribute('value'))
  })

  it('should validate failed GBP to JPY sale', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    const notional = await mainPage.tile.tradeType.GBPToUSD.notional
    await mainPage.tile.selectSpotTile('GBPToJPY', 'sell')
    tileUtils.confirmationMessageAsserts('GBP/JPY','sell','Rejected', notional.getAttribute('value'))
  })

  it('should validate failed GBP to JPY purchase', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    const notional = await mainPage.tile.tradeType.GBPToUSD.notional
    await mainPage.tile.selectSpotTile('GBPToJPY', 'buy')
    tileUtils.confirmationMessageAsserts('GBP/JPY','buy','Rejected', notional.getAttribute('value'))
  }) 

  afterAll(async () => {
    await browser.close()
  })

})
