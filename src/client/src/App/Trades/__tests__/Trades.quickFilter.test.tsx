import { render, screen, within } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { Trade, tradesTestData } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import Trades from "../TradesCore"

jest.mock("@/services/trades/trades")

const { mockTrades } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Trades />
    </TestThemeProvider>,
  )

const _trades = require("@/services/trades/trades")

describe("Trades quick filter", () => {
  beforeEach(() => {
    _trades.__resetMocks()
  })

  it("should be empty on load", () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    _trades.__setTrades(tradesSubj)

    renderComponent()

    expect(
      within(
        screen.getByRole("search", {
          name: "Search by text across all trade fields",
        }),
      ).queryByRole("textbox")?.textContent,
    ).toBe("")
  })
})
