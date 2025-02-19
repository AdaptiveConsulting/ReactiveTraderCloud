import { BrowserContext, expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { ExpectTimeout, isOpenFin } from "./utils"

test.describe("Credit", () => {
  let browserContext: BrowserContext
  let newRfqPage: Page
  let rfqsPage: Page
  let rfqBlotterPage: Page

  test.beforeAll(async ({ creditPagesRec }, workerInfo) => {
    newRfqPage = creditPagesRec["credit-new-rfq"]
    rfqsPage = creditPagesRec["credit-rfqs"]
    rfqBlotterPage = creditPagesRec["credit-blotter"]

    if (isOpenFin(workerInfo)) {
      const mainWindow = creditPagesRec["mainWindow"]

      await mainWindow.evaluate(async () => {
        window.fin.Window.getCurrentSync().maximize()
      })

      newRfqPage.setViewportSize({ width: 1280, height: 1024 })
      rfqsPage.setViewportSize({ width: 1280, height: 1024 })
      rfqBlotterPage.setViewportSize({ width: 1280, height: 1024 })
    } else {
      await newRfqPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)
    }
  })

  test.beforeEach(async ({ context }) => {
    browserContext = context
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

  const createRFQStep = async (
    symbol: string,
    quantity: string,
    triggerSellSide: boolean = true,
  ) => {
    await newRfqPage.getByPlaceholder(/Enter a CUSIP/).click()
    await newRfqPage
      .getByTestId("search-result-item")
      .getByText(symbol)
      .first()
      .click()
    await newRfqPage.getByLabel("Quantity (000)").pressSequentially(quantity)

    if (!triggerSellSide) {
      // if we want to avoid popping up the sell side window (should be minority of tests)
      // select all, then the click on Adaptive Bank below will switch off the sell side for that test
      await newRfqPage.getByLabel(/All/).click()
    }
    await newRfqPage.getByLabel(/Adaptive Bank/).click()

    const pagePromise = triggerSellSide
      ? browserContext.waitForEvent("page", {
          predicate: (page) => page.url().includes("credit-sellside"),
        })
      : Promise.resolve()

    await newRfqPage
      .locator("button")
      .getByText(/Send RFQ/)
      .click()

    return pagePromise
  }

  test("Create RFQ for GOOGL @smoke", async () => {
    await test.step("Create RFQ for 1000 GOOGL", () =>
      createRFQStep("GOOGL", "1", false))

    // Navigate to Live
    await rfqsPage.getByText(/Live/).first().click()

    const firstQuote = rfqsPage
      .getByTestId(/^rfq-/)
      .first()
      .getByTestId("quotes")
      .locator("div")
      .first()

    // Wait for first quote response
    await expect(firstQuote).not.toContainText(/Awaiting response/, {
      timeout: ExpectTimeout.LONG,
    })

    const acceptButton = firstQuote.getByText(/Accept/)

    await expect(async () => {
      await firstQuote.hover()
      await acceptButton.click()
    }, `Click on quote Accept within ${ExpectTimeout.MEDIUM} seconds`).toPass({
      intervals: [250],
      timeout: ExpectTimeout.MEDIUM,
    })

    // Navigate back to All RFQs
    await rfqsPage.getByText(/All/).nth(0).click()

    const btnTxt = await rfqsPage.getByTestId("view-trade").first().innerText()

    await rfqsPage.getByTestId("view-trade").first().click()

    const tradeId = btnTxt.split(" ")[2]
    const blotterId = await rfqBlotterPage
      .locator("div")
      .getByText(tradeId, { exact: true })
      .first()
      .innerText()

    expect(tradeId).toEqual(blotterId)
  })

  test("Create RFQ with Sell side", async () => {
    const pagePromise = test.step("Create RFQ for 2000 AMZN", () =>
      createRFQStep("AMZN", "2"))
    const sellSidePage = await (pagePromise as Promise<Page>)

    const rfqTestId = await rfqsPage
      .getByTestId(/^rfq-/)
      .first()
      .getAttribute("data-testid")

    expect(rfqTestId, "Find the right RFQ Tile").not.toBeNull()

    await expect(
      sellSidePage.locator("div").getByText("New RFQ").first(),
    ).toBeVisible()

    await sellSidePage.getByTestId("price-input").pressSequentially("100")

    await sellSidePage.keyboard.press("Enter")

    const firstQuote = rfqsPage
      .getByTestId(rfqTestId!)
      .getByTestId("quotes")
      .locator("div")
      .first()

    await expect(firstQuote).toContainText("$100")
  })

  test("Respond to quote with Pass in Sell Side", async () => {
    const pagePromise = test.step("Create RFQ for 3000 BAC", () =>
      createRFQStep("BAC", "3"))
    const sellSidePage = await (pagePromise as Promise<Page>)

    const rfqTestId = await rfqsPage
      .getByTestId(/^rfq-/)
      .first()
      .getAttribute("data-testid")

    expect(rfqTestId, "Find the right RFQ Tile").not.toBeNull()

    await expect(
      sellSidePage.locator("div").getByText("New RFQ").first(),
    ).toBeVisible()

    await sellSidePage.getByRole("button", { name: "Pass" }).click()

    const firstQuote = rfqsPage
      .getByTestId(rfqTestId!)
      .getByTestId("quotes")
      .locator("div")
      .first()

    await expect(firstQuote).toContainText("Passed")
  })
})
