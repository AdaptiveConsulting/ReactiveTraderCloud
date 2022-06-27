import {
  AcceptQuoteRequest,
  AckCreateRfqResponse,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateRfqRequest,
  WorkflowService,
} from "@/generated/TradingGateway"
import { Subject } from "rxjs"
import { exhaustMap, map, tap } from "rxjs/operators"

interface CreditRfqCreation extends AckCreateRfqResponse {
  request: CreateRfqRequest
}

const creditRfqCreationsSubject = new Subject<CreditRfqCreation>()

export const createCreditRfq$ = (request: CreateRfqRequest) => {
  return WorkflowService.createRfq(request).pipe(
    map((response) => ({ ...response, request })),
    tap((response) => {
      if (response.type === ACK_CREATE_RFQ_RESPONSE) {
        creditRfqCreationsSubject.next(response)
      }
    }),
  )
}

export const creditRfqCreations$ = creditRfqCreationsSubject.asObservable()

// Mocking a quote
creditRfqCreations$
  .pipe(
    exhaustMap((response) =>
      WorkflowService.createQuote({
        rfqId: response.payload,
        dealerId: response.request.dealerIds[0],
        price: 12,
      }),
    ),
  )
  .subscribe()

export const cancelCreditRfq$ = (cancelRequest: CancelRfqRequest) => {
  return WorkflowService.cancelRfq(cancelRequest)
}

export const acceptCreditQuote$ = (acceptRequest: AcceptQuoteRequest) => {
  return WorkflowService.acceptQuote(acceptRequest)
}
