import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { ACTION_TYPES, ReferenceServiceAction } from '../../referenceDataOperations'
import { CurrencyPair } from '../../types'
import { toObject } from './utils'

export interface CurrencyPairState {
  [id: string]: CurrencyPair
}

const initialState: CurrencyPairState = {}

export const currencyPairReducer = (
  state: CurrencyPairState = initialState,
  action: ReferenceServiceAction | DisconnectAction
): CurrencyPairState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload
      return { ...state, ...toObject<CurrencyPair>(payloadUpdateItems) }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return initialState
    default:
      return state
  }
}
