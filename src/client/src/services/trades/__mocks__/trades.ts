import { Observable, defer, EMPTY } from "rxjs"
import type { Trade } from "../types"

let _trades$: Observable<Trade[]>

export let trades$ = defer(() => _trades$)

export const __setTrades = (input: Observable<Trade[]>) => {
  _trades$ = input
}

export const __resetMocks = () => {
  _trades$ = EMPTY
}
