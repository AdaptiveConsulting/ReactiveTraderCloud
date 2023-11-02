import { Page } from "@playwright/test"

import { BasePageComponent } from "../base.component"

export enum CurrencyPair {
  EURUSD = "EUR/USD",
  USDJPY = "USD/JPY",
  GBPUSD = "GBP/USD",
  GBPJPY = "GBP/JPY",
  EURJPY = "EUR/JPY",
  AUDUSD = "AUD/USD",
  NZDUSD = "NZD/USD",
  EURCAD = "EUR/CAD",
  EURAUD = "EUR/AUD",
}

export enum Filter {
  ALL,
  EUR,
  USD,
  GBP,
  AUD,
  NZD,
}

export enum Side {
  BUY = "Buy",
  SELL = "Sell",
}

export default class SpotTileComponent extends BasePageComponent {
  constructor(page: Page) {
    super(page.locator("[data-qa='workspace__tiles-workspace']"), page)
  }

  public async selectFilter(filter: Filter) {
    await this.host.getByTestId(`menuButton-${Filter[filter]}`).click()
  }

  public getSpotTile(currencyPair: CurrencyPair) {
    const spotTile = this.host
      .getByRole("region")
      .locator("div")
      .filter({ hasText: currencyPair })
      .first()
    const confirmationDialogGreen = spotTile
      .getByRole("dialog")
      .getByText(/Trade ID/)
    const confirmationDialogOrange = spotTile
      .getByRole("dialog")
      .getByText(/Trade execution taking longer than expected/)
    const confirmationDialogRed = spotTile
      .getByRole("dialog")
      .getByText(/Your trade has been rejected/)
    const executionSpinner = spotTile.getByText(/Executing/)

    async function clearTextField() {
      await spotTile.locator("input").clear()
    }
    async function fillTextField(amount: string) {
      await spotTile.locator("input").fill(amount)
    }
    async function selectSide(side: Side) {
      const formattedCurrencyPair = currencyPair.replace("/", "")
      await spotTile.getByTestId(`${side}-${formattedCurrencyPair}`).click()
    }
    async function getTradeId() {
      return await confirmationDialogGreen
        .locator("[data-testid='trade-id']")
        .innerText()
    }

    return {
      confirmationDialogGreen,
      confirmationDialogOrange,
      confirmationDialogRed,
      executionSpinner,
      clearTextField,
      fillTextField,
      selectSide,
      getTradeId,
    }
  }
}
