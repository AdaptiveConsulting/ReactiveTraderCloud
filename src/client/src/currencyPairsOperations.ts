import { Action } from 'redux-actions'
import { DISCONNECT_SERVICES } from './connectionActions'
import { ACTION_TYPES } from './referenceDataOperations'
import { CurrencyPair } from './types/index'

export interface CurrencyPairReducerState {
  [id: string]: CurrencyPair
}

// TODO: revisit
function toObject<T>(aMap: Map<string, T>): { [id: string]: T } {
  const obj = {}
  aMap.forEach((v, k) => {
    obj[k] = v
  })
  return obj
}

export const currencyPairReducer = (
  state: CurrencyPairReducerState = {},
  action: Action<Map<string, CurrencyPair>>
): CurrencyPairReducerState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload
      return { ...state, ...toObject<CurrencyPair>(payloadUpdateItems) }
    case DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}
