import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, mergeMapTo, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../operations/connectionStatus'
import { ACTION_TYPES as REF_ACTION_TYPES, ReferenceActions } from '../../operations/referenceData'
import { AnalyticsActions } from './actions'

const CURRENCY: string = 'USD'

const { fetchAnalytics } = AnalyticsActions
const { createReferenceServiceAction } = ReferenceActions
type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>
type FetchAnalyticsAction = ReturnType<typeof fetchAnalytics>

export const analyticsServiceEpic: ApplicationEpic = (action$, state$, { analyticsService }) =>
  action$.pipe(
    ofType<Action, ReferenceServiceAction>(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo<FetchAnalyticsAction>(
      analyticsService.getAnalyticsStream(CURRENCY).pipe(
        map(fetchAnalytics),
        takeUntil(action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)))
      )
    )
  )

export default analyticsServiceEpic
