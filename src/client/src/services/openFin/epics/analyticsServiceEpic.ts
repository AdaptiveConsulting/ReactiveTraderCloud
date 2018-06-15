import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { ignoreElements, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES as ANALYTICS_ACTION_TYPES, AnalyticsActions } from '../../../ui/analytics'

type FetchAnalyticsAction = ReturnType<typeof AnalyticsActions.fetchAnalytics>

export const connectAnalyticsServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, FetchAnalyticsAction>(ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE),
    tap((action: FetchAnalyticsAction) => openFin.publishCurrentPositions(action.payload.currentPositions)),
    ignoreElements()
  )
