import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic, GlobalState } from 'StoreTypes'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'
import { EMPTY } from 'rxjs'
import { CurrencyPairPosition } from 'rt-types'

const { fetchAnalytics } = AnalyticsActions
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

export const publishPositionUpdateEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platform.hasFeature('excel')) {
    return EMPTY
  }
  return action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    tap((action: FetchAnalyticsAction) => {
      if (platform.excel.isOpen()) {
        const currentPositions = combineWithLatestPrices(
          action.payload.currentPositions,
          state$.value,
        )
        platform.excel.publishPositions(currentPositions)
      }
    }),
    ignoreElements(),
  )
}

function combineWithLatestPrices(positions: CurrencyPairPosition[], globalState: GlobalState) {
  return positions.map(position => {
    const tileData = globalState.spotTilesData[position.symbol]
    return {
      ...position,
      latestAsk: tileData && tileData.price.ask ? tileData.price.ask : null,
      latestBid: tileData && tileData.price.bid ? tileData.price.bid : null,
    }
  })
}
