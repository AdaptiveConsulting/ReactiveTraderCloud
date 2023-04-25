import {
  combineLatest,
  firstValueFrom,
  scan,
  switchMap,
  withLatestFrom,
} from "rxjs"
import { PriceTick, PricingService } from "@/generated/TradingGateway"
import { currencyPairSymbols$, getCurencyPair$ } from "./currencyPairs"

export interface Price extends PriceTick {
  lastMove: "up" | "down" | "none"
  spread: string
}

const getPriceMovementType = (prevItem: Price, newItem: Price) => {
  const prevPriceMove = prevItem.lastMove
  const lastPrice = prevItem.mid
  const nextPrice = newItem.mid
  if (lastPrice < nextPrice) {
    return "up"
  }
  if (lastPrice > nextPrice) {
    return "down"
  }
  return prevPriceMove
}

const calculateSpread = (
  ask: number,
  bid: number,
  ratePrecision: number,
  pipsPosition: number,
) =>
  ((ask - bid) * Math.pow(10, pipsPosition)).toFixed(
    ratePrecision - pipsPosition,
  )

const priceMapper = (price: PriceTick): Price => ({
  ask: price.ask,
  bid: price.bid,
  mid: price.mid,
  creationTimestamp: price.creationTimestamp,
  symbol: price.symbol,
  valueDate: price.valueDate,
  lastMove: "none",
  spread: "0",
})

export const getPriceForSymbol$ = (symbol: string) =>
  PricingService.getPriceUpdates({ symbol }).pipe(
    withLatestFrom(getCurencyPair$(symbol)),
    scan((acc, [priceTick, currencyPair]) => {
      const price = priceMapper(priceTick)
      price.lastMove = getPriceMovementType(acc, price)
      price.spread = calculateSpread(
        price.ask,
        price.bid,
        currencyPair.ratePrecision,
        currencyPair.pipsPosition,
      )

      return price
    }, {} as Price),
  )

export const prices$ = currencyPairSymbols$.pipe(
  switchMap((symbols) => {
    const priceUpdates$ = symbols.map((symbol) =>
      PricingService.getPriceUpdates({ symbol }),
    )
    return combineLatest(priceUpdates$).pipe(
      scan((acc, prices) => {
        prices.map(priceMapper).forEach((price) => {
          if (acc.has(price.symbol)) {
            price.lastMove = getPriceMovementType(acc.get(price.symbol)!, price)
          }
          acc.set(price.symbol, price)
        })

        return acc
      }, new Map<string, Price>()),
    )
  }),
)

export const getMarket = () => firstValueFrom(prices$)
