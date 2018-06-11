import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { map, mergeMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as REF_ACTION_TYPES, createReferenceServiceAction } from '../../referenceDataOperations'
import { PositionUpdates } from '../../types'
import { DISCONNECT_SERVICES, DisconnectAction } from './../../connectionActions'
import { AnalyticsActions } from './actions'

const CURRENCY: string = 'USD'

type ReferenceServiceAction = ReturnType<typeof createReferenceServiceAction>
type FetchAnalyticsAction = ReturnType<typeof AnalyticsActions.fetchAnalytics>

export const analyticsServiceEpic: ApplicationEpic = (action$, state$, { analyticsService, openFin }) =>
  action$.pipe(
    ofType<Action, ReferenceServiceAction>(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo<FetchAnalyticsAction>(
      analyticsService.getAnalyticsStream(CURRENCY).pipe(
        tap((positionUpdates: PositionUpdates) => openFin.publishCurrentPositions(positionUpdates.currentPositions)),
        map<PositionUpdates, FetchAnalyticsAction>(AnalyticsActions.fetchAnalytics),
        takeUntil<FetchAnalyticsAction>(action$.pipe(ofType<Action, DisconnectAction>(DISCONNECT_SERVICES)))
      )
    )
  )

export default analyticsServiceEpic
