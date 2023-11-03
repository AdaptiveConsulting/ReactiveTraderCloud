import { Page } from "@playwright/test"

import { BasePage } from "../base.page"
import AnalyticsComponent from "../components/analytics.component"
import BlotterComponent from "../components/blotter.component"
import SpotTileComponent from "../components/spotTile.component"

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

  async open() {
    await super.open("/fx")
  }
}
