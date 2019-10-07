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
  })

  afterAll(async () => {
    await browser.close()
  })

})
