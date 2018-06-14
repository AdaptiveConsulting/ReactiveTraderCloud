import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { from as observableFrom } from 'rxjs'
import { delay, map, mergeMap, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ExecuteTradeResponse } from '../../types'
import { ACTION_TYPES, SpotTileActions } from './actions'

const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

type ExecutionAction = ReturnType<typeof SpotTileActions.executeTrade>
type ExecutedTradeAction = ReturnType<typeof SpotTileActions.tradeExecuted>

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

type DisplayChartAction = ReturnType<typeof SpotTileActions.displayCurrencyChart>
type ChartOpenedAction = ReturnType<typeof SpotTileActions.currencyChartOpened>

export const displayCurrencyChart: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, DisplayChartAction>(ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap<DisplayChartAction, string>((action: DisplayChartAction) =>
      observableFrom<string>(openFin.displayCurrencyChart(action.payload))
    ),
    map<string, ChartOpenedAction>(symbol => SpotTileActions.currencyChartOpened(symbol))
  )

type DismissNotificationAction = ReturnType<typeof SpotTileActions.dismissNotification>

export const onTradeExecuted: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    tap((action: ExecutedTradeAction) => {
      if (openFin.isRunningInOpenFin && action.meta) {
        openFin.sendPositionClosedNotification(action.meta.uuid, action.meta.correlationId)
      }
    }),
    delay<ExecutedTradeAction>(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map<ExecutedTradeAction, string>((action: ExecutedTradeAction) => action.payload.request.CurrencyPair),
    map<string, DismissNotificationAction>(SpotTileActions.dismissNotification)
  )

export const spotTileEpicsCreator = combineEpics(executeTradeEpic, displayCurrencyChart, onTradeExecuted)
