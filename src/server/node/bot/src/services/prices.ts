import { PriceTick, PricingService } from '../generated/TradingGateway'
import { scan, share, switchMap } from 'rxjs/operators'
import { currencyPairSymbols$ } from './currencyPairs'
import { combineLatest } from 'rxjs'

export interface Price extends PriceTick {
  lastMove: 'up' | 'down' | 'none'
}

const getPriceMovementType = (prevItem: Price, newItem: Price) => {
  const prevPriceMove = prevItem.lastMove
  const lastPrice = prevItem.mid
  const nextPrice = newItem.mid
  if (lastPrice < nextPrice) {
    return 'up'
  }
  if (lastPrice > nextPrice) {
    return 'down'
  }
  return prevPriceMove
}

const priceMapper = (price: PriceTick): Price => ({
  ask: price.ask,
  bid: price.bid,
  mid: price.mid,
  creationTimestamp: price.creationTimestamp,
  symbol: price.symbol,
  valueDate: price.valueDate,
  lastMove: 'none'
})

export const prices$ = currencyPairSymbols$.pipe(
  switchMap(symbols => {
    const priceUpdates$ = symbols.map(symbol => PricingService.getPriceUpdates({ symbol }))
    return combineLatest(priceUpdates$).pipe(
      scan((acc, prices) => {
        prices.map(priceMapper).forEach(price => {
          if (acc.has(price.symbol)) {
            price.lastMove = getPriceMovementType(acc.get(price.symbol)!, price)
          }
          acc.set(price.symbol, price)
        })

        return acc
      }, new Map<string, Price>())
    )
  })
)
