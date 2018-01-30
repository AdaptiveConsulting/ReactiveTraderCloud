import { createAction } from 'redux-actions'
import * as keyBy from 'lodash.keyby'

import { CurrencyPair } from './types'

export enum ACTION_TYPES {
  /**
   * Looks like is like an init action that is only dispatched on init.
   */
  REFERENCE_SERVICE = '@ReactiveTraderCloud/REFERENCE_SERVICE',
}

export const createReferenceServiceAction = createAction(ACTION_TYPES.REFERENCE_SERVICE)

export const referenceServiceEpic = refService$ => () => {
  return refService$.getCurrencyPairUpdatesStream()
    .map(createReferenceServiceAction)
}

interface CurrencyPairWrapper {
  updateType: string,
  currencyPair: CurrencyPair
}

interface State {
  [id: string]: CurrencyPairWrapper
}

export const referenceServiceReducer = (state: State = {}, action): State => {
  switch (action.type) {
    case ACTION_TYPES.REFERENCE_SERVICE:
      return keyBy(action.payload.currencyPairUpdates, 'currencyPair.symbol')
    default:
      return state
  }
}
