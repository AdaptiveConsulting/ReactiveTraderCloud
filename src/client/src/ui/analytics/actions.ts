import { action, ActionUnion } from '../../ActionHelper'
import { PositionUpdates } from './model/positionUpdates'

export enum ACTION_TYPES {
  ANALYTICS_SERVICE = '@ReactiveTraderCloud/ANALYTICS_SERVICE'
}

export const AnalyticsActions = {
  fetchAnalytics: action<ACTION_TYPES.ANALYTICS_SERVICE, PositionUpdates>(ACTION_TYPES.ANALYTICS_SERVICE)
}

export type AnalyticsActions = ActionUnion<typeof AnalyticsActions>
