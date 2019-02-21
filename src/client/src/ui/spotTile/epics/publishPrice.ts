import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { applicationDisconnected } from 'rt-actions'
import { CurrencyPairMap } from 'rt-types'
import { ignoreElements, map, takeUntil, tap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import { SpotPriceTick } from '../model/spotPriceTick'

const { priceUpdateAction } = SpotTileActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

const addRatePrecisionToPrice = (currencyData: CurrencyPairMap, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData[price.symbol].ratePrecision,
})

export const publishPriceUpdateEpic: ApplicationEpic = (action$, _, { referenceDataService$, platform }) =>
  action$.pipe(
    ofType<Action, PriceUpdateAction>(TILE_ACTION_TYPES.SPOT_PRICES_UPDATE),
    map(action =>
      referenceDataService$.pipe(
        map(currencyMap => addRatePrecisionToPrice(currencyMap, action.payload)),
        tap(enhancedPrice => platform.interop.publish('price-update', enhancedPrice)),
        ignoreElements(),
        takeUntil(action$.pipe(applicationDisconnected)),
      ),
    ),
    ignoreElements(),
  )
