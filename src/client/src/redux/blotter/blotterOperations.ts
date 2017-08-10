import * as _ from 'lodash'
import * as keyBy from 'lodash.keyby'
import { createAction } from 'redux-actions';

import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations';

export enum ACTION_TYPES {
  BLOTTER_SERVICE = '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

export const fetchBlotter = createAction(ACTION_TYPES.BLOTTER_SERVICE)

export const blotterServiceEpic = blotterService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(blotterService$.getTradesStream())
    .map(fetchBlotter);
}

export const blotterServiceReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE:
      const trades = keyBy(_.values(action.payload.trades), '_tradeId')
      return {
        trades: _.sortBy({ ...trades, ...state.trades }, '_topicId').reverse()
      }
    default:
      return state
  }
}

