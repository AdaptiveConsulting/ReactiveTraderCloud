import { action, ActionUnion } from '../../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_ANALYTICS = '@ReactiveTraderCloud/TOGGLE_ANALYTICS'
}

export const SidebarRegionActions = {
  toggleAnalytics: action<ACTION_TYPES.TOGGLE_ANALYTICS>(ACTION_TYPES.TOGGLE_ANALYTICS)
}

export type SidebarRegionActions = ActionUnion<typeof SidebarRegionActions>
