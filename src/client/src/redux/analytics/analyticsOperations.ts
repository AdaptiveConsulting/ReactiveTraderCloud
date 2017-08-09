import { Observable } from 'rxjs/Observable';
import { createAction } from 'redux-actions';

import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations';

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE'
}

const CURRENCY: string = 'USD';

export const fetchAnalytics = createAction(ACTION_TYPES.ANALYTICS_SERVICE)

const getAnalyticsStream = (analyticsService$: any) => {
  return Observable.from(CURRENCY)
    .mergeMap(currency => analyticsService$.getAnalyticsStream(CURRENCY))
}

export const analyticsServiceEpic = analyticsService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .mergeMapTo(getAnalyticsStream(analyticsService$))
    .map(fetchAnalytics)
}

export const analyticsServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.ANALYTICS_SERVICE:
      return action.payload
    default:
      return state
  }
}
