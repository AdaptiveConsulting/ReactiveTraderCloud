import { render, screen, within } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { Trade, tradesTestData } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import FxTrades from "../CoreFxTrades"

jest.mock("@/services/trades/trades")
jest.mock("../TradesState/tableTrades", () => ({
  ...jest.requireActual("../TradesState/tableTrades"),
  useFilterFields: jest.fn().mockReturnValue([]),
  useFxTradeRowHighlight: jest.fn().mockReturnValue(undefined),
}))
const { mockTrades } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <FxTrades />
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
