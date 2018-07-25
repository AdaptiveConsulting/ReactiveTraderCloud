import { Region, REGION_ACTION_TYPES, RegionActions } from 'rt-actions'

export interface RegionsState {
  [regionId: string]: Region
}

const INITIAL_STATE: RegionsState = {}

export const regionsReducer = (state: RegionsState = INITIAL_STATE, action: RegionActions): RegionsState => {
  switch (action.type) {
    case REGION_ACTION_TYPES.REGION_ADD:
    case REGION_ACTION_TYPES.REGION_ATTACH_WINDOW:
    case REGION_ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return {
        ...state,
        [action.payload.id]: regionReducer(state[action.payload.id], action)
      }
    default:
      return state
  }
}

const REGION_INITIAL_STATE = {
  id: '',
  isTearedOff: false
}

const regionReducer = (state: Region = REGION_INITIAL_STATE, action: RegionActions): Region => {
  switch (action.type) {
    case REGION_ACTION_TYPES.REGION_ADD:
      return { ...action.payload, ...state }
    case REGION_ACTION_TYPES.REGION_ATTACH_WINDOW:
      return { ...state, isTearedOff: false }
    case REGION_ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return { ...state, isTearedOff: true }
    default:
      return state
  }
}
