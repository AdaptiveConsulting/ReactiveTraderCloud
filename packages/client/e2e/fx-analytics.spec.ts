import { expect, Page } from "@playwright/test"

import { test } from "./fixtures"
import { ElementTimeout, isOpenFin } from "./utils"

const currencyPairs = [
  "EURUSD",
  "USDJPY",
  "GBPUSD",
  "GBPJPY",
  "EURJPY",
  "AUDUSD",
  "NZDUSD",
  "EURCAD",
]

const currencies = ["NZD", "USD", "JPY", "GBP", "EUR", "CAD", "AUD"]

test.describe("Analytics panel", () => {
  let analyticsPage: Page

  test.beforeAll(async ({ context, fxPagesRec }, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      analyticsPage = fxPagesRec["fx-analytics"]
    } else {
      const pages = context.pages()
      const mainWindow = pages.length > 0 ? pages[0] : await context.newPage()

      await mainWindow.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)

      analyticsPage = mainWindow
    }
  })

  test.describe("Profit & Loss section", () => {
    test("Last Profit & Loss amount is displayed in numerical format @smoke", async () => {
      const lastPnlAmount = await analyticsPage
        .locator("[data-testid='lastPosition']")
        .textContent()

      const regexp = RegExp(`[-+,.0-9]`, "g")
      expect(lastPnlAmount).toMatch(regexp)
    })

    test("Profit & Loss amount is updated periodically", async () => {
      const pnlLocator = analyticsPage.locator("[data-testid='lastPosition']")
      const initialPnlAmount = await pnlLocator.textContent()

      if (initialPnlAmount)
        await expect(pnlLocator).not.toContainText(initialPnlAmount, {
          timeout: ElementTimeout.NORMAL,
        })
    })

    test("Correct text color is displayed based on Profit & Loss amount", async () => {
      const pnlLocator = analyticsPage.locator("[data-testid='lastPosition']")

      const pnlText = await pnlLocator.textContent()

      test.fail(!pnlText, "Profit & Loss value should not be empty")

      const pnlValue = Number.parseFloat(pnlText as string)

      expect(pnlValue, "Profit & Loss value is not a number").not.toBeNaN()

      if (pnlValue < 0) {
        expect(await pnlLocator.getAttribute("color")).toEqual("negative")
      } else expect(await pnlLocator.getAttribute("color")).toEqual("positive")
    })
  })
  test.describe("Positions section", () => {
    test("Position nodes are showing tooltip information for each currencies", async () => {
      for (const currency of currencies) {
        const currencyCircle = analyticsPage
          .locator("g.node")
          .filter({ hasText: currency })
          .first()
        const currencyTooltip = analyticsPage
          .locator("[data-testid='tooltip']", { hasText: currency })
          .first()

        await currencyCircle.hover()
        await expect(currencyTooltip).toBeVisible({
          timeout: ElementTimeout.AGGRESSIVE,
        })
        const regexp = RegExp(`${currency} [-+,.0-9]`, "g")
        expect(
          await currencyTooltip.textContent(),
          `tooltip for ${currency} doesn't match expected pattern`,
        ).toMatch(regexp)
      }
    })

    test("Position nodes can be moved", async () => {
      const nzdNode = analyticsPage
        .locator("g.node")
        .filter({ hasText: "NZD" })
        .first()

      const jpyNode = analyticsPage
        .locator("g.node")
        .filter({ hasText: "JPY" })
        .first()

      const nzdInitialPosition = await nzdNode.boundingBox()
      await nzdNode.dragTo(jpyNode)
      expect(nzdInitialPosition).not.toEqual(await nzdNode.boundingBox())
    })
  })

  test.describe("PnL section", () => {
    test("PnL value is displayed for each currencies", async () => {
      const pnlSection = analyticsPage
        .locator("div")
        .filter({ has: analyticsPage.locator("div", { hasText: "PnL" }) })
        .last()

      for (const currencypair of currencyPairs) {
        const amountString = await pnlSection
          .locator("div", {
            hasText: currencypair,
          })
          .first()
          .getByTestId("priceLabel")
          .textContent()
        const regexp = RegExp(`[-,.0-9km]`, "g")
        expect(
          amountString,
          `amount for ${currencypair} doesn't match abbreviated numerical pattern`,
        ).toMatch(regexp)
      }
    })
  })
})
