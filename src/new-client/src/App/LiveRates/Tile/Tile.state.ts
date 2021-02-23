import { collect, createListener, split } from "@react-rxjs/utils"
import { Direction } from "services/trades"
import {
  exhaustMap,
  filter,
  map,
  mapTo,
  pluck,
  startWith,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { concat, EMPTY, of, race, timer } from "rxjs"
import { getPrice$ } from "services/prices"
import { ExecutionTrade, execute$, ExecutionStatus } from "services/executions"
import { getCurrencyPair$ } from "services/currencyPairs"
import { emitTooLongMessage } from "utils/emitTooLong"
import { bind } from "@react-rxjs/core"

// Notional
const DEFAULT_NOTIONAL = 1_000_000

const [rawNotional$, onChangeNotionalValue] = createListener<{
  symbol: string
  value: string
}>()

const mapNotionals$ = rawNotional$.pipe(
  split(
    (e) => e.symbol,
    (rawNotional$) =>
      rawNotional$.pipe(
        pluck("value"),
        filter((value) => !Number.isNaN(Number(value))),
      ),
  ),
  collect(),
)
mapNotionals$.subscribe()

const [useNotional, getNotional$] = bind(
  (symbol: string) =>
    mapNotionals$.pipe(
      exhaustMap((map) => (map.has(symbol) ? map.get(symbol)! : EMPTY)),
    ),
  DEFAULT_NOTIONAL.toString(10),
)

export { onChangeNotionalValue, useNotional }

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

export const [useTileState, getTileState$] = bind((symbol: string) =>
  executionsMap$.pipe(
    exhaustMap((map) => (map.has(symbol) ? map.get(symbol)! : of(READY))),
  ),
)
