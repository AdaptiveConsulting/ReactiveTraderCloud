import { Action } from 'redux'
import { ofType, ActionsObservable } from 'redux-observable'
import { CONNECTION_ACTION_TYPES } from 'rt-actions'
import { merge, MonoTypeOperatorFunction } from 'rxjs'
import { map, mergeMap, takeUntil, filter } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import PricingService from './pricingService'
import { getHistoricPrices } from './historicPriceService'
import { DisconnectAction } from 'rt-actions/connectionActions'

const {
  priceUpdateAction,
  subscribeToSpotTile,
  priceHistoryReceived,
  unsubscribeToSpotTile
} = SpotTileActions

type SubscribeToSpotTileAction = ReturnType<typeof subscribeToSpotTile>
type UnsubscribeToSpotTileAction = ReturnType<typeof unsubscribeToSpotTile>

const takePriceUpdatesUntil = (
  action$: ActionsObservable<Action>,
  currencyPair: string
): MonoTypeOperatorFunction<Action> =>
  takeUntil(
    merge(
      action$.pipe(ofType<Action, DisconnectAction>(CONNECTION_ACTION_TYPES.DISCONNECT_SERVICES)),
      action$.pipe(
        ofType<Action, UnsubscribeToSpotTileAction>(TILE_ACTION_TYPES.SPOT_TILE_UNSUBSCRIBE),
        filter(({ payload }) => payload === currencyPair)
      )
    )
  )

export const pricingServiceEpic: ApplicationEpic = (action$, _state$, { serviceClient }) => {
  const pricingService = new PricingService(serviceClient)

  return action$.pipe(
    ofType<Action, SubscribeToSpotTileAction>(TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE),
    mergeMap((action: SubscribeToSpotTileAction) =>
      pricingService
        .getSpotPriceStream({
          symbol: action.payload
        })
        .pipe(map(priceUpdateAction), takePriceUpdatesUntil(action$, action.payload))
    )
  )
}

export const pricingHistoryEpic: ApplicationEpic = (action$, _state$, { serviceClient }) => {
  return action$.pipe(
    ofType<Action, SubscribeToSpotTileAction>(TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE),
    mergeMap((action: SubscribeToSpotTileAction) =>
      getHistoricPrices(serviceClient, action.payload).pipe(
        map(priceData => priceHistoryReceived(priceData, action.payload)),
        takePriceUpdatesUntil(action$, action.payload)
      )
    )
  )
}
