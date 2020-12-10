import { bind, shareLatest } from "@react-rxjs/core"
import { createListener } from "@react-rxjs/utils"
import { combineLatest, merge } from "rxjs"
import { map, mergeAll, scan, share, startWith } from "rxjs/operators"
import { getStream$ } from "./client"
import {
  CamelCase,
  CollectionUpdate,
  CollectionUpdates,
  UpdateType,
} from "./utils"

interface CurrencyRaw {
  Symbol: string
  RatePrecision: number
  PipsPosition: number
}

interface RawCurrencyPairUpdate extends CollectionUpdate {
  CurrencyPair: CurrencyRaw
}

interface RawCurrencyPairUpdates extends CollectionUpdates {
  Updates: RawCurrencyPairUpdate[]
}

export interface CurrencyPair extends CamelCase<CurrencyRaw> {
  base: string
  terms: string
}

const currencyPairMapper = (input: CurrencyRaw): CurrencyPair => ({
  symbol: input.Symbol,
  ratePrecision: input.RatePrecision,
  pipsPosition: input.PipsPosition,
  base: input.Symbol.substr(0, 3),
  terms: input.Symbol.substr(3, 3),
})

export const currencyPairUpdates$ = getStream$<RawCurrencyPairUpdates>(
  "reference",
  "getCurrencyPairUpdatesStream",
  {},
).pipe(
  map(({ Updates }) =>
    Updates.map((update) => ({
      updateType: update.UpdateType,
      currencyPair: currencyPairMapper(update.CurrencyPair),
    })),
  ),
  mergeAll(),
  share(),
)

export const ALL_CURRENCIES = Symbol("all")
type AllCurrencies = typeof ALL_CURRENCIES

const [selectedCurrencyInput$, onSelectCurrency] = createListener<
  string | AllCurrencies
>()
const [useSelectedCurrency, selectedCurrency$] = bind(
  selectedCurrencyInput$.pipe(startWith(ALL_CURRENCIES)),
  ALL_CURRENCIES,
)

const [useCurrencyPairs, currencyPairs$] = bind(currencyPairUpdates$.pipe(
  scan((acc, { updateType, currencyPair }) => {
    const { symbol } = currencyPair
    if (updateType === UpdateType.Removed) {
      delete acc[symbol]
    } else {
      acc[symbol] = currencyPair
    }
    return acc
  }, {} as Record<string, CurrencyPair>),
  shareLatest(),
  )
)

const [useFilteredSymbols, filteredSymbols$] = bind(
  combineLatest([currencyPairs$, selectedCurrency$]).pipe(
    map(([currencyPairs, selectedCurrency]) => {
      const allSymbols = Object.keys(currencyPairs)
      return selectedCurrency === ALL_CURRENCIES
        ? allSymbols
        : allSymbols.filter((symbol) => symbol.includes(selectedCurrency))
    }),
  ),
)

const [useCurrencies, currencies$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs)
          .map((currencyPair) => [currencyPair.base, currencyPair.terms])
          .flat(),
      ),
    ]),
  ),
)

export {
  useSelectedCurrency,
  useFilteredSymbols,
  useCurrencies,
  onSelectCurrency,
  useCurrencyPairs,
  currencyPairs$,
  filteredSymbols$,
  currencies$
}
export const subscriptions$ = merge(currencies$, filteredSymbols$)
