import { nlpIntent$, NlpIntentType } from "@/Launcher/services/nlpService"
import { Direction } from "@/services/trades"
import {
  catchError,
  exhaustMap,
  map,
  mapTo,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"
import { createSignal } from "@react-rxjs/utils"
import { concat, Observable } from "rxjs"
import { getPrice$ } from "@/services/prices"
import { getCurrencyPair$ } from "@/services/currencyPairs"
import {
  execute$,
  ExecutionStatus,
  ExecutionTrade,
} from "@/services/executions"
import { bind } from "@react-rxjs/core"
import { useEffect } from "react"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

export const useMoveNextOnEnter = () => {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.repeat) {
        onNext()
      }
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])
}

export enum NlpExecutionStatus {
  MissingData = 1,
  DataReady = 2,
  WaitingToExecute = 3,
  Executing = 4,
  Done = 5,
}

interface RequestData {
  symbol: string
  notional: number
  direction: Direction
}

export interface NlpExecutionMissingData {
  type: NlpExecutionStatus.MissingData
  payload: {}
}

export interface NlpExecutionDataReady {
  type: NlpExecutionStatus.DataReady
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionWaitingToExecute {
  type: NlpExecutionStatus.WaitingToExecute
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionExecuting {
  type: NlpExecutionStatus.Executing
  payload: {
    requestData: RequestData
  }
}

export interface NlpExecutionDone {
  type: NlpExecutionStatus.Done
  payload: {
    requestData: RequestData
    response:
      | { type: "ok"; trade: ExecutionTrade }
      | { type: "ko"; reason: string }
  }
}

export type NlpExecutionState =
  | NlpExecutionMissingData
  | NlpExecutionDataReady
  | NlpExecutionWaitingToExecute
  | NlpExecutionExecuting
  | NlpExecutionDone

let nextId = 1
const getId = () => (nextId++).toString()

const nlpExecutionState$: Observable<NlpExecutionState> = nlpIntent$.pipe(
  switchMap((intent) => {
    if (
      !intent ||
      intent === "loading" ||
      intent.type !== NlpIntentType.TradeExecution ||
      !intent.payload.symbol ||
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
        mapTo({
          type: NlpExecutionStatus.WaitingToExecute as const,
          payload: { requestData },
        }),
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
