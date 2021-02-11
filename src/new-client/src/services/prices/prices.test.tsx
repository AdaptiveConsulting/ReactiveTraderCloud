import { whenRpc, whenStream, reset } from "utils/mockClient"

import {
  getPrice$,
  usePrice,
  getHistoricalPrices$,
  useHistoricalPrices,
} from "./prices"
import { PriceMovementType, RawPrice, Price, HistoryPrice } from "./types"
import { BehaviorSubject, Subject } from "rxjs"
import { act as reactAct } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { Subscribe } from "@react-rxjs/core"

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

const mockSource = {
  a: {
    Symbol: "EURCAD",
    Bid: 1.53816,
    Ask: 1.53834,
    Mid: 1.53825,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  } as RawPrice,
  b: {
    Symbol: "EURCAD",
    Bid: 1.53836,
    Ask: 1.53844,
    Mid: 1.5384,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  } as RawPrice,
  c: {
    Symbol: "EURCAD",
    Bid: 1.53805,
    Ask: 1.53811,
    Mid: 1.53808,
    CreationTimestamp: 5318479648168,
    ValueDate: "2021-02-10T19:10:28.4919591+00:00",
  } as RawPrice,
}

const mockResult = {
  a: {
    ask: 1.53834,
    bid: 1.53816,
    creationTimestamp: 5318479648168,
    mid: 1.53825,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.NONE,
  } as Price,
  b: {
    ask: 1.53844,
    bid: 1.53836,
    creationTimestamp: 5318479648168,
    mid: 1.5384,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.UP,
  } as Price,
  c: {
    ask: 1.53811,
    bid: 1.53805,
    creationTimestamp: 5318479648168,
    mid: 1.53808,
    symbol: "EURCAD",
    valueDate: "2021-02-10T19:10:28.4919591+00:00",
    movementType: PriceMovementType.DOWN,
  } as Price,
}
const mockHistorySource = {
  a: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:12:28.4919591+00:00",
    },
  ] as HistoryPrice[],
}

const mockHistoryResult = {
  a: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:12:28.4919591+00:00",
    },
  ] as HistoryPrice[],
  b: [
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:10:28.4919591+00:00",
    },
    {
      ask: 1.53844,
      bid: 1.53836,
      creationTimestamp: 5318479648168,
      mid: 1.5384,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:11:28.4919591+00:00",
    },
    {
      ask: 1.53811,
      bid: 1.53805,
      creationTimestamp: 5318479648168,
      mid: 1.53808,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:12:28.4919591+00:00",
    },
    {
      ask: 1.53834,
      bid: 1.53816,
      creationTimestamp: 5318479648168,
      mid: 1.53825,
      symbol: "EURCAD",
      valueDate: "2021-02-10T19:10:28.4919591+00:00",
      movementType: PriceMovementType.NONE,
    },
  ] as HistoryPrice[],
}

const sampleSymbol = "EURCAD"

const renderUsePrice = (sampleSymbol: string) => {
  return renderHook(() => usePrice(sampleSymbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getPrice$(sampleSymbol)}>{children}</Subscribe>
    ),
  })
}

const renderUseHistoricalPrices = (sampleSymbol: string) => {
  return renderHook(() => useHistoricalPrices(sampleSymbol), {
    wrapper: ({ children }) => (
      <Subscribe source$={getHistoricalPrices$(sampleSymbol)}>
        {children}
      </Subscribe>
    ),
  })
}

describe("services/prices", () => {
  describe("usePrice", () => {
    beforeEach(() => {
      reset()
    })
    it("returns an initial Price", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )

      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)
    })
    it("returns a price indicating price increase", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )
      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)

      reactAct(() => {
        mockStream.next(mockSource.b)
      })
      expect(result.current).toEqual(mockResult.b)
    })
    it("returns a price indicating price drop", () => {
      const mockStream = new BehaviorSubject(mockSource.a)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        mockStream,
      )
      const { result } = renderUsePrice(sampleSymbol)

      expect(result.current).toEqual(mockResult.a)

      reactAct(() => {
        mockStream.next(mockSource.c)
      })
      expect(result.current).toEqual(mockResult.c)
    })
  })
  describe("useHistoricalPrices", () => {
    beforeEach(() => {
      reset()
    })

    it("returns historical prices at beginning", async () => {
      const mockHistory$ = new BehaviorSubject(mockHistorySource.a)
      const priceUpdates$ = new Subject<RawPrice>()
      whenRpc("priceHistory", "getPriceHistory", sampleSymbol, mockHistory$)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        priceUpdates$,
      )

      const { result } = renderUseHistoricalPrices(sampleSymbol)

      await reactAct(async () => {
        await wait(10)
      })

      expect(result.current).toEqual(mockHistoryResult.a)
    })

    it("returns new price concat historical price after new price comes", async () => {
      const mockHistory$ = new BehaviorSubject(mockHistorySource.a)
      const priceUpdates$ = new Subject<RawPrice>()
      whenRpc("priceHistory", "getPriceHistory", sampleSymbol, mockHistory$)
      whenStream(
        "pricing",
        "getPriceUpdates",
        { symbol: sampleSymbol },
        priceUpdates$,
      )

      const { result } = renderUseHistoricalPrices(sampleSymbol)

      await reactAct(async () => {
        await wait(10)
      })

      expect(result.current).toEqual(mockHistoryResult.a)

      await reactAct(async () => {
        mockHistory$.complete()
        priceUpdates$.next(mockSource.a)
        await wait(10)
      })
      expect(result.current).toEqual(mockHistoryResult.b)
    })
  })
})
