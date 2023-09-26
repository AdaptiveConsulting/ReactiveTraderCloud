import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { concat, Observable } from "rxjs"
import {
  catchError,
  exhaustMap,
  map,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"

import { Direction } from "@/generated/TradingGateway"
import { getCurrencyPair$ } from "@/services/currencyPairs"
import { execute$, ExecutionStatus } from "@/services/executions"
import { nlpIntent$, NlpIntentType } from "@/services/nlp"
import { getPrice$ } from "@/services/prices"

import {
  TradeNlpExecutionDataReady,
  TradeNlpExecutionState,
  TradeNlpExecutionStatus,
} from "./tradeExecutionTypes"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

const tradeExecutionState$: Observable<TradeNlpExecutionState> =
  nlpIntent$.pipe(
    switchMap((intent) => {
      if (
        !intent ||
        intent === "loading" ||
        intent.type !== NlpIntentType.TradeExecution ||
        !intent.payload.symbol ||
        !("notional" in intent.payload) ||
        !intent.payload.notional ||
        !intent.payload.direction
      ) {
        return [
          { type: TradeNlpExecutionStatus.MissingData as const, payload: {} },
        ]
      }

      const requestData =
        intent.payload as TradeNlpExecutionDataReady["payload"]["requestData"]
      const { symbol, direction, notional } = requestData

      return concat(
        [
          {
            type: TradeNlpExecutionStatus.DataReady as const,
            payload: { requestData },
          },
        ],
        next$.pipe(
          map(() => ({
            type: TradeNlpExecutionStatus.WaitingToExecute as const,
            payload: { requestData },
          })),
        ),
        next$.pipe(
          withLatestFrom(getPrice$(symbol), getCurrencyPair$(symbol)),
          exhaustMap(([, price, { base, terms, symbol }]) =>
            execute$({
              currencyPair: symbol,
              dealtCurrency: direction === Direction.Buy ? base : terms,
              direction,
              notional,
              spotRate: direction === Direction.Buy ? price.ask : price.bid,
            }).pipe(
              map((trade) => {
                if (trade.status === ExecutionStatus.CreditExceeded) {
                  throw new Error("Credit limit exceeded!")
                }
                if (trade.status === ExecutionStatus.Timeout) {
                  throw new Error("Request timed out!")
                }
                return {
                  type: TradeNlpExecutionStatus.Done as const,
                  payload: {
                    requestData,
                    response: {
                      type: "ok" as const,
                      trade,
                    },
                  },
                }
              }),
              catchError((e) => [
                {
                  type: TradeNlpExecutionStatus.Done as const,
                  payload: {
                    requestData,
                    response: { type: "ko" as const, reason: e?.message ?? "" },
                  },
                },
              ]),
              startWith({
                type: TradeNlpExecutionStatus.Executing as const,
                payload: { requestData },
              }),
            ),
          ),
        ),
      )
    }),
  )

export const [useTradeExecutionState] = bind(tradeExecutionState$)
