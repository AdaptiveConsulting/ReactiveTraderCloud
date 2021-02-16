import React from "react"
import { Subscribe } from "@react-rxjs/core"
import { whenStream, reset } from "utils/mockClient"
import { of, Subject } from "rxjs"
import {
  render,
  screen,
  act as reactAct,
  waitFor,
} from "@testing-library/react"

import {
  useCurrencyPairs,
  currencyPairs$,
  CurrencyRaw,
  currencyPairMapper,
} from "./currencyPairs"

const mockCurrencyPairsRaw: CurrencyRaw = {
  Symbol: "EURUSD",
  RatePrecision: 5,
  PipsPosition: 4,
}

const mockUpdates = {
  Updates: [
    {
      UpdateType: "Added",
      CurrencyPair: {
        Symbol: "EURUSD",
        RatePrecision: 1,
        PipsPosition: 1,
      },
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

    it("should correctly map raw currency pairs", () => {
      const mapped = currencyPairMapper(mockCurrencyPairsRaw)
      expect(mapped.base).toBe("EUR")
      expect(mapped.terms).toBe("USD")
    })
  })
})
