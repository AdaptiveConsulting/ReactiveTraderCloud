import * as _ from 'lodash'

export const regionsSettings = (title, width, height, dockable) => {
  return {
    title,
    width,
    height,
    dockable,
  }
}

export const ACTION_TYPES = {
  REGION_ADD: '@ReactiveTraderCloud/REGION_ADD',
  REGION_OPEN_WINDOW: '@ReactiveTraderCloud/REGION_OPEN_WINDOW',
  REGION_TEAROFF_WINDOW: '@ReactiveTraderCloud/REGION_TEAROFF_WINDOW',
  REGION_ATTACH_WINDOW: '@ReactiveTraderCloud/REGION_ATTACH_WINDOW',
}

const changeRegionTearOffStatus = (state, payload, status) => {
  const regionId = payload.id
  const region = _.pick(state, [regionId])
  region[regionId].isTearedOff = status
  const cleanState = _.omit(state, [regionId])
  return {
    ...region,
    ...cleanState
  }
}

export const regionsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      const newRegion = action.payload
      return {
        [newRegion.id]: newRegion,
        ...state,
      }
    case ACTION_TYPES.REGION_ATTACH_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, false)
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      return changeRegionTearOffStatus(state, action.payload, true)
    default:
      return state
  }

}
