import React from "react"
import { Subscribe } from "@react-rxjs/core"
import { whenStream, reset } from "utils/mockClient"
import { BehaviorSubject, of, Subject } from "rxjs"
import { render, screen, act as reactAct } from "@testing-library/react"
import { act, renderHook } from "@testing-library/react-hooks"
import { TradeRaw, TradeStatus } from "./types"

import { useTrades, trades$ } from "./trades"

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

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

const renderUseTrades = () => {
  return renderHook(() => useTrades(), {
    wrapper: ({ children }) => (
      <Subscribe source$={trades$}>{children}</Subscribe>
    ),
  })
}

describe("services/trade", () => {
  describe("useTrades", () => {
    beforeEach(() => {
      reset()
    })

    it("should trigger Suspense before it receives the first update", async () => {
      const mockStream = new Subject<any>()
      whenStream("blotter", "getTradesStream", {}, mockStream)
      const TestHook: React.FC = () => {
        useTrades()
        return <>There is data</>
      }

      render(
        <Subscribe source$={trades$} fallback="No data">
          <TestHook />
        </Subscribe>,
      )

      expect(screen.queryByText("No data")).not.toBeNull()

      await reactAct(async () => {
        mockStream.next(mockTrades)
        await wait(20)
      })

      expect(screen.queryByText("There is data")).not.toBeNull()
    })

    it("should transform each raw RawTrade into a Trade", () => {
      whenStream("blotter", "getTradesStream", {}, of(mockTrades))
      const { result } = renderUseTrades()

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
      const mockStream = new BehaviorSubject(mockTrades)
      whenStream("blotter", "getTradesStream", {}, mockStream)

      const { result } = renderUseTrades()

      expect(result.current.length).toBe(3)

      act(() => {
        mockStream.next({
          Trades: [
            {
              ...mockTrades.Trades.find((trade) => trade.TradeId === 2),
              Status: TradeStatus.Done,
            },
          ] as any,
        })
      })

      expect(result.current.length).toBe(3)
      expect(result.current.filter((trade) => trade.tradeId === 2).length).toBe(
        1,
      )
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
      whenStream("blotter", "getTradesStream", {}, of(mockTrades))
      const { result } = renderUseTrades()

      for (
        let i = 0, j = mockTrades.Trades.length - 1;
        i < mockTrades.Trades.length;
        i++, j--
      ) {
        expect(result.current[j].tradeId).toBe(mockTrades.Trades[i].TradeId)
      }
    })
  })
})
