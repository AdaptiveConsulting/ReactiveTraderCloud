import { createSignal } from "@react-rxjs/utils"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"

import {
  AcceptQuoteRequest,
  ACK_ACCEPT_QUOTE_RESPONSE,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateQuoteRequest,
  CreateRfqRequest,
  QuoteBody,
  WorkflowService,
} from "@/generated/TradingGateway"
import { showRfqInSellSide } from "@/utils"

import { adaptiveDealerId$ } from "./creditDealers"
import { creditRfqsById$, RfqDetails } from "./creditRfqs"

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

sellSideRfqs$.subscribe(showRfqInSellSide)

export const cancelCreditRfq$ = (cancelRequest: CancelRfqRequest) => {
  return WorkflowService.cancelRfq(cancelRequest)
}

export const createCreditQuote$ = (quoteRequest: CreateQuoteRequest) => {
  return WorkflowService.createQuote(quoteRequest)
}

export const [acceptedCreditRfq$, setAcceptedCreditRfq] = createSignal<{
  quoteId: number
}>()

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

export interface RfqWithQuote {
  rfq: RfqDetails
  quote: QuoteBody
}

export const acceptedRfqWithQuote$ = acceptedCreditRfq$.pipe(
  withLatestFrom(creditRfqsById$),
  //get rfq with same quoteid as acceptedCreditRfq
  map(([{ quoteId }, rfqs]) => {
    return Object.values(rfqs).reduce((acc, rfq) => {
      const quote = rfq.quotes.find((quote) => quoteId === quote.id)
      return quote ? { quote, rfq } : acc
    }, {} as RfqWithQuote)
  }),
)
