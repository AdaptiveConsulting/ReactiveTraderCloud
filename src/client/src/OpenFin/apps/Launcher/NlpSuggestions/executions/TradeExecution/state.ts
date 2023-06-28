import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { concat } from "rxjs"
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
import { getPrice$ } from "@/services/prices"

import { nlpIntent$, NlpIntentType } from "../../../services/nlpService"
import { NlpExecutionDataReady, NlpExecutionStatus } from "../types"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

let nextId = 1
const getId = () => (nextId++).toString()

const nlpExecutionState$ = nlpIntent$.pipe(
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
      return [{ type: NlpExecutionStatus.MissingData as const, payload: {} }]
    }

    const requestData =
      intent.payload as NlpExecutionDataReady["payload"]["requestData"]
    const { symbol, direction, notional } = requestData

    return concat(
      [
        {
          type: NlpExecutionStatus.DataReady as const,
          payload: { requestData },
        },
      ],
      next$.pipe(
        map(() => ({
          type: NlpExecutionStatus.WaitingToExecute as const,
          payload: { requestData },
        })),
      ),
      next$.pipe(
        withLatestFrom(getPrice$(symbol), getCurrencyPair$(symbol)),
        exhaustMap(([, price, { base, terms, symbol }]) =>
          execute$({
            id: getId(),
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
                type: NlpExecutionStatus.Done as const,
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
                type: NlpExecutionStatus.Done as const,
                payload: {
                  requestData,
                  response: { type: "ko" as const, reason: e?.message ?? "" },
                },
              },
            ]),
            startWith({
              type: NlpExecutionStatus.Executing as const,
              payload: { requestData },
            }),
          ),
        ),
      ),
    )
  }),
)

export const [useNlpExecutionState] = bind(nlpExecutionState$)
