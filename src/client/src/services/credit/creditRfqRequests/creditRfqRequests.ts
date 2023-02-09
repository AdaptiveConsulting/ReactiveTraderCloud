import {
  AcceptQuoteRequest,
  ACK_ACCEPT_QUOTE_RESPONSE,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateQuoteRequest,
  CreateRfqRequest,
  WorkflowService,
} from "@/generated/TradingGateway"
import { toSellSideView } from "@/utils"
import { createSignal } from "@react-rxjs/utils"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"
import { adaptiveDealerId$ } from "../creditDealers"

export interface CreatedCreditRfq {
  request: CreateRfqRequest
  rfqId: number
}

export const [createdCreditRfq$, setCreatedCreditRfq] =
  createSignal<CreatedCreditRfq>()

export const createCreditRfq$ = (request: CreateRfqRequest) => {
  return WorkflowService.createRfq(request).pipe(
    tap((response) => {
      if (response.type === ACK_CREATE_RFQ_RESPONSE) {
        setCreatedCreditRfq({ request, rfqId: response.payload })
      }
    }),
  )
}

const sellSideRfqs$ = createdCreditRfq$.pipe(
  withLatestFrom(adaptiveDealerId$),
  filter(
    ([
      {
        request: { dealerIds },
      },
      adaptiveBankId,
    ]) => !!dealerIds.find((id) => id === adaptiveBankId),
  ),
  map(([{ rfqId }]) => rfqId),
)

sellSideRfqs$.subscribe(toSellSideView)

export const cancelCreditRfq$ = (cancelRequest: CancelRfqRequest) => {
  return WorkflowService.cancelRfq(cancelRequest)
}

export const createCreditQuote$ = (quoteRequest: CreateQuoteRequest) => {
  return WorkflowService.createQuote(quoteRequest)
}

export const [acceptedCreditRfq$, setAcceptedCreditRfq] =
  createSignal<{ quoteId: number }>()

export const acceptCreditQuote$ = (acceptRequest: AcceptQuoteRequest) => {
  return WorkflowService.acceptQuote(acceptRequest).pipe(
    tap((response) => {
      if (response.type === ACK_ACCEPT_QUOTE_RESPONSE) {
        setAcceptedCreditRfq({
          quoteId: acceptRequest.quoteId,
        })
      }
    }),
  )
}
