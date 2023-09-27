import { defer, EMPTY, Observable, of } from "rxjs"

import type { Trade } from "../types"

let _trades$: Observable<Trade[]>

export const tradesStream$ = EMPTY

export const trades$ = defer(() => _trades$)

export const __setTrades = (input: Observable<Trade[]>) => {
  _trades$ = input
}

export const __resetMocks = () => {
  _trades$ = EMPTY
}

export const isBlotterDataStale$ = of(false)
