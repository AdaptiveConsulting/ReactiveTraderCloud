import { Observable } from 'rxjs/Observable'
import * as _ from 'lodash'


import { ACTION_TYPES as REF_ACTION_TYPES } from '../reference/referenceOperations'
export const ACTION_TYPES = {
  BLOTTER_SERVICE: '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

export const fetchBlotter = payload => {
  return { type: ACTION_TYPES.BLOTTER_SERVICE, payload }
}

export const getBlotterStream = (blotterService$: any) => {
  return Observable.from(blotterService$.getTradesStream())
}

export const blotterEpic = blotterService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .mergeMapTo(getBlotterStream(blotterService$))
    .map(fetchBlotter);
}

export const blotterServiceReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE:
      if (_.isEmpty(state)) {
        return action.payload;
      }
      const _trades = [...state, ...action.payload]
      return Object.assign({}, state, { _trades })

    default:
      return state
  }
}

