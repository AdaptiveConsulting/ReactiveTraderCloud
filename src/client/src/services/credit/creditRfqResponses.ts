import { EMPTY, merge, Observable, of } from "rxjs"
import {
  catchError,
  delay,
  exhaustMap,
  mergeMap,
  tap,
  withLatestFrom,
} from "rxjs/operators"

import {
  CreateQuoteResponse,
  DealerBody,
  RfqState,
} from "@/generated/TradingGateway"

import { ADAPTIVE_BANK_NAME, creditDealers$ } from "./creditDealers"
import {
  createCreditQuote$,
  CreatedCreditRfq,
  createdCreditRfq$,
} from "./creditRfqRequests"
import { creditRfqsById$ } from "./creditRfqs"

// Keeping it short for demo purposes but could be driven by the actual RFQ duration value
const DEALER_RFQ_RESPONSE_TIME_WINDOW_MILLIS = 30_000

// Simulate other dealers responding to RFQs
const dealersResponses$ = createdCreditRfq$.pipe(
  withLatestFrom(creditDealers$),
  mergeMap(
    ([createdCreditRfq, creditDealers]: [CreatedCreditRfq, DealerBody[]]) => {
      const {
        rfqId,
        request: { dealerIds },
      } = createdCreditRfq

      const dealerByIdMap = new Map<number, string>(
        creditDealers.map((dealer) => [dealer.id, dealer.name]),
      )

      const dealersResponses$: Observable<CreateQuoteResponse>[] = []
      dealerIds.forEach((id) => {
        const isNotAdaptiveBank = dealerByIdMap.get(id) !== ADAPTIVE_BANK_NAME
        const shouldRespond = Math.random() > 0.3
        if (shouldRespond && isNotAdaptiveBank) {
          dealersResponses$.push(
            sendRandomQuoteAfterDelay(
              rfqId,
              id,
              dealerByIdMap.get(id) ?? "Unknown dealer",
              Math.floor(
                Math.random() * DEALER_RFQ_RESPONSE_TIME_WINDOW_MILLIS,
              ),
            ),
          )
        }
      })

      return merge(...dealersResponses$)
    },
  ),
)

function sendRandomQuoteAfterDelay(
  rfqId: number,
  dealerId: number,
  dealerName: string,
  delayMillis: number,
) {
  const price = generateRandomPrice()
  const payload = {
    dealerId,
    rfqId,
    price,
  }

  return of(payload).pipe(
    delay(delayMillis),
    withLatestFrom(creditRfqsById$),
    exhaustMap(([payload, creditRfqsById]) => {
      const rfqStillOpen =
        creditRfqsById[payload.rfqId]?.state === RfqState.Open

      return rfqStillOpen
        ? createCreditQuote$(payload).pipe(
            catchError((e) =>
              EMPTY.pipe(
                tap({
                  complete() {
                    console.error(e)
                    console.warn(
                      `Dealer ${dealerName} encountered error when submitting quote for rfqId ${rfqId}`,
                    )
                  },
                }),
              ),
            ),
          )
        : EMPTY
    }),
  )
}

// The target price should be driven by the benchmark once it is implemented
function generateRandomPrice(targetPrice = 100) {
  const sign = Math.random() > 0.5 ? -1 : 1
  const priceChange = Math.floor(Math.random() * 10)

  return targetPrice + priceChange * sign
}

export function registerSimulatedDealerResponses() {
  return dealersResponses$.subscribe()
}
