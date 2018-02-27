import { RegionSettings, Trade } from '../../types/index'
import * as keyBy from 'lodash.keyby'
import { ACTION_TYPES } from './actions'

export const blotterRegionsSettings: RegionSettings = {
  title: 'Blotter',
  width: 850,
  height: 450,
  minHeight: 200,
  dockable: false,
  resizable: true
}

interface Trades {
  [tradeId: number]: Trade
}

interface State {
  trades: Trades
}

const initialState: State = {
  trades: {},
}

export const blotterServiceReducer = (state: State = initialState, action): State => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES:
      const newTradesById = keyBy(action.payload.trades, `tradeId`)
      return {
        ...state,
        trades: {
          ...state.trades,
          ...newTradesById,
        }
      }
    default:
      return state
  }
}

export default blotterServiceReducer
