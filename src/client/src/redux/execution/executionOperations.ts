import { createAction } from 'redux-actions'
import { regionsSettings } from '../regions/regionsOperations'

export enum ACTION_TYPES {
  EXECUTE_TRADE = '@ReactiveTraderCloud/EXECUTE_TRADE',
  TRADE_EXECUTED = '@ReactiveTraderCloud/TRADE_EXECUTED'
}


export const executeTrade = createAction(ACTION_TYPES.EXECUTE_TRADE, payload => payload)
export const tradeExecuted = createAction(ACTION_TYPES.TRADE_EXECUTED)

export const spotRegionSettings = id => regionsSettings(`${id} Spot`, 370, 155, true)

export const executionServiceEpic = executionService$ => action$ => {
  return action$.ofType(ACTION_TYPES.EXECUTE_TRADE)
    .flatMap(x => {
      return executionService$.executeTrade(x.payload)
    })
    .map(tradeExecuted)
}
