import * as _ from 'lodash'

export const ACTION_TYPES = {
  BLOTTER_SERVICE: '@ReactiveTraderCloud/BLOTTER_SERVICE'
}

export const fetchBlotter = payload => ({ type: ACTION_TYPES.BLOTTER_SERVICE, payload })

export const blotterEpic = blotterService$ => action$ => {
  return blotterService$
    .map(fetchBlotter);
}

export const blotterServiceReducer = (state: any = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.BLOTTER_SERVICE:
      if (_.isEmpty(state)) {
        return action.payload;
      }
      const _trades = [ ...state, ...action.payload ]
      return Object.assign({}, state, { _trades })

    default:
      return state
  }
}

