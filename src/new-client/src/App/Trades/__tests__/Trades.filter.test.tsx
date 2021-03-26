import { act, fireEvent, render, screen } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { Trade, tradesTestData } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import Trades from "../TradesCore"
import userEvent from "@testing-library/user-event"
import { ComparatorType } from "@/App/Trades/TradesState"

jest.mock("@/services/trades/trades")

const { mockTrades } = tradesTestData

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Trades />
    </TestThemeProvider>,
  )

const _trades = require("@/services/trades/trades")

describe("for notional column", () => {
  const notionalFilterIcon = '[aria-label="Open Notional field filter pop up"]'
  const notionalFilterMenu =
    '[aria-label="Filter trades by Notional field value"]'
  const notionalFilterMenuInput = '[aria-label="Primary filter value"]'

  let container: HTMLElement

  beforeEach(() => {
    const tradesSubj = new BehaviorSubject<Trade[]>(mockTrades)
    _trades.__setTrades(tradesSubj)
    container = renderComponent().container
  })

  it("no filter icon or menu should be rendered", () => {
    expect(container.querySelector(notionalFilterIcon)).toBe(null)
    expect(container.querySelector(notionalFilterMenu)).toBe(null)
  })

  it("filter icon and menu should work correct", () => {
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
    expect(container.querySelectorAll("tbody tr").length).toBe(2)

    act(() => {
      userEvent.selectOptions(
        container.querySelector("select") as Element,
        ComparatorType.Greater,
      )
    })
    expect(container.querySelectorAll("tbody tr").length).toBe(1)

    act(() => {
      userEvent.selectOptions(
        container.querySelector("select") as Element,
        ComparatorType.NotEqual,
      )
    })
    expect(container.querySelectorAll("tbody tr").length).toBe(1)
  })
})
