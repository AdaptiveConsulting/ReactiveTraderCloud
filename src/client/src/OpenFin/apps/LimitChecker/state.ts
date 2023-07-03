import { bind } from "@react-rxjs/core"
import { createKeyedSignal, createSignal } from "@react-rxjs/utils"
import { concat, map, switchMap, take } from "rxjs"

import { mapToFormattedNotional } from "@/App/LiveRates/Tile/Notional"
import { currencyPairs$ } from "@/services/currencyPairs"

export interface LimitCheckerRequest {
  id: string
  responseTopic: string
  tradedCurrencyPair: string
  notional: string
  rate: string
}

const [limitInputValue$, onChangeLimitValue] = createKeyedSignal(
  (limit) => limit.symbol,
  (symbol: string, value: string) => ({ symbol, value }),
)

const [useLimit, limitBySymbol$] = bind((symbol: string) =>
  concat(
    currencyPairs$.pipe(
      take(1),
      map((currencyPairs) => ({
        symbol,
        value: currencyPairs[symbol].defaultNotional.toString(),
      })),
    ),
    limitInputValue$(symbol),
  ).pipe(mapToFormattedNotional(({ value }) => value, ["k", "m"])),
)

const [limitCheckRequest$, checkLimit] = createSignal<LimitCheckerRequest>()

const limitResult$ = limitCheckRequest$.pipe(
  switchMap((request) =>
    limitBySymbol$(request.tradedCurrencyPair).pipe(
      take(1),
      map(([value, formattedValue]) => ({
        notional: formattedValue,
        result: Number(request.notional) <= value,
        request,
      })),
    ),
  ),
)

limitResult$.subscribe(({ result, request }) => {
  window.fdc3.broadcast({
    type: `result-${request.id}`,
    id: { result: result.toString(), ccy: request.tradedCurrencyPair },
  })
})

export { checkLimit, limitResult$, onChangeLimitValue, useLimit }
