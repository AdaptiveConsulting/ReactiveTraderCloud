import { firstValueFrom } from "rxjs"
import { distinctUntilChanged, map, scan } from "rxjs/operators"
import { CurrencyPair, ReferenceDataService } from "@/generated/TradingGateway"

export const currencyPairs$ = ReferenceDataService.getCcyPairs().pipe(
  scan((acc, data) => {
    const { updates } = data
    const result = { ...acc }
    updates.forEach(({ type, payload }) => {
      const { symbol } = payload
      if (type === "removed") {
        delete result[symbol]
      } else {
        result[symbol] = payload
      }
    })
    return result
  }, {} as Record<string, CurrencyPair>),
)

export const getCurencyPair$ = (symbol: string) =>
  currencyPairs$.pipe(
    map((currencyPairs) => currencyPairs[symbol]),
    distinctUntilChanged(),
  )

export const getCurencyPair = (symbol: string) =>
  firstValueFrom(getCurencyPair$(symbol))

export const currencyPairSymbols$ = currencyPairs$.pipe(
  map((ccyPairs) => Object.keys(ccyPairs)),
)
