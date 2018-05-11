import { ofType } from 'redux-observable'
import { map, mergeMapTo, tap } from 'rxjs/operators'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { AnalyticsService } from '../../services'
import { OpenFin } from '../../services/openFin'
import { PositionUpdates } from '../../types'
import { fetchAnalytics } from './actions'

const CURRENCY: string = 'USD'

export const analyticsServiceEpic = (
  analyticsService$: AnalyticsService,
  openFin: OpenFin
) => action$ => {
  return action$.pipe(
    ofType(REF_ACTION_TYPES.REFERENCE_SERVICE),
    mergeMapTo(analyticsService$.getAnalyticsStream(CURRENCY)),
    tap((action: PositionUpdates) =>
      openFin.publishCurrentPositions(action.currentPositions)
    ),
    map(fetchAnalytics)
  )
}

export default analyticsServiceEpic
