import { bind } from "@react-rxjs/core"
import { concat } from "rxjs"
import { scan, mergeAll, debounceTime } from "rxjs/operators"
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
