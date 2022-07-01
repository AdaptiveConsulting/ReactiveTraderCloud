import { ROUTES_CONFIG } from "@/constants"
import {
  AcceptQuoteRequest,
  AckCreateRfqResponse,
  ACK_CREATE_RFQ_RESPONSE,
  CancelRfqRequest,
  CreateQuoteRequest,
  CreateRfqRequest,
  WorkflowService,
} from "@/generated/TradingGateway"
import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { Subject } from "rxjs"
import { map, tap } from "rxjs/operators"

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

creditRfqCreations$.subscribe(
  ({ payload, request }) => {
    const rfqId = payload.toString()
    const firstDealerId = request.dealerIds[0].toString()
    openWindow({
      url: constructUrl(
        ROUTES_CONFIG.sellSideTicket
          .replace(":rfqId", rfqId)
          .replace(":dealerId", firstDealerId),
      ),
      name: `CreditRFQ-${rfqId}-${firstDealerId}`,
      width: 300,
      height: 286,
      x: window.innerWidth - 300,
      y: window.innerHeight - 286,
    })
  },
  (e) => {
    console.error(e)
  },
  () => {
    console.error("RFQ creation stream completed!?")
  },
)

export const cancelCreditRfq$ = (cancelRequest: CancelRfqRequest) => {
  return WorkflowService.cancelRfq(cancelRequest)
}

export const createCreditQuote$ = (quoteRequest: CreateQuoteRequest) => {
  return WorkflowService.createQuote(quoteRequest)
}

export const acceptCreditQuote$ = (acceptRequest: AcceptQuoteRequest) => {
  return WorkflowService.acceptQuote(acceptRequest)
}
