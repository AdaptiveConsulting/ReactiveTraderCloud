import * as keyBy from 'lodash.keyby'
import * as _ from 'lodash'
import { SpotPriceTick } from '../../types/spotPriceTick'
import { PriceMovementTypes } from '../../types/priceMovementTypes'
import { ACTION_TYPES } from '../actions/pricingActions'
import { buildNotification } from '../../ui/notification/notificationUtils'

interface PricingOperationsReducerState {
  [symbol: string]: SpotPriceTick
}

const stalePriceErrorMessage = 'Pricing is unavailable'

export const pricingServiceReducer = (state: PricingOperationsReducerState = {}, action): PricingOperationsReducerState => {

  const { type, payload } = action
  switch (type) {
    case ACTION_TYPES.SPOT_PRICES_UPDATE:

      const updatedPrices = keyBy(action.payload, 'symbol')
      const updatedPricesDataObj = {}

      _.forOwn(updatedPrices, (value, key) => {
        const prevItem = state[key] || {}
        const newItem:SpotPriceTick = { ...value }
        newItem.priceStale = false
        newItem.priceMovementType = getPriceMovementType(prevItem, newItem)
        updatedPricesDataObj[key] = newItem
      })

      return { ...state, ...updatedPricesDataObj }
    case ACTION_TYPES.PRICING_STALE:
      return {
        ...state,
        [payload.symbol]: {
          ...state[payload.symbol],
          priceStale: true,
          notification: buildNotification(null, stalePriceErrorMessage)
        }
      }
    default:
      return state
  }
}

function getPriceMovementType(prevItem: any, newItem: any) {
  const prevPriceMove = prevItem.priceMovementType || PriceMovementTypes.None;
  const lastPrice = prevItem.mid
  const nextPrice = newItem.mid
  if (lastPrice < nextPrice) {
    return PriceMovementTypes.Up
  }
  if (lastPrice > nextPrice) {
    return PriceMovementTypes.Down
  }
  return prevPriceMove
}

