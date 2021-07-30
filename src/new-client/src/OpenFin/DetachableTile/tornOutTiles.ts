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
import { Offset } from "@/utils"

type TearOutEntry = [string, boolean]

const [tearOutEntry$, tearOut] = createSignal<TearOutEntry>()

const calculateOpeningWindowCoords = async (coords: Offset) => {
  if (fin) {
    const view = await fin.View.getCurrent()
    const window = await view.getCurrentWindow()
    const viewBounds = await view.getBounds()
    const windowBounds = await window.getBounds()
    return {
      x: coords.x + viewBounds.left + windowBounds.left - 20,
      y: coords.y + viewBounds.top + windowBounds.top - 20,
    }
  }

  return coords
}

export const onTearOut = async (symbol: string, coords: Offset) => {
  const position = await calculateOpeningWindowCoords(coords)
  const options = {
    name: symbol,
    url: `/spot/${symbol}?tileView=Analytics`,
    width: 380,
    height: 200,
    includeInSnapshots: false,
    ...position,
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
