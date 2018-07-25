import { action, ActionUnion } from 'rt-util'

export interface NotionalUpdate {
  currencyPairSymbol: string
  value: number
}

export enum NOTIONAL_ACTION_TYPES {
  NOTIONAL_INPUT = '@ReactiveTraderCloud/NOTIONAL_INPUT'
}

export const NotionalActions = {
  onNotionalInputChange: action<NOTIONAL_ACTION_TYPES.NOTIONAL_INPUT, NotionalUpdate>(
    NOTIONAL_ACTION_TYPES.NOTIONAL_INPUT
  )
}

export type NotionalActions = ActionUnion<typeof NotionalActions>
