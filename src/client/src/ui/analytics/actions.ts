import { createAction } from 'redux-actions'

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE',
}

export const fetchAnalytics = createAction(ACTION_TYPES.ANALYTICS_SERVICE)
