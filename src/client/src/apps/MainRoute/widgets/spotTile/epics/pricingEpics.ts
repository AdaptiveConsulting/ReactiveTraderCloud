import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { applicationDisconnected } from 'rt-actions'
import { map, mergeMap, takeUntil } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import PricingService from './pricingService'
import { getHistoricPrices } from './historicPriceService'

const { priceUpdateAction, subscribeToSpotTile, priceHistoryReceieved } = SpotTileActions
type SubscribeToSpotTileAction = ReturnType<typeof subscribeToSpotTile>

export const pricingServiceEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub }) => {
  const pricingService = new PricingService(loadBalancedServiceStub)

  return action$.pipe(
    ofType<Action, SubscribeToSpotTileAction>(TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE),
    mergeMap((action: SubscribeToSpotTileAction) =>
      pricingService
        .getSpotPriceStream({
          symbol: action.payload,
        })
        .pipe(
          map(priceUpdateAction),
          takeUntil(action$.pipe(applicationDisconnected)),
        ),
    ),
  )
}

export const pricingHistoryEpic: ApplicationEpic = (action$, state$, { loadBalancedServiceStub }) => {
  return action$.pipe(
    ofType<Action, SubscribeToSpotTileAction>(TILE_ACTION_TYPES.SPOT_TILE_SUBSCRIBE),
    mergeMap((action: SubscribeToSpotTileAction) =>
      getHistoricPrices(loadBalancedServiceStub, action.payload).pipe(
        map(priceData => priceHistoryReceieved(priceData, action.payload)),
        takeUntil(action$.pipe(applicationDisconnected)),
      ),
    ),
  )
}
