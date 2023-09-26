import { createSignal } from "@react-rxjs/utils"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"

import { showRfqInSellSide } from "@/client/utils"
import {
  AcceptQuoteRequest,
  ACK_ACCEPT_QUOTE_RESPONSE,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateRfqRequest,
  PassRequest,
  QuoteRequest,
  WorkflowService,
} from "@/generated/TradingGateway"

import { PricedQuoteBody } from "../rfqs/types"
import { adaptiveDealerId$ } from "./creditDealers"
import { creditRfqsById$, RfqDetails } from "./creditRfqs"

export interface CreatedCreditRfq {
  request: CreateRfqRequest
  rfqId: number
}

export const [createdCreditRfq$, setCreatedCreditRfq] =
  createSignal<CreatedCreditRfq>()

export const createCreditRfq$ = (request: CreateRfqRequest) => {
  const { dealerIds, direction, expirySecs, instrumentId, quantity } = request

  return WorkflowService.createRfq({
    dealerIds,
    direction,
    expirySecs,
    instrumentId,
    quantity: quantity * 1000,
  }).pipe(
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

export const quoteCreditQuote$ = (quoteRequest: QuoteRequest) => {
  return WorkflowService.quote(quoteRequest)
}

export const passCreditQuote$ = (passRequest: PassRequest) => {
  return WorkflowService.pass(passRequest)
}

export const [acceptedCreditRfq$, setAcceptedCreditRfq] =
  createSignal<{
    quoteId: number
  }>()

export const acceptCreditQuote$ = (acceptRequest: AcceptQuoteRequest) => {
  return WorkflowService.accept(acceptRequest).pipe(
    tap((response) => {
      if (response.type === ACK_ACCEPT_QUOTE_RESPONSE) {
        setAcceptedCreditRfq({
          quoteId: acceptRequest.quoteId,
        })
      }
    }),
  )
}

export interface RfqWithPricedQuote {
  rfq: RfqDetails
  quote: PricedQuoteBody
}

export const acceptedRfqWithQuote$ = acceptedCreditRfq$.pipe(
  withLatestFrom(creditRfqsById$),
  //get rfq with same quoteid as acceptedCreditRfq
  map(([{ quoteId }, rfqs]) => {
    return Object.values(rfqs).reduce((acc, rfq) => {
      const quote = rfq.quotes.find((quote) => quoteId === quote.id)
      return quote ? ({ quote, rfq } as RfqWithPricedQuote) : acc
    }, {} as RfqWithPricedQuote)
  }),
)
