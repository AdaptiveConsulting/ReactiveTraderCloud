import { bind } from "@react-rxjs/core"
import { split } from "@react-rxjs/utils"
import { concat, Observable } from "rxjs"
import {
  distinctUntilChanged,
  map,
  mergeAll,
  mergeMap,
  scan,
  share,
  skip,
  switchMap,
  take,
} from "rxjs/operators"
import { getStream$ } from "../client"
import { UpdateType } from "../utils"
import { CurrencyRaw, CurrencyPair, RawCurrencyPairUpdates } from "./types"

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
  share(),
)

export const [useCurrencyPairs, currencyPairs$] = bind(
  currencyPairUpdates$.pipe(
    scan((acc, updates) => {
      const result = { ...acc }
      updates.forEach(({ updateType, currencyPair }) => {
        const { symbol } = currencyPair
        if (updateType === UpdateType.Removed) {
          delete result[symbol]
        } else {
          result[symbol] = currencyPair
        }
      })
      return result
    }, {} as Record<string, CurrencyPair>),
  ),
)

export const [useCurrencyPair, getCurrencyPair$] = bind((symbol: string) =>
  currencyPairs$.pipe(
    map((currencyPairs) => currencyPairs[symbol]),
    distinctUntilChanged(),
  ),
)

export const [useCurrencies, currencies$] = bind(
  currencyPairs$.pipe(
    map((currencyPairs) => [
      ...new Set(
        Object.values(currencyPairs).map((currencyPair) => currencyPair.base),
      ),
    ]),
  ),
)

export const currencyPairDependant$ = (
  input: (symbol: string) => Observable<any>,
) =>
  concat(
    currencyPairs$.pipe(
      take(1),
      mergeMap((ccPairs) => Object.values(ccPairs)),
      map((currencyPair) => ({ currencyPair, updateType: UpdateType.Added })),
    ),
    currencyPairUpdates$.pipe(mergeAll()),
  ).pipe(
    split(
      (update) => update.currencyPair.symbol,
      (update$, key) =>
        update$.pipe(
          distinctUntilChanged((a, b) => a.updateType === b.updateType),
          take(2),
          switchMap((update) =>
            update.updateType === UpdateType.Removed ? [] : input(key),
          ),
        ),
    ),
    mergeAll(),
  )
