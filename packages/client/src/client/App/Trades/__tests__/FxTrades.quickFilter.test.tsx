import { act, fireEvent, render, screen, within } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import { TestThemeProvider } from "@/client/utils/testUtils"
import * as Trades from "@/services/trades"
import { tradesMock } from "@/services/trades/__mocks__/_trades"

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
vi.mock("../GridRegion/utils")
vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({
    children,
  }: {
    children: React.FunctionComponent<{ height: number; width: number }>
  }) => children({ height: 100, width: 100 }),
}))
vi.stubGlobal("Notification", {
  permission: "granted",
})

const { mockTrades } = Trades.tradesTestData

const renderComponent = async () =>
  await act(async () =>
    render(
      <TestThemeProvider>
        <FxTrades />
      </TestThemeProvider>,
    ),
  )

describe("Trades quick filter", () => {
  beforeEach(() => {
    tradesMock.__resetMocks()
  })

  it("should be empty on load", async () => {
    const tradesSubj = new BehaviorSubject<Trades.Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

    await renderComponent()

    expect(
      within(
        screen.getByRole("search", {
          name: "Search by text across all trade fields",
        }),
      ).queryByRole("textbox")?.textContent,
    ).toBe("")
  })

  it("should filter across columns", async () => {
    const tradesSubj = new BehaviorSubject<Trades.Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

    await renderComponent()

    let rows = await screen.findAllByTestId(/trades-grid-row/)
    expect(rows.length).toBe(3)

    const searchTextBox = within(
      screen.getByRole("search", {
        name: "Search by text across all trade fields",
      }),
    ).queryByRole("textbox") as HTMLInputElement

    act(() => {
      fireEvent.change(searchTextBox, {
        target: { value: "Pend" },
      })
    })

    rows = await screen.findAllByTestId(/trades-grid-row/)
    expect(rows.length).toBe(1)
  })
})
