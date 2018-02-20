import { Action, createAction, handleActions } from 'redux-actions'

export enum ACTION_TYPES {
  NOTIONAL_INPUT = '@ReactiveTraderCloud/NOTIONAL_INPUT'
}

export const onNotionalInputChange = createAction(ACTION_TYPES.NOTIONAL_INPUT)

const INITIAL_STATE = {}

export interface NotionalUpdate {
  currencyPairSymbol: string
  value: number
}

export default handleActions(
  {
    [ACTION_TYPES.NOTIONAL_INPUT]: (state: any, action: Action<NotionalUpdate>) => {
      return {
        ...state,
        [action.payload.currencyPairSymbol]: action.payload.value
      }
    }
  },
  INITIAL_STATE
)
