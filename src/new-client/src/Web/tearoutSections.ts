import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map } from "rxjs/operators"

type TearOutEntry = [boolean, HTMLDivElement?]

export const [tearOutEntryTiles$, tearOutTiles] = createSignal(
  (bool: boolean, ref?: HTMLDivElement): TearOutEntry => [bool, ref],
)

export const [tearOutEntryAnalytics$, tearOutAnalytics] = createSignal(
  (bool: boolean, ref?: HTMLDivElement): TearOutEntry => [bool, ref],
)

export const [tearOutEntryTrades$, tearOutTrades] = createSignal(
  (bool: boolean, ref?: HTMLDivElement): TearOutEntry => [bool, ref],
)

export const [useTearOutTileState, tearOutTileState$] = bind(
  (id: string) =>
    tearOutEntryTiles$.pipe(
      map((val: Array<any>) => {
        return val[0]
      }),
    ),
  false,
)

export const [useTearOutAnalyticsState, tearOutAnalyticsState$] = bind(
  (id: string) =>
    tearOutEntryAnalytics$.pipe(
      map((val: Array<any>) => {
        return val[0]
      }),
    ),
  false,
)

export const [useTearOutTradeState, tearOutTradeState$] = bind(
  (id: string) =>
    tearOutEntryTrades$.pipe(
      map((val: Array<any>) => {
        return val[0]
      }),
    ),
  false,
)
