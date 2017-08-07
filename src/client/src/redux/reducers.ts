import { UPDATE_PRICING } from './actions'

export const pricingReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PRICING:
    // console.log('pricingReducer:', action.payload)
      return state
    case 'ccyUpdate':
     console.log('pricingReducer:', action.payload)
      return state
    default:
      return state
  }
}

