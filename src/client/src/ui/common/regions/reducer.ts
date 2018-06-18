import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../../operations/connectionStatus'
import { ACTION_TYPES, Region, RegionActions } from './actions'

const changeRegionTearOffStatus = (state: RegionState, payload: Region, status: boolean) => ({
  ...state,
  [payload.id]: {
    ...state[payload.id],
    isTearedOff: status
  }
})

interface RegionState {
  [regionId: string]: Region
}

const initialState: RegionState = {}

export const regionsReducer = (state: RegionState = {}, action: RegionActions | DisconnectAction): RegionState => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      return {
        [action.payload.id]: action.payload,
        ...state
      }
    case ACTION_TYPES.REGION_ATTACH_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, false)
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, true)
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return initialState
    default:
      return state
  }
}
