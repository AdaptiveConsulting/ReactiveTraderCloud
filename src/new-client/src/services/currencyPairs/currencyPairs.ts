import { bind } from "@react-rxjs/core"
import {
  distinctUntilChanged,
  map,
  mergeAll,
  scan,
  share,
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
  mergeAll(),
  share(),
)

export const [useCurrencyPairs, currencyPairs$] = bind(
  currencyPairUpdates$.pipe(
    scan((acc, { updateType, currencyPair }) => {
      const { symbol } = currencyPair
      if (updateType === UpdateType.Removed) {
        delete acc[symbol]
      } else {
        acc[symbol] = currencyPair
      }
      return acc
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
