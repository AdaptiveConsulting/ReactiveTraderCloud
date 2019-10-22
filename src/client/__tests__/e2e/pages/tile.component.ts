import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { wait } from '../utils/async.utils'

export class TileComponent {
  tradeType: Record<string, Record<string, ElementFinder>>

  constructor(private browser: ProtractorBrowser, public root: ElementFinder) {
    this.tradeType = {
      EURToUSD: {
        sell: root.element(by.qaTag('direction-sell-eurusd')),
        buy: root.element(by.qaTag('direction-buy-eurusd')),
        notional: root.element(by.qaTag('notional-input__input-eurusd'))
      },
      USDToJPY: {
        sell: root.element(by.qaTag('direction-sell-usdjpy')),
        buy: root.element(by.qaTag('direction-buy-usdjpy')),
        notional: root.element(by.qaTag('notional-input__input-usdjpy'))
      },
      GBPToUSD: {
        sell: root.element(by.qaTag('direction-sell-gbpusd')),
        buy: root.element(by.qaTag('direction-buy-gbpusd')),
        notional: root.element(by.qaTag('notional-input__input-gbpusd'))
      },
      GBPToJPY: {
        sell: root.element(by.qaTag('direction-sell-gbpjpy')),
        buy: root.element(by.qaTag('direction-buy-gbpjpy')),
        notional: root.element(by.qaTag('notional-input__input-gbpjpy'))
      },
      AUDToUSD: {
        sell: root.element(by.qaTag('direction-sell-audusd')),
        buy: root.element(by.qaTag('direction-buy-audusd')),
        notional: root.element(by.qaTag('notional-input__input-audusd'))
      },
      NZDToUSD: {
        sell: root.element(by.qaTag('direction-sell-nzdusd')),
        buy: root.element(by.qaTag('direction-buy-nzdusd')),
        notional: root.element(by.qaTag('notional-input__input-nzdusd')),
        initiateRFQ: root.element(by.qa('tile-booking__booking-status')),
      },
      EURToAUD: {
        sell: root.element(by.qaTag('direction-sell-euraud')),
        buy: root.element(by.qaTag('direction-buy-euraud')),
        notional: root.element(by.qaTag('notional-input__input-euraud'))
      },
      EURToCAD: {
        sell: root.element(by.qaTag('direction-sell-eurcad')),
        buy: root.element(by.qaTag('direction-buy-eurcad')),
        notional: root.element(by.qaTag('notional-input__input-eurcad'))
      },
      EURToJPY: {
        sell: root.element(by.qaTag('direction-sell-eurjpy')),
        buy: root.element(by.qaTag('direction-buy-eurjpy')),
        notional: root.element(by.qaTag('notional-input__input-eurjpy'))
      },
      confirmationScreen: {
        labelCurrency: root.element(by.qa('tile-notification__symbols')),
        labelTradeId: root.element(by.qa('tile-notification__tradeid')),
        labelMessage: root.element(by.qa('tile-notification__content')),
        pillButton: root.element(by.qa('tile-notification__pill-button'))
      },
      initiateRFQ: {
        buttonInitiateRFQ: root.element(by.qa('tile-booking__booking-status')),
        buttonReload: root.element(by.qa('notional-input__reset-input-value')),
        buttonReject: root.element(by.qa('rfq-timer__reject-quote-button')),
        labelTextStreamingUnavailable: root.element(by.qa('price-controls__price-button-disabled')),
        labelTextTradeExpired: root.element(by.qa('price-button__expired'))
      }
    }
  }

  async selectSpotTile(currencyTrade: string, type: string) {
    const buttonElement = this.tradeType[currencyTrade][type]
    if (!buttonElement) {
      throw new Error(`could not find element with symbol ${currencyTrade}${type}`)
    }
    await waitForElementToBeClickable(this.browser, buttonElement)
    await buttonElement.click()
    await wait(2000)
  }
  async resetNotional(currencyTrade: string) {
    const buttonElement = this.tradeType.initiateRFQ.buttonReload
    if (!buttonElement) {
      throw new Error(`could not find reset notional button on ${currencyTrade}`)
    }
    await waitForElementToBeClickable(this.browser, buttonElement)
    await buttonElement.click()
    await wait(200)
  }

  async setNotional(currencyTrade: string, notional: string) {
    const textElement = this.tradeType[currencyTrade].notional
    if (!textElement) {
      throw new Error(`could not find element with symbol ${currencyTrade}`)
    }
    await waitForElementToBeVisible(this.browser, textElement)
    await textElement.clear()
    await textElement.sendKeys(notional)
  }

  async initiateRFQ(initiateRFQ: string) {
    const labelTextStreaming = this.tradeType[initiateRFQ].labelTextStreamingUnavailable
    expect(labelTextStreaming.getText()).toEqual('STREAMING PRICE UNAVAILABLE')
    const buttonRFQ = this.tradeType[initiateRFQ].buttonInitiateRFQ
    await waitForElementToBeClickable(this.browser, buttonRFQ)
    await buttonRFQ.click()
    const buttonReject = this.tradeType[initiateRFQ].buttonReject
    await waitForElementToBeClickable(this.browser, buttonReject)
    await buttonReject.click()
    const labelTextExpired = this.tradeType[initiateRFQ].labelTextTradeExpired
    expect(labelTextExpired.getText()).toEqual('EXPIRED')
    // To avoid click interception between the elements
    await wait(800)
    const buttonRequote = this.tradeType[initiateRFQ].buttonInitiateRFQ
    await waitForElementToBeClickable(this.browser, buttonRequote)
    await buttonRequote.click()
    // Wait for button reload to appear after requote
    await wait(10500)
    const buttonReload = this.tradeType[initiateRFQ].buttonReload
    await waitForElementToBeClickable(this.browser, buttonReload)
    await buttonReload.click()
  }

  async NZDToUSDRFQ(currencyTrade: string) {
    const buttonRFQ = this.tradeType[currencyTrade].initiateRFQ
    await waitForElementToBeClickable(this.browser, buttonRFQ)
    await buttonRFQ.click()
    const buttonSell = this.tradeType.NZDToUSD.sell
    await waitForElementToBeClickable(this.browser, buttonSell)
    expect(buttonSell.isPresent()).toBe(true)
    const buttonBuy = this.tradeType.NZDToUSD.buy
    await waitForElementToBeClickable(this.browser, buttonBuy)
    expect(buttonBuy.isPresent()).toBe(true)
    // Wait for button requote to appear after inititiate RFQ timeout
    await wait(10500)
  }

}
