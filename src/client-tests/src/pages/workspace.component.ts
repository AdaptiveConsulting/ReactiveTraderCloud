import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { waitForElementToBeClickable, waitForElementToBeVisible } from '../utils/browser.utils'
import { wait } from '../utils/async.utils'

export class WorkspaceComponent {
  links: Record<string, ElementFinder>

  constructor(private browser: ProtractorBrowser, public root: ElementFinder) {
    this.links = {
      all: root.element(by.qaTag('currency-option-all')),
      eur: root.element(by.qaTag('currency-option-eur')),
      usd: root.element(by.qaTag('currency-option-usd')),
      gbp: root.element(by.qaTag('currency-option-gbp')),
      aud: root.element(by.qaTag('currency-option-aud')),
      nzd: root.element(by.qaTag('currency-option-nzd'))
    }
  }

  async selectCurrency(linkCurrency: String) {
    const key = linkCurrency.toLowerCase()
    const linkElement = this.links[key]
    if (!linkElement) {
      throw new Error(`could not find element with symbol ${linkCurrency}`)
    }
    await waitForElementToBeClickable(this.browser, linkElement)
    await linkElement.click()
    await wait(500)
  }
}
