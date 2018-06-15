import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, mergeMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../operations/connectionStatus'
import { ACTION_TYPES as REF_ACTION_TYPES, createReferenceServiceAction } from '../../referenceDataOperations'
import { AnalyticsActions } from './actions'

const CURRENCY: string = 'USD'

type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>
type FetchAnalyticsAction = ReturnType<typeof AnalyticsActions.fetchAnalytics>

export const analyticsServiceEpic: ApplicationEpic = (action$, state$, { analyticsService }) =>
  action$.pipe(
    ofType<Action, ReferenceServiceAction>(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo(
      analyticsService.getAnalyticsStream(CURRENCY).pipe(
        map(AnalyticsActions.fetchAnalytics),
        takeUntil<FetchAnalyticsAction>(
          action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES))
        )
      )
    )
  )

export default analyticsServiceEpic
