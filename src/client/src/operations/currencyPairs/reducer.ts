import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../operations/connectionStatus'
import { ACTION_TYPES, ReferenceActions } from '../../operations/referenceData'
import { CurrencyPair } from '../../types'
import { toObject } from './utils'

export interface CurrencyPairState {
  [id: string]: CurrencyPair
}

const INITIAL_STATE: CurrencyPairState = {}

export const currencyPairReducer = (
  state: CurrencyPairState = INITIAL_STATE,
  action: ReferenceActions | DisconnectAction
): CurrencyPairState => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      const payloadUpdateItems = action.payload
      return { ...state, ...toObject<CurrencyPair>(payloadUpdateItems) }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}
