import { useEffect, useRef } from "react"
import { Subscribe } from "@react-rxjs/core"
import { whenStream, reset } from "@/utils/mockClient"
import { BehaviorSubject, Subject } from "rxjs"
import {
  render,
  screen,
  waitFor,
  act as componentAct,
} from "@testing-library/react"
import { renderHook, act as hookAct } from "@testing-library/react-hooks"

import { CurrencyPair, CurrencyRaw, RawCurrencyPairUpdates } from "./types"

import {
  useCurrencyPairs,
  currencyPairs$,
  useCurrencyPair,
  getCurrencyPair$,
} from "./currencyPairs"
import { UpdateType } from "@/services/utils"

enum MockSymbols {
  EURUSD = "EURUSD",
  GBPJPY = "GBPJPY",
}

const mockCurrencyPairsRaw: Record<MockSymbols, CurrencyRaw> = {
  [MockSymbols.EURUSD]: {
    Symbol: "EURUSD",
    RatePrecision: 5,
    PipsPosition: 4,
  },
  [MockSymbols.GBPJPY]: {
    Symbol: "GBPJPY",
    RatePrecision: 1,
    PipsPosition: 1,
  },
}

const mockCurrencyPairs: Record<MockSymbols, CurrencyPair> = {
  [MockSymbols.EURUSD]: {
    symbol: "EURUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "USD",
    defaultNotional: 1_000_000,
  },
  [MockSymbols.GBPJPY]: {
    symbol: "GBPJPY",
    ratePrecision: 1,
    pipsPosition: 1,
    base: "GBP",
    terms: "JPY",
    defaultNotional: 1_000_000,
  },
}

const useCurrencyPairWithUpdates = (symbol: MockSymbols) => {
  const ref = useRef(0)
  useEffect(() => {
    ref.current++
  })
  return { value: useCurrencyPair(symbol), updates: ref.current }
}

const renderUseCurrencyPairWithUpdates = (symbol: MockSymbols) =>
  renderHook(() => useCurrencyPairWithUpdates(symbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getCurrencyPair$(symbol)}>{children}</Subscribe>
    ),
  })

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

      componentAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: "Added",
              CurrencyPair: mockCurrencyPairsRaw.EURUSD,
            },
          ],
        })
      })

      await waitFor(() =>
        expect(screen.queryByText("There is data")).not.toBeNull(),
      )
    })

    it("should receive the currency data", async () => {
      const mockStream = new Subject<RawCurrencyPairUpdates>()
      whenStream("reference", "getCurrencyPairUpdatesStream", {}, mockStream)

      const eurUsd = renderUseCurrencyPairWithUpdates(MockSymbols.EURUSD)

      expect(eurUsd.result.current).toBeUndefined()

      mockStream.next({
        Updates: [
          {
            UpdateType: UpdateType.Added,
            CurrencyPair: mockCurrencyPairsRaw.EURUSD,
          },
        ],
      })

      await waitFor(() =>
        expect(eurUsd.result.current.value).toEqual(mockCurrencyPairs.EURUSD),
      )

      const other = renderUseCurrencyPairWithUpdates(MockSymbols.GBPJPY)
      expect(other.result.current.value).toBeUndefined()

      hookAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: UpdateType.Added,
              CurrencyPair: mockCurrencyPairsRaw.GBPJPY,
            },
          ],
        })
      })

      expect(other.result.current.value).toEqual(mockCurrencyPairs.GBPJPY)
    })

    it("should not trigger updates for unrelated data", () => {
      const mockStream = new BehaviorSubject<RawCurrencyPairUpdates>({
        Updates: [
          {
            UpdateType: UpdateType.Added,
            CurrencyPair: mockCurrencyPairsRaw.EURUSD,
          },
        ],
      })
      whenStream("reference", "getCurrencyPairUpdatesStream", {}, mockStream)

      const eurUsd = renderUseCurrencyPairWithUpdates(MockSymbols.EURUSD)
      const gbpJpy = renderUseCurrencyPairWithUpdates(MockSymbols.GBPJPY)

      expect(eurUsd.result.current.value).toEqual(mockCurrencyPairs.EURUSD)
      expect(gbpJpy.result.current.value).toBeUndefined()
      expect(eurUsd.result.current.updates).toBe(0)
      expect(gbpJpy.result.current.updates).toBe(0)

      hookAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: UpdateType.Added,
              CurrencyPair: mockCurrencyPairsRaw.GBPJPY,
            },
          ],
        })
      })

      expect(gbpJpy.result.current.value).toEqual(mockCurrencyPairs.GBPJPY)

      expect(eurUsd.result.current.updates).toBe(0)
      expect(gbpJpy.result.current.updates).toBe(1)
    })

    it("should correctly add and remove currency pairs", async () => {
      const mockStream = new Subject<any>()
      whenStream("reference", "getCurrencyPairUpdatesStream", {}, mockStream)

      const gbpJpy = renderUseCurrencyPairWithUpdates(MockSymbols.GBPJPY)
      const eurUsd = renderUseCurrencyPairWithUpdates(MockSymbols.EURUSD)

      componentAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: "Added",
              CurrencyPair: mockCurrencyPairsRaw.GBPJPY,
            },
            {
              UpdateType: "Added",
              CurrencyPair: mockCurrencyPairsRaw.EURUSD,
            },
          ],
        })
      })

      await waitFor(() =>
        expect(gbpJpy.result.current.value).toEqual(mockCurrencyPairs.GBPJPY),
      )
      expect(eurUsd.result.current.value).toEqual(mockCurrencyPairs.EURUSD)

      hookAct(() => {
        mockStream.next({
          Updates: [
            {
              UpdateType: "Removed",
              CurrencyPair: mockCurrencyPairsRaw.GBPJPY,
            },
          ],
        })
      })

      expect(gbpJpy.result.current.value).toBe(undefined)
      expect(eurUsd.result.current.value).toEqual(mockCurrencyPairs.EURUSD)
    })
  })
})
