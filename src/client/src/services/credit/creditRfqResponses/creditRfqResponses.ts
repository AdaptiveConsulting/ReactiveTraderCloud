import { ROUTES_CONFIG } from "@/constants"
import {
  CreateQuoteResponse,
  DealerBody,
  RfqState,
} from "@/generated/TradingGateway"
import { constructUrl } from "@/utils/url"
import { openWindow } from "@/utils/window/openWindow"
import { EMPTY, merge, Observable, of } from "rxjs"
import {
  catchError,
  delay,
  exhaustMap,
  map,
  mergeMap,
  tap,
  withLatestFrom,
} from "rxjs/operators"
import { ADAPTIVE_BANK_NAME, creditDealers$ } from "../creditDealers"
import {
  createCreditQuote$,
  CreatedCreditRfq,
  createdCreditRfq$,
} from "../creditRfqRequests"
import { creditRfqsById$ } from "../creditRfqs/creditRfqs"

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

const sellSideTicket$ = createdCreditRfq$.pipe(
  withLatestFrom(creditDealers$),
  map(
    ([
      {
        rfqId,
        request: { dealerIds },
      },
      creditDealers,
    ]: [CreatedCreditRfq, DealerBody[]]) => {
      const adaptiveBankId = creditDealers.find(
        (dealer) => dealer.name === ADAPTIVE_BANK_NAME,
      )?.id
      const dealerId = dealerIds.find((id) => id === adaptiveBankId)
      return dealerId !== undefined
        ? {
            rfqId,
            dealerId,
          }
        : undefined
    },
  ),
  tap((ticketToOpen) => {
    if (ticketToOpen) {
      openDealerTicketForRfq(
        ticketToOpen.rfqId.toString(),
        ticketToOpen.dealerId.toString(),
      )
    }
  }),
)

// Open the sell side ticket to manually respond to RFQs
function openDealerTicketForRfq(rfqId: string, dealerId: string) {
  openWindow({
    url: constructUrl(
      ROUTES_CONFIG.sellSideTicket
        .replace(":rfqId", rfqId)
        .replace(":dealerId", dealerId),
    ),
    name: `CreditRFQ-${rfqId}-${dealerId}`,
    width: 330,
    height: 286,
    x: window.innerWidth - 330,
    y: window.innerHeight - 286,
  })
}

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
function generateRandomPrice(targetPrice: number = 100) {
  const sign = Math.random() > 0.5 ? -1 : 1
  const priceChange = Math.floor(Math.random() * 10)

  return targetPrice + priceChange * sign
}

export function registerSimulatedDealerResponses() {
  return dealersResponses$.subscribe()
}

export function enableOpenSellSideTicketForAdaptiveBankRfqs() {
  return sellSideTicket$.subscribe()
}
