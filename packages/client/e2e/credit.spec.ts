import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { ElementTimeout, isOpenFin, TestTimeout } from "./utils"

test.describe("Credit", () => {
  let newRfqPage: Page
  let rfqsPage: Page
  let rfqBlotterPage: Page

  test.beforeAll(async ({ context, creditPagesRec }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      const mainWindow = creditPagesRec["mainWindow"]

      await mainWindow.evaluate(async () => {
        window.fin.Window.getCurrentSync().maximize()
      })

      newRfqPage = creditPagesRec["credit-new-rfq"]
      rfqsPage = creditPagesRec["credit-rfqs"]
      rfqBlotterPage = creditPagesRec["credit-blotter"]

      newRfqPage.setViewportSize({ width: 1280, height: 1024 })
      rfqsPage.setViewportSize({ width: 1280, height: 1024 })
      rfqBlotterPage.setViewportSize({ width: 1280, height: 1024 })
    } else {
      const pages = context.pages()

      newRfqPage = pages.length > 0 ? pages[0] : await context.newPage()

      await newRfqPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)

      rfqsPage = newRfqPage
      rfqBlotterPage = newRfqPage
    }
  })

  test.afterEach(async ({ context }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      const subWindowFrame = context
        .pages()
        .find((page) => page.url().includes("openfin-sub-window-frame"))
      await subWindowFrame?.close()
    } else {
      const sellSidePage = context
        .pages()
        .find((page) => page.url().includes("credit-sellside"))
      await sellSidePage?.close()
    }
  })

  test.describe("New RFQ", () => {
    test.setTimeout(TestTimeout.EXTENDED)

    test("Create RFQ for GOOGL @smoke", async () => {
      const firstQuote = rfqsPage.getByTestId("quotes").locator("div").first()
      const acceptButton = firstQuote.getByText(/Accept/)

      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage
        .getByTestId("search-result-item")
        .getByText("GOOGL")
        .first()
        .click()

      const quantity = newRfqPage.getByLabel("Quantity (000)")
      await quantity.pressSequentially("2")
      await quantity.blur()

      await newRfqPage.getByLabel(/All/).click()

      await newRfqPage.getByLabel(/Adaptive Bank/).click()

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()

      // Navigate to Live
      await rfqsPage.getByText(/Live/).first().click()

      // Wait for first quote response
      await expect(firstQuote).not.toContainText(/Awaiting response/, {
        timeout: ElementTimeout.LONG,
      })

      // retry clicking on accept button until timeout
      const retryTimeout = ElementTimeout.NORMAL

      await expect(async () => {
        await firstQuote.hover()
        await acceptButton.click()
      }, `Click on quote Accept within ${retryTimeout} seconds`).toPass({
        intervals: [250],
        timeout: retryTimeout,
      })

      await rfqsPage.locator("div").getByText(/All/).nth(0).click()
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
      await newRfqPage
        .getByTestId("search-result-item")
        .getByText("GOOGL")
        .first()
        .click()

      const quantity = newRfqPage.getByLabel("Quantity (000)")
      await quantity.pressSequentially("2")

      await newRfqPage.getByLabel(/Adaptive Bank/).click()

      const pagePromise = context.waitForEvent("page", {
        predicate: (page) => page.url().includes("credit-sellside"),
      })

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()

      const sellSidePage = await pagePromise
      await expect(
        sellSidePage.locator("div").getByText("New RFQ").first(),
      ).toBeVisible({ timeout: ElementTimeout.NORMAL })

      await sellSidePage.getByTestId("price-input").pressSequentially("100")

      await sellSidePage.keyboard.press("Enter")

      await expect(rfqsPage.getByTestId("quotes").first()).toContainText("$100")
    })
  })

  test.describe("Respond to RFQ with Pass", () => {
    test("Passing a newly created RFQ", async ({ context }) => {
      await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
      await newRfqPage.getByTestId("search-result-item").nth(5).click()

      const quantity = newRfqPage.getByLabel("Quantity (000)")
      await quantity.pressSequentially("2")

      await newRfqPage.getByLabel(/Adaptive Bank/).click()

      const pagePromise = context.waitForEvent("page", {
        predicate: (page) => page.url().includes("credit-sellside"),
      })

      await newRfqPage
        .locator("button")
        .getByText(/Send RFQ/)
        .click()

      const sellSidePage = await pagePromise
      await expect(
        sellSidePage.locator("div").getByText("New RFQ"),
      ).toBeVisible({ timeout: ElementTimeout.NORMAL })

      await sellSidePage.getByRole("button", { name: "Pass" }).click()

      await expect(rfqsPage.getByTestId("quotes").first()).toContainText(
        "Passed",
        { timeout: ElementTimeout.NORMAL },
      )
    })
  })
})
