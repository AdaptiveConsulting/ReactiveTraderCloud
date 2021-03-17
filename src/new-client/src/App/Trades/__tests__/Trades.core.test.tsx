import {
  render,
  screen,
  waitFor,
  act,
  within,
  queryByText,
} from "@testing-library/react"
import { BehaviorSubject, Subject } from "rxjs"
import { Trade, tradesTestData } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import Trades from "../TradesCore"

jest.mock("@/services/trades/trades")

const { mockTrades, nextTrade } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Trades />
    </TestThemeProvider>,
  )

const _trades = require("@/services/trades/trades")

describe("Trades", () => {
  beforeEach(() => {
    _trades.__resetMocks()
  })

  it("should display loading bar before trades are received", async () => {
    const tradesSubj = new Subject<Trade[]>()
    _trades.__setTrades(tradesSubj)

    renderComponent()

    expect(
      screen.queryByRole("progressbar", { name: "Loading trades blotter" }),
    ).not.toBeNull()

    act(() => tradesSubj.next(mockTrades))

    await waitFor(() =>
      expect(
        screen.queryByRole("progressbar", { name: "Loading trades blotter" }),
      ).toBeNull(),
    )
  })

  it("should display 'No trades' when there are no trades", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>([])
    _trades.__setTrades(tradesSubj)

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
    _trades.__setTrades(tradesSubj)

    const { container } = renderComponent()
    const grid = container.querySelector('[role="grid"]')

    if (!grid) {
      throw new Error(`Expected grid not rendered`)
    }

    const firstRow = grid.firstElementChild
    const lastRow = grid.lastElementChild

    if (!firstRow || !lastRow) {
      throw new Error("Expected rows not rendered")
    }

    expect(queryByText(firstRow as HTMLElement, "1111111111")).not.toBeNull()
    expect(queryByText(lastRow as HTMLElement, "3333333333")).not.toBeNull()
  })

  it("should apply no filter by default", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    _trades.__setTrades(tradesSubj)

    renderComponent()

    expect(screen.queryByText("Displaying rows 3 of 3")).not.toBeNull()
  })

  it("should update when new trades are received", async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    _trades.__setTrades(tradesSubj)

    renderComponent()

    expect(screen.queryByText("Displaying rows 3 of 3")).not.toBeNull()

    act(() => tradesSubj.next([nextTrade, ...mockTrades]))

    await waitFor(() =>
      expect(screen.queryByText("Displaying rows 4 of 4")).not.toBeNull(),
    )
  })
})
