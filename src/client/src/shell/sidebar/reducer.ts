import { SIDEBAR_ACTION_TYPES, SidebarRegionActions } from './actions'

export type SidebarRegionState = boolean

const INITIAL_STATE: SidebarRegionState = true

export const sidebarRegionReducer = (
  state: SidebarRegionState = INITIAL_STATE,
  action: SidebarRegionActions
): SidebarRegionState => {
  switch (action.type) {
    case SIDEBAR_ACTION_TYPES.TOGGLE_ANALYTICS:
      return !state
    default:
      return state
  }
}
