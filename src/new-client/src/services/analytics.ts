import { bind, shareLatest } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { CamelCase } from "services/utils"
import { getStream$ } from "./client"

interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
  CounterTradedAmount: number
}
export type CurrencyPairPosition = CamelCase<CurrencyPairPositionRaw>

interface HistoryRaw {
  Timestamp: string
  UsdPnl: number
}
export interface HistoryEntry {
  timestamp: number
  usPnl: number
}

interface PositionsRaw {
  CurrentPositions: CurrencyPairPositionRaw[]
  History: HistoryRaw[]
}

const analytics$ = getStream$<PositionsRaw, string>(
  "analytics",
  "getAnalitics",
  "USD",
).pipe(shareLatest())

export const [useHistory, history$] = bind<HistoryEntry[]>(
  analytics$.pipe(
    map((analitics) =>
      analitics.History.filter(Boolean).map(({ Timestamp, UsdPnl }) => ({
        usPnl: UsdPnl,
        timestamp: new Date(Timestamp).getTime(),
      })),
    ),
  ),
)

export const [useCurrentPositions, currentPositions$] = bind<
  CurrencyPairPosition[]
>(
  analytics$.pipe(
    map((analitics) =>
      analitics.CurrentPositions.map(
        ({ Symbol, BasePnl, BaseTradedAmount, CounterTradedAmount }) => ({
          symbol: Symbol,
          basePnl: BasePnl,
          baseTradedAmount: BaseTradedAmount,
          counterTradedAmount: CounterTradedAmount,
        }),
      ),
    ),
  ),
)
