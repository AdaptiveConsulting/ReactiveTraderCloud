import React, { useEffect, useRef } from "react"
import { Subscribe } from "@react-rxjs/core"
import { whenStream, reset } from "utils/mockClient"
import { Subject } from "rxjs"
import {
  render,
  screen,
  act as reactAct,
  waitFor,
} from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"

import {
  useCurrencyPairs,
  currencyPairs$,
  CurrencyRaw,
  currencyPairMapper,
  useCurrencyPair,
  getCurrencyPair$,
} from "./currencyPairs"

const mockCurrencyPairsRaw: CurrencyRaw[] = [
  {
    Symbol: "EURUSD",
    RatePrecision: 5,
    PipsPosition: 4,
  },
  {
    Symbol: "GBPJPY",
    RatePrecision: 1,
    PipsPosition: 1,
  },
]

const mockUpdates = {
  Updates: [
    {
      UpdateType: "Added",
      CurrencyPair: mockCurrencyPairsRaw[0],
    },
  ],
}

describe("services/currencyPairs", () => {
  describe("useCurrencyPairs", () => {
    beforeEach(() => {
      reset()
    })

    it("should trigger Suspense before it receives the first update", async () => {
      const mockStream = new Subject<any>()

      whenStream("reference", "getCurrencyPairUpdatesStream", {}, mockStream)

      const TestHook: React.FC = () => {
        useCurrencyPairs()
        return <div id="data">There is data</div>
      }

      render(
        <Subscribe source$={currencyPairs$} fallback="No data">
          <TestHook />
        </Subscribe>,
      )

      expect(screen.queryByText("No data")).not.toBeNull()

      reactAct(() => {
        mockStream.next(mockUpdates)
      })

      await waitFor(() =>
        expect(screen.queryByText("There is data")).not.toBeNull(),
      )
    })

    it("should not trigger unrelated updates", async () => {
      const mockStream = new Subject<any>()
      whenStream("reference", "getCurrencyPairUpdatesStream", {}, mockStream)

      const TestHook: React.FC = () => {
        useCurrencyPairs()
        return <div id="data">There is data</div>
      }
      render(
        <Subscribe source$={currencyPairs$} fallback="No data">
          <TestHook />
        </Subscribe>,
      )

      reactAct(() => {
        mockStream.next(mockUpdates)
      })

      const renderUseCurrencyPair = (symbol: string) =>
        renderHook(
          () => {
            const ref = useRef(0)
            useEffect(() => {
              ref.current++
            })
            return { value: useCurrencyPair(symbol), updates: ref.current }
          },
          {
            wrapper: ({ children }) => (
              <Subscribe source$={getCurrencyPair$(symbol)}>
                {children}
              </Subscribe>
            ),
          },
        )

      const eurUsd = renderUseCurrencyPair(mockCurrencyPairsRaw[0].Symbol)
      const gbpJpy = renderUseCurrencyPair(mockCurrencyPairsRaw[1].Symbol)

      expect(gbpJpy.result.current.value).toBe(undefined)
      expect(eurUsd.result.current.value).toStrictEqual(
        currencyPairMapper(mockCurrencyPairsRaw[0]),
      )

      reactAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: "Added",
              CurrencyPair: mockCurrencyPairsRaw[1],
            },
          ],
        })
      })

      expect(gbpJpy.result.current.value).toStrictEqual(
        currencyPairMapper(mockCurrencyPairsRaw[1]),
      )

      expect(eurUsd.result.current.updates).toBe(0)
      expect(gbpJpy.result.current.updates).toBe(1)
    })
  })
})
