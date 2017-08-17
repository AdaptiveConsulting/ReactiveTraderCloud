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
  REGION_TEAROFF_WINDOW: '@ReactiveTraderCloud/REGION_TEAROFF',
}

export const regionsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      const newRegion = action.payload
      return {
        [newRegion.id]: newRegion,
        ...state
      }
    case ACTION_TYPES.REGION_TEAROFF_WINDOW:
      const payloadRegion = action.payload
      const regionId = payloadRegion.id
      const region = _.pick(state, [regionId])
      region[regionId].isTearedOff = !region[regionId].isTearedOff
      const cleanState = _.omit(state, [regionId])
      return {
        ...cleanState,
        ...region
      }
    default:
      return state
  }

}
