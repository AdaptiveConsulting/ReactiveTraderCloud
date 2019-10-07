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
    const parsedTradeText = (await tradeSuccessMessage.getText()).slice(0, 14)
    expect(parsedTradeText).toEqual('You bought USD')
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
    await waitForElementToBeVisible(browser, tradeCurrency)
    expect(tradeCurrency.getText()).toEqual('USD/JPY')
  })

  it('Should validate successful GBP to USD trade', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    await mainPage.tile.selectSpotTile('GBPToUSD', 'sell')
    const tradeSuccessMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeSuccessMessage)
    const parsedTradeText = (await tradeSuccessMessage.getText()).slice(0, 12)
    expect(parsedTradeText).toEqual('You sold GBP')
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
    await waitForElementToBeVisible(browser, tradeCurrency)
    expect(tradeCurrency.getText()).toEqual('GBP/USD')
  })

  it('Should validate successful EUR to JPY trade', async () => {
    await mainPage.workspace.selectCurrency('eur')
    await mainPage.tile.selectSpotTile('EURToJPY', 'sell')
    const tradeTimeOutMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeTimeOutMessage)
    expect(tradeTimeOutMessage.getText()).toEqual('Trade Execution taking longer then Expected')
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
    await waitForElementToBeVisible(browser, tradeCurrency)
    expect(tradeCurrency.getText()).toEqual('EUR/JPY')
    // Timeout to change status from trade timeout message to success message state
    await wait(5000)
    const tradeSuccessMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeSuccessMessage)
    const parsedTradeText = (await tradeSuccessMessage.getText()).slice(0, 12)
    expect(parsedTradeText).toEqual('You sold EUR')
  })

  it('Should validate rejected GBP to JPY trade', async () => {
    await mainPage.workspace.selectCurrency('gbp')
    await mainPage.tile.selectSpotTile('GBPToJPY', 'buy')
    const tradeRejectedMessage = await mainPage.tile.tradeType.confirmationScreen.labelMessage
    await waitForElementToBeVisible(browser, tradeRejectedMessage)
    expect(tradeRejectedMessage.getText()).toEqual('Your trade has been rejected')
    const tradeCurrency = await mainPage.tile.tradeType.confirmationScreen.labelCurrency
    await waitForElementToBeVisible(browser, tradeCurrency)
    expect(tradeCurrency.getText()).toEqual('GBP/JPY')
  })

  afterAll(async () => {
    await browser.close()
  })

})
