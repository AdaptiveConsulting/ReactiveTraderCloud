import { of, Subject, Subscription } from "rxjs"
import React, { ReactNode } from "react"
import { Subscribe } from "@react-rxjs/core"
import { act, renderHook } from "@testing-library/react-hooks"
import { useTrades, TradeRaw, trades$, TradeStatus } from "../trades"
type MockTradeStream = { Trades: TradeRaw[] } | undefined
declare module globalThis {
  let mockTradeSubject$: Subject<MockTradeStream>
}

/**
 * Jest automatically hoists the result of jest.mock
 * above EcmaScript imports.  Invocations of client functions
 * will use this mock.  Since it makes use of mockTradeSubject$,
 * declare as global that we want to control outside of this scope,
 * declare as global.
 */
jest.mock("../client", () => {
  const { Subject } = require("rxjs")
  globalThis.mockTradeSubject$ = new Subject()
  return {
    getStream$: () => {
      return globalThis.mockTradeSubject$.asObservable()
    },
  }
})

const mockTrades = {
  Trades: [
    {
      TradeId: 1,
      TraderName: "LMO",
      CurrencyPair: "GBPUSD",
      Notional: 1000000,
      DealtCurrency: "GBP",
      Direction: "Buy",
      SpotRate: 1.36665,
      TradeDate: "2021-01-13T17:32:12.6003777+00:00",
      ValueDate: "2021-01-15T17:32:12.6005967+00:00",
      Status: "Done",
    },
    {
      TradeId: 2,
      TraderName: "LMO",
      CurrencyPair: "USDJPY",
      Notional: 1000000,
      DealtCurrency: "USD",
      Direction: "Buy",
      SpotRate: 103.891,
      TradeDate: "2021-01-13T17:32:26.7011799+00:00",
      ValueDate: "2021-01-15T17:32:26.7012023+00:00",
      Status: "Pending",
    },
    {
      TradeId: 3,
      TraderName: "EDO",
      CurrencyPair: "USDJPY",
      Notional: 1000000,
      DealtCurrency: "USD",
      Direction: "Buy",
      SpotRate: 103.924,
      TradeDate: "2021-01-13T20:02:39.4410315+00:00",
      ValueDate: "2021-01-15T20:02:39.4410596+00:00",
      Status: "Done",
    },
  ] as TradeRaw[],
}

beforeAll(() => {
  // Tests error if I don't emit a value and try to push inside test
  // or in beforeEach
  globalThis.mockTradeSubject$.next(mockTrades)
})

// Tests error if I re-assign or complete
// beforeEach(() => {
//  globalThis.mockTradeSubject$ = new Subject<MockTradeStream>()
// })

// afterEach(() => {
//   globalThis.mockTradeSubject$.complete()
// }

afterAll(() => {
  globalThis.mockTradeSubject$.complete()
})

// Subscription needs to be done here and maintained, rather than supplied through a <Subscribe> wrapper to the hook.  If I try unsubscribing in any scope or handler in this file, things break for reasons that I do not understand.
trades$.subscribe()

const renderUseTrades = () => {
  return renderHook(() => useTrades(), {
    // See comment on line 88
    // wrapper: ({ children }) => {
    //   return (
    //     <Subscribe source$={trades$}>{children}</Subscribe>
    //   )
    // }
  })
}

describe("useTrades", () => {
  xit("should return undefined before first trade comes in", () => {
    const { result } = renderUseTrades()
    expect(result).toBeUndefined()
  })

  it("should transform each raw RawTrade into a Trade", () => {
    const { result } = renderUseTrades()
    // Currently redundant since data already emitted in before all
    act(() => globalThis.mockTradeSubject$.next(mockTrades))
    expect(result.current.find((trade) => trade.tradeId === 1)).toEqual({
      tradeId: 1,
      traderName: "LMO",
      symbol: "GBPUSD",
      notional: 1000000,
      dealtCurrency: "GBP",
      direction: "Buy",
      spotRate: 1.36665,
      tradeDate: new Date("2021-01-13T17:32:12.6003777+00:00"),
      valueDate: new Date("2021-01-15T17:32:12.6005967+00:00"),
      status: "Done",
    })
    expect(result.current.length).toBe(mockTrades.Trades.length)
  })

  it("should only include the last version of a trade", () => {
    const { result } = renderUseTrades()
    // Currently redundant since data already emitted in before all
    act(() => globalThis.mockTradeSubject$.next(mockTrades))
    expect(result.current.length).toBe(3)
    act(() => {
      globalThis.mockTradeSubject$.next({
        Trades: [
          {
            ...mockTrades.Trades.find((trade) => trade.TradeId === 2),
            Status: TradeStatus.Done,
          },
        ] as any,
      })
    })

    expect(result.current.length).toBe(3)
    expect(result.current.filter((trade) => trade.tradeId === 2).length).toBe(1)
    expect(result.current.find((trade) => trade.tradeId === 2)).toEqual({
      tradeId: 2,
      traderName: "LMO",
      symbol: "USDJPY",
      notional: 1000000,
      dealtCurrency: "USD",
      direction: "Buy",
      spotRate: 103.891,
      tradeDate: new Date("2021-01-13T17:32:26.7011799+00:00"),
      valueDate: new Date("2021-01-15T17:32:26.7012023+00:00"),
      status: "Done",
    })
  })

  it("should reverse sort trades", () => {
    const { result } = renderUseTrades()
    // Currently redundant since data already emitted in before all
    act(() => globalThis.mockTradeSubject$.next(mockTrades))
    for (
      let i = 0, j = mockTrades.Trades.length - 1;
      i < mockTrades.Trades.length;
      i++, j--
    ) {
      expect(result.current[j].tradeId).toBe(mockTrades.Trades[i].TradeId)
    }
  })
})


