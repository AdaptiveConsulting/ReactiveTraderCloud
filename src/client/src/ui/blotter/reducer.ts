import * as keyBy from 'lodash.keyby'
import { Trade } from './'
import { ACTION_TYPES } from './actions'
import { regionsSettings } from '../common/regions/regionsOperations'

export const blotterRegionsSettings = regionsSettings('Blotter', 850, 250, false)

interface Trades {
  [tradeId: number]: Trade
}

interface State {
  trades: Trades
}

const initialState: State = {
  trades: {}
}

export const blotterServiceReducer = (state: State = initialState, action): State => {
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
    default:
      return state
  }
}

export default blotterServiceReducer
