import { action, ActionUnion } from '../../ActionHelper'
import { TradesUpdate } from '../../types'

export enum ACTION_TYPES {
  BLOTTER_SERVICE_NEW_TRADES = '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES'
}

export const BlotterActions = {
  createNewTradesAction: action<ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES, TradesUpdate>(
    ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES
  )
}

export type BlotterActions = ActionUnion<typeof BlotterActions>
