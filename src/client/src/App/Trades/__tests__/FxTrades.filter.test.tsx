/* eslint-disable @typescript-eslint/no-var-requires */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { Trade, tradesTestData } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import FxTrades from "../CoreFxTrades"
import userEvent from "@testing-library/user-event"
import { ComparatorType } from "@/App/Trades/TradesState"

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

describe("for notional column", () => {
  const notionalFilterIcon = '[aria-label="Open Notional field filter pop up"]'
  const notionalFilterMenu =
    '[aria-label="Filter trades by Notional field value"]'
  const notionalFilterMenuInput = '[aria-label="Primary filter value"]'

  let container: HTMLElement

  beforeEach(async () => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    act(() => _trades.__setTrades(tradesSubj))
    container = renderComponent().container
    await waitFor(() => {
      expect(container).toBeDefined()
    })
  })

  it("no filter icon or menu should be rendered", async () => {
    expect(container.querySelector(notionalFilterIcon)).toBe(null)
    expect(container.querySelector(notionalFilterMenu)).toBe(null)
  })

  it("filter icon and menu should work correctly", async () => {
    act(() => {
      fireEvent.mouseOver(screen.getByText("Notional").closest("th") as Element)
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

    await waitFor(() => {
      expect(container.querySelectorAll("tbody tr").length).toBe(2)
    })

    act(() => {
      userEvent.selectOptions(
        container.querySelector("select") as Element,
        ComparatorType.Greater,
      )
    })

    await waitFor(() =>
      expect(container.querySelectorAll("tbody tr").length).toBe(1),
    )

    act(() => {
      userEvent.selectOptions(
        container.querySelector("select") as Element,
        ComparatorType.NotEqual,
      )
    })

    await waitFor(() => {
      expect(container.querySelectorAll("tbody tr").length).toBe(1)
    })
  })
})
