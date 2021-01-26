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
import { concat, EMPTY, Observable, race, timer } from "rxjs"
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

// Execution
const [tileExecutions$, sendExecution] = createListener<{
  symbol: string
  direction: Direction
}>()
export { sendExecution }

const mapExecutions$ = tileExecutions$.pipe(
  split((e) => e.symbol),
  collect(),
)

// Dismiss Message
const DISMISS_TIMEOUT = 5_000
const [dismiss$, onDismissMessage] = createListener<string>()
export { onDismissMessage }

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

let nextId = 1
const getId = () => (nextId++).toString()
const TAKING_TOO_LONG = 2_000

export const [useTileState] = bind(
  (symbol: string) =>
    mapExecutions$.pipe(
      exhaustMap((map) => (map.has(symbol) ? map.get(symbol)! : EMPTY)),
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
      exhaustMap((execution) =>
        concat(
          execute$(execution).pipe(
            map((trade) =>
              trade.status === ExecutionStatus.Timeout
                ? { status: TileStates.Timeout }
                : { status: TileStates.Finished, trade },
            ),
            emitTooLongMessage(TAKING_TOO_LONG, {
              status: TileStates.TooLong,
            }),
            startWith({ status: TileStates.Started }),
          ),
          race([
            dismiss$.pipe(
              filter((s) => s === symbol),
              take(1),
            ),
            timer(DISMISS_TIMEOUT),
          ]).pipe(mapTo({ status: TileStates.Ready })),
        ),
      ),
    ) as Observable<TileState>,
  { status: TileStates.Ready },
)
