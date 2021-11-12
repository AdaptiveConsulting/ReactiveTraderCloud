import { createKeyedSignal } from "@react-rxjs/utils"
import { Direction } from "@/services/trades"
import {
  exhaustMap,
  map,
  mapTo,
  startWith,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators"
import { concat, race, timer } from "rxjs"
import { getPrice$ } from "@/services/prices"
import {
  ExecutionTrade,
  execute$,
  ExecutionStatus,
} from "@/services/executions"
import { getCurrencyPair$ } from "@/services/currencyPairs"
import { emitTooLongMessage } from "@/utils/emitTooLong"
import { bind } from "@react-rxjs/core"
import { getNotionalValue$ } from "./Notional"

// Dismiss Message
const DISMISS_TIMEOUT = 5_000
const [dismiss$, onDismissMessage] = createKeyedSignal<string>()
export { onDismissMessage }

const waitForDismissal$ = (symbol: string) => dismiss$(symbol).pipe(take(1))

// Executions
export const [tileExecutions$, sendExecution] = createKeyedSignal(
  (x) => x.symbol,
  (symbol: string, direction: Direction) => ({ symbol, direction }),
)

// TileState
export enum TileStates {
  Ready,
  Started,
  TooLong,
  Timeout,
  Finished,
  CreditExceeded,
}

interface NoTradeState {
  status:
    | TileStates.Ready
    | TileStates.Started
    | TileStates.TooLong
    | TileStates.Timeout
    | TileStates.CreditExceeded
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
const CREDIT_EXCEEDED: NoTradeState = { status: TileStates.CreditExceeded }

let nextId = 1
const getId = () => (nextId++).toString()

const TAKING_TOO_LONG = 2_000

export const [useTileState, getTileState$] = bind(
  (symbol: string) =>
    tileExecutions$(symbol).pipe(
      withLatestFrom(
        getNotionalValue$(symbol),
        getPrice$(symbol),
        getCurrencyPair$(symbol),
      ),
      map(([{ direction }, notional, price, { base, terms, symbol }]) => ({
        id: getId(),
        currencyPair: symbol,
        dealtCurrency: direction === Direction.Buy ? base : terms,
        direction,
        notional,
        spotRate: direction === Direction.Buy ? price.ask : price.bid,
      })),
      tap(({ direction, currencyPair, spotRate, notional }) => {
        window.ga(
          "send",
          "event",
          "RT - Trade Attempt",
          direction,
          `${currencyPair} - ${spotRate}`,
          notional,
        )
      }),
      exhaustMap((request) =>
        concat(
          execute$(request).pipe(
            map((trade) =>
              trade.status === ExecutionStatus.Timeout
                ? TIMEOUT
                : trade.status === ExecutionStatus.CreditExceeded
                ? CREDIT_EXCEEDED
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
  READY,
)
