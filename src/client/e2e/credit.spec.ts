import { expect, Page } from "@playwright/test"
import * as dotenv from "dotenv"
import { test } from "../fixtures"

dotenv.config()

test.describe("Credit", () => {
  test.describe("New RFQ", () => {
    test("When I select Googl instrument and click Send RFQ button then I should see a GOOGL RFQ created on the RFQ sections and I can accept any value", async ({
      context,
      creditOpenfinPagesRec,
    }, testInfo) => {
      test.setTimeout(120000)
      let newRfqPage: Page
      let rfqsPage: Page
      let rfqBlotterPage: Page
      if (testInfo.project.name === "openfin") {
        const mainWindow = creditOpenfinPagesRec["mainWindow"]
        await mainWindow.evaluate(async () => {
          const currentWindow = window.fin.desktop.Window.getCurrent()
          currentWindow.maximize()
          return window.fin
        })
        newRfqPage = creditOpenfinPagesRec["credit-new-rfq"]
        rfqsPage = creditOpenfinPagesRec["credit-rfqs"]
        rfqBlotterPage = creditOpenfinPagesRec["credit-blotter"]
      } else {
        const pages = await context.pages()
        newRfqPage = pages.length > 0 ? pages[0] : await context.newPage()
        await newRfqPage.goto(
          `${process.env.URL_PATH ?? "http://localhost:1917/credit"}`,
        )
        rfqsPage = newRfqPage
        rfqBlotterPage = newRfqPage
      }
      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage
        .locator("[data-testid='search-result-item']")
        .nth(5)
        .click()

      const quantity = newRfqPage.locator("[data-testid='quantity']")
      await quantity.type("2")
      await quantity.blur()

      await newRfqPage.locator("span").getByText(/All/).click()
      console.log("Found span > all")
      await newRfqPage
        .locator("span")
        .getByText(/Adaptive Bank/)
        .click()
      console.log("Found span > Adaptive Bank")

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()
      console.log("Clicked Send RFQ")
      // Navigate to Live
      await rfqsPage.getByText(/Live/).click()
      await rfqsPage.waitForTimeout(15000)

      console.log("Timeout 15000 ms reached")
      await rfqsPage
        .locator("[data-testid='quotes']")
        .locator("div")
        .first()
        .hover()

      console.log("Hover over single quote")
      await rfqsPage
        .getByTestId("quotes")
        .getByText(/Accept/)
        .first()
        .click()

      console.log("Click accept")

      await rfqsPage.locator("li").getByText(/All/).nth(0).click()
      const btnTxt = await rfqsPage
        .locator("button")
        .getByText(/View Trade/)
        .first()
        .innerText()

      await rfqsPage
        .locator("button")
        .getByText(/View Trade/)
        .first()
        .click()

      const tradeId = btnTxt.split(" ")[2]
      const blotterId = await rfqBlotterPage
        .locator("td")
        .getByText(tradeId)
        .first()
        .innerText()

      expect(tradeId).toEqual(blotterId)
    })
  })
})
