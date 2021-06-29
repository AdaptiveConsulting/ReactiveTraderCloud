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
import { closeWindow, openWindow } from "../utils/window"

type TearOutEntry = [string, boolean]

const [tearOutEntry$, tearOut] = createSignal<TearOutEntry>()

export const onTearOut = (symbol: string) => {
  const options = {
    name: symbol,
    url: `/spot/${symbol}?tileView=Analytics`,
    width: 380,
    height: 200,
  }

  openWindow(options, () => {
    tearOut([symbol, false])
  })

  tearOut([symbol, true])
}

export const onClose = () => {
  closeWindow()
}

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
