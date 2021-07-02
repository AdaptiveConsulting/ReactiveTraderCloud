import { PriceTick, PricingService } from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { mergeWithKey } from "@react-rxjs/utils"
import { combineLatest, concat, race } from "rxjs"
import { scan, map, take, distinctUntilChanged } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { withConnection } from "../withConnection"
import { PriceMovementType, HistoryPrice, Price } from "./types"

const priceMappper = (input: PriceTick): HistoryPrice => ({
  ask: input.ask,
  bid: input.bid,
  mid: input.mid,
  creationTimestamp: Number(input.creationTimestamp), // TODO: talk with hydra team about this
  symbol: input.symbol,
  valueDate: input.valueDate, // TODO: talk with hydra team about this
})

const [, getPriceHistory$] = bind((symbol: string) =>
  PricingService.getPriceHistory({ symbol }).pipe(
    withConnection(),
    map(({ prices }) =>
      prices.slice(prices.length - HISTORY_SIZE).map(priceMappper),
    ),
  ),
)

const [, getPriceUpdates$] = bind((symbol: string) =>
  PricingService.getPriceUpdates({ symbol }).pipe(
    withConnection(),
    map(priceMappper),
  ),
)

export const [, getIsSymbolDataStale$] = bind((symbol: string) =>
  combineLatest([
    withIsStaleData(getPriceHistory$(symbol)),
    withIsStaleData(getPriceUpdates$(symbol)),
  ]).pipe(
    map(([a, b]) => a || b),
    distinctUntilChanged(),
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
      undefined as any as Price,
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
