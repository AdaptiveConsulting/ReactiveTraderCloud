import { bind } from "@react-rxjs/core"
import { split } from "@react-rxjs/utils"
import { concat, defer, Observable, of } from "rxjs"
import {
  distinctUntilChanged,
  map,
  mergeAll,
  mergeMap,
  switchMap,
  take,
} from "rxjs/operators"
import { UpdateType } from "@/services/utils"
import { CurrencyPair } from "../types"

let ccMocks$: Record<string, Observable<CurrencyPair>> = {}
let currenciesMocks$: Observable<String[]> = of([])
let currencyPairsMocks$: Record<string, CurrencyPair> = {}
let currencyUpdateMocks$: any = {}

export const __setCurrencyPairMock = (
  key: string,
  value: Observable<CurrencyPair>,
) => {
  ccMocks$[key] = value
}

export const __resetCurrencyPairMocks = () => {
  ccMocks$ = {}
}

export const [useCurrencyPair, getCurrencyPair$] = bind((symbol: string) =>
  defer(() => ccMocks$[symbol]),
)

export const __setCurrenciesMock = (value: Observable<String[]>) => {
  currenciesMocks$ = value
}

export const __resetCurrenciesMocks = () => {
  currenciesMocks$ = of([])
}

export const [useCurrencies, currencies$] = bind(
  defer(() => {
    return currenciesMocks$
  }),
)

export const __setCurrencyPairsMock = (key: string, value: CurrencyPair) => {
  currencyPairsMocks$[key] = value
}

export const __resetCurrencyPairsMocks = () => {
  currencyPairsMocks$ = {}
}

export const [useCurrencyPairs, currencyPairs$] = bind(
  defer(() => of(currencyPairsMocks$)),
)

export const __setCurrencyUpdateMock = (value: any) => {
  currencyUpdateMocks$ = value
}

export const __resetCurrencyUpdateMocks = () => {
  currencyUpdateMocks$ = {}
}

export const currencyPairUpdates$ = defer(() => of(currencyUpdateMocks$))

export const __resetMocks = () => {
  __resetCurrencyPairMocks()
  __resetCurrenciesMocks()
  __resetCurrencyPairsMocks()
}

export const currencyPairDependant$ = (
  input: (symbol: string) => Observable<any>,
) =>
  concat(
    currencyPairs$.pipe(
      take(1),
      mergeMap((ccPairs) => Object.values(ccPairs)),
      map((currencyPair) => ({ currencyPair, updateType: UpdateType.Added })),
    ),
    currencyPairUpdates$,
  ).pipe(
    split(
      (update) => update.currencyPair.symbol,
      (update$, key) =>
        update$.pipe(
          distinctUntilChanged((a, b) => a.updateType === b.updateType),
          take(2),
          switchMap((update) =>
            update.updateType === UpdateType.Removed ? [] : input(key),
          ),
        ),
    ),
    mergeAll(),
  )
