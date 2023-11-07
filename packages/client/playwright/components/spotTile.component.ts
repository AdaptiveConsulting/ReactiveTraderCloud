import { Locator, Page } from "@playwright/test"

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

export enum Side {
  BUY = "Buy",
  SELL = "Sell",
}

export default class SpotTileComponent extends BasePageComponent {
  constructor(page: Page) {
    super(page.getByRole("region").locator("div"), page)
  }
  public getTile(currencyPair: CurrencyPair) {
    const spotTile = this.host
      .filter({ hasText: currencyPair })
      .first() as Locator

    // TODO - Make confirmation Green to fail when Orange/Red are received
    const confirmationDialogGreen = spotTile
      .getByRole("dialog")
      .filter({has:this.page.getByTestId("trade-id")})
    
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
