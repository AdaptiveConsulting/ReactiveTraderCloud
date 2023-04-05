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

      await newRfqPage.goto(`${process.env.URL_PATH}/credit`)

      rfqsPage = newRfqPage
      rfqBlotterPage = newRfqPage
    }
  })

  test.describe("New RFQ", () => {
    test("When I select Googl instrument and click Send RFQ button then I should see a GOOGL RFQ created on the RFQ sections and I can accept any value @smoke", async () => {
      test.setTimeout(120000)

      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage
        .locator("[data-testid='search-result-item']")
        .nth(5)
        .click()

      const quantity = newRfqPage.locator("[data-testid='quantity']")
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
      await rfqsPage.waitForTimeout(15000)

      await rfqsPage
        .locator("[data-testid='quotes']")
        .locator("div")
        .first()
        .hover()

      await rfqsPage
        .getByTestId("quotes")
        .getByText(/Accept/)
        .first()
        .click()

      await rfqsPage.locator("li").getByText(/All/).nth(0).click()
      const btnTxt = await rfqsPage
        .locator("[data-testid='view-trade']")
        .first()
        .innerText()

      await rfqsPage.locator("[data-testid='view-trade']").first().click()

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
    test.only("Sell side ticket", async ({ context }) => {
      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage
        .locator("[data-testid='search-result-item']")
        .nth(5)
        .click()

      const quantity = newRfqPage.locator("[data-testid='quantity']")
      await quantity.type("2")
      await quantity.blur()

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

      await sellSidePage
        .getByText(/New RFQ/)
        .first()
        .click()

      await sellSidePage.getByTestId("price-input").fill("100")

      await sellSidePage.keyboard.press("Tab")
      await sellSidePage.keyboard.press("Enter")

      await expect(rfqsPage.getByTestId("quotes").first()).toContainText("$100")
    })
  })
})
