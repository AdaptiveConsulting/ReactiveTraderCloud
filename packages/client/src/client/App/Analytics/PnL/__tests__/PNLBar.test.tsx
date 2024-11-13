import { act, fireEvent, render, screen } from "@testing-library/react"

import { TestThemeProvider } from "@/client/utils/testUtils"

import PNLBar from "../PNLBar"

const renderComponent = (symbol: string, basePnl: number, maxVal: number) =>
  render(
    <TestThemeProvider>
      <PNLBar
        symbol={symbol}
        profitOrLossValue={basePnl}
        largetProfitOrLossValue={maxVal}
      />
    </TestThemeProvider>,
  )

describe("PNLBar", () => {
  it("should display the symbol name correctly", () => {
    renderComponent("EURAUD", -26043.691207338878, 1239939.1231111237)
    expect(screen.getByTestId("symbolLabel").textContent).toBe(`EURAUD`)
  })

  it("should display the price and hover price correctly", () => {
    renderComponent("EURAUD", -26043.691207338878, 1239939.1231111237)
    expect(screen.getByTestId("priceLabel").textContent).toBe(`-26k`)

    act(() => {
      fireEvent.mouseOver(screen.getByTestId("priceLabel"))
    })

    expect(screen.getByTestId("priceLabel").textContent).toBe(`-26,043.69`)
  })
})
