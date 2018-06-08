import { createAction } from 'redux-actions'
import { DISCONNECT_SERVICES } from '../../../connectionActions'

export const ACTION_TYPES = {
  REGION_ADD: '@ReactiveTraderCloud/REGION_ADD',
  REGION_OPEN_WINDOW: '@ReactiveTraderCloud/REGION_OPEN_WINDOW',
  REGION_TEAROFF_WINDOW: '@ReactiveTraderCloud/REGION_TEAROFF_WINDOW',
  REGION_ATTACH_WINDOW: '@ReactiveTraderCloud/REGION_ATTACH_WINDOW'
}

// onPopoutClick
export const openWindow = createAction(ACTION_TYPES.REGION_OPEN_WINDOW, payload => ({ ...payload }))
// onComponentMount
export const addRegion = createAction(ACTION_TYPES.REGION_ADD, payload => payload)

const changeRegionTearOffStatus = (state, payload, status) => ({
  ...state,
  [payload.id]: {
    ...state[payload.id],
    isTearedOff: status
  }
})

export const regionsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      const newRegion = action.payload
      return {
        [newRegion.id]: newRegion,
        ...state
      }
    case ACTION_TYPES.REGION_ATTACH_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, false)
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, true)
    case DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}
