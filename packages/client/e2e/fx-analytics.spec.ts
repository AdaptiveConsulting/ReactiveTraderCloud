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
    test("Last position amount is displayed in numerical format @smoke", async () => {
      const lastPositionAmount = await analyticsPage
        .locator("[data-testid='lastPosition']")
        .textContent()

      const regexp = RegExp(`[-+,.0-9]`, "g")
      expect(lastPositionAmount).toMatch(regexp)
    })

    test("Last position amount is updated periodically", async () => {
      const lastpositionLocator = analyticsPage.locator(
        "[data-testid='lastPosition']",
      )
      const initiallastPositionAmount = await lastpositionLocator.textContent()

      if (initiallastPositionAmount)
        await expect(lastpositionLocator).not.toContainText(
          initiallastPositionAmount,
          { timeout: ElementTimeout.NORMAL },
        )
    })

    test("Correct text color is displayed based on position value", async () => {
      const initialpositionLocator = analyticsPage.locator(
        "[data-testid='lastPosition']",
      )
      const amount = Number(
        (await initialpositionLocator.textContent())?.replace(/[.,]/g, ""),
      )
      
      expect(amount).toBeTruthy()

      if (amount < 0) {
        expect(await initialpositionLocator.getAttribute("color")).toEqual(
          "negative",
        )
      } else
        expect(await initialpositionLocator.getAttribute("color")).toEqual(
          "positive",
        )
    })

    test.skip("Graph display coherent values", async () => {
      // TODO
      // more complex. may requires datatest-id to reliably assert graph content
      // to be completed under https://adaptive.kanbanize.com/ctrl_board/18/cards/5634/details/
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
        .filter( {has: analyticsPage.locator("div", {hasText: "PnL"})})
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
