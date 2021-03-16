import {
  collect,
  createListener,
  getGroupedObservable,
  split,
} from "@react-rxjs/utils"
import { Direction } from "@/services/trades"
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  mergeMap,
  pluck,
  startWith,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { concat, merge, race, timer } from "rxjs"
import { getPrice$ } from "@/services/prices"
import {
  ExecutionTrade,
  execute$,
  ExecutionStatus,
} from "@/services/executions"
import { currencyPairs$, getCurrencyPair$ } from "@/services/currencyPairs"
import { emitTooLongMessage } from "@/utils/emitTooLong"
import { bind } from "@react-rxjs/core"
import { symbolBind } from "./Tile.context"

// Notional
const [rawNotional$, onChangeNotionalValue] = createListener<{
  symbol: string
  value: string
}>()

const initialNotionals$ = currencyPairs$.pipe(
  mergeMap((pairs) =>
    Object.values(pairs).map(({ symbol, defaultNotional: value }) => ({
      symbol,
      value,
    })),
  ),
)

const mapNotionals$ = merge(rawNotional$, initialNotionals$).pipe(
  split(
    (e) => e.symbol,
    (rawNotional$) =>
      rawNotional$.pipe(
        pluck("value"),
        filter((value) => !Number.isNaN(Number(value))),
        map(Number),
      ),
  ),
  collect(),
)

const [useNotional, getNotional$] = symbolBind((symbol) =>
  getGroupedObservable(mapNotionals$, symbol),
)

export const [useDefaultNotional, defaultNotional$] = symbolBind((symbol) =>
  currencyPairs$.pipe(map((pairs) => pairs[symbol]?.defaultNotional ?? 0)),
)
export { onChangeNotionalValue, useNotional, getNotional$ }

// Dismiss Message
const DISMISS_TIMEOUT = 5_000
const [dismiss$, onDismissMessage] = createListener<string>()
export { onDismissMessage }

const waitForDismissal$ = (symbol: string) =>
  dismiss$.pipe(
    filter((s) => s === symbol),
    take(1),
  )

// Executions
const [tileExecutions$, sendExecution] = createListener<{
  symbol: string
  direction: Direction
}>()
export { sendExecution }

// TileState
export enum TileStates {
  Ready,
  Started,
  TooLong,
  Timeout,
  Finished,
}

interface NoTradeState {
  status:
    | TileStates.Ready
    | TileStates.Started
    | TileStates.TooLong
    | TileStates.Timeout
  trade?: undefined
}

interface TradeState {
  status: TileStates.Finished
  trade: ExecutionTrade
}

export type TileState = TradeState | NoTradeState

const READY: NoTradeState = { status: TileStates.Ready }
const STARTED: NoTradeState = { status: TileStates.Started }
const TOO_LONG: NoTradeState = { status: TileStates.TooLong }
const TIMEOUT: NoTradeState = { status: TileStates.Timeout }

const executionsMap$ = tileExecutions$.pipe(
  split(
    (e) => e.symbol,
    (execution$, symbol) =>
      execution$.pipe(
        withLatestFrom(
          getNotional$(symbol),
          getPrice$(symbol),
          getCurrencyPair$(symbol),
        ),
        map(([{ direction }, notional, price, { base, terms, symbol }]) => ({
          id: getId(),
          currencyPair: symbol,
          dealtCurrency: direction === Direction.Buy ? base : terms,
          direction,
          notional: Number(notional),
          spotRate: direction === Direction.Buy ? price.ask : price.bid,
        })),
        exhaustMap((request) =>
          concat(
            execute$(request).pipe(
              map((trade) =>
                trade.status === ExecutionStatus.Timeout
                  ? TIMEOUT
                  : { status: TileStates.Finished as const, trade },
              ),
              emitTooLongMessage(TAKING_TOO_LONG, TOO_LONG),
              startWith(STARTED),
            ),
            race([
              waitForDismissal$(request.currencyPair),
              timer(DISMISS_TIMEOUT),
            ]).pipe(mapTo(READY)),
          ),
        ),
      ),
  ),
  collect(),
)
executionsMap$.subscribe()

let nextId = 1
const getId = () => (nextId++).toString()

const TAKING_TOO_LONG = 2_000

export const [useTileState, getTileState$] = bind(
  (symbol: string) => getGroupedObservable(executionsMap$, symbol),
  READY,
)
