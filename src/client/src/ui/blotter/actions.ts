import { createAction } from 'redux-actions'
import { TradesUpdate } from '../../types'

export const ACTION_TYPES = {
  BLOTTER_SERVICE_NEW_TRADES: '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES'
}

export const createNewTradesAction = createAction<TradesUpdate>(ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES)
