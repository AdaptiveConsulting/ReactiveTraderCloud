import { Observable } from 'rxjs/Observable';
import { createAction } from 'redux-actions';

import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations';

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE'
}

const CURRENCY: string = 'USD';

export const fetchAnalytics = createAction(ACTION_TYPES.ANALYTICS_SERVICE)

export const analyticsServiceEpic = analyticsService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .mergeMapTo(Observable.merge(analyticsService$.getAnalyticsStream(CURRENCY)))
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
