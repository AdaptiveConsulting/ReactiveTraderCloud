import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { from, merge } from "rxjs"
import {
  distinctUntilChanged,
  groupBy,
  map,
  mergeMap,
  scan,
} from "rxjs/operators"
import { CurrencyPair, currencyPairs$ } from "@/services/currencyPairs"

type TearOutEntry = [string, boolean, HTMLDivElement?]

export const [tearOutEntry$, tearOut] = createSignal(
  (symbol: string, bool: boolean, ref?: HTMLDivElement): TearOutEntry => [
    symbol,
    bool,
    ref,
  ],
)

type TearOutState = Record<string, boolean>

export const [useTearOutState, tearOutState$] = bind<TearOutState>(
  merge(
    currencyPairs$.pipe(
      mergeMap((currencyPairs) => from(Object.values(currencyPairs))),
      groupBy((currencyPair) => currencyPair.symbol),
      mergeMap((currencyPair$) =>
        currencyPair$.pipe(
          distinctUntilChanged(),
          map<CurrencyPair, TearOutEntry>((currencyPair) => [
            currencyPair.symbol,
            false,
          ]),
        ),
      ),
    ),
    tearOutEntry$,
  ).pipe(scan((acc, [key, tornOut]) => ({ ...acc, [key]: tornOut }), {})),
)

export const [useTearOutEntry] = bind<TearOutEntry | null>(tearOutEntry$, null)
