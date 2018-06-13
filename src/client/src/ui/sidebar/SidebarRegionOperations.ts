import { handleActions } from 'redux-actions'
import { action, ActionUnion } from '../../ActionHelper'

export enum ACTION_TYPES {
  TOGGLE_ANALYTICS = '@ReactiveTraderCloud/TOGGLE_ANALYTICS'
}

export const SidebarRegionActions = {
  toggleAnalytics: action<typeof ACTION_TYPES.TOGGLE_ANALYTICS>(ACTION_TYPES.TOGGLE_ANALYTICS)
}

export type SidebarRegionActions = ActionUnion<typeof SidebarRegionActions>

const INITIAL_STATE = true

export default handleActions(
  {
    [ACTION_TYPES.TOGGLE_ANALYTICS]: state => !state
  },
  INITIAL_STATE
)
