import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { from as observableFrom } from 'rxjs'
import { delay, map, mergeMap, tap } from 'rxjs/operators'
import { ApplicationEpic } from '../../ApplicationEpic'
import { ACTION_TYPES, SpotTileActions } from './actions'
const DISMISS_NOTIFICATION_AFTER_X_IN_MS = 6000

type ExecutionAction = ReturnType<typeof SpotTileActions.executeTrade>

const executeTradeEpic: ApplicationEpic<SpotTileActions> = (action$, store, { executionService }) =>
  action$.pipe(
    ofType<SpotTileActions, ExecutionAction>(ACTION_TYPES.EXECUTE_TRADE),
    mergeMap(request =>
      executionService
        .executeTrade(request.payload)
        .pipe(map(result => SpotTileActions.tradeExecuted(result, request.meta)))
    )
  )

type DisplayChartAction = ReturnType<typeof SpotTileActions.displayCurrencyChart>

export const displayCurrencyChart: ApplicationEpic = (action$, store, { openFin }) =>
  action$.pipe(
    ofType<Action, DisplayChartAction>(ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap(action => observableFrom(openFin.displayCurrencyChart(action.payload))),
    map(symbol => SpotTileActions.currencyChartOpened(symbol))
  )

type ExecutedTradeAction = ReturnType<typeof SpotTileActions.tradeExecuted>

export const onTradeExecuted: ApplicationEpic = (action$, store, { openFin }) =>
  action$.pipe(
    ofType<Action, ExecutedTradeAction>(ACTION_TYPES.TRADE_EXECUTED),
    tap(action => {
      if (openFin.isRunningInOpenFin && action.meta) {
        openFin.sendPositionClosedNotification(action.meta.uuid, action.meta.correlationId)
      }
    }),
    delay(DISMISS_NOTIFICATION_AFTER_X_IN_MS),
    map(action => action.payload.request.CurrencyPair),
    map(SpotTileActions.dismissNotification)
  )

export const spotTileEpicsCreator = combineEpics(executeTradeEpic, displayCurrencyChart, onTradeExecuted)
