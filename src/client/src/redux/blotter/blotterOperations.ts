import * as _ from 'lodash'
import * as keyBy from 'lodash.keyby'
import { createAction } from 'redux-actions';

import {ACTION_TYPES as REGION_ACTION_TYPES} from '../regions/regionsOperations'
import {ACTION_TYPES as REF_ACTION_TYPES} from '../reference/referenceOperations'
import {regionsSettings} from '../regions/regionsOperations'

export const ACTION_TYPES = {
  BLOTTER_SERVICE: '@ReactiveTraderCloud/BLOTTER_SERVICE',
  BLOTTER_POPOUT: '@ReactiveTraderCloud/BLOTTER_POPOUT'
}

export const fetchBlotter = createAction(ACTION_TYPES.BLOTTER_SERVICE)
export const onPopoutClick = createAction(REGION_ACTION_TYPES.REGION_REMOVE, payload => payload)
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
      const trades = keyBy(_.values(action.payload.trades), '_tradeId')
      const orderedTrades = _.sortBy({ ...trades, ...state.trades }, ['_tradeId']).reverse()
      console.log('orderedTrades', orderedTrades)

      return {
        trades: keyBy(orderedTrades, '_tradeId')
      }
    default:
      return state
  }
}

