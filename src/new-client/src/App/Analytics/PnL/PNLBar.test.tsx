import { render, screen, act, fireEvent } from "@testing-library/react"
import { TestThemeProvider } from "@/utils/testUtils"
import PNLBar from "./PNLBar"
const renderer = require("react-test-renderer")

const renderComponent = (symbol: string, basePnl: number, maxVal: number) =>
  render(
    <TestThemeProvider>
      <PNLBar symbol={symbol} basePnl={basePnl} maxVal={maxVal} />
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

  it("renders the bar correctly", () => {
    const tree = renderer
      .create(
        <TestThemeProvider>
          <PNLBar
            symbol={"EURAUD"}
            basePnl={-26043.691207338878}
            maxVal={1239939.1231111237}
          />
        </TestThemeProvider>,
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
