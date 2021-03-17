import { Subscribe } from "@react-rxjs/core"
import { render, screen, act, fireEvent } from "@testing-library/react"
import { BehaviorSubject } from "rxjs"
import { TestThemeProvider } from "@/utils/testUtils"
import { Positions, positions$ } from "./Positions"
import { CurrencyPairPosition } from "@/services/analytics"
import { CurrencyPair } from "@/services/currencyPairs"

jest.mock("@/services/analytics/analytics")
jest.mock("@/services/currencyPairs/currencyPairs")

const currencyPairMock1: CurrencyPair = {
  symbol: "EURAUD",
  base: "EUR",
  terms: "AUD",
  ratePrecision: 5,
  pipsPosition: 4,
}

const currencyPairMock2: CurrencyPair = {
  symbol: "EURJPY",
  base: "EUR",
  terms: "JPY",
  ratePrecision: 5,
  pipsPosition: 2,
}

const positionMock: Record<string, CurrencyPairPosition> = {
  EURAUD: {
    symbol: "EURAUD",
    basePnl: 5505.700507776323,
    baseTradedAmount: 1000000,
    counterTradedAmount: -1557030,
    basePnlName: "basePnl",
    baseTradedAmountName: "baseTradedAmount",
  },
  EURJPY: {
    symbol: "EURJPY",
    basePnl: -28767.690451584618,
    baseTradedAmount: -7975223,
    counterTradedAmount: 1014984843.778,
    basePnlName: "basePnl",
    baseTradedAmountName: "baseTradedAmount",
  },
}

const positionMock2: Record<string, CurrencyPairPosition> = {
  EURAUD: {
    symbol: "EURAUD",
    basePnl: 5505.700507776323,
    baseTradedAmount: 1000000,
    counterTradedAmount: -1557031,
    basePnlName: "basePnl",
    baseTradedAmountName: "baseTradedAmount",
  },
  EURJPY: {
    symbol: "EURJPY",
    basePnl: -28767.690451584618,
    baseTradedAmount: -7975223,
    counterTradedAmount: 1014984843.778,
    basePnlName: "basePnl",
    baseTradedAmountName: "baseTradedAmount",
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

const _analytics = require("@/services/analytics/analytics")
const _ccpp = require("@/services/currencyPairs/currencyPairs")

describe("Positions", () => {
  beforeEach(() => {
    _analytics.__resetMocks()
    _ccpp.__resetMock()
    _ccpp.__setMock(
      new BehaviorSubject({
        [currencyPairMock1.symbol]: currencyPairMock1,
        [currencyPairMock2.symbol]: currencyPairMock2,
      }),
    )
  })

  it("should render the correct price tag", () => {
    const positionMock$ = new BehaviorSubject<
      Record<string, CurrencyPairPosition>
    >(positionMock)
    _analytics.__setPositionMock(positionMock$)

    renderComponent()

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
      fireEvent.mouseOver(screen.getByTestId("positions-label-AUD"))
    })

    expect(screen.getByTestId("tooltip").textContent).toBe("AUD -1,557,031")
  })

  it("should display the correct bubble chart", () => {
    const positionMock$ = new BehaviorSubject<
      Record<string, CurrencyPairPosition>
    >(positionMock)
    _analytics.__setPositionMock(positionMock$)

    const subscription = positions$.subscribe()
    const { container } = render(
      <TestThemeProvider>
        <Subscribe source$={positions$} fallback="No data">
          <Positions />
        </Subscribe>
      </TestThemeProvider>,
    )

    expect(container.firstChild).toMatchSnapshot()

    act(() => {
      positionMock$.next(positionMock2)
    })

    expect(container.firstChild).toMatchSnapshot()

    subscription.unsubscribe()
  })
})
