import { shareLatest } from "@react-rxjs/core"
import { getDataPoints, withScales } from "client/utils/historicalChart"
import { pipe } from "rxjs"
import { map } from "rxjs/operators"
import { history$, HistoryEntry } from "services/analytics"

import { LINE_CHART_HEIGHT, TOTAL_WIDTH, Y_LEGENDS_WIDTH } from "./constants"

export const dataPoints$ = history$.pipe(
  map(
    pipe(
      getDataPoints((entry: HistoryEntry) => [
        new Date(entry.timestamp),
        entry.usPnl,
      ]),
      withScales([Y_LEGENDS_WIDTH, TOTAL_WIDTH], [0, LINE_CHART_HEIGHT]),
    ),
  ),
  shareLatest(),
)
