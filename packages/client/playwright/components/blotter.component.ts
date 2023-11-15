import { type Page } from "@playwright/test"
import fs from "fs"

import { BaseComponent } from "../Base.component"

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

export default class BlotterComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.locator("[aria-labelledby='trades-table-heading']"), page)
  }

  public async clickHeaderColumn(blotterColumnValue: BlotterColumnValue) {
    await this.host.locator("[role=\"grid\"] > div").first().locator("div").nth(blotterColumnValue).click()
  }

  public async filterColumnByText(blotterColumnValue: BlotterColumnValue, text: string, isopen = false) {
    const header = this.host.locator("[role=\"grid\"] > div").first().locator("div").nth(blotterColumnValue)
    await header.hover()
    if (!isopen) {
      await header.getByRole("button").click()
    }
    await header.getByRole("textbox").type(text)
  }

  public async clearFilterColumn(blotterColumnValue: BlotterColumnValue, isopen = false) {
    const header = this.host.locator("[role=\"grid\"] > div").first().locator("div").nth(blotterColumnValue)
    await header.hover()
    if (!isopen) {
      await header.getByRole("button").click()
    }
    await header.getByRole("textbox").clear()
  }

  public async getTradeCount() {
    const rows = await this.host.locator("[role=\"grid\"] > div").count()
    // substract 1 for header row
    return rows - 1
  }

  public async clickDownload() {
    await this.host.locator("[aria-label=\"Export to CSV\"]").click()
  }

  public getTradeIDFromCSV = (csvRows: string | string[]): string => {
    // get index 1 to account for header row
    const firstRowFields = csvRows[1].split(",")
    const tradeField = firstRowFields[0]
    return tradeField
  }

  public async getlatestTradeId() {
    const firstRow = await this.getTradeEntry(1)
    const tradeId = firstRow.getValueByColumn(BlotterColumnValue.TRADEID)
    return tradeId
  }

  public async getLatestTradeStatus() {
    const firstRow = await this.getTradeEntry(1)
    const status = firstRow.getValueByColumn(BlotterColumnValue.STATUS)
    return status
  }
  public parseCSV (filePath:string): Array<string> | string {
    //read the downloaded file, use readFileSync because it is synchronous
    let csvRows: Array<string> | string
    try {
      csvRows = fs
        .readFileSync(filePath, "utf8")
        .toString()
        .split("\n") as Array<string>
    } catch (err) {
      csvRows = "error"
    }
    return csvRows
  }
  
  public async getTradeEntry(rank: number) {
    const tradeEntry = this.page.locator("[role=\"grid\"] > div").nth(rank)

    const backgroundColor = await tradeEntry.evaluate((element) => {
      return window
        .getComputedStyle(element)
        .getPropertyValue("background-color")
    })

    const animation = await tradeEntry.evaluate((element) => {
      return window
        .getComputedStyle(element)
        .getPropertyValue("animation")
    })

    async function getValueByColumn(column: BlotterColumnValue) {
      return await tradeEntry.locator("div").nth(column).textContent()
    }

    async function hover() {
      await tradeEntry.hover()
    }

    return { getValueByColumn, hover, backgroundColor, animation }
  }


}
