import { action, ActionUnion } from 'rt-util'
import { PositionUpdates } from './model/positionUpdates'

export enum ANALYTICS_ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE',
  SUBCRIBE_TO_ANALYTICS = '@ReactiveTraderCloud/SUBSRCIBE_TO_ANALYTICS'
}

export const AnalyticsActions = {
  fetchAnalytics: action<ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE, PositionUpdates>(
    ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE
  ),
  subcribeToAnalytics: action(ANALYTICS_ACTION_TYPES.SUBCRIBE_TO_ANALYTICS)
}

export type AnalyticsActions = ActionUnion<typeof AnalyticsActions>
