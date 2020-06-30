import { excelApp } from 'apps/MainRoute/store/singleServices'
import { CurrencyPairPosition, CurrencyPairPositionWithPrice } from 'rt-types'
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { analyticsService$ } from '../analyticsService'

// TODO get the prices in
const rawPositions$ = analyticsService$.pipe(
  map(analytics => analytics.currentPositions),
  map(positions => combineWithLatestPrices(positions, 2, 2))
)

combineLatest(rawPositions$, excelApp).subscribe({
  next([currentPositions, excel]) {
    excel.publishPositions(currentPositions)
  },
})

function combineWithLatestPrices(
  positions: CurrencyPairPosition[],
  latestAsk: number,
  latestBid: number
): CurrencyPairPositionWithPrice[] {
  return positions.map(position => {
    return {
      ...position,
      latestAsk,
      latestBid,
    }
  })
}
