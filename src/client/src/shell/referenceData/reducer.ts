import { REF_ACTION_TYPES, ReferenceActions } from 'rt-actions'
import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { CurrencyPair } from 'rt-types'

export interface CurrencyPairState {
  [id: string]: CurrencyPair
}

const INITIAL_STATE: CurrencyPairState = {}

export const currencyPairReducer = (
  state: CurrencyPairState = INITIAL_STATE,
  action: ReferenceActions | DisconnectAction
): CurrencyPairState => {
  switch (action.type) {
    case REF_ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload
      return { ...state, ...payloadUpdateItems }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}
