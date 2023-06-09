import { act, fireEvent, render, screen } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import { ComparatorType } from "@/App/Trades/TradesState"
import { Trade, tradesTestData } from "@/services/trades"
import { tradesMock } from "@/services/trades/__mocks__/_trades"
import { setupMockWindow, TestThemeProvider } from "@/utils/testUtils"

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

const { mockTrades } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <FxTrades />
    </TestThemeProvider>,
  )

describe("for notional column", () => {
  const notionalFilterIcon = '[aria-label="Open Notional field filter pop up"]'
  const notionalFilterMenu =
    '[aria-label="Filter trades by Notional field value"]'
  const notionalFilterMenuInput = '[aria-label="Primary filter value"]'

  setupMockWindow()

  beforeEach(() => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    tradesMock.__setTrades(tradesSubj.asObservable())
  })

  it("no filter icon or menu should be rendered", () => {
    const { container } = renderComponent()
    expect(container.querySelector(notionalFilterIcon)).toBe(null)
    expect(container.querySelector(notionalFilterMenu)).toBe(null)
  })

  it("filter icon and menu should work correct", async () => {
    const { container } = renderComponent()

    act(() => {
      fireEvent.mouseOver(
        screen.getByText("Notional").closest("div") as Element,
      )
    })
    expect(container.querySelector(notionalFilterIcon)).not.toBe(null)

    act(() => {
      fireEvent.click(container.querySelector(notionalFilterIcon) as Element)
    })
    expect(container.querySelector(notionalFilterMenu)).not.toBe(null)

    const input = container.querySelector(
      notionalFilterMenuInput,
    ) as HTMLInputElement
    expect(input.value).toBe("")

    act(() => {
      fireEvent.change(input, { target: { value: "1000000" } })
    })
    expect(input.value).toBe("1000000")

    let rows = await screen.findAllByTestId(/trades-grid-row/)

    expect(rows.length).toBe(2)
    act(() => {
      fireEvent.change(container.querySelector("select") as Element, {
        target: { value: ComparatorType.Greater },
      })
    })

    rows = await screen.findAllByTestId(/trades-grid-row/)
    expect(rows.length).toBe(1)

    act(() => {
      fireEvent.change(container.querySelector("select") as Element, {
        target: { value: ComparatorType.NotEqual },
      })
    })
    rows = await screen.findAllByTestId(/trades-grid-row/)
    expect(rows.length).toBe(1)
  })
})
