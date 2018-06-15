import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { ACTION_TYPES, ReferenceServiceAction } from '../../referenceDataOperations'
import { CurrencyPair } from '../../types'
import { toObject } from './utils'

export interface CurrencyPairState {
  [id: string]: CurrencyPair
}

export const currencyPairReducer = (
  state: CurrencyPairState = {},
  action: ReferenceServiceAction | DisconnectAction
): CurrencyPairState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload
      return { ...state, ...toObject<CurrencyPair>(payloadUpdateItems) }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return {}
    default:
      return state
  }
}
