import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  catchError,
  concat,
  exhaustMap,
  map,
  Observable,
  startWith,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs"

import { CREDIT_RFQ_EXPIRY_SECONDS } from "@/client/constants"
import {
  AckCreateRfqResponse,
  InstrumentBody,
} from "@/generated/TradingGateway"
import {
  createCreditRfq$,
  creditDealers$,
  creditInstruments$,
} from "@/services/credit"
import { nlpIntent$, NlpIntentType } from "@/services/nlp"

import {
  RfqNlpExecutionDataReady,
  RfqNlpExecutionState,
  RfqNlpExecutionStatus,
} from "./rfqExecutionTypes"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

const rfqExecutionState$: Observable<RfqNlpExecutionState> = nlpIntent$.pipe(
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
      return [{ type: RfqNlpExecutionStatus.MissingData as const, payload: {} }]
    }

    const requestData =
      intent.payload as RfqNlpExecutionDataReady["payload"]["requestData"]
    const { symbol, direction, notional, maturity } = requestData

    const symbolInstruments = instruments.filter(
      (instrument) => instrument.ticker === symbol,
    )

    let instrument = symbolInstruments[0]

    if (maturity) {
      instrument =
        symbolInstruments.find(
          (instrument) => maturity === instrument.maturity.slice(0, 4),
        ) ?? symbolInstruments[0]
    }

    if (!instrument) {
      return [{ type: RfqNlpExecutionStatus.MissingData as const, payload: {} }]
    }

    return concat(
      [
        {
          type: RfqNlpExecutionStatus.DataReady as const,
          payload: { requestData },
        },
      ],
      next$.pipe(
        map(() => ({
          type: RfqNlpExecutionStatus.WaitingToExecute as const,
          payload: { requestData },
        })),
      ),
      next$.pipe(
        exhaustMap(() =>
          createCreditRfq$({
            instrumentId: instrument.id,
            quantity: notional,
            direction,
            dealerIds: dealers.map((dealer) => dealer.id),
            expirySecs: CREDIT_RFQ_EXPIRY_SECONDS,
          }).pipe(
            map((response) => {
              return {
                type: RfqNlpExecutionStatus.Done as const,
                payload: {
                  requestData,
                  response: {
                    type: "ack" as const,
                    response: response as AckCreateRfqResponse,
                  },
                },
              }
            }),
            catchError((e) => [
              {
                type: RfqNlpExecutionStatus.Done as const,
                payload: {
                  requestData,
                  response: { type: "nack" as const, reason: e?.message ?? "" },
                },
              },
            ]),
            startWith({
              type: RfqNlpExecutionStatus.Executing as const,
              payload: { requestData },
            }),
          ),
        ),
      ),
    )
  }),
)

export const [useRfqExecutionState] = bind(rfqExecutionState$)
