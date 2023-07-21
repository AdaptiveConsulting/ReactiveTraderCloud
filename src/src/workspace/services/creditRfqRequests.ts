import { createSignal } from "@react-rxjs/utils"
import { firstValueFrom, map, of, switchMap, tap, withLatestFrom } from "rxjs"

import {
  CreateRfqRequest,
  CreateRfqResponse,
  InstrumentBody,
  NACK_CREATE_RFQ_RESPONSE,
  WorkflowService,
} from "@/generated/TradingGateway"

import { creditDealers$ } from "./creditDealers"
import { creditInstruments$ } from "./creditInstruments"
import { creditRfqsById$ } from "./creditRfqs"

const [rfqCreatedResponse$, setRfqResponse] = createSignal<CreateRfqResponse>()

export const createdRfqWithInstrumentWithResponse$ = rfqCreatedResponse$.pipe(
  switchMap((response) => {
    if (response.type === NACK_CREATE_RFQ_RESPONSE) {
      return of({ response })
    }
    return creditRfqsById$.pipe(
      withLatestFrom(creditInstruments$),
      map(([rfqs, instruments]) => {
        const rfq = rfqs[response.payload]

        const instrument = instruments.find(
          (instrument) => instrument.id === rfq.instrumentId,
        ) as InstrumentBody

        return {
          instrument,
          rfq,
          response,
        }
      }),
    )
  }),
)

export const createCreditRfq = (request: Omit<CreateRfqRequest, "dealerIds">) =>
  firstValueFrom(
    creditDealers$.pipe(
      switchMap((dealers) => {
        const requestWithDealerIds = {
          ...request,
          dealerIds: dealers.map(({ id }) => id),
        }

        return WorkflowService.createRfq(requestWithDealerIds).pipe(
          tap((response) => {
            setRfqResponse(response)
          }),
        )
      }),
    ),
  )
