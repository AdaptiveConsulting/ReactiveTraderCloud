import { combineLatest, firstValueFrom, switchMap } from 'rxjs'
import { PricingService } from '../generated/TradingGateway'
import { currencyPairSymbols$ } from './currencyPairs'

export const getPriceForSymbol$ = (symbol: string) => PricingService.getPriceUpdates({ symbol })

export const getPriceForSymbol = (symbol: string) => firstValueFrom(getPriceForSymbol$(symbol))

// TODO - Add movement
export const prices$ = currencyPairSymbols$.pipe(
  switchMap(symbols => {
    const priceUpdates$ = symbols.map(symbol => PricingService.getPriceUpdates({ symbol }))
    return combineLatest(priceUpdates$)
  })
)

export const getMarket = () => firstValueFrom(prices$)
