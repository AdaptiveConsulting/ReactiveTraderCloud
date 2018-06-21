import { ACTION_TYPES, NotionalActions } from './actions'

export interface NotionalState {
  [currencyPairSymbol: string]: number
}

const INITIAL_STATE: NotionalState = {}

export const notionalsReducer = (state: NotionalState = INITIAL_STATE, action: NotionalActions): NotionalState => {
  switch (action.type) {
    case ACTION_TYPES.NOTIONAL_INPUT:
      return {
        ...state,
        [action.payload.currencyPairSymbol]: action.payload.value
      }
    default:
      return state
  }
}
