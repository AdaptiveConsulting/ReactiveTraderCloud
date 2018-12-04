import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'

const { fetchAnalytics } = AnalyticsActions
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

export const publishPositionUpdateEpic: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    tap((action: FetchAnalyticsAction) => {
      const currentPositions = action.payload.currentPositions
      platform.interop!.excel.publish('position-update', currentPositions)
    }),
    ignoreElements(),
  )
