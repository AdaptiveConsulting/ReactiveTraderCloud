import { ofType } from 'redux-observable'
import { map, mergeMapTo, takeUntil, tap } from 'rxjs/operators'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { AnalyticsService } from '../../services'
import { OpenFin } from '../../services/openFin'
import { PositionUpdates } from '../../types'
import { DISCONNECT_SERVICES } from './../../connectionActions'
import { fetchAnalytics } from './actions'

const CURRENCY: string = 'USD'

export const analyticsServiceEpic = (
  analyticsService$: AnalyticsService,
  openFin: OpenFin
) => action$ => {
  return action$.pipe(
    ofType(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo(
      analyticsService$
        .getAnalyticsStream(CURRENCY)
        .pipe(
          tap((action: PositionUpdates) =>
            openFin.publishCurrentPositions(action.currentPositions)
          ),
          map(fetchAnalytics),
          takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
        )
    )
  )
}

export default analyticsServiceEpic
