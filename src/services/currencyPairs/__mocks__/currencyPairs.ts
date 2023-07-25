import { bind } from "@react-rxjs/core"
import { defer, Observable, of } from "rxjs"
import { map } from "rxjs/operators"

import { UpdateType } from "@/services/utils"

import { CurrencyPair } from "../types"

let currencyPairsMocks$: Observable<Record<string, CurrencyPair>> = of({})

export const __setMock = (value: Observable<Record<string, CurrencyPair>>) => {
  currencyPairsMocks$ = value
}

export const __resetMock = () => {
  currencyPairsMocks$ = of({})
}

export const [useCurrencyPair, getCurrencyPair$] = bind((symbol: string) =>
  defer(() => currencyPairsMocks$.pipe(map((entries) => entries[symbol]))),
)

export const [useCurrencyPairs, currencyPairs$] = bind(
  defer(() => currencyPairsMocks$),
)

export const currencyPairUpdates$ = currencyPairs$.pipe(
  map((entries) =>
    Object.values(entries).map((currencyPair) => ({
      updateType: UpdateType.Added,
      currencyPair,
    })),
  ),
)
