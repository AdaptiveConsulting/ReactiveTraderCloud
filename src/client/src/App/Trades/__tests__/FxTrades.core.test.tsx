import {
  act,
  queryByText,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { BehaviorSubject, Subject } from "rxjs"

import { Trade, tradesTestData } from "@/services/trades"
import { tradesMock } from "@/services/trades/__mocks__/_trades"
import { TestThemeProvider } from "@/utils/testUtils"

import FxTrades from "../CoreFxTrades"
import * as TableTrades from "../TradesState/tableTrades"

vi.mock("../TradesGrid/utils")
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
vi.mock("../TradesGrid/utils")
vi.mock("react-virtualized-auto-sizer", () => ({
  default: ({
    children,
  }: {
    children: React.FunctionComponent<{ height: number; width: number }>
  }) => children({ height: 100, width: 100 }),
}))

const { mockTrades, nextTrade } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <FxTrades />
    </TestThemeProvider>,
  )

describe("Trades", () => {
  beforeEach(() => {
    tradesMock.__resetMocks()
  })

  it("should display 'no trades' message before trades are received", async () => {
    const tradesSubj = new Subject<Trade[]>()
    tradesMock.__setTrades(tradesSubj)

    renderComponent()

    expect(screen.queryByText("No trades to show")).not.toBeNull()

    act(() => tradesSubj.next(mockTrades))

    await waitFor(() =>
      expect(screen.queryByText("No trades to show")).toBeNull(),
    )
  })

  it("should display 'No trades' when there are no trades", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>([])
    tradesMock.__setTrades(tradesSubj)

    renderComponent()

    expect(
      within(screen.getByRole("grid")).queryByText("No trades to show"),
    ).not.toBeNull()

    act(() => tradesSubj.next(mockTrades))

    await waitFor(() =>
      expect(
        within(screen.getByRole("grid")).queryByText("No trades to show"),
      ).toBeNull(),
    )
  })

  it("should apply no sort by default", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

    const { container } = renderComponent()
    const grid = container.querySelector('[role="grid"]')

    if (!grid) {
      throw new Error(`Expected grid not rendered`)
    }

    const firstRow = grid.children[1]
    const lastRow = grid.lastElementChild

    if (!firstRow || !lastRow) {
      throw new Error("Expected rows not rendered")
    }

    expect(queryByText(firstRow as HTMLElement, "1111111111")).not.toBeNull()
    expect(queryByText(lastRow as HTMLElement, "3333333333")).not.toBeNull()
  })

  it("should apply no filter by default", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

    renderComponent()

    expect(screen.queryByText("Displaying rows 3 of 3")).not.toBeNull()
  })

  it("should update when new trades are received", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj)

    renderComponent()

    expect(screen.queryByText("Displaying rows 3 of 3")).not.toBeNull()

    act(() => tradesSubj.next([nextTrade, ...mockTrades]))

    await waitFor(() =>
      expect(screen.queryByText("Displaying rows 4 of 4")).not.toBeNull(),
    )
  })
})
