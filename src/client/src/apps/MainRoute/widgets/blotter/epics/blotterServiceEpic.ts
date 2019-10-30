import { DateTime } from 'luxon'
import numeral from 'numeral'
import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { CurrencyPair, CurrencyPairMap, Trade, Trades, TradeStatus } from 'rt-types'
import { filter, ignoreElements, map, skipWhile, switchMapTo, takeUntil, tap } from 'rxjs/operators'

import { ApplicationEpic } from 'StoreTypes'
import { BLOTTER_ACTION_TYPES, BlotterActions } from '../actions'
import { interval } from 'rxjs'

type NewTradesAction = ReturnType<typeof BlotterActions.createNewTradesAction>

const formatTradeNotification = (trade: Trade, currencyPair: CurrencyPair) => ({
  symbol: trade.symbol,
  spotRate: trade.spotRate,
  notional: numeral(trade.notional).format('0,000,000[.]00'),
  direction: trade.direction,
  tradeId: trade.tradeId.toString(),
  tradeDate: DateTime.fromJSDate(trade.tradeDate).toString(),
  status: trade.status,
  dealtCurrency: trade.dealtCurrency,
  termsCurrency: currencyPair.terms,
  valueDate: DateTime.fromJSDate(trade.tradeDate, { zone: 'utc' }).toFormat('dd MMM'),
  traderName: trade.traderName,
})

function parseBlotterData(blotterData: Trades, currencyPairs: CurrencyPairMap) {
  if (Object.keys(currencyPairs).length === 0 || Object.keys(blotterData).length === 0) {
    return []
  }
  return Object.keys(blotterData).map(x =>
    formatTradeNotification(blotterData[x], currencyPairs[blotterData[x].symbol]),
  )
}

export const publishBlotterToExcelEpic: ApplicationEpic = (action$, state$, { excelApp }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo(
      interval(7500).pipe(
        takeUntil(action$.pipe(applicationDisconnected)),
        tap(() => {
          if (excelApp.isOpen()) {
            const parsedData = parseBlotterData(
              state$.value.blotterService.trades,
              state$.value.currencyPairs,
            )
            excelApp.publishBlotter(parsedData)
          }
        }),
        ignoreElements(),
      ),
    ),
  )

export const connectBlotterToNotifications: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    filter(() => state$.value.layoutService.blotter.visible),
    filter(action => !action.payload.isStateOfTheWorld && action.payload.trades.length > 0),
    map(action => action.payload.trades[0]),
    skipWhile(trade => !state$.value.currencyPairs[trade.symbol]),
    filter(trade => trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected),
    map(trade => formatTradeNotification(trade, state$.value.currencyPairs[trade.symbol])),
    tap(tradeNotification => platform.notification.notify({ tradeNotification })),
    ignoreElements(),
  )

export const requestBrowserNotificationPermission: ApplicationEpic = (
  action$,
  state$,
  { platform },
) =>
  action$.pipe(
    applicationConnected,
    tap(() => {
      if ('Notification' in window) {
        Notification.requestPermission()
      }
    }),
    ignoreElements(),
  )
