import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BehaviorSubject } from "rxjs"

import { ComparatorType } from "@/App/Trades/TradesState"
import { Trade, TradeStatus, tradesTestData } from "@/services/trades"
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

// Applies to all column with set filter
describe("Set filter", () => {
  setupMockWindow()

  describe("For Status column", () => {
    const statusFilterIcon = '[aria-label="Open Status field filter pop up"]'
    const statusFilterMenu =
      '[aria-label="Filter trades by status field value"]'

    beforeEach(() => {
      const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
      tradesMock.__setTrades(tradesSubj.asObservable())
    })

    it("no filter icon or menu should be rendered", () => {
      const { container } = renderComponent()
      expect(container.querySelector(statusFilterIcon)).toBe(null)
      expect(container.querySelector(statusFilterMenu)).toBe(null)
    })

    it("filter icon and menu should work correct", async () => {
      const { container } = renderComponent()

      act(() => {
        fireEvent.mouseOver(
          screen.getByText("Status").closest("div") as Element,
        )
      })

      expect(container.querySelector(statusFilterIcon)).not.toBe(null)

      act(() => {
        fireEvent.click(container.querySelector(statusFilterIcon) as Element)
      })

      expect(container.querySelector(statusFilterMenu)).not.toBe(null)

      let rows = await screen.findAllByTestId(/trades-grid-row/)

      expect(rows.length).toBe(3)

      const selectDoneOption = await screen.findByTestId(
        `select-option-${TradeStatus.Done}`,
      )
      act(() => {
        fireEvent.click(selectDoneOption)
      })

      rows = await screen.findAllByTestId(/trades-grid-row/)
      expect(rows.length).toBe(1)

      // Unselect Done option
      act(() => {
        fireEvent.click(selectDoneOption)
      })

      rows = await screen.findAllByTestId(/trades-grid-row/)
      expect(rows.length).toBe(3)
    })
  })
})

// Applies to all columns with Date Filter
describe("Date Filter", () => {
  setupMockWindow()

  describe("For Trade Date column", () => {
    const tradeDateFilterIcon =
      '[aria-label="Open Trade Date field filter pop up"]'
    const tradeDateFilterMenu =
      '[aria-label="Filter trades by tradeDate field value"]'

    beforeEach(() => {
      const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
      tradesMock.__setTrades(tradesSubj.asObservable())
    })

    it("no filter icon or menu should be rendered", () => {
      const { container } = renderComponent()
      expect(container.querySelector(tradeDateFilterIcon)).toBe(null)
      expect(container.querySelector(tradeDateFilterMenu)).toBe(null)
    })

    it("filter icon and menu should work correct", async () => {
      const { container } = renderComponent()

      act(() => {
        fireEvent.mouseOver(
          screen.getByText("Trade Date").closest("div") as Element,
        )
      })

      expect(container.querySelector(tradeDateFilterIcon)).not.toBe(null)

      act(() => {
        fireEvent.click(container.querySelector(tradeDateFilterIcon) as Element)
      })

      expect(container.querySelector(tradeDateFilterMenu)).not.toBe(null)

      let rows = await screen.findAllByTestId(/trades-grid-row/)

      expect(rows.length).toBe(3)
      const dateInput = (await screen.findByTestId(
        "date-filter-input",
      )) as HTMLInputElement

      act(() => {
        fireEvent.change(dateInput, { target: { value: "2021-01-13" } })
      })

      rows = await screen.findAllByTestId(/trades-grid-row/)
      expect(rows.length).toBe(1)

      act(() => {
        fireEvent.change(container.querySelector("select") as Element, {
          target: { value: ComparatorType.Greater },
        })
      })

      rows = await screen.findAllByTestId(/trades-grid-row/)
      expect(rows.length).toBe(1)
    })
  })
})
