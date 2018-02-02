import { CurrencyPair } from '../../types/index'
import { ACTION_TYPES } from '../actions/referenceDataActions'

interface CurrencyPairReducerState {
  [id: string]: CurrencyPair
}

export const currencyPairReducer = (state: CurrencyPairReducerState = {}, action): CurrencyPairReducerState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload.currencyPairUpdates
      payloadUpdateItems.forEach((item) => {
        state[item.currencyPair.symbol] = item.currencyPair
      })
      return state
    default:
      return state
  }
}
