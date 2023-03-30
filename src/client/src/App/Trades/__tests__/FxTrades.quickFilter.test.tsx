import { render, screen, within } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import * as Trades from "@/services/trades"
import { tradesMock } from "@/services/trades/__mocks__/_trades"
import { TestThemeProvider } from "@/utils/testUtils"

import FxTrades from "../CoreFxTrades"
import * as TableTrades from "../TradesState/tableTrades"

vi.mock("@openfin/core", () => ({
  fin: undefined,
}))
vi.mock("@/services/trades/trades")
vi.mock("../TradesState/tableTrades", async () => {
  const tableTrades: typeof TableTrades = await vi.importActual(
    "../TradesState/tableTrades",
  )
  return {
    ...tableTrades,
    useFilterFields: vi.fn().mockReturnValue([]),
    useFxTradeRowHighlight: vi.fn().mockReturnValue(undefined),
  }
})
const { mockTrades } = Trades.tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <FxTrades />
    </TestThemeProvider>,
  )

describe("Trades quick filter", () => {
  beforeEach(() => {
    tradesMock.__resetMocks()
  })

  it("should be empty on load", () => {
    const tradesSubj = new BehaviorSubject<Trades.Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

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
