import { bind } from "@react-rxjs/core"
import { mergeWithKey } from "@react-rxjs/utils"
import { concat, race } from "rxjs"
import { scan, map, take } from "rxjs/operators"
import { getRemoteProcedureCall$, getStream$ } from "../client"
import {
  RawPrice,
  PriceMovementType,
  HistoryPrice,
  Price,
  Request,
} from "./types"

const [, getPriceHistory$] = bind((symbol: string) =>
  getRemoteProcedureCall$<Price[], string>(
    "priceHistory",
    "getPriceHistory",
    symbol,
  ).pipe(map((x) => x.slice(x.length - HISTORY_SIZE))),
)

const [, getPriceUpdates$] = bind((symbol: string) =>
  getStream$<RawPrice, Request>("pricing", "getPriceUpdates", { symbol }).pipe(
    map((rawPrice) => ({
      ask: rawPrice.Ask,
      bid: rawPrice.Bid,
      mid: rawPrice.Mid,
      creationTimestamp: rawPrice.CreationTimestamp,
      symbol: rawPrice.Symbol,
      valueDate: rawPrice.ValueDate,
    })),
  ),
)

export const [usePrice, getPrice$] = bind((symbol: string) =>
  race([
    getPriceUpdates$(symbol),
    concat(
      getPriceHistory$(symbol)
        .pipe(map((x) => x[x.length - 1]))
        .pipe(take(1)),
      getPriceUpdates$(symbol),
    ),
  ]).pipe(
    scan(
      (acc, price) => ({
        ...price,
        movementType:
          acc === undefined
            ? PriceMovementType.NONE
            : price.mid > acc.mid
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
  mergeWithKey(
    {
      init: getPriceHistory$(symbol).pipe(take(1)),
      update: getPriceUpdates$(symbol),
    },
    1,
  ).pipe(
    scan((acc, event) => {
      if (event.type === "init") return event.payload
      const result = acc.concat(event.payload)
      return result.length <= HISTORY_SIZE ? result : result.slice(1)
    }, [] as HistoryPrice[]),
  ),
)
