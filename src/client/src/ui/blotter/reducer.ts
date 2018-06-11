import * as keyBy from 'lodash.keyby'
import { Action } from 'redux'
import { DISCONNECT_SERVICES } from '../../connectionActions'
import { RegionSettings, Trades } from '../../types'
import { ACTION_TYPES, BlotterActions } from './actions'

export const blotterRegionsSettings: RegionSettings = {
  title: 'Blotter',
  width: 850,
  height: 450,
  minHeight: 200,
  dockable: false,
  resizable: true
}

interface BlotterState {
  trades: Trades
}

const initialState: BlotterState = {
  trades: {}
}

export const blotterServiceReducer = (
  state: BlotterState = initialState,
  action: BlotterActions | Action<typeof DISCONNECT_SERVICES>
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
    case DISCONNECT_SERVICES:
      return initialState
    default:
      return state
  }
}

export default blotterServiceReducer
