import {
  AckCreateRfqResponse,
  ACK_CREATE_RFQ_RESPONSE,
  CreateRfqRequest,
  WorkflowService,
} from "@/generated/TradingGateway"
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
