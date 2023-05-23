import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  concat,
  map,
  merge,
  of,
  scan,
  share,
  switchMap,
  timer,
  withLatestFrom,
} from "rxjs"

import { currencyPairs$ } from "@/services/currencyPairs"
import { LimitCheckStatus, LimitCheckTrade } from "@/services/trades/types"

import { LimitCheckerRequest } from "./LimitChecker"

const [limitInput$, setLimit] = createSignal<Record<string, number>>()

const defaultLimits$ = currencyPairs$.pipe(
  map((currencyPairs) =>
    Object.keys(currencyPairs).reduce((ccyNotionalValues, symbol) => {
      const { defaultNotional } = currencyPairs[symbol]
      ccyNotionalValues[symbol] = defaultNotional
      return ccyNotionalValues
    }, {} as Record<string, number>),
  ),
)

const limits$ = merge(defaultLimits$, limitInput$).pipe(
  scan((acc, limits) => ({ ...acc, ...limits }), {} as Record<string, number>),
)

const [limitCheckRequest$, checkLimit] = createSignal<LimitCheckerRequest>()

const limitResult$ = limitCheckRequest$.pipe(
  withLatestFrom(limits$),
  map(([request, limits]) => ({
    result: request.notional <= limits[request.tradedCurrencyPair],
    request,
  })),
)

const [useLimitResult] = bind(
  limitResult$.pipe(
    switchMap((result) =>
      concat(of(result), timer(1000).pipe(map(() => null))),
    ),
  ),
  null,
)

limitResult$.subscribe(({ result, request }) =>
  fin.InterApplicationBus.publish(request.responseTopic, { result }),
)

const [useLimits] = bind(limits$, {})

let tradeId = 0

const tableRows$ = limitResult$.pipe(
  scan((acc, { request, result }) => {
    return [
      ...acc,
      {
        status: result ? LimitCheckStatus.Success : LimitCheckStatus.Failure,
        tradeId: tradeId++,
        symbol: request.tradedCurrencyPair,
        notional: request.notional,
        spotRate: request.rate,
      },
    ]
  }, [] as LimitCheckTrade[]),
  share(),
)

export { checkLimit, setLimit, tableRows$, useLimitResult, useLimits }
