import { Subscribe } from "@react-rxjs/core"
import { render, screen, act, waitFor, fireEvent } from "@testing-library/react"
import { BehaviorSubject, Subject } from "rxjs"

import { CurrencyPair } from "@/services/currencyPairs"
import {
  ExecutionRequest,
  ExecutionStatus,
  ExecutionTrade,
  TimeoutExecution,
} from "@/services/executions"
import { HistoryPrice, Price, PriceMovementType } from "@/services/prices"
import { Direction } from "@/services/trades"
import { TestThemeProvider } from "@/utils/testUtils"
import { Tile, tile$ } from "./Tile"

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

describe("Tile", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    _prices.__resetMocks()
    _ccpp.__resetMock()
    _exec.__resetMocks()

    const ccPairMock$ = new BehaviorSubject({
      [currencyPairMock.symbol]: currencyPairMock,
    })
    _ccpp.__setMock(ccPairMock$)
  })

  it("should trigger Suspense before it receives the first update", async () => {
    const priceMock$ = new Subject<Price>()
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    renderComponent()

    expect(screen.queryByText("No data")).not.toBeNull()

    act(() => {
      priceMock$.next(priceMock)
    })

    await waitFor(() => expect(screen.queryByText("No data")).toBeNull())
  })

  it("should display and update the right prices on the buy and sell buttons", async () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    renderComponent()

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )

    expect(screen.getAllByRole("button")[1].textContent).toBe(
      `BUY${priceMock.ask}`,
    )

    const nextBid = 4.34345
    act(() => {
      priceMock$.next({ ...priceMock, bid: nextBid })
    })

    await waitFor(() =>
      expect(screen.getAllByRole("button")[0].textContent).toBe(
        `SELL${nextBid}`,
      ),
    )
  })

  it("triggers executions currenctly", async () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    const response$ = new Subject<ExecutionTrade | TimeoutExecution>()

    const executeFn = jest.fn(() => response$)
    _exec.__setExecute$(executeFn)

    renderComponent()

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
      notional: 1000000,
      spotRate: 1.53816,
    })

    await waitFor(() => expect(screen.queryByText("Executing")).not.toBeNull())

    const tradeId = 200
    act(() => {
      response$.next({
        ...originalRequest,
        valueDate: "2021-02-04T13:17:28.040711+00:00",
        tradeId,
        status: ExecutionStatus.Done,
      })
      response$.complete()
    })

    await waitFor(() => expect(screen.queryByText("Executing")).toBeNull())
    expect(screen.queryByRole("alert")!.textContent).toEqual(
      "You sold EUR 1,000,000 at a rate of 1.53816 for USD 1,538,160 settling (Spt) 04 Feb.",
    )

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )
  })

  it("should render alert when execution takes too long", async () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    const ccPairMock$ = new BehaviorSubject({
      [currencyPairMock.symbol]: currencyPairMock,
    })
    _ccpp.__setMock(ccPairMock$)

    const response$ = new Subject<ExecutionTrade | TimeoutExecution>()

    const executeFn = jest.fn(() => response$)
    _exec.__setExecute$(executeFn)

    renderComponent()

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
      notional: 1000000,
      spotRate: 1.53816,
    })

    await waitFor(() => expect(screen.queryByText("Executing")).not.toBeNull())

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(screen.queryByText("Executing")).toBeNull()
    expect(screen.queryByRole("alert")!.textContent).toEqual(
      "Trade execution taking longer than expected.",
    )

    const tradeId = 200
    act(() => {
      response$.next({
        ...originalRequest,
        valueDate: "2021-02-04T13:17:28.040711+00:00",
        tradeId,
        status: ExecutionStatus.Done,
      })
      response$.complete()
    })

    expect(screen.queryByRole("alert")!.textContent).toEqual(
      "You sold EUR 1,000,000 at a rate of 1.53816 for USD 1,538,160 settling (Spt) 04 Feb.",
    )

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )
  })

  it("should render alert when execution timeout", async () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    const response$ = new Subject<ExecutionTrade | TimeoutExecution>()

    const executeFn = jest.fn(() => response$)
    _exec.__setExecute$(executeFn)

    renderComponent()

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
      notional: 1000000,
      spotRate: 1.53816,
    })

    await waitFor(() => expect(screen.queryByText("Executing")).not.toBeNull())

    act(() => {
      response$.next({
        ...originalRequest,
        status: ExecutionStatus.Timeout,
      })
      response$.complete()
    })

    await waitFor(() => {
      expect(screen.queryByText("Executing")).toBeNull()
      expect(screen.queryByRole("alert")!.textContent).toEqual(
        "Trade execution timeout exceeded.",
      )
    })

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )
  })

  it("should render alert when execution rejected", async () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    const response$ = new Subject<ExecutionTrade | TimeoutExecution>()

    const executeFn = jest.fn(() => response$)
    _exec.__setExecute$(executeFn)

    renderComponent()

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
      notional: 1000000,
      spotRate: 1.53816,
    })

    await waitFor(() => expect(screen.queryByText("Executing")).not.toBeNull())

    const tradeId = 200
    act(() => {
      response$.next({
        ...originalRequest,
        valueDate: "2021-02-04T13:17:28.040711+00:00",
        tradeId,
        status: ExecutionStatus.Rejected,
      })
      response$.complete()
    })

    await waitFor(() => {
      expect(screen.queryByText("Executing")).toBeNull()
      expect(screen.queryByRole("alert")!.textContent).toEqual(
        "Your trade has been rejected",
      )
    })

    act(() => {
      fireEvent.click(screen.getByText("Close"))
    })

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())

    expect(screen.getAllByRole("button")[0].textContent).toBe(
      `SELL${priceMock.bid}`,
    )
  })

  it("should not re-trigger executions after remounting", () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    const response$ = new Subject<ExecutionTrade | TimeoutExecution>()

    const executeFn = jest.fn(() => response$)
    _exec.__setExecute$(executeFn)

    let renderedComponent = renderComponent()

    expect(executeFn).not.toHaveBeenCalled()
    expect(screen.queryByText("Executing")).toBeNull()

    act(() => {
      fireEvent.click(screen.getAllByRole("button")[0])
    })

    expect(executeFn.mock.calls.length).toBe(1)

    renderedComponent.unmount()
    renderComponent()

    expect(executeFn.mock.calls.length).toBe(1)
  })

  it("should not unformat the notional number when focused", () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    renderComponent()
    const input = screen.getAllByRole("input")[0] as HTMLInputElement
    act(() => {
      fireEvent.change(input, { target: { value: "1000000" } })
    })
    expect(input.value).toBe("1,000,000")

    act(() => {
      fireEvent.focus(input)
    })
    expect(input.value).toBe("1,000,000")
  })

  it("should automatically selected the text of the input when focused", () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    const hPriceMock$ = new Subject<HistoryPrice>()
    _prices.__setHistoricalPricesMock(hPriceMock$)

    renderComponent()
    const input = screen.getAllByRole("input")[0] as HTMLInputElement
    act(() => {
      fireEvent.focus(input)
    })

    expect(input.selectionStart).toBe(0)
    expect(input.selectionEnd).toBe("1,000,000".length)
  })

  it("should not allow letters in the notional input", () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    renderComponent()
    const input = screen.getAllByRole("input")[0] as HTMLInputElement
    expect(input.value).toBe("1,000,000")
    act(() => {
      fireEvent.change(input, { target: { value: "Hello" } })
    })
    expect(input.value).toBe("1,000,000")
  })

  it("should reformat the notional input after got new value", () => {
    const priceMock$ = new BehaviorSubject<Price>(priceMock)
    _prices.__setPriceMock(currencyPairMock.symbol, priceMock$)

    renderComponent()
    const input = screen.getAllByRole("input")[0] as HTMLInputElement

    expect(input.value).toBe("1,000,000")

    act(() => {
      fireEvent.change(input, { target: { value: "10000000" } })
    })
    expect(input.value).toBe("10,000,000")
  })
})
