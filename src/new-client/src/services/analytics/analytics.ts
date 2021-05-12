import { AnalyticsService } from "@/generated/TradingGateway"
import { bind, shareLatest } from "@react-rxjs/core"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"
import { CurrencyPairPosition, HistoryEntry } from "./types"

export const analytics$ = AnalyticsService.getAnalytics({
  currency: "USD",
}).pipe(shareLatest())

export const history$: Observable<HistoryEntry[]> = analytics$.pipe(
  map((analitics) =>
    analitics.history.filter(Boolean).map((data) => ({
      usPnl: data.usdPnl,
      timestamp: new Date(data.timestamp).getTime(), // TODO: talk with hydra team about this
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
        analitics.currentPositions.map((data) => [data.symbol, data]),
      ),
    ),
  ),
)
