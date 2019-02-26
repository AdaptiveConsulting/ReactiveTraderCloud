import moment from 'moment'
import numeral from 'numeral'
import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { applicationConnected, applicationDisconnected } from 'rt-actions'
import { CurrencyPair, CurrencyPairMap, Trade, Trades, TradeStatus } from 'rt-types'
import { InteropTopics } from 'rt-components'
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
  tradeDate: moment(trade.tradeDate).format(),
  status: trade.status,
  dealtCurrency: trade.dealtCurrency,
  termsCurrency: currencyPair.terms,
  valueDate: moment.utc(trade.valueDate).format('DD MMM'),
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

const connectBlotterToExcel: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    applicationConnected,
    tap(() => platform.interop!.excel!.init()),
    switchMapTo(
      interval(7500).pipe(
        takeUntil(action$.pipe(applicationDisconnected)),
        tap(() => {
          const parsedData = parseBlotterData(state$.value.blotterService.trades, state$.value.currencyPairs)
          platform.interop!.excel!.publish(InteropTopics.Blotter, parsedData)
        }),
        ignoreElements(),
      ),
    ),
  )

export const connectBlotterToNotifications: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    filter(action => action.payload.trades.length > 0),
    map(action => action.payload.trades[0]),
    skipWhile(trade => !state$.value.currencyPairs[trade.symbol]),
    filter(trade => trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected),
    map(trade => formatTradeNotification(trade, state$.value.currencyPairs[trade.symbol])),
    tap(tradeNotification => platform.notification!.notify({ tradeNotification })),
    ignoreElements(),
  )

export const requestBrowserNotificationPermission: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    applicationConnected,
    tap(() => {
      if ('Notification' in window) {
        Notification.requestPermission()
      }
    }),
    ignoreElements(),
  )

export const publishBlotterEpic = combineEpics(connectBlotterToExcel)
