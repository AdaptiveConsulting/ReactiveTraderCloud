import { Locator, Page } from "@playwright/test"

import { BaseComponent } from "../Base.component"
import { GrReturn } from "react-icons/all"

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

export default class SpotTileComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.getByRole("region").locator("div"), page)
  }

  public getToggle() {
    return this.page.getByTestId("toggleButton")
  }

  get tileState() {
    return this.page.evaluate(() => {
      window.localStorage.getItem("selectedView")
    })
  }

  public async getTileSate() {
    await this.page.evaluate(() => {
      return window.localStorage.getItem("selectedView")
    })
  }

  public getTile(currencyPair: CurrencyPair) {
    const spotTile = this.host.filter({ hasText: currencyPair }).first()

    const formattedCurrencyPair = currencyPair.replace("/", "")

    const confirmationDialogGreen = spotTile
      .getByRole("dialog")
      .filter({ hasText: /You/ })
      .filter({
        has: this.page.getByTestId("trade-id"),
      })
    const confirmationDialogOrange = spotTile
      .getByRole("dialog")
      .getByText(/Trade execution taking longer than expected/)
    const confirmationDialogRed = spotTile
      .getByRole("dialog")
      .getByText(/Your trade has been rejected/)
    const executionSpinner = spotTile.getByText(/Executing/)

    const getMaxExceedError = spotTile.getByText(/Max exceeded/)

    const getRfqButton = spotTile.locator("[data-testid='rfqButton']")

    const rfqSellPrice = spotTile.locator(
      `[data-testid='Sell-${formattedCurrencyPair}']`,
    )
    const rfqBuyPrice = spotTile.locator(
      `[data-testid='Buy-${formattedCurrencyPair}']`,
    )

    async function clearTextField() {
      await spotTile.locator("input").clear()
    }

    async function fillTextField(amount: string) {
      await spotTile.locator("input").fill(amount)
    }

    async function getTextField() {
      return await spotTile
        .locator(`input[id='notional-input-${formattedCurrencyPair}']`)
        .inputValue()
    }

    async function selectSide(side: Side) {
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
      rfqSellPrice,
      rfqBuyPrice,
      getRfqButton,
      getMaxExceedError,
      clearTextField,
      fillTextField,
      getTextField,
      selectSide,
      getTradeId,
    }
  }
}
