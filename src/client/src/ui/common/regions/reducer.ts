import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../../operations/connectionStatus'
import { ACTION_TYPES, Region, RegionActions } from './actions'

export interface RegionsState {
  [regionId: string]: Region
}

const INITIAL_STATE: RegionsState = {}

export const regionsReducer = (
  state: RegionsState = INITIAL_STATE,
  action: RegionActions | DisconnectAction
): RegionsState => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
    case ACTION_TYPES.REGION_ATTACH_WINDOW:
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return { ...state, [action.payload.id]: regionReducer(state[action.payload.id], action) }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

const REGION_INITIAL_STATE = {
  id: '',
  isTearedOff: false,
  container: null,
  settings: null
}

const regionReducer = (state: Region = REGION_INITIAL_STATE, action: RegionActions): Region => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      return { ...action.payload, ...state }
    case ACTION_TYPES.REGION_ATTACH_WINDOW:
      return {
        ...state,
        isTearedOff: false
      }
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return {
        ...state,
        isTearedOff: true
      }
    default:
      return state
  }
}
