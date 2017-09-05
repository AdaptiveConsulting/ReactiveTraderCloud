import { createAction, handleActions } from 'redux-actions'

import { ACTION_TYPES as REF_ACTION_TYPES } from '../../redux/reference/referenceOperations'
import { regionsSettings } from '../../redux/regions/regionsOperations'

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE',
}

const INITIAL_STATE = {}

const CURRENCY: string = 'USD'

export const fetchAnalytics = createAction(ACTION_TYPES.ANALYTICS_SERVICE)

export const analyticsServiceEpic = analyticsService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(analyticsService$.getAnalyticsStream(CURRENCY))
    .map(fetchAnalytics)
}

export const analyticsRegionSettings = regionsSettings('Analytics', 400, 800, false)

export default handleActions({
  [ACTION_TYPES.ANALYTICS_SERVICE]: (state, action) => action.payload,
},                           INITIAL_STATE)
