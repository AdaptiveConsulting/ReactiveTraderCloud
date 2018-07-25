import { action, ActionUnion } from 'rt-util'
import { TradesUpdate } from './blotterService'

export enum ACTION_TYPES {
  SUBSCRIBE_TO_BLOTTER_ACTION = '@ReactiveTraderCloud/SUBSCRIBE_TO_BLOTTER_ACTION',
  BLOTTER_SERVICE_NEW_TRADES = '@ReactiveTraderCloud/BLOTTER_SERVICE_NEW_TRADES'
}

export const BlotterActions = {
  createNewTradesAction: action<ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES, TradesUpdate>(
    ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES
  ),
  subscribeToBlotterAction: action(ACTION_TYPES.SUBSCRIBE_TO_BLOTTER_ACTION)
}

export type BlotterActions = ActionUnion<typeof BlotterActions>
