import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { InteropTopics, platformHasFeature } from 'rt-platforms'
import { CurrencyPairMap } from 'rt-types'
import { EMPTY } from 'rxjs'
import { ignoreElements, map, tap, withLatestFrom } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'

import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import { SpotPriceTick } from '../model/spotPriceTick'

const { priceUpdateAction } = SpotTileActions
type PriceUpdateAction = ReturnType<typeof priceUpdateAction>

const addRatePrecisionToPrice = (currencyData: CurrencyPairMap, price: SpotPriceTick) => ({
  ...price,
  ratePrecision: currencyData[price.symbol].ratePrecision,
})

export const publishPriceUpdateEpic: ApplicationEpic = (
  action$,
  _,
  { referenceDataService$, platform },
) => {
  if (!platformHasFeature(platform, 'interop')) {
    return EMPTY
  }

  return action$.pipe(
    ofType<Action, PriceUpdateAction>(TILE_ACTION_TYPES.SPOT_PRICES_UPDATE),
    withLatestFrom(referenceDataService$),
    map(([action, currencyMap]) => addRatePrecisionToPrice(currencyMap, action.payload)),
    tap(enhancedPrice => {
      platform.interop.publish(InteropTopics.PriceUpdate, enhancedPrice)
    }),
    ignoreElements(),
  )
}
