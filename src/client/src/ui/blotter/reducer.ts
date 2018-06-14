import * as keyBy from 'lodash.keyby'
import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { Trades } from '../../types'
import { ACTION_TYPES, BlotterActions } from './actions'

export interface BlotterState {
  trades: Trades
}

const initialState: BlotterState = {
  trades: {}
}

export const blotterServiceReducer = (
  state: BlotterState = initialState,
  action: BlotterActions | DisconnectAction
): BlotterState => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES:
      const newTradesById = keyBy(action.payload.trades, `tradeId`)
      return {
        ...state,
        trades: {
          ...state.trades,
          ...newTradesById
        }
      }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return initialState
    default:
      return state
  }
}

export default blotterServiceReducer
