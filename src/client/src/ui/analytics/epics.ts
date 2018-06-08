import { ofType } from 'redux-observable'
import { map, mergeMapTo, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { PositionUpdates } from '../../types'
import { DISCONNECT_SERVICES } from './../../connectionActions'
import { AnalyticsActions } from './actions'

const CURRENCY: string = 'USD'

export const analyticsServiceEpic: ApplicationEpic = (action$, store, { analyticsService, openFin }) => {
  return action$.pipe(
    ofType(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo(
      analyticsService.getAnalyticsStream(CURRENCY).pipe(
        tap((action: PositionUpdates) => openFin.publishCurrentPositions(action.currentPositions)),
        map(AnalyticsActions.fetchAnalytics),
        takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
      )
    )
  )
}
export default analyticsServiceEpic
