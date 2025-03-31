import { BrowserContext, expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { CreditNewRfqPageObject, CreditSellSidePageObject } from "./pages"
import { ExpectTimeout, isOpenFin } from "./utils"

test.describe("Credit", () => {
  test.beforeAll(async ({ creditPages: { mainPage } }, workerInfo) => {
    if (!isOpenFin(workerInfo)) {
      await mainPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)
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

  const createRFQStep = async (
    browserContext: BrowserContext,
    newRfqPO: CreditNewRfqPageObject,
    symbol: string,
    quantity: string,
    triggerSellSide: boolean = true,
  ) => {
    await newRfqPO.cusipInput.click()
    await newRfqPO.firstCusipEntryForSymbol(symbol).click()

    await newRfqPO.quantityField.pressSequentially(quantity)

    if (!triggerSellSide) {
      // if we want to avoid popping up the sell side window (should be minority of tests)
      // select all, then the click on Adaptive Bank below will switch off the sell side for that test
      await newRfqPO.selectAllCounterparties()
    }
    await newRfqPO.selectAdaptiveBankCounterparty()

    const pagePromise = triggerSellSide
      ? browserContext.waitForEvent("page", {
          predicate: (page) => page.url().includes("credit-sellside"),
        })
      : Promise.resolve()

    await newRfqPO.sendRFQButton.click()

    return pagePromise
  }

  test("Create RFQ for GOOGL @smoke", async ({
    creditPages: { newRfqPO, rfqsPO, blotterPO },
    context,
  }) => {
    await test.step("Create RFQ for 1000 GOOGL", () =>
      createRFQStep(context, newRfqPO, "GOOGL", "1", false))

    await rfqsPO.selectFilter("Live")

    await expect(rfqsPO.firstQuote).not.toContainText(/Awaiting response/, {
      timeout: ExpectTimeout.LONG,
    })

    await expect(async () => {
      await rfqsPO.firstQuote.hover()
      await rfqsPO.firstAcceptButton.click()
    }, `Click on quote Accept within ${ExpectTimeout.MEDIUM} seconds`).toPass({
      intervals: [250],
      timeout: ExpectTimeout.MEDIUM,
    })

    await rfqsPO.selectFilter("All")

    const viewTradeButtonLabel = await rfqsPO.firstViewTradeButton.innerText()
    const tradeIdFromTile = viewTradeButtonLabel.split(" ")[2]

    await rfqsPO.firstViewTradeButton.click()

    const tradeIdInBlotter = await blotterPO
      .blotterCellForTradeId(tradeIdFromTile)
      .innerText()

    expect(tradeIdFromTile).toEqual(tradeIdInBlotter)
  })

  test("Sell side ticket", async ({
    creditPages: { newRfqPO, rfqsPO },
    context,
  }, workerInfo) => {
    const sellSidePage = (await test.step("Create RFQ for 2000 AMZN", () =>
      createRFQStep(context, newRfqPO, "AMZN", "2"))) as Page
    const sellSidePO = new CreditSellSidePageObject(sellSidePage, workerInfo)

    const rfqTestId = await rfqsPO.firstRfqTile.getAttribute("data-testid")

    await expect(sellSidePO.firstNewRfqInGrid).toBeVisible()

    await sellSidePO.priceField.pressSequentially("100")

    await sellSidePO.submitQuote()

    await expect(rfqsPO.firstQuoteForRfqId(rfqTestId!)).toContainText("$100")
  })

  test("Respond to quote with Pass in Sell Side", async ({
    creditPages: { newRfqPO, rfqsPO },
    context,
  }, workerInfo) => {
    const sellSidePage = (await test.step("Create RFQ for 2000 AMZN", () =>
      createRFQStep(context, newRfqPO, "AMZN", "2"))) as Page
    const sellSidePO = new CreditSellSidePageObject(sellSidePage, workerInfo)

    const rfqTestId = await rfqsPO.firstRfqTile.getAttribute("data-testid")

    await expect(sellSidePO.firstNewRfqInGrid).toBeVisible()

    await sellSidePO.passButton.click()

    await expect(rfqsPO.firstQuoteForRfqId(rfqTestId!)).toContainText("Passed")
  })
})
