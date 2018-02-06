import { createAction, handleActions } from 'redux-actions'

import { ACTION_TYPES as REF_ACTION_TYPES } from '../../redux/actions/referenceDataActions'
import { regionsSettings } from '../../regions/regionsOperations'

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE',
}

const INITIAL_STATE = {}

const CURRENCY: string = 'USD'

export const fetchAnalytics = createAction(ACTION_TYPES.ANALYTICS_SERVICE)

export const analyticsServiceEpic = (analyticsService$, openFin) => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(analyticsService$.getAnalyticsStream(CURRENCY))
    .do(action => openFin.publishCurrentPositions(action.currentPositions))
    .map(fetchAnalytics)
}

export const analyticsRegionSettings = regionsSettings('Analytics', 400, 800, false)

export default handleActions({
  [ACTION_TYPES.ANALYTICS_SERVICE]: (state, action) => action.payload,
},                           INITIAL_STATE)
