import { bind } from "@react-rxjs/core"
import { mergeWithKey } from "@react-rxjs/utils"
import { combineLatest, concat, race } from "rxjs"
import {
  distinctUntilChanged,
  map,
  scan,
  take,
  withLatestFrom,
} from "rxjs/operators"

import { PriceTick, PricingService } from "@/generated/TradingGateway"

import { withIsStaleData } from "../connection"
import { getCurrencyPair$ } from "../currencyPairs"
import { withConnection } from "../withConnection"
import { HistoryPrice, Price, PriceMovementType } from "./types"

export const calculateSpread = (
  ask: number,
  bid: number,
  ratePrecision: number,
  pipsPosition: number,
) =>
  ((ask - bid) * Math.pow(10, pipsPosition)).toFixed(
    ratePrecision - pipsPosition,
  )

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

export const [, getPriceUpdates$] = bind((symbol: string) =>
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
    withLatestFrom(getCurrencyPair$(symbol)),
    scan(
      (acc, [price, ccyPair]) => ({
        ...price,

        movementType:
          acc === undefined
            ? PriceMovementType.NONE
            : price.mid > acc.mid
              ? PriceMovementType.UP
              : PriceMovementType.DOWN,

        spread: calculateSpread(
          price.ask,
          price.bid,
          ccyPair.ratePrecision,
          ccyPair.pipsPosition,
        ),
      }),
      undefined as unknown as Price,
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
