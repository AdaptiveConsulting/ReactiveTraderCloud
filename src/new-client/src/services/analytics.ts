import { bind, shareLatest } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { CamelCase } from "services/utils"
import { getStream$ } from "./client"

interface CurrencyPairPositionRaw {
  Symbol: string
  BasePnl: number
  BaseTradedAmount: number
  CounterTradedAmount: number
}

export interface CurrencyPairPosition
  extends CamelCase<CurrencyPairPositionRaw> {
  basePnlName: "basePnl"
  baseTradedAmountName: "baseTradedAmount"
}

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
  "getAnalytics",
  "USD",
).pipe(shareLatest())

export const history$: Observable<HistoryEntry[]> = analytics$.pipe(
  map((analitics) =>
    analitics.History.filter(Boolean).map(({ Timestamp, UsdPnl }) => ({
      usPnl: UsdPnl,
      timestamp: new Date(Timestamp).getTime(),
    })),
  ),
  shareLatest(),
)

export const [useCurrentPositions, currentPositions$] = bind<
  Record<string, CurrencyPairPosition>
>(
  analytics$.pipe(
    map((analitics) =>
      Object.fromEntries(
        analitics.CurrentPositions.map(
          ({ Symbol, BasePnl, BaseTradedAmount, CounterTradedAmount }) => [
            Symbol,
            {
              symbol: Symbol,
              basePnl: BasePnl,
              baseTradedAmount: BaseTradedAmount,
              counterTradedAmount: CounterTradedAmount,
              basePnlName: "basePnl",
              baseTradedAmountName: "baseTradedAmount",
            },
          ],
        ),
      ),
    ),
  ),
)
