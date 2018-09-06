import _ from 'lodash'

import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { Trade } from 'rt-types'
import { BLOTTER_ACTION_TYPES, BlotterActions } from './actions'

export interface Trades {
  [tradeId: number]: Trade
}

export interface BlotterState {
  trades: Trades
}

const INITIAL_STATE: BlotterState = {
  trades: {}
}

export const blotterServiceReducer = (
  state: BlotterState = INITIAL_STATE,
  action: BlotterActions | DisconnectAction
): BlotterState => {
  switch (action.type) {
    case BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES:
      const newTradesById = _.keyBy(action.payload.trades, `tradeId`)
      return {
        ...state,
        trades: {
          ...state.trades,
          ...newTradesById
        }
      }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

export default blotterServiceReducer
