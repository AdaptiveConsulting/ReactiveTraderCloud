import { combineEpics, ofType, StateObservable } from 'redux-observable'
import { bindCallback } from 'rxjs'
import { filter, map, mergeMap, switchMapTo, takeUntil, tap, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { GlobalState } from './combineReducers'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { CurrencyPairReducerState } from './currencyPairsOperations'
import { OpenFin } from './services'
import { Direction, SpotPriceTick, Trades } from './types'
import { CurrencyPair } from './types/currencyPair'
import { ACTION_TYPES as BLOTTER_ACTION_TYPES } from './ui/blotter/actions'
import { SpotTileActions } from './ui/spotTile/actions'

const subscribeOpenFinToBlotterData = (openFin: OpenFin, state$: StateObservable<GlobalState>) => () => {
  const trades: Trades = state$.value.blotterService.trades
  const currencyPairs: CurrencyPairReducerState = state$.value.currencyPairs
  const cb = (msg: any, uuid: string) => openFin.sendAllBlotterData(uuid, trades, currencyPairs)
  openFin.addSubscription('fetch-blotter', cb)
}

export const connectBlotterServiceToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType(BLOTTER_ACTION_TYPES.BLOTTER_SERVICE_NEW_TRADES),
    tap(subscribeOpenFinToBlotterData(openFin, state$))
  )

const addRatePrecisionToPrice = (currencyData: Map<string, CurrencyPair>, price: SpotPriceTick) => {
  return {
    ...price,
    ratePrecision: currencyData.get(price.symbol).ratePrecision
  }
}

const publishPriceToOpenFinEpic: ApplicationEpic = (
  action$,
  store,
  { pricesForCurrenciesInRefData, referenceDataService, openFin }
) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    switchMapTo(
      pricesForCurrenciesInRefData.pipe(
        mergeMap(price =>
          referenceDataService.getCurrencyPairUpdates$().pipe(
            map(currencyMap => addRatePrecisionToPrice(currencyMap, price)),
            tap<any>(enhancedPrice => openFin.publishPrice(enhancedPrice)),
            filter(() => false),
            takeUntil(action$.pipe(ofType(DISCONNECT_SERVICES)))
          )
        )
      )
    )
  )

function createTrade(msg, price) {
  const direction = msg.amount > 0 ? Direction.Sell : Direction.Buy
  const notional = Math.abs(msg.amount)

  const spotRate = direction === Direction.Buy ? price.ask : price.bid

  return {
    CurrencyPair: price.symbol,
    SpotRate: spotRate,
    Direction: direction,
    Notional: notional,
    DealtCurrency: price.currencyPair.base
  }
}

export const closePositionEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType(CONNECT_SERVICES),
    mergeMap(() => {
      return bindCallback(openFin.addSubscription).bind(openFin)('close-position')
    }),
    withLatestFrom(state$),
    map<any, any>(([[msg, uuid], state]) => {
      const trade = createTrade(msg, state.pricingService[msg.symbol])
      return SpotTileActions.executeTrade(trade, {
        uuid,
        correlationId: msg.correlationId
      })
    })
  )

export const openfinEpic = combineEpics(publishPriceToOpenFinEpic, connectBlotterServiceToOpenFinEpic)
