import { action, ActionUnion } from 'rt-util'

export interface NotionalUpdate {
  currencyPairSymbol: string
  value: number
}

export enum ACTION_TYPES {
  NOTIONAL_INPUT = '@ReactiveTraderCloud/NOTIONAL_INPUT'
}

export const NotionalActions = {
  onNotionalInputChange: action<ACTION_TYPES.NOTIONAL_INPUT, NotionalUpdate>(ACTION_TYPES.NOTIONAL_INPUT)
}

export type NotionalActions = ActionUnion<typeof NotionalActions>
