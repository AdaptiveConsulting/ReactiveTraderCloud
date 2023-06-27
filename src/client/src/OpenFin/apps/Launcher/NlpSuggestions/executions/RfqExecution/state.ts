import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  concat,
  exhaustMap,
  map,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from "rxjs"

import { CREDIT_RFQ_EXPIRY_SECONDS } from "@/constants"
import { Direction } from "@/generated/TradingGateway"
import {
  createCreditRfq$,
  creditDealers$,
  creditInstruments$,
} from "@/services/credit"
import { ExecutionTrade } from "@/services/executions"

import { nlpIntent$, NlpIntentType } from "../../../services/nlpService"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

export enum NlpExecutionStatus {
  MissingData = 1,
  DataReady = 2,
  WaitingToExecute = 3,
  Executing = 4,
  Done = 5,
}

export interface RequestData {
  symbol: string
  notional: number
  direction: Direction
}

export interface NlpExecutionMissingData {
  type: NlpExecutionStatus.MissingData
  payload: Record<string, unknown>
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

export const [useRfqExecutionIntent] = bind(
  nlpIntent$.pipe(
    withLatestFrom(creditInstruments$, creditDealers$),
    switchMap(([intent, instruments, dealers]) => {
      if (
        !intent ||
        intent === "loading" ||
        intent.type !== NlpIntentType.CreditRfq ||
        !intent.payload.symbol ||
        !intent.payload.direction ||
        !intent.payload.notional ||
        !dealers.length
      ) {
        return [{ type: NlpExecutionStatus.MissingData, payload: {} }]
      }

      const requestData =
        intent.payload as NlpExecutionDataReady["payload"]["requestData"]
      const { symbol, direction, notional } = requestData

      const instrument = instruments.find(
        (instrument) => instrument.ticker === symbol,
      )

      if (!instrument) {
        return [{ type: NlpExecutionStatus.MissingData, payload: {} }]
      }

      return concat(
        [
          {
            type: NlpExecutionStatus.DataReady as const,
            payload: { requestData },
          },
        ],
        next$.pipe(
          exhaustMap(() =>
            createCreditRfq$({
              instrumentId: instrument.id,
              quantity: notional,
              direction,
              dealerIds: dealers.map((dealer) => dealer.id),
              expirySecs: CREDIT_RFQ_EXPIRY_SECONDS,
            }),
          ),
          map(() => {
            return {
              type: NlpExecutionStatus.Done,
            }
          }),
        ),
      )
    }),
  ),
)
