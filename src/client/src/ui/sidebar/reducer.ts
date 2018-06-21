import { ACTION_TYPES, SidebarRegionActions } from './actions'

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
