import { ACTION_TYPES } from './actions'

export const analyticsReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.ANALYTICS_SERVICE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default analyticsReducer
