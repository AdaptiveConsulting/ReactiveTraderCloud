import { shareLatest } from "@react-rxjs/core"
import { map } from "rxjs/operators"
import { history$ } from "services/analytics"

export const dataPoints$ = history$.pipe(
  map((historical) => {
    const points = historical.map(
      (entry) => [new Date(entry.timestamp), entry.usPnl] as [Date, number],
    )
    const xRange = [points[0][0], points[points.length - 1][0]] as const

    const yValues = points.map(([, y]) => y)
    const yRange = [Math.max(...yValues), Math.min(...yValues)] as const
    return { points, xRange, yRange }
  }),
  shareLatest(),
)
