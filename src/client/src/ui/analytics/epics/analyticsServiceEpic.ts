import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../actions'
import { InteropTopics } from 'rt-components'
import { EMPTY } from 'rxjs'

const { fetchAnalytics } = AnalyticsActions
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

export const publishPositionUpdateEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platform.hasFeature('excel')) {
    return EMPTY
  }
  return action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    tap((action: FetchAnalyticsAction) => {
      const currentPositions = action.payload.currentPositions
      platform.excel.publish(InteropTopics.Analytics, currentPositions)
    }),
    ignoreElements(),
  )
}
