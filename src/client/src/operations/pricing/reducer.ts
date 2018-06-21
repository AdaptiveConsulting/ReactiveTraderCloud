import { SpotPriceTick } from '../../types'
import { ACTION_TYPES, PricingActions } from './actions'

interface PricingOperationsState {
  readonly [symbol: string]: SpotPriceTick
}

export const INITIAL_STATE: PricingOperationsState = {}

export const pricingServiceReducer = (
  state: PricingOperationsState = INITIAL_STATE,
  action: PricingActions
): PricingOperationsState => {
  switch (action.type) {
    case ACTION_TYPES.SPOT_PRICES_UPDATE:
      return { ...state, [action.payload.symbol]: action.payload }
    default:
      return state
  }
}
