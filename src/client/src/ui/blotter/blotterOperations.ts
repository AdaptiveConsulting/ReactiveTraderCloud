import * as _ from 'lodash'
import { createAction } from 'redux-actions';

import {ACTION_TYPES as REGION_ACTION_TYPES} from '../../redux/regions/regionsOperations'
import {ACTION_TYPES as REF_ACTION_TYPES} from '../../redux/reference/referenceOperations'
import {regionsSettings} from '../../redux/regions/regionsOperations'

export const ACTION_TYPES = {
  BLOTTER_SERVICE: '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

export const fetchBlotter = createAction(ACTION_TYPES.BLOTTER_SERVICE)
export const onPopoutClick = createAction(REGION_ACTION_TYPES.REGION_OPEN_WINDOW, payload => payload)
export const onComponentMount = createAction(REGION_ACTION_TYPES.REGION_ADD, payload => payload)

export const blotterServiceEpic = blotterService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(blotterService$.getTradesStream())
    .map(fetchBlotter);
}

export const blotterRegionsSettings = regionsSettings('Blotter', 850, 250, false)

export const blotterServiceReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE:
      let newState = state
      const payloadTrades = action.payload.trades
      // removing the existing key for a single trade
      if (payloadTrades.length === 1) {
        const tradeKey = payloadTrades[0]['_tradeId']
        if (state.trades[tradeKey]) {
          newState.trades = _.omit(state.trades, tradeKey)
        }
      }
      const trades = _.mapKeys(_.values(payloadTrades), '_tradeId')
      return {
        trades: { ...trades, ...newState.trades }
      }
    default:
      return state
  }
}

