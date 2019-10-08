import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'

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
        notional: root.element(by.qaTag('notional-input__input-nzdusd'))
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
  }

  async setNotional(currencyTrade: string, textNotional: string, notional: number) {
    const textElement = this.tradeType[currencyTrade][textNotional]
    if (!textElement) {
      throw new Error(`could not find element with symbol ${currencyTrade}${textNotional}`)
    }
    await waitForElementToBeVisible(this.browser, textElement)
    await textElement.clear()
    await textElement.sendKeys(notional)
  }
}
