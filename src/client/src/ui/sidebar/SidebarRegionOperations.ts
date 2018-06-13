import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_ANALYTICS = '@ReactiveTraderCloud/TOGGLE_ANALYTICS'
}

export const SidebarRegionActions = {
  toggleAnalytics: action<typeof ACTION_TYPES.TOGGLE_ANALYTICS>(ACTION_TYPES.TOGGLE_ANALYTICS)
}

export type SidebarRegionActions = ActionUnion<typeof SidebarRegionActions>

export type SidebarRegionState = boolean

const initialState: SidebarRegionState = true

export const sidebarRegionReducer = (
  state: SidebarRegionState = initialState,
  action: SidebarRegionActions
): SidebarRegionState => {
  switch (action.type) {
    case ACTION_TYPES.TOGGLE_ANALYTICS:
      return !state
    default:
      return state
  }
}
