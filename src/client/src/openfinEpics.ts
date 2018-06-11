import { combineEpics, ofType } from 'redux-observable'
import { bindCallback } from 'rxjs'
import { filter, map, mergeMap, switchMapTo, takeUntil, tap, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from './ApplicationEpic'
import { CONNECT_SERVICES, DISCONNECT_SERVICES } from './connectionActions'
import { openfinServiceEpics } from './services/openFin'
import { Direction, SpotPriceTick } from './types'
import { CurrencyPair } from './types/currencyPair'
import { SpotTileActions } from './ui/spotTile/actions'

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

export const openfinEpic = combineEpics(publishPriceToOpenFinEpic, openfinServiceEpics)
