import { Subscribe } from "@react-rxjs/core"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { TestThemeProvider } from "client/utils/testUtils"
import { BehaviorSubject } from "rxjs"
import { CurrencyPair } from "services/currencyPairs"
import { ccppMock } from "services/currencyPairs/__mocks__/_ccpp"

import { liveRates$ } from "../../LiveRatesCore"
import { Tiles } from "../../Tiles"
import { MainHeader } from ".."

vi.mock("services/currencyPairs/currencyPairs")
vi.mock("../../Tile/Tile.tsx")

const currencyPairMock1: CurrencyPair = {
  symbol: "EURUSD",
  base: "EUR",
  terms: "USD",
  ratePrecision: 5,
  pipsPosition: 4,
  defaultNotional: 1_000_000,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "GBPJPY",
  base: "GBP",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
  defaultNotional: 1_000_000,
}

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Subscribe source$={liveRates$} fallback="No data">
        <MainHeader />
        <Tiles />
      </Subscribe>
    </TestThemeProvider>,
  )

describe("MainHeader", () => {
  beforeEach(() => {
    ccppMock.__resetMock()
    ccppMock.__setMock(
      new BehaviorSubject({
        [currencyPairMock1.symbol]: currencyPairMock1,
        [currencyPairMock2.symbol]: currencyPairMock2,
      }),
    )
  })

  it("should load all the currency buttons", async () => {
    renderComponent()

    expect(screen.getByTestId("menuButton-ALL").textContent).toBe(`ALL`)
    expect(screen.getByTestId("menuButton-EUR").textContent).toBe(`EUR`)
    expect(screen.getByTestId("menuButton-GBP").textContent).toBe(`GBP`)
  })

  it("should filter the tiles based on selection", async () => {
    renderComponent()

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(2)

    act(() => {
      fireEvent.click(screen.getByTestId("menuButton-EUR"))
    })

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(1)
    expect(screen.getByTestId("tile-EURUSD")).not.toBeNull()

    act(() => {
      fireEvent.click(screen.getByTestId("menuButton-GBP"))
    })

    expect(
      screen.getByRole("region", { name: "Lives Rates Tiles" }).children.length,
    ).toBe(1)
    expect(screen.getByTestId("tile-GBPJPY")).not.toBeNull()
  })

  it("should show the charts in tiles once click toggle view button", async () => {
    renderComponent()

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "IsAnalytics: true",
    )

    act(() => {
      fireEvent.click(screen.getByTestId("toggleButton"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "IsAnalytics: false",
    )

    act(() => {
      fireEvent.click(screen.getByTestId("toggleButton"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "IsAnalytics: true",
    )
  })
})
