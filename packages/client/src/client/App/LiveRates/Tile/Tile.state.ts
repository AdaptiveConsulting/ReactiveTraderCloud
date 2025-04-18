import { bind } from "@react-rxjs/core"
import { createKeyedSignal } from "@react-rxjs/utils"
import { concat, race, timer } from "rxjs"
import {
  delay,
  exhaustMap,
  map,
  mapTo,
  startWith,
  take,
  tap,
  withLatestFrom,
} from "rxjs/operators"

import { emitTooLongMessage } from "@/client/utils/emitTooLong"
import { Direction } from "@/generated/TradingGateway"
import { getCurrencyPair$ } from "@/services/currencyPairs"
import {
  execute$,
  ExecutionStatus,
  ExecutionTrade,
} from "@/services/executions"
import { getPrice$ } from "@/services/prices"

import { isBuy } from "../../Credit/common"
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

export interface NoTradeState {
  status:
    | TileStates.Ready
    | TileStates.Started
    | TileStates.TooLong
    | TileStates.Timeout
    | TileStates.CreditExceeded
  trade?: undefined
}

export interface TradeState {
  status: TileStates.Finished
  trade: ExecutionTrade
}

export type TileState = TradeState | NoTradeState

const READY: NoTradeState = { status: TileStates.Ready }
const STARTED: NoTradeState = { status: TileStates.Started }
const TOO_LONG: NoTradeState = { status: TileStates.TooLong }
const TIMEOUT: NoTradeState = { status: TileStates.Timeout }
const CREDIT_EXCEEDED: NoTradeState = { status: TileStates.CreditExceeded }

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
        currencyPair: symbol,
        dealtCurrency: isBuy(direction) ? base : terms,
        direction,
        notional,
        spotRate: isBuy(direction) ? price.ask : price.bid,
      })),
      tap(({ direction, currencyPair, spotRate, notional }) => {
        window.gtag("event", "fx_trade_attempt", {
          direction,
          currencyPair,
          spotRate,
          notional,
        })
      }),
      exhaustMap((request) =>
        concat(
          execute$(request).pipe(
            // Simulating real time trade delay
            delay(Math.random() * 1000 + 100),
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
