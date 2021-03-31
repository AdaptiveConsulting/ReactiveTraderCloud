import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, map, scan, share } from "rxjs/operators"
import { getStream$ } from "../client"
import { UpdateType } from "../utils"
import { CurrencyRaw, CurrencyPair, RawCurrencyPairUpdates } from "./types"

const currencyPairMapper = (input: CurrencyRaw): CurrencyPair => ({
  symbol: input.Symbol,
  ratePrecision: input.RatePrecision,
  pipsPosition: input.PipsPosition,
  base: input.Symbol.substr(0, 3),
  terms: input.Symbol.substr(3, 3),
  defaultNotional: input.Symbol === "NZDUSD" ? 10_000_000 : 1_000_000,
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
