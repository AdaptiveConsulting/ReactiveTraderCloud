import { bind } from "@react-rxjs/core"
import { split } from "@react-rxjs/utils"
import { concat, EMPTY, merge } from "rxjs"
import {
  distinctUntilChanged,
  map,
  mergeMap,
  scan,
  switchMap,
  take,
} from "rxjs/operators"
import { getRemoteProcedureCall$, getStream$ } from "./client"
import { currencyPairs$, currencyPairUpdates$ } from "./currencyPairs"
import { CamelCase, UpdateType } from "./utils"

interface RawPrice {
  Ask: number
  Bid: number
  Mid: number
  CreationTimestamp: number
  Symbol: string
  ValueDate: string
}

enum PriceMovementType {
  UP,
  DOWN,
  NONE,
}

type HistoryPrice = CamelCase<RawPrice>

export interface Price extends HistoryPrice {
  movementType: PriceMovementType
}

interface Request {
  symbol: string
}

export const [usePrice, getPrice$] = bind((symbol: string) =>
  getStream$<RawPrice, Request>("pricing", "getPriceUpdates", { symbol }).pipe(
    scan<RawPrice, Price>((acc, price) => ({
      ask: price.Ask,
      bid: price.Bid,
      mid: price.Mid,
      creationTimestamp: price.CreationTimestamp,
      symbol: price.Symbol,
      valueDate: price.ValueDate,
      movementType:
        acc === undefined
          ? PriceMovementType.NONE
          : price.Mid > acc.mid
          ? PriceMovementType.UP
          : PriceMovementType.DOWN,
    })),
  ),
)

export const [
  useHistoricalPrices,
  getHistoricalPrices$,
] = bind((symbol: string) =>
  getRemoteProcedureCall$<HistoryPrice[], string>(
    "priceHistory",
    "getPriceHistory",
    symbol,
  ),
)

export const tilesSubscription$ = concat(
  currencyPairs$.pipe(
    take(1),
    mergeMap((ccPairs) => Object.values(ccPairs)),
    map((currencyPair) => ({ currencyPair, updateType: UpdateType.Added })),
  ),
  currencyPairUpdates$,
).pipe(
  split(
    (update) => update.currencyPair.symbol,
    (update$, key) =>
      update$.pipe(
        distinctUntilChanged((a, b) => a.updateType === b.updateType),
        switchMap((update) =>
          update.updateType === UpdateType.Removed
            ? EMPTY
            : merge(getPrice$(key), getHistoricalPrices$(key)),
        ),
      ),
  ),
)
