import { CurrencyPair } from './types/index'
import { ACTION_TYPES } from './referenceDataOperations'

interface CurrencyPairReducerState {
  [id: string]: CurrencyPair
}

export const currencyPairReducer = (state: CurrencyPairReducerState = {}, action): CurrencyPairReducerState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload.currencyPairUpdates
      const updatedItems = {}
      payloadUpdateItems.forEach(item => {
        updatedItems[item.currencyPair.symbol] = item.currencyPair
      })
      return { ...state, ...updatedItems }
    default:
      return state
  }
}
