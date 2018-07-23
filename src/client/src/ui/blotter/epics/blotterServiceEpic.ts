import * as moment from 'moment'
import { Action } from 'redux'
import { combineEpics, ofType } from 'redux-observable'
import { interval } from 'rxjs'
import { filter, ignoreElements, map, switchMapTo, takeUntil, tap } from 'rxjs/operators'
import { Trades } from '..'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { CurrencyPair, Trade, TradeStatus } from '../../../types'
import { CurrencyPairMap } from '../../../types/currencyPair'
import { applicationConnected, applicationDisconnected } from '../../connectionStatus'
import { ACTION_TYPES, BlotterActions } from '../actions'

type NewTradesAction = ReturnType<typeof BlotterActions.createNewTradesAction>

function formatTradeNotification(trade: Trade, currencyPair: CurrencyPair) {
  return {
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
    traderName: trade.traderName
  }
}

function parseBlotterData(blotterData: Trades, currencyPairs: CurrencyPairMap) {
  if (Object.keys(currencyPairs).length === 0 || Object.keys(blotterData).length === 0) {
    return
  }
  return Object.keys(blotterData).map(x =>
    formatTradeNotification(blotterData[x], currencyPairs[blotterData[x].symbol])
  )
}

const connectBlotterToExcel: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    applicationConnected,
    switchMapTo(
      interval(7500).pipe(
        takeUntil(action$.pipe(applicationDisconnected)),
        tap(() => {
          openFin.sendAllBlotterData(parseBlotterData(state$.value.blotterService.trades, state$.value.currencyPairs))
        }),
        ignoreElements()
      )
    )
  )

const connectBlotterToNotifications: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, NewTradesAction>(ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    map(action => action.payload.trades[0]),
    filter(trade => trade.status === TradeStatus.Done || trade.status === TradeStatus.Rejected),
    tap(trade => openFin.openTradeNotification(trade, state$.value.currencyPairs[trade.symbol])),
    ignoreElements()
  )

export const connectBlotterServiceToOpenFinEpic = combineEpics(connectBlotterToExcel, connectBlotterToNotifications)
