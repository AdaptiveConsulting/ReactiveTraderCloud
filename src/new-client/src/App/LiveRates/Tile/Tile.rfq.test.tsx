import { Subscribe } from "@react-rxjs/core"
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { BehaviorSubject, Subject } from "rxjs"

import { CurrencyPair } from "@/services/currencyPairs"
import { HistoryPrice, Price, PriceMovementType } from "@/services/prices"
import { TestThemeProvider } from "@/utils/testUtils"
import { Tile, tile$ } from "./Tile"
import {
  ExecutionRequest,
  ExecutionStatus,
  ExecutionTrade,
  TimeoutExecution,
} from "@/services/executions"
import { Direction } from "@/services/trades"

jest.mock("@/services/executions/executions")
jest.mock("@/services/prices/prices")
jest.mock("@/services/currencyPairs/currencyPairs")

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

const _prices = require("@/services/prices/prices")
const _ccpp = require("@/services/currencyPairs/currencyPairs")
const _exec = require("@/services/executions/executions")

const rfqButtonTestId = "rfqButton"
const rfqRejectTestId = "rfqReject"
const rfqTimerTestId = "rfqTimer"
const rfqExpireLabelTestId = "expireLabel"

function initiateQuote() {
  act(() => {
    const input = screen.getAllByRole("input")[0] as HTMLInputElement
    fireEvent.change(input, { target: { value: "10000000" } })
  })
  act(() => {
    fireEvent.click(screen.getByTestId(rfqButtonTestId))
  })
}
const response$ = new Subject<ExecutionTrade | TimeoutExecution>()
const executeFn = jest.fn(() => response$)

describe("Tile/rfq", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern")

    _prices.__resetMocks()
    _ccpp.__resetMock()
    _exec.__resetMocks()

    const ccPairMock$ = new BehaviorSubject({
      [currencyPairMock.symbol]: currencyPairMock,
    })
    _ccpp.__setMock(ccPairMock$)
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)
    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    _exec.__setExecute$(executeFn)
    renderComponent()
  })

  it("RFQ Button should only appear when notional above threshold", async () => {
    expect(screen.queryByTestId(rfqButtonTestId)).toBe(null)

    act(() => {
      const input = screen.getAllByRole("input")[0] as HTMLInputElement
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
      jest.advanceTimersByTime(2001)
    })

    expect(screen.queryByTestId(rfqButtonTestId)).toBe(null)
    expect(screen.queryByTestId(rfqTimerTestId)).not.toBe(null)
    expect(screen.queryByTestId(rfqRejectTestId)).not.toBe(null)
  })

  it("RFQ Reject button should work as expected", async () => {
    initiateQuote()
    act(() => {
      jest.advanceTimersByTime(2001)
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
      jest.advanceTimersByTime(2001)
    })

    act(() => {
      jest.advanceTimersByTime(10001)
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
      jest.advanceTimersByTime(2001)
    })

    expect(executeFn).not.toHaveBeenCalled()
    expect(screen.queryByText("Executing")).toBeNull()

    act(() => {
      fireEvent.click(screen.getAllByRole("button")[0])
    })

    expect(executeFn.mock.calls.length).toBe(1)

    const originalRequest: ExecutionRequest = (executeFn.mock
      .calls[0] as any)[0]
    const request: Partial<ExecutionRequest> = {
      ...originalRequest,
    }
    delete request.id

    expect(request).toEqual({
      currencyPair: "EURUSD",
      dealtCurrency: "USD",
      direction: Direction.Sell,
      notional: 10000000,
      spotRate: 1.53816,
    })

    await waitFor(() => expect(screen.queryByText("Executing")).not.toBeNull())

    act(() => {
      jest.advanceTimersByTime(2001)
    })

    act(() => {
      response$.next({
        ...originalRequest,
        valueDate: "2021-02-04T13:17:28.040711+00:00",
        tradeId: 200,
        status: ExecutionStatus.Done,
      })
      response$.complete()
    })

    expect(screen.queryByRole("alert")!.textContent).toEqual(
      "You sold EUR 10,000,000 at a rate of 1.53816 for USD 15,381,600 settling (Spt) 04 Feb.",
    )

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )

    expect(screen.getByTestId(rfqButtonTestId)?.textContent).toBe(
      "Initiate RFQ",
    )
  })

  it("RFQ button should be disabled where notional is not valid", async () => {
    act(() => {
      const input = screen.getAllByRole("input")[0] as HTMLInputElement
      fireEvent.change(input, { target: { value: "1000000001" } })
    })

    expect(
      screen.queryByText("Initiate RFQ")?.hasAttribute("disabled"),
    ).toEqual(true)
  })
})
