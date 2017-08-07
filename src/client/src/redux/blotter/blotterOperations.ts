import * as _ from 'lodash'

export const ACTION_TYPES = {
  BLOTTER_SERVICE: '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

// TODO rename
export const fetchBlotter = payload => ({ type: ACTION_TYPES.BLOTTER_SERVICE, payload })

export const blotterEpic = refService$ => action$ => {
  return refService$
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
