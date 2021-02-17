import { whenStream, reset } from "utils/mockClient"

import { history$, useCurrentPositions, currentPositions$ } from "./analytics"
import { CurrencyPairPosition, HistoryEntry, PositionsRaw } from "./types"
import { BehaviorSubject } from "rxjs"
import { waitFor } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { Subscribe } from "@react-rxjs/core"
import { testScheduler } from "utils/testScheduler"

const mockSource = {
  a: {
    CurrentPositions: [
      {
        BasePnl: 5505.700507776323,
        BaseTradedAmount: 1000000,
        CounterTradedAmount: -1557030,
        Symbol: "EURAUD",
      },
      {
        BasePnl: -28767.690451584618,
        BaseTradedAmount: -7975223,
        CounterTradedAmount: 1014984843.778,
        Symbol: "EURJPY",
      },
    ],
    History: [
      {
        Timestamp: "2021-02-15T15:20:46.0961935+00:00",
        UsdPnl: -2722245.789415593,
      },
      {
        Timestamp: "2021-02-15T15:20:56.0971211+00:00",
        UsdPnl: -2713309.3362381877,
      },
      {
        Timestamp: "2021-02-15T15:21:06.0961142+00:00",
        UsdPnl: -2700750.747100412,
      },
    ],
  } as PositionsRaw,
}

const mockResult = {
  a: [
    {
      timestamp: 1613402446096,
      usPnl: -2722245.789415593,
    },
    {
      timestamp: 1613402456097,
      usPnl: -2713309.3362381877,
    },
    {
      timestamp: 1613402466096,
      usPnl: -2700750.747100412,
    },
  ] as HistoryEntry[],
}

const mockPostionResult = {
  a: {
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
  } as Record<string, CurrencyPairPosition>,
}

const renderUseCurrentPositions = () => {
  return renderHook(() => useCurrentPositions(), {
    wrapper: ({ children }) => (
      <Subscribe source$={currentPositions$}>{children}</Subscribe>
    ),
  })
}

describe("services/analytics", () => {
  describe("history$", () => {
    beforeEach(() => {
      reset()
    })
    it("returns history usPnl array with new time stamp", () => {
      testScheduler().run(({ expectObservable, cold }) => {
        const input = cold("    ---(a|)", mockSource)
        const expectedOutput = "---(a|)"

        reset()
        whenStream("analytics", "getAnalytics", "USD", input)
        expectObservable(history$).toBe(expectedOutput, mockResult)
      })
    })
  })
  describe("useCurrentPositions", () => {
    beforeEach(() => {
      reset()
    })

    it("returns current position map", async () => {
      const mockHistory$ = new BehaviorSubject(mockSource.a)
      whenStream("analytics", "getAnalytics", "USD", mockHistory$)

      const { result } = renderUseCurrentPositions()

      await waitFor(() => expect(result.current).toEqual(mockPostionResult.a))
    })
  })
})
