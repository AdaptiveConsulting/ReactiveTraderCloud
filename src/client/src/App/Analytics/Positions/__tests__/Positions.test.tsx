import { Subscribe } from "@react-rxjs/core"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"

import { CurrencyPairPosition } from "@/services/analytics"
import { analyticsMock } from "@/services/analytics/__mocks__/_analytics"
import { CurrencyPair } from "@/services/currencyPairs"
import { ccppMock } from "@/services/currencyPairs/__mocks__/_ccpp"
import { TestThemeProvider } from "@/utils/testUtils"

import { Positions, positions$ } from "../Positions"

vi.mock("@/services/analytics/analytics")
vi.mock("@/services/currencyPairs/currencyPairs")

const currencyPairMock1: CurrencyPair = {
  symbol: "EURAUD",
  base: "EUR",
  terms: "AUD",
  ratePrecision: 5,
  pipsPosition: 4,
  defaultNotional: 1_000_000,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "EURJPY",
  base: "EUR",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
  defaultNotional: 1_000_000,
}

const positionMock: Record<string, CurrencyPairPosition> = {
  EURAUD: {
    symbol: "EURAUD",
    basePnl: 5505.700507776323,
    baseTradedAmount: 1000000,
    counterTradedAmount: -1557030,
  },
  EURJPY: {
    symbol: "EURJPY",
    basePnl: -28767.690451584618,
    baseTradedAmount: -7975223,
    counterTradedAmount: 1014984843.778,
  },
}

const positionMock2: Record<string, CurrencyPairPosition> = {
  EURAUD: {
    symbol: "EURAUD",
    basePnl: 5505.700507776323,
    baseTradedAmount: 1000000,
    counterTradedAmount: -1557031,
  },
  EURJPY: {
    symbol: "EURJPY",
    basePnl: -28767.690451584618,
    baseTradedAmount: -7975223,
    counterTradedAmount: 1014984843.778,
  },
}

const renderComponent = () =>
  render(
    <TestThemeProvider>
      <Subscribe source$={positions$} fallback="No data">
        <Positions />
      </Subscribe>
    </TestThemeProvider>,
  )

describe("Positions", () => {
  beforeEach(() => {
    analyticsMock.__resetMocks()
    ccppMock.__resetMock()
    ccppMock.__setMock(
      new BehaviorSubject({
        [currencyPairMock1.symbol]: currencyPairMock1,
        [currencyPairMock2.symbol]: currencyPairMock2,
      }),
    )
  })

  it("should render the correct price tag", async () => {
    const positionMock$ = new BehaviorSubject<
      Record<string, CurrencyPairPosition>
    >(positionMock)
    analyticsMock.__setPositionMock(positionMock$)

    renderComponent()

    await waitFor(() =>
      expect(screen.getByTestId("positions-label-JPY")).not.toBeNull(),
    )

    act(() => {
      fireEvent.mouseOver(screen.getByTestId("positions-label-JPY"))
    })

    expect(screen.getByTestId("tooltip").textContent).toBe("JPY 1,014,984,844")

    act(() => {
      fireEvent.mouseOver(screen.getByTestId("positions-label-AUD"))
    })

    expect(screen.getByTestId("tooltip").textContent).toBe("AUD -1,557,030")

    act(() => {
      positionMock$.next(positionMock2)
    })
    await waitFor(() =>
      expect(screen.getByTestId("positions-label-AUD")).not.toBeNull(),
    )

    act(() => {
      fireEvent.mouseOver(screen.getByTestId("positions-label-AUD"))
    })

    expect(screen.getByTestId("tooltip").textContent).toBe("AUD -1,557,031")
  })
})
