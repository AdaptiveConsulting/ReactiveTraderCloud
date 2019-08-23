import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
// import { REF_ACTION_TYPES, ReferenceActions } from 'rt-actions'
import { delay, map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import { ExecuteTradeRequest, ExecuteTradeResponse } from '../model/executeTradeRequest'
import ExecutionService from './executionService'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

const { executeTrade, tradeExecuted } = SpotTileActions
type ExecutionAction = ReturnType<typeof executeTrade>

export type ExecutedTradeAction = ReturnType<typeof tradeExecuted>

const executeTradeEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub, limitChecker }) => {
  const limitCheck = (executeTradeRequest: ExecuteTradeRequest) =>
    limitChecker.rpc({
      tradedCurrencyPair: executeTradeRequest.CurrencyPair,
      notional: executeTradeRequest.Notional,
      rate: executeTradeRequest.SpotRate,
    })

  const executionService = new ExecutionService(loadBalancedServiceStub, limitCheck)

  return action$.pipe(
    ofType<Action, ExecutionAction>(TILE_ACTION_TYPES.EXECUTE_TRADE),
    mergeMap((request: ExecutionAction) =>
      executionService
        .executeTrade(request.payload)
        .pipe(map((result: ExecuteTradeResponse) => tradeExecuted(result, request.meta))),
    ),
  )
}

export const onTradeExecuted: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(TILE_ACTION_TYPES.TRADE_EXECUTED),
    delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map((action: ExecutedTradeAction) => action.payload.request.CurrencyPair),
    map(SpotTileActions.dismissNotification),
  )

export const spotTileEpic = combineEpics(executeTradeEpic, onTradeExecuted)
