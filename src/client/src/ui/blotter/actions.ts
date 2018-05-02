import { createAction } from 'redux-actions'

export const ACTION_TYPES = {
  BLOTTER_SERVICE_NEW_TRADES: '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES'
}

export const createNewTradesAction = createAction(
  ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES
)
