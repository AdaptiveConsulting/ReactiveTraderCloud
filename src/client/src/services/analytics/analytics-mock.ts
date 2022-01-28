import { bind, shareLatest } from "@react-rxjs/core"
import { combineLatest, NEVER, Observable, of } from "rxjs"
import { map } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { CurrencyPairPosition, HistoryEntry } from "./types"

export const analytics$ = NEVER

export const history$: Observable<HistoryEntry[]> = new Observable<
  HistoryEntry[]
>((observer) => {
  let currentPrice = Math.random() * 10_000 - 5_000
  let currentTime = Date.now()

  let result: HistoryEntry[] = []

  while (result.length < 90) {
    result.unshift({
      usPnl: currentPrice,
      timestamp: currentTime,
    })
    currentPrice *= 1 + (Math.random() - 0.5) / 100
    currentTime -= 10_000
  }

  observer.next(result)

  const token = setInterval(() => {
    currentPrice *= 1 + (Math.random() - 0.5) / 100
    result = [
      ...result.slice(1),
      { usPnl: currentPrice, timestamp: Date.now() },
    ]
    observer.next(result)
  }, 10_000)

  return () => {
    clearInterval(token)
  }
}).pipe(shareLatest())

export const [useCurrentPositions, currentPositions$] = bind<
  Record<string, CurrencyPairPosition>
>(
  of(
    JSON.parse(`
{
  "NZDUSD": {
    "symbol": "NZDUSD",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  },
  "USDJPY": {
    "symbol": "USDJPY",
    "basePnl": 1382.312284932821,
    "baseTradedAmount": -1000000,
    "counterTradedAmount": 102144000
  },
  "GBPJPY": {
    "symbol": "GBPJPY",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  },
  "EURJPY": {
    "symbol": "EURJPY",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  },
  "EURCAD": {
    "symbol": "EURCAD",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  },
  "EURUSD": {
    "symbol": "EURUSD",
    "basePnl": 564.9717514123768,
    "baseTradedAmount": -2000000,
    "counterTradedAmount": 2726570
  },
  "EURAUD": {
    "symbol": "EURAUD",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  },
  "GBPUSD": {
    "symbol": "GBPUSD",
    "basePnl": -1656.8191508800955,
    "baseTradedAmount": -1000000,
    "counterTradedAmount": 1638980
  },
  "AUDUSD": {
    "symbol": "AUDUSD",
    "basePnl": 0,
    "baseTradedAmount": 0,
    "counterTradedAmount": 0
  }
}
            `),
  ),
)

export const isAnalyticsDataStale$ = combineLatest([
  withIsStaleData(currentPositions$),
  withIsStaleData(history$),
]).pipe(map(([current, historyPos]) => current || historyPos))
