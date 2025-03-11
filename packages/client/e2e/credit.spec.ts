import { BrowserContext, expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import {
  CreditBlotterPageObject,
  CreditNewRfqPageObject,
  CreditRfqTilesPageObject,
  CreditSellSidePageObject,
} from "./pages"
import { ExpectTimeout, isOpenFin, isResponsive } from "./utils"

let browserContext: BrowserContext
let mainPage: Page
let newRfqPage: CreditNewRfqPageObject
let rfqsPage: CreditRfqTilesPageObject
let rfqBlotterPage: CreditBlotterPageObject

test.describe("Credit", () => {
  test.beforeAll(async ({ creditPagesRec }, workerInfo) => {
    mainPage = creditPagesRec.mainPage
    newRfqPage = creditPagesRec.newRfqPO
    rfqsPage = creditPagesRec.rfqsPO
    rfqBlotterPage = creditPagesRec.blotterPO

    if (isOpenFin(workerInfo)) {
      await mainPage.evaluate(async () => {
        // eslint-disable-next-line
        // @ts-ignore
        window.fin.Window.getCurrentSync().maximize()
      })
      rfqsPage.page.setViewportSize({ width: 1280, height: 1024 })
    } else {
      await mainPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)
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
    await newRfqPage.cusipInput.click()
    await newRfqPage.firstCusipEntryForSymbol(symbol).click()

    await newRfqPage.quantityField.pressSequentially(quantity)

    if (!triggerSellSide) {
      // if we want to avoid popping up the sell side window (should be minority of tests)
      // select all, then the click on Adaptive Bank below will switch off the sell side for that test
      await newRfqPage.page.getByLabel(/All/).click()
    }
    await newRfqPage.adaptiveBankToggle.click()

    const pagePromise = triggerSellSide
      ? browserContext.waitForEvent("page", {
          predicate: (page) => page.url().includes("credit-sellside"),
        })
      : Promise.resolve()

    await newRfqPage.sendRFQButton.click()

    return pagePromise
  }

  test("Create RFQ for GOOGL @smoke", async ({}, workerInfo) => {
    await test.step("Create RFQ for 1000 GOOGL", () =>
      createRFQStep("GOOGL", "1", false))

    if(isResponsive(workerInfo)) {
      await rfqsPage.selectFilterResponsiveNav("Live")
    } else {
      await rfqsPage.selectFilter("Live")
    }

    await expect(rfqsPage.firstQuote).not.toContainText(/Awaiting response/, {
      timeout: ExpectTimeout.LONG,
    })

    await expect(async () => {
      await rfqsPage.firstQuote.hover()
      await rfqsPage.firstAcceptButton.click()
    }, `Click on quote Accept within ${ExpectTimeout.MEDIUM} seconds`).toPass({
      intervals: [250],
      timeout: ExpectTimeout.MEDIUM,
    })

    if(isResponsive(workerInfo)) {
      await rfqsPage.selectFilterResponsiveNav("All")
    } else {
      await rfqsPage.selectFilter("All")
    }

    const viewTradeButtonLabel = await rfqsPage.firstViewTradeButton.innerText()
    const tradeIdFromTile = viewTradeButtonLabel.split(" ")[2]

    await rfqsPage.firstViewTradeButton.click()

    const tradeIdInBlotter = await rfqBlotterPage
      .blotterCellForTradeId(tradeIdFromTile)
      .innerText()

    expect(tradeIdFromTile).toEqual(tradeIdInBlotter)
  })

  test("Sell side ticket", async () => {
    const sellSidePage = (await test.step("Create RFQ for 2000 AMZN", () =>
      createRFQStep("AMZN", "2"))) as Page
    const sellSidePO = new CreditSellSidePageObject(sellSidePage)

    const rfqTestId = await rfqsPage.firstRfqTile.getAttribute("data-testid")

    await expect(sellSidePO.firstNewRfqInGrid).toBeVisible()

    await sellSidePO.priceField.pressSequentially("100")

    await sellSidePO.submitQuote()

    await expect(rfqsPage.firstQuoteForRfqId(rfqTestId!)).toContainText("$100")
  })

  test("Respond to quote with Pass in Sell Side", async () => {
    const sellSidePage = (await test.step("Create RFQ for 2000 AMZN", () =>
      createRFQStep("AMZN", "2"))) as Page
    const sellSidePO = new CreditSellSidePageObject(sellSidePage)

    const rfqTestId = await rfqsPage.firstRfqTile.getAttribute("data-testid")

    await expect(sellSidePO.firstNewRfqInGrid).toBeVisible()

    await sellSidePO.passButton.click()

    await expect(rfqsPage.firstQuoteForRfqId(rfqTestId!)).toContainText(
      "Passed",
    )
  })
})
