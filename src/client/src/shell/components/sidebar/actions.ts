import { action, ActionUnion } from 'rt-util'

export enum SIDEBAR_ACTION_TYPES {
  TOGGLE_ANALYTICS = '@ReactiveTraderCloud/TOGGLE_ANALYTICS'
}

export const SidebarRegionActions = {
  toggleAnalytics: action<SIDEBAR_ACTION_TYPES.TOGGLE_ANALYTICS>(SIDEBAR_ACTION_TYPES.TOGGLE_ANALYTICS)
}

export type SidebarRegionActions = ActionUnion<typeof SidebarRegionActions>
