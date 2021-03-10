import { Subscribe } from "@react-rxjs/core"
import { render, screen, act, fireEvent } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { MainHeader } from "./MainHeader"
import { liveRates$ } from "../LiveRatesCore"
import { CurrencyPair } from "@/services/currencyPairs"
import { TestThemeProvider } from "@/utils/testUtils"
import { Tiles } from "../Tiles"

jest.mock("@/services/currencyPairs/currencyPairs")
jest.mock("../Tile/Tile.tsx")

const currenciesMock: string[] = ["EUR", "USD"]

const currencyPairMock1: CurrencyPair = {
  symbol: "EURUSD",
  base: "EUR",
  terms: "USD",
  ratePrecision: 5,
  pipsPosition: 4,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "GBPJPY",
  base: "GBP",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
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

const _ccpp = require("@/services/currencyPairs/currencyPairs")

describe("MainHeader", () => {
  beforeEach(() => {
    _ccpp.__resetMocks()
  })

  it("should load all the currency buttons", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    renderComponent()

    expect(screen.getByTestId("menuButton-Symbol(all)").textContent).toBe(`ALL`)
    expect(screen.getByTestId("menuButton-EUR").textContent).toBe(`EUR`)
    expect(screen.getByTestId("menuButton-USD").textContent).toBe(`USD`)
  })

  it("should filter the tiles based on selection", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    _ccpp.__setCurrencyPairsMock(currencyPairMock1.symbol, currencyPairMock1)
    _ccpp.__setCurrencyPairsMock(currencyPairMock2.symbol, currencyPairMock2)

    renderComponent()

    expect(
      screen.getByTestId("workspace__tiles-workspace-items").children.length,
    ).toBe(2)

    act(() => {
      fireEvent.click(screen.getByTestId("menuButton-EUR"))
    })

    expect(
      screen.getByTestId("workspace__tiles-workspace-items").children.length,
    ).toBe(1)
    expect(screen.getByTestId("tile-EURUSD")).not.toBeNull()
  })

  it("should show the charts in tiles once click toggle view button", async () => {
    const currenciesMock$ = new BehaviorSubject<string[]>(currenciesMock)
    _ccpp.__setCurrenciesMock(currenciesMock$)

    _ccpp.__setCurrencyPairsMock(currencyPairMock1.symbol, currencyPairMock1)
    _ccpp.__setCurrencyPairsMock(currencyPairMock2.symbol, currencyPairMock2)

    renderComponent()

    act(() => {
      fireEvent.click(screen.getByTestId("toggleButton"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "IsAnalytics: true",
    )

    act(() => {
      fireEvent.click(screen.getByTestId("toggleButton"))
    })

    expect(screen.getByTestId("tile-EURUSD").textContent).toBe(
      "IsAnalytics: false",
    )
  })
})
