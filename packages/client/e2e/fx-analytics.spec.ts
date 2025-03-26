import { expect } from "@playwright/test"

import { test } from "./fixtures"
import { ExpectTimeout } from "./utils"

const currencyPairs = [
  "EUR/USD",
  "USD/JPY",
  "GBP/USD",
  "GBP/JPY",
  "EUR/JPY",
  "AUD/USD",
  "NZD/USD",
  "EUR/CAD",
]

const currencies = ["NZD", "USD", "JPY", "GBP", "EUR", "CAD", "AUD"]

test.describe("Analytics panel", () => {
  test.describe("Profit & Loss section", () => {
    test("Last Profit & Loss amount is displayed in numerical format @smoke", async ({
      fxPages: { analyticsPO },
    }) => {
      const lastPnlAmount = await analyticsPO.lastPnLPosition.textContent()

      const regexp = RegExp(`[-+,.0-9]`, "g")
      expect(lastPnlAmount).toMatch(regexp)
    })

    test("Profit & Loss amount is updated periodically", async ({
      fxPages: { analyticsPO },
    }) => {
      const pnlLocator = analyticsPO.lastPnLPosition
      const initialPnlAmount = await pnlLocator.textContent()

      await expect(pnlLocator).not.toContainText(initialPnlAmount ?? "", {
        timeout: ExpectTimeout.MEDIUM,
      })
    })

    test("Correct text color is displayed based on Profit & Loss amount", async ({
      fxPages: { analyticsPO },
    }) => {
      const pnlLocator = analyticsPO.lastPnLPosition

      const pnlText = await pnlLocator.textContent()

      test.fail(!pnlText, "Profit & Loss value should not be empty")

      const pnlValue = Number.parseFloat(pnlText as string)

      expect(pnlValue, "Profit & Loss value is not a number").not.toBeNaN()

      await expect(pnlLocator).toHaveAttribute(
        "color",
        pnlValue < 0 ? "Colors/Border/border-sell" : "Colors/Border/border-buy",
      )
    })
  })
  test.describe("Positions section", () => {
    test("Position nodes are showing tooltip information for each currencies", async ({
      fxPages: { analyticsPO },
    }) => {
      for (const currency of currencies) {
        const currencyCircle = analyticsPO.currencyCircle(currency).first()
        const currencyTooltip = analyticsPO.page
          .locator("[data-testid='tooltip']", { hasText: currency })
          .first()

        await currencyCircle.hover()
        await expect(currencyTooltip).toBeVisible()
        const regexp = RegExp(`${currency} [-+,.0-9]`, "g")
        expect(
          await currencyTooltip.textContent(),
          `tooltip for ${currency} doesn't match expected pattern`,
        ).toMatch(regexp)
      }
    })

    test("Position nodes can be moved", async ({
      fxPages: { analyticsPO },
    }) => {
      const nzdNode = analyticsPO.currencyCircle("NZD").first()

      const jpyNode = analyticsPO.currencyCircle("JPY").first()

      const nzdInitialPosition = await nzdNode.boundingBox()
      await nzdNode.dragTo(jpyNode)
      expect(nzdInitialPosition).not.toEqual(await nzdNode.boundingBox())
    })
  })

  test.describe("PnL section", () => {
    test("PnL value is displayed for each currencies", async ({
      fxPages: { analyticsPO },
    }) => {
      for (const currencypair of currencyPairs) {
        const amountString = await analyticsPO
          .PnLAmount(currencypair)
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
