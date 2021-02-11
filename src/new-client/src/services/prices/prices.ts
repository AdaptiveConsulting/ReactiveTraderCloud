import { bind } from "@react-rxjs/core"
import { concat } from "rxjs"
import { scan, mergeAll, debounceTime } from "rxjs/operators"
import { getRemoteProcedureCall$, getStream$ } from "../client"
import {
  RawPrice,
  PriceMovementType,
  HistoryPrice,
  Price,
  Request,
} from "./types"

export const [usePrice, getPrice$] = bind((symbol: string) =>
  getStream$<RawPrice, Request>("pricing", "getPriceUpdates", { symbol }).pipe(
    scan<RawPrice, Price>(
      (acc, price) => ({
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
      }),
      (undefined as any) as Price,
    ),
  ),
)

const HISTORY_SIZE = 50
export const [useHistoricalPrices, getHistoricalPrices$] = bind<
  [string],
  HistoryPrice[]
>((symbol: string) =>
  concat(
    getRemoteProcedureCall$<HistoryPrice[], string>(
      "priceHistory",
      "getPriceHistory",
      symbol,
    ).pipe(mergeAll()),
    getPrice$(symbol),
  ).pipe(
    scan((acc, price) => {
      const result = acc.concat(price)
      return result.length <= HISTORY_SIZE ? result : result.slice(1)
    }, [] as HistoryPrice[]),
    debounceTime(0),
  ),
)
