import { ACTION_TYPES as CONNECTION_ACTION_TYPES, DisconnectAction } from '../../connectionActions'
import { CurrencyPairPosition, HistoricPosition } from '../../types'
import { ACTION_TYPES, AnalyticsActions } from './actions'

export interface AnalyticsState {
  currentPositions: CurrencyPairPosition[]
  history: HistoricPosition[]
}

const initialState: AnalyticsState = {
  currentPositions: [],
  history: []
}

export const analyticsReducer = (state: AnalyticsState = initialState, action: AnalyticsActions | DisconnectAction) => {
  switch (action.type) {
    case ACTION_TYPES.ANALYTICS_SERVICE:
      return { ...state, ...action.payload }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return { currentPositions: [], history: [] }
    default:
      return state
  }
}

export default analyticsReducer
