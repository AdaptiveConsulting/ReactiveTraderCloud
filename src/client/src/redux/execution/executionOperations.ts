import { createAction } from 'redux-actions'

export enum ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED'
}

export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED)

export const executionServiceEpic = executionService$ => action$ => {
  return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
    .flatMap(x => executionService$.executeTrade(x.payload))
    .map(tradeExecuted)
}
