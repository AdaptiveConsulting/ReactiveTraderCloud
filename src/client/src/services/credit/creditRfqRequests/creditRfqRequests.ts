import {
  AcceptQuoteRequest,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateQuoteRequest,
  CreateRfqRequest,
  WorkflowService,
} from "@/generated/TradingGateway"
import { createSignal } from "@react-rxjs/utils"
import { tap } from "rxjs/operators"

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

export const cancelCreditRfq$ = (cancelRequest: CancelRfqRequest) => {
  return WorkflowService.cancelRfq(cancelRequest)
}

export const createCreditQuote$ = (quoteRequest: CreateQuoteRequest) => {
  return WorkflowService.createQuote(quoteRequest)
}

export const acceptCreditQuote$ = (acceptRequest: AcceptQuoteRequest) => {
  return WorkflowService.acceptQuote(acceptRequest)
}
