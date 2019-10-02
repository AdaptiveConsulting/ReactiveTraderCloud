// Import required pages
import { ProtractorBrowser, ElementFinder, by } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { getBrowser } from '../browser-manager'
import { wait } from '../utils/async.utils'
import { MainPage } from '../pages/main.page'

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

  it('Should validate successful USD to JPY trade', async () => {
    await mainPage.workspace.selectCurrency('usd')
    await mainPage.tile.selectSpotTile('USDToJPY', 'buy')
    const tradeSuccessMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeSuccessMessage)
    const parsedTradeText = (await tradeSuccessMessage.getText()).slice(0,14)
    expect(parsedTradeText).toEqual('You bought USD')
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
    await waitForElementToBeVisible(browser, tradeCurrency)
    expect(tradeCurrency.getText()).toEqual('USD/JPY')
    const tradeIdActual = await mainPage.tile.tradeType.confirmationScreen.labelTradeId
    await waitForElementToBeVisible(browser, tradeIdActual)
    const parsedTradeId = (await tradeIdActual.getText()).slice(10,14)
    const tradeIdExpected = await mainPage.blotter.tradesTable.executedTrades.tradeID
    await waitForElementToBeVisible(browser, tradeIdExpected)
    expect(tradeIdExpected.getText()).toEqual(parsedTradeId)
    const tradeStatus = await mainPage.blotter.tradesTable.executedTrades.tradeStatus
    await waitForElementToBeVisible(browser, tradeStatus)
    expect(tradeStatus.getText()).toEqual('Done')
    const tradeSuccessBanner = await mainPage.blotter.tradesTable.executedTrades.tradeBackGroundColour
    await waitForElementToBeVisible(browser, tradeSuccessBanner)
    expect(tradeSuccessBanner.getCssValue('background-color')).toEqual('rgba(40, 201, 136, 1)')
  })

  afterAll(async () => {
    await browser.close()
  })

})
