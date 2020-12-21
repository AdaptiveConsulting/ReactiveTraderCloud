import { bind } from "@react-rxjs/core"
import { concat } from "rxjs"
import { scan, take, mergeAll, debounceTime } from "rxjs/operators"
import { getRemoteProcedureCall$, getStream$ } from "./client"
import { CamelCase } from "./utils"

interface RawPrice {
  Ask: number
  Bid: number
  Mid: number
  CreationTimestamp: number
  Symbol: string
  ValueDate: string
}

export enum PriceMovementType {
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

const HISTORY_TIMESTAMP_THRESHOLD = 1000
const HISTORY_SIZE = 100
export const [useHistoricalPrices, getHistoricalPrices$] = bind<
  [string],
  HistoryPrice[]
>((symbol: string) =>
  concat(
    getRemoteProcedureCall$<HistoryPrice[], string>(
      "priceHistory",
      "getPriceHistory",
      symbol,
    ).pipe(mergeAll(), take(100)),
    getPrice$(symbol),
  ).pipe(
    scan((acc, price) => {
      if (acc.length === 0) return [price]
      const last = acc[acc.length - 1]
      const diff = price.creationTimestamp - last.creationTimestamp
      if (diff < HISTORY_TIMESTAMP_THRESHOLD) return acc
      if (acc.length < HISTORY_SIZE) return acc.concat(price)
      const result = acc.slice(1)
      if (price.symbol) result.push(price)
      return result
    }, [] as HistoryPrice[]),
    debounceTime(0),
  ),
)
