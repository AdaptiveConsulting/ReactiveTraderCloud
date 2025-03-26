import { expect } from "@playwright/test"

import { test } from "./fixtures"
import { ExpectTimeout } from "./utils"

test.describe("FX Analytics", () => {
  test.describe("Profit & Loss section", () => {
    test("Last Profit & Loss amount is displayed in numerical format @smoke", async ({
      fxPages: { analyticsPO },
    }) => {
      const lastPnlAmount = await analyticsPO.lastPnLPosition.textContent()
      expect(lastPnlAmount).toMatch(/[-+,.0-9]/)
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
    const currencies = ["NZD", "USD", "JPY", "GBP", "EUR", "CAD", "AUD"]

    currencies.forEach((currency) => {
      test(`Position nodes are showing tooltip information for ${currency}`, async ({
        fxPages: { analyticsPO },
      }) => {
        await analyticsPO.bubble(currency).hover()

        const currencyTooltip = analyticsPO.bubbleTooltip(currency)
        await expect(currencyTooltip).toBeVisible()

        expect(
          await currencyTooltip.textContent(),
          `tooltip for ${currency} doesn't match expected pattern`,
        ).toMatch(RegExp(`${currency} [-+,.0-9]`))
      })
    })

    test("Position nodes can be moved", async ({
      fxPages: { analyticsPO },
    }) => {
      const nzdNode = analyticsPO.bubble("NZD")
      const jpyNode = analyticsPO.bubble("JPY")

      const nzdInitialPosition = await nzdNode.boundingBox()
      await nzdNode.dragTo(jpyNode)
      expect(nzdInitialPosition).not.toEqual(await nzdNode.boundingBox())
    })
  })

  test.describe("PnL section", () => {
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

    currencyPairs.forEach((currencyPair) => {
      test(`PnL value is displayed for ${currencyPair}`, async ({
        fxPages: { analyticsPO },
      }) => {
        const amountString = await analyticsPO
          .pnlAmount(currencyPair)
          .textContent()

        const regexp = RegExp(`[-,.0-9km]`, "g")

        expect(
          amountString,
          `amount for ${currencyPair} doesn't match abbreviated numerical pattern`,
        ).toMatch(regexp)
      })
    })
  })
})
