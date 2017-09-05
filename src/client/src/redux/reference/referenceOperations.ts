import { createAction } from 'redux-actions'
import * as keyBy from 'lodash.keyby'

export enum ACTION_TYPES {
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE',
}

export const fetchReference = createAction(ACTION_TYPES.REFERENCE_SERVICE)

export const referenceServiceEpic = refService$ => action$ => {
  return refService$.getCurrencyPairUpdatesStream()
    .map(fetchReference)
}

export const referenceServiceReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      return keyBy(action.payload.currencyPairUpdates, '_currencyPair._symbol')
    default:
      return state
  }
}
