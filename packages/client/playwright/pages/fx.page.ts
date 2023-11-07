import { Download, Page } from "@playwright/test"

import { BasePage } from "../base.page"
import AnalyticsComponent from "../components/Analytics.component"
import BlotterComponent from "../components/Blotter.component"
import SpotTileComponent from "../components/SpotTile.component"

export enum Filter {
  ALL,
  EUR,
  USD,
  GBP,
  AUD,
  NZD,
}

export default class FxPage extends BasePage {
  constructor(public readonly page: Page) {
    super(page)
  }

  public readonly spotTileComponent = new SpotTileComponent(this.page)
  public readonly blotterComponent = new BlotterComponent(this.page)
  public readonly analyticsComponent = new AnalyticsComponent(this.page)

  public async selectCurrencyFilter(filter: Filter) {
    await this.page
      .locator("[data-qa='workspace__tiles-workspace']")
      .getByTestId(`menuButton-${Filter[filter]}`)
      .click()
  }

  public async waitForEventDownload(): Promise<Download> {
    return await this.page.waitForEvent("download")
  }

  async open() {
    await super.open("/fx")
  }
}
