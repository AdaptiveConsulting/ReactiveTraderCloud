import { createAction } from 'redux-actions'

import { regionsSettings } from '../../regions/regionsOperations'
import { ACTION_TYPES as REF_ACTION_TYPES } from '../../referenceOperations'
import { Trade } from '../../types'
import * as keyBy from 'lodash.keyby'

export const ACTION_TYPES = {
  BLOTTER_SERVICE_NEW_TRADES: '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES',
}

export const createNewTradesAction = createAction(ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES)

const subscribeOpenFinToBlotterData = (openFin, store) => () => {
  const cb = (msg, uuid) => openFin.sendAllBlotterData(uuid, store.getState().blotterService.trades)
  openFin.addSubscription('fetch-blotter', cb)
}

export const blotterServiceEpic = (blotterService$, openFin) => (action$, store) => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .do(subscribeOpenFinToBlotterData(openFin, store))
    .flatMapTo(blotterService$.getTradesStream())
    .map(createNewTradesAction)
}

export const blotterRegionsSettings = regionsSettings('Blotter', 850, 250, false)

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

