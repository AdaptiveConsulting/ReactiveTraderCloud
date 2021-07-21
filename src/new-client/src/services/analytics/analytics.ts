import { AnalyticsService } from "@/generated/TradingGateway"
import { bind, shareLatest } from "@react-rxjs/core"
import { combineLatest, Observable } from "rxjs"
import { filter, map } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { withConnection } from "../withConnection"
import { CurrencyPairPosition, HistoryEntry } from "./types"

export const analytics$ = AnalyticsService.getAnalytics({
  currency: "USD",
}).pipe(withConnection(), shareLatest())

export const history$: Observable<HistoryEntry[]> = analytics$.pipe(
  filter((analytics) => analytics.history.length > 0),
  map((analytics) =>
    analytics.history.filter(Boolean).map((data) => ({
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
    filter((analytics) => analytics.currentPositions.length > 0),
    map((analytics) =>
      Object.fromEntries(
        analytics.currentPositions.map((data) => [data.symbol, data]),
      ),
    ),
  ),
)

export const isAnalyticsDataStale$ = combineLatest([
  withIsStaleData(currentPositions$),
  withIsStaleData(history$),
]).pipe(map(([current, historyPos]) => current || historyPos))
