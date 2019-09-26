import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap, filter } from 'rxjs/operators'
import { ApplicationEpic, GlobalState } from 'StoreTypes'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'
import { CurrencyPairPosition, CurrencyPairPositionWithPrice } from '../../../../../rt-types'

const { fetchAnalytics } = AnalyticsActions
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

export const publishPositionToExcelEpic: ApplicationEpic = (action$, state$, { excelApp }) =>
  action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    filter(() => excelApp.isOpen()),
    tap((action: FetchAnalyticsAction) => {
      const currentPositions = combineWithLatestPrices(
        action.payload.currentPositions,
        state$.value,
      )
      excelApp.publishPositions(currentPositions)
    }),
    ignoreElements(),
  )

function combineWithLatestPrices(
  positions: CurrencyPairPosition[],
  globalState: GlobalState,
): CurrencyPairPositionWithPrice[] {
  return positions.map(position => {
    const tileData = globalState.spotTilesData[position.symbol]
    return {
      ...position,
      latestAsk: tileData && tileData.price.ask ? tileData.price.ask : null,
      latestBid: tileData && tileData.price.bid ? tileData.price.bid : null,
    }
  })
}
