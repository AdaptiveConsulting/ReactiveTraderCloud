import { action, ActionUnion } from '../../ActionHelper'
import { PositionUpdates } from './model/positionUpdates'

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE',
  SUBCRIBE_TO_ANALYTICS = '@ReactiveTraderCloud/SUBSRCIBE_TO_ANALYTICS'
}

export const AnalyticsActions = {
  fetchAnalytics: action<ACTION_TYPES.ANALYTICS_SERVICE, PositionUpdates>(ACTION_TYPES.ANALYTICS_SERVICE),
  subcribeToAnalytics: action(ACTION_TYPES.SUBCRIBE_TO_ANALYTICS)
}

export type AnalyticsActions = ActionUnion<typeof AnalyticsActions>
