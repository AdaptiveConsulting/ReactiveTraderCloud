import { combineLatest, firstValueFrom, switchMap } from 'rxjs'
import { PricingService } from '../generated/TradingGateway'
import { currencyPairSymbols$ } from './currencyPairs'

export const getPriceForSymbol = (symbol: string) =>
  firstValueFrom(PricingService.getPriceUpdates({ symbol }))

// TODO - Add movement
const prices$ = currencyPairSymbols$.pipe(
  switchMap(symbols => {
    const priceUpdates$ = symbols.map(symbol => PricingService.getPriceUpdates({ symbol }))
    return combineLatest(priceUpdates$)
  })
)

export const getMarket = () => firstValueFrom(prices$)