import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { delay, map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ExecuteTradeResponse } from '../../types'
import { ACTION_TYPES, SpotTileActions } from './actions'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

type ExecutionAction = ReturnType<typeof SpotTileActions.executeTrade>
export type ExecutedTradeAction = ReturnType<typeof SpotTileActions.tradeExecuted>

const executeTradeEpic: ApplicationEpic = (action$, state$, { executionService }) =>
  action$.pipe(
    ofType<Action, ExecutionAction>(ACTION_TYPES.EXECUTE_TRADE),
    mergeMap<ExecutionAction, ExecutedTradeAction>((request: ExecutionAction) =>
      executionService
        .executeTrade(request.payload)
        .pipe(
          map<ExecuteTradeResponse, ExecutedTradeAction>((result: ExecuteTradeResponse) =>
            SpotTileActions.tradeExecuted(result, request.meta)
          )
        )
    )
  )

type DismissNotificationAction = ReturnType<typeof SpotTileActions.dismissNotification>

export const onTradeExecuted: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    delay<ExecutedTradeAction>(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map<ExecutedTradeAction, string>((action: ExecutedTradeAction) => action.payload.request.CurrencyPair),
    map<string, DismissNotificationAction>(SpotTileActions.dismissNotification)
  )

export const spotTileEpicsCreator = combineEpics(executeTradeEpic, onTradeExecuted)
