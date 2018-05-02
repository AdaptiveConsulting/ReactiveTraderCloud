import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceDataOperations'
import { fetchAnalytics } from './actions'

const CURRENCY: string = 'USD'

export const analyticsServiceEpic = (analyticsService$, openFin) => action$ => {
  return action$
    .ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(analyticsService$.getAnalyticsStream(CURRENCY))
    .do(action => openFin.publishCurrentPositions(action.currentPositions))
    .map(fetchAnalytics)
}

export default analyticsServiceEpic
