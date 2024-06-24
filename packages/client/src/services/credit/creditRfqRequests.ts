import { createSignal } from "@react-rxjs/utils"
import { filter, map, tap, withLatestFrom } from "rxjs/operators"

import { adjustUserCreditQuantity, showRfqInSellSide } from "@/client/utils"
import {
  AcceptQuoteRequest,
  ACK_ACCEPT_QUOTE_RESPONSE,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateRfqRequest,
  InstrumentBody,
  PassRequest,
  QuoteRequest,
  WorkflowService,
} from "@/generated/TradingGateway"

import { PricedQuoteBody } from "../rfqs/types"
import { adaptiveDealerId$ } from "./creditDealers"
import { creditInstruments$ } from "./creditInstruments"
import { creditRfqsById$, RfqDetails } from "./creditRfqs"

export interface CreatedCreditRfq {
  request: CreateRfqRequest
  rfqId: number
}

type ConfirmRfqRequest = CreateRfqRequest & {
  instrument: InstrumentBody | null
}
export interface ConfirmCreatedCreditRfq
  extends Omit<CreatedCreditRfq, "request"> {
  request: ConfirmRfqRequest
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
    quantity: adjustUserCreditQuantity(quantity),
  }).pipe(
    tap((response) => {
      if (response.type === ACK_CREATE_RFQ_RESPONSE) {
        setCreatedCreditRfq({ request, rfqId: response.payload })
      }
    }),
  )
}

export const createdCreditConfirmation$ = createdCreditRfq$.pipe(
  filter((response) => response !== null),
  withLatestFrom(creditInstruments$),
  map(
    ([response, creditInstruments]): ConfirmCreatedCreditRfq => ({
      ...response,
      request: {
        ...response.request,
        quantity: adjustUserCreditQuantity(response.request.quantity),
        instrument:
          creditInstruments.find(
            (instrument) => instrument.id === response.request.instrumentId,
          ) ?? null,
      },
    }),
  ),
)

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

export const [acceptedCreditRfq$, setAcceptedCreditRfq] = createSignal<{
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
