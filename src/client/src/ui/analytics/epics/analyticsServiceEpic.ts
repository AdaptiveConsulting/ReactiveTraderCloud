import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'
import { CurrencyPairPosition } from '../model/currencyPairPosition'

const { fetchAnalytics } = AnalyticsActions
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

const mapToDto = (ccyPairPosition: CurrencyPairPosition) => ({
  symbol: ccyPairPosition.symbol,
  basePnl: ccyPairPosition.basePnl,
  baseTradedAmount: ccyPairPosition.baseTradedAmount
})

export const connectAnalyticsServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    tap((action: FetchAnalyticsAction) => {
      const currentPositions = action.payload.currentPositions.map(p => mapToDto(p))
      openFin.publishCurrentPositions(currentPositions)
    }),
    ignoreElements()
  )
