import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map, merge, scan, share, withLatestFrom } from "rxjs"

import { currencyPairs$ } from "@/services/currencyPairs"
import { LimitCheckStatus, LimitCheckTrade } from "@/services/trades/types"

export interface LimitCheckerRequest {
  id: string
  responseTopic: string
  tradedCurrencyPair: string
  notional: string
  rate: string
}

const defaultLimits$ = currencyPairs$.pipe(
  map((currencyPairs) =>
    Object.keys(currencyPairs).reduce((ccyNotionalValues, symbol) => {
      const { defaultNotional } = currencyPairs[symbol]
      ccyNotionalValues[symbol] = defaultNotional
      return ccyNotionalValues
    }, {} as Record<string, number>),
  ),
)

const [limitInput$, setLimit] = createSignal<Record<string, number>>()

const limits$ = merge(defaultLimits$, limitInput$).pipe(
  scan((acc, limits) => ({ ...acc, ...limits }), {} as Record<string, number>),
)

const [useLimit] = bind(
  (symbol: string) => limits$.pipe(map((limits) => limits[symbol])),
  0,
)

const [limitCheckRequest$, checkLimit] = createSignal<LimitCheckerRequest>()

const limitResult$ = limitCheckRequest$.pipe(
  map((request) => ({
    ...request,
    notional: parseFloat(request.notional),
    rate: parseFloat(request.rate),
  })),
  withLatestFrom(limits$),
  map(([request, limits]) => ({
    result: request.notional <= limits[request.tradedCurrencyPair],
    request,
  })),
)

limitResult$.subscribe(({ result, request }) => {
  window.fdc3.broadcast({
    type: `result-${request.id}`,
    id: { result: result.toString(), ccy: request.tradedCurrencyPair },
  })
})

let tradeId = 0

const tableRows$ = limitResult$.pipe(
  scan((acc, { request, result }) => {
    return [
      {
        status: result ? LimitCheckStatus.Success : LimitCheckStatus.Failure,
        tradeId: tradeId++,
        symbol: request.tradedCurrencyPair,
        notional: request.notional,
        spotRate: request.rate,
      },
      ...acc,
    ]
  }, [] as LimitCheckTrade[]),
  share(),
)

export { checkLimit, setLimit, tableRows$, useLimit }
