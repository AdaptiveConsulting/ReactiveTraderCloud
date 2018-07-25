import { CONNECTION_ACTION_TYPES, DisconnectAction } from 'rt-actions'
import { ANALYTICS_ACTION_TYPES, AnalyticsActions } from './actions'
import { CurrencyPairPosition, HistoricPosition } from './model'

export interface AnalyticsState {
  currentPositions: CurrencyPairPosition[]
  history: HistoricPosition[]
}

const INITIAL_STATE: AnalyticsState = {
  currentPositions: [],
  history: []
}

export const analyticsReducer = (
  state: AnalyticsState = INITIAL_STATE,
  action: AnalyticsActions | DisconnectAction
): AnalyticsState => {
  switch (action.type) {
    case ANALYTICS_ACTION_TYPES.ANALYTICS_SERVICE:
      return { ...state, ...action.payload }
    case CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES:
      return INITIAL_STATE
    default:
      return state
  }
}

export default analyticsReducer
