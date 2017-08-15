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
  REGION_REMOVE: '@ReactiveTraderCloud/REGION_REMOVE',
  REGION_OPENED: '@ReactiveTraderCloud/REGION_OPENED',
}

export const regionsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REGION_ADD:
      const newRegion = action.payload
      return {
        ...newRegion,
        ...state
      }
    case ACTION_TYPES.REGION_REMOVE:
      return _.omit(state, [action.payload.id])
    default:
      return state
  }

}
