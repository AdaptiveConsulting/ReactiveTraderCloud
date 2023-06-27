import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { concat, exhaustMap, map, switchMap, take, withLatestFrom } from "rxjs"

import { CREDIT_RFQ_EXPIRY_SECONDS } from "@/constants"
import {
  createCreditRfq$,
  creditDealers$,
  creditInstruments$,
} from "@/services/credit"

import { nlpIntent$, NlpIntentType } from "../../../services/nlpService"
import {
  NlpExecutionDataReady,
  NlpExecutionStatus,
} from "../TradeExecution/state"

const [next$_, onNext] = createSignal()
export { onNext }

const next$ = next$_.pipe(take(1))

export const rfqExecutionState$ = nlpIntent$.pipe(
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
      return [{ type: NlpExecutionStatus.MissingData as const, payload: {} }]
    }

    const requestData =
      intent.payload as NlpExecutionDataReady["payload"]["requestData"]
    const { symbol, direction, notional } = requestData

    const instrument = instruments.find(
      (instrument) => instrument.ticker === symbol,
    )

    if (!instrument) {
      return [{ type: NlpExecutionStatus.MissingData as const, payload: {} }]
    }

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
            type: NlpExecutionStatus.Done as const,
            payload: { requestData },
          }
        }),
      ),
    )
  }),
)

export const [useRfqExecutionState] = bind(rfqExecutionState$)
