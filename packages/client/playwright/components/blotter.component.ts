import type { Page } from "@playwright/test"

import { BasePageComponent } from "../base.component"

export enum BlotterColumnValue {
  MAIN,
  TRADEID,
  STATUS,
  TRADEDATE,
  DIRECTION,
  CCYCCY,
  DEALCCY,
  NOTIONAL,
  RATE,
  VALUETRADE,
  TRADER,
}

export default class BlotterComponent extends BasePageComponent {
  constructor(page: Page) {
    super(page.locator("[aria-labelledby='trades-table-heading']"), page)
  }

  public async getTradeLineValue(tradeId: string, column: BlotterColumnValue) {
    return await this.host
      .locator(`[data-testid='trades-grid-row-${tradeId}'] > div`)
      .nth(column)
      .textContent()
  }
}
