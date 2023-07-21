import { bind } from "@react-rxjs/core"
import { Observable } from "rxjs/internal/Observable"
import { map, scan, startWith } from "rxjs/operators"

import { withIsStaleData } from "../connection"
import { executions$ } from "../executions"
import { mockCreditTrades } from "./__mocks__/creditTrades"
import { Trade } from "./types"

export const [useTrades, trades$] = bind<Trade[]>(
  executions$.pipe(
    scan(
      (acc, trade) => ({
        ...acc,
        [trade.tradeId]: trade,
      }),
      {} as Record<string, Trade>,
    ),
    map((trades) => {
      return Object.values(trades).reverse()
    }),
    startWith([]),
  ),
)

export const isBlotterDataStale$ = withIsStaleData(trades$)

const fakeCreditStream$ = new Observable<Trade[]>((subscriber) => {
  subscriber.next(mockCreditTrades)
  subscriber.complete()
})

export const [useCreditTrades, creditTrades$] = bind<Trade[]>(
  fakeCreditStream$,
  [],
)
