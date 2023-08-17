import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { OPENFIN_PROJECT_NAME } from "./utils"

test.describe("Credit", () => {
  let newRfqPage: Page
  let rfqsPage: Page
  let rfqBlotterPage: Page

  test.beforeAll(async ({ context, creditPagesRec }, testInfo) => {
    if (testInfo.project.name === OPENFIN_PROJECT_NAME) {
      const mainWindow = creditPagesRec["mainWindow"]

      await mainWindow.evaluate(async () => {
        window.fin.Window.getCurrentSync().maximize()
      })

      newRfqPage = creditPagesRec["credit-new-rfq"]
      rfqsPage = creditPagesRec["credit-rfqs"]
      rfqBlotterPage = creditPagesRec["credit-blotter"]
    } else {
      const pages = context.pages()

      newRfqPage = pages.length > 0 ? pages[0] : await context.newPage()

      await newRfqPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)

      rfqsPage = newRfqPage
      rfqBlotterPage = newRfqPage
    }
  })

  test.describe("New RFQ", () => {
    test("Create RFQ for GOOGL @smoke", async () => {
      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage.getByTestId("search-result-item").getByText("GOOGL").first().click()

      const quantity = newRfqPage.getByTestId("quantity")
      await quantity.type("2")
      await quantity.blur()

      await newRfqPage.locator("span").getByText(/All/).click()

      await newRfqPage
        .locator("span")
        .getByText(/Adaptive Bank/)
        .click()

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()

      // Navigate to Live
      await rfqsPage.getByText(/Live/).click()

      const firstQuote = await rfqsPage
        .getByTestId("quotes")
        .first()
        .locator("div")
        .first()
      // Wait for first quote response
      await expect(firstQuote).not.toContainText("Awaiting response", {
        timeout: 20000,
      })

      await firstQuote.hover()

      await firstQuote.getByText(/Accept/).click()

      await rfqsPage.locator("li").getByText(/All/).nth(0).click()
      const btnTxt = await rfqsPage
        .getByTestId("view-trade")
        .first()
        .innerText()

      await rfqsPage.getByTestId("view-trade").first().click()

      const tradeId = btnTxt.split(" ")[2]
      const blotterId = await rfqBlotterPage
        .locator("div")
        .getByText(tradeId, { exact: true })
        .first()
        .innerText()

      expect(tradeId).toEqual(blotterId)
    })
  })

  test.describe("Sell side", () => {
    test("Sell side ticket", async ({ context }) => {
      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage.getByTestId("search-result-item").getByText("GOOGL").first().click()

      const quantity = newRfqPage.getByTestId("quantity")
      await quantity.type("2")

      await newRfqPage
        .locator("span")
        .getByText(/Adaptive Bank/)
        .click()

      const pagePromise = context.waitForEvent("page")

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()

      const sellSidePage = await pagePromise

      await sellSidePage.waitForSelector("text=New RFQ")

      await sellSidePage.getByTestId("price-input").fill("100")

      await sellSidePage.keyboard.press("Enter")

      await expect(rfqsPage.getByTestId("quotes").first()).toContainText("$100", {timeout: 10000})
    })
  })
})