import { Subscribe } from "@react-rxjs/core"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { TestThemeProvider } from "client/utils/testUtils"
import { Direction } from "generated/TradingGateway"
import { BehaviorSubject, Subject } from "rxjs"
import { CurrencyPair } from "services/currencyPairs"
import { ccppMock } from "services/currencyPairs/__mocks__/_ccpp"
import {
  ExecutionRequest,
  ExecutionStatus,
  ExecutionTrade,
  TimeoutExecution,
} from "services/executions"
import { execMock } from "services/executions/__mocks__/_exec"
import { HistoryPrice, Price, PriceMovementType } from "services/prices"
import { pricesMock } from "services/prices/__mocks__/_prices"

import { Tile, tile$ } from ".."

vi.mock("services/executions/executions")
vi.mock("services/prices/prices")
vi.mock("services/currencyPairs/currencyPairs")

const currencyPairMock: CurrencyPair = {
  symbol: "EURUSD",
  base: "EUR",
  terms: "USD",
  ratePrecision: 5,
  pipsPosition: 4,
  defaultNotional: 1_000_000,
}

const priceMock: Price = {
  ask: 1.53834,
  bid: 1.53816,
  spread: "0.00022",
  creationTimestamp: 5318479648168,
  mid: 1.53825,
  symbol: "EURUSD",
  valueDate: "2021-02-10T19:10:28.4919591+00:00",
  movementType: PriceMovementType.NONE,
}

const renderComponent = (
  currencyPair = currencyPairMock,
  isAnalytics = false,
) =>
  render(
    <TestThemeProvider>
      <Subscribe source$={tile$(currencyPair.symbol)} fallback="No data">
        <Tile currencyPair={currencyPairMock} isAnalytics={isAnalytics} />
      </Subscribe>
    </TestThemeProvider>,
  )

const rfqButtonTestId = "rfqButton"
const rfqRejectTestId = "rfqReject"
const rfqTimerTestId = "rfqTimer"
const rfqExpireLabelTestId = "expireLabel"

function initiateQuote() {
  act(() => {
    const input = screen.getAllByRole("textbox")[0] as HTMLInputElement
    fireEvent.change(input, { target: { value: "10000000" } })
  })
  act(() => {
    fireEvent.click(screen.getByTestId(rfqButtonTestId))
  })
}
const response$ = new Subject<ExecutionTrade | TimeoutExecution>()
const executeFn = vi.fn(() => response$)

describe("Tile/rfq", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    pricesMock.__resetMocks()
    ccppMock.__resetMock()
    execMock.__resetMocks()

    const ccPairMock$ = new BehaviorSubject({
      [currencyPairMock.symbol]: currencyPairMock,
    })
    ccppMock.__setMock(ccPairMock$)
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    pricesMock.__setPriceMock(currencyPairMock.symbol, priceMock$)
    const hPriceMock$ = new Subject<HistoryPrice>()
    pricesMock.__setHistoricalPricesMock(hPriceMock$)

    execMock.__setExecute$(executeFn)
    renderComponent()
  })

  it("RFQ Button should only appear when notional above threshold", async () => {
    expect(screen.queryByTestId(rfqButtonTestId)).toBe(null)

    const input = screen.getAllByRole("textbox")[0] as HTMLInputElement

    act(() => {
      fireEvent.change(input, { target: { value: "10000000" } })
    })

    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe(
      "Initiate RFQ",
    )
  })

  it("RFQ cancel should appear after initiate quote and work as expected", async () => {
    initiateQuote()
    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe("Cancel RFQ")

    // clicking cancel button
    act(() => {
      fireEvent.click(screen.getByTestId(rfqButtonTestId))
    })
    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe(
      "Initiate RFQ",
    )
  })

  it("RFQ cancel should disappear after 2 seconds, and timer and reject button should appear", async () => {
    initiateQuote()
    act(() => {
      vi.advanceTimersByTime(2001)
    })

    expect(screen.queryByTestId(rfqButtonTestId)).toBe(null)
    expect(screen.queryByTestId(rfqTimerTestId)).not.toBe(null)
    expect(screen.queryByTestId(rfqRejectTestId)).not.toBe(null)
  })

  it("RFQ Reject button should work as expected", async () => {
    initiateQuote()
    act(() => {
      vi.advanceTimersByTime(2001)
    })
    act(() => {
      const rfqReject = screen.getByTestId(rfqRejectTestId)
      fireEvent.click(rfqReject)
    })

    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe("Requote")
    expect(screen.queryAllByTestId(rfqExpireLabelTestId)).toHaveLength(2)

    // click requote button
    act(() => {
      fireEvent.click(screen.getByTestId(rfqButtonTestId))
    })
    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe("Cancel RFQ")
  })

  it("RFQ timer timeout should work as rejected", async () => {
    initiateQuote()
    act(() => {
      vi.advanceTimersByTime(2001)
    })

    act(() => {
      vi.advanceTimersByTime(10001)
    })

    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe("Requote")
    expect(screen.queryAllByTestId(rfqExpireLabelTestId)).toHaveLength(2)

    // click requote button
    act(() => {
      fireEvent.click(screen.getByTestId(rfqButtonTestId))
    })
    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe("Cancel RFQ")
  })

  it("RFQ buy/sell buttons should work as expected", async () => {
    initiateQuote()
    act(() => {
      vi.advanceTimersByTime(2001)
    })

    expect(executeFn).not.toHaveBeenCalled()
    expect(screen.queryByText("Executing")).toBeNull()

    act(() => {
      fireEvent.click(screen.getAllByRole("button")[1])
    })
    expect(executeFn.mock.calls.length).toBe(1)

    const originalRequest: ExecutionRequest = (
      executeFn.mock.calls[0] as any
    )[0]
    const request: Partial<ExecutionRequest> = {
      ...originalRequest,
    }

    expect(request).toEqual({
      currencyPair: "EURUSD",
      dealtCurrency: "USD",
      direction: Direction.Sell,
      notional: 10000000,
      spotRate: 1.53816,
    })

    expect(screen.queryByText("Executing")).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(2001)
    })

    act(() => {
      response$.next({
        ...originalRequest,
        valueDate: new Date("2021-02-04T13:17:28.040711+00:00"),
        tradeDate: new Date("2021-02-05T13:17:28.040711+00:00"),
        tradeId: 200,
        status: ExecutionStatus.Done,
      })
      response$.complete()
    })

    expect(screen.getByRole("alert").textContent).toEqual(
      "You sold EUR 10,000,000 at a rate of 1.53816 for USD 15,381,600 settling (Spt) 04 Feb.",
    )

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    expect(screen.queryByRole("alert")).toBeNull()

    expect(screen.getAllByRole("button")[1].textContent).toBe(
      `SELL${priceMock.bid}`,
    )

    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe(
      "Initiate RFQ",
    )
  })

  it("RFQ button should be disabled where notional is not valid", async () => {
    act(() => {
      const input = screen.getAllByRole("textbox")[0] as HTMLInputElement
      fireEvent.change(input, { target: { value: "1000000001" } })
    })

    expect(
      screen.queryByText("Initiate RFQ")?.hasAttribute("disabled"),
    ).toEqual(true)
  })
})
