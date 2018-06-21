import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { delay, map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ExecuteTradeResponse } from '../../types'
import { ACTION_TYPES, SpotTileActions } from './actions'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

const { executeTrade, tradeExecuted } = SpotTileActions
type ExecutionAction = ReturnType<typeof executeTrade>
export type ExecutedTradeAction = ReturnType<typeof tradeExecuted>

const executeTradeEpic: ApplicationEpic = (action$, state$, { executionService }) =>
  action$.pipe(
    ofType<Action, ExecutionAction>(ACTION_TYPES.EXECUTE_TRADE),
    mergeMap((request: ExecutionAction) =>
      executionService
        .executeTrade(request.payload)
        .pipe(map((result: ExecuteTradeResponse) => tradeExecuted(result, request.meta)))
    )
  )

export const onTradeExecuted: ApplicationEpic = (action$, state$) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map((action: ExecutedTradeAction) => action.payload.request.CurrencyPair),
    map(SpotTileActions.dismissNotification)
  )

export const spotTileEpic = combineEpics(executeTradeEpic, onTradeExecuted)
