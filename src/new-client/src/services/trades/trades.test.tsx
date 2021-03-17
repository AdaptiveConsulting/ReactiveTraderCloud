import { Subscribe } from "@react-rxjs/core"
import { whenStream, reset } from "@/utils/mockClient"
import { BehaviorSubject, of, Subject } from "rxjs"
import { render, screen, act as reactAct } from "@testing-library/react"
import { act, renderHook } from "@testing-library/react-hooks"
import { TradeStatus } from "./types"
import { useTrades, trades$ } from "./trades"
import { tradesTestData } from "./index"

const { mockRawTrades } = tradesTestData

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

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
        mockStream.next(mockRawTrades)
        await wait(20)
      })

      expect(screen.queryByText("There is data")).not.toBeNull()
    })

    it("should transform each raw RawTrade into a Trade", () => {
      whenStream("blotter", "getTradesStream", {}, of(mockRawTrades))
      const { result } = renderUseTrades()

      expect(
        result.current.find((trade) => trade.tradeId === 1111111111),
      ).toEqual({
        tradeId: 1111111111,
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
      expect(result.current.length).toBe(mockRawTrades.Trades.length)
    })

    it("should only include the last version of a trade", () => {
      const mockStream = new BehaviorSubject(mockRawTrades)
      whenStream("blotter", "getTradesStream", {}, mockStream)

      const { result } = renderUseTrades()

      expect(result.current.length).toBe(3)

      act(() => {
        mockStream.next({
          Trades: [
            {
              ...mockRawTrades.Trades.find(
                (trade) => trade.TradeId === 2222222222,
              ),
              Status: TradeStatus.Done,
            },
          ] as any,
        })
      })

      expect(result.current.length).toBe(3)
      expect(
        result.current.filter((trade) => trade.tradeId === 2222222222).length,
      ).toBe(1)
      expect(
        result.current.find((trade) => trade.tradeId === 2222222222),
      ).toEqual({
        tradeId: 2222222222,
        traderName: "LMO",
        symbol: "USDJPY",
        notional: 10_000_000,
        dealtCurrency: "USD",
        direction: "Buy",
        spotRate: 103.891,
        tradeDate: new Date("2021-01-13T17:32:26.7011799+00:00"),
        valueDate: new Date("2021-01-15T17:32:26.7012023+00:00"),
        status: "Done",
      })
    })

    it("should reverse sort trades", () => {
      whenStream("blotter", "getTradesStream", {}, of(mockRawTrades))
      const { result } = renderUseTrades()

      for (
        let i = 0, j = mockRawTrades.Trades.length - 1;
        i < mockRawTrades.Trades.length;
        i++, j--
      ) {
        expect(result.current[j].tradeId).toBe(mockRawTrades.Trades[i].TradeId)
      }
    })
  })
})
