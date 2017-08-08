import * as _ from 'lodash'
import { createAction } from 'redux-actions';

export enum ACTION_TYPES {
  BLOTTER_SERVICE = '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

export const fetchBlotter = createAction(ACTION_TYPES.BLOTTER_SERVICE)

export const blotterServiceEpic = blotterService$ => action$ => {
  return blotterService$.getTradesStream()
    .map(fetchBlotter);
}

export const blotterServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE:
      const blotterData = _.mapKeys(action.payload._trades, '_tradeId')
      return Object.assign({}, state, blotterData)
    default:
      return state
  }
}
