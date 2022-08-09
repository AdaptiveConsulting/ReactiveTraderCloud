import {
  DealerBody,
  InstrumentBody,
  QuoteState,
  QUOTE_ACCEPTED_RFQ_UPDATE,
  QUOTE_CREATED_RFQ_UPDATE,
  RfqUpdate,
  RFQ_CLOSED_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  WorkflowService,
  END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  QuoteCreatedRfqUpdate,
} from "@/generated/TradingGateway"
import { bind, shareLatest } from "@react-rxjs/core"
import { filter, map, scan, startWith, withLatestFrom } from "rxjs/operators"
import { QuoteDetails, RfqDetails } from "./types"
import { withConnection } from "../../withConnection"
import { creditInstruments$ } from "../creditInstruments"
import { creditDealers$ } from "../creditDealers"
import { Observable } from "rxjs"

const creditRfqUpdates$ = WorkflowService.subscribe().pipe(
  withConnection(),
  shareLatest(),
)

export const creditRfqsById$ = creditRfqUpdates$.pipe(
  withLatestFrom(creditInstruments$, creditDealers$),
  scan<[RfqUpdate, InstrumentBody[], DealerBody[]], Record<number, RfqDetails>>(
    (acc, [update, instruments, dealers]) => {
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE:
          return {}
        case RFQ_CREATED_RFQ_UPDATE:
          return {
            ...acc,
            [update.payload.id]: {
              ...acc[update.payload.id],
              ...update.payload,
              instrument:
                instruments.find(
                  (instrument) => instrument.id === update.payload.instrumentId,
                ) ?? null,
              dealers: update.payload.dealerIds.map(
                (dealerId) =>
                  dealers.find((dealer) => dealer.id === dealerId) ?? {
                    id: dealerId,
                    name: "Unknown Dealer",
                  },
              ),
              quotes: [],
            },
          }
        case RFQ_CLOSED_RFQ_UPDATE:
          return {
            ...acc,
            [update.payload.id]: {
              ...acc[update.payload.id],
              ...update.payload,
            },
          }
        case QUOTE_CREATED_RFQ_UPDATE: {
          const previousRfq = acc[update.payload.rfqId]
          return {
            ...acc,
            [update.payload.rfqId]: {
              ...previousRfq,
              quotes: previousRfq?.quotes
                ? previousRfq.quotes.concat([update.payload])
                : [update.payload],
            },
          }
        }
        // Currently the server sets the state of all the other quotes to
        // Rejected if one quote is accepted
        case QUOTE_ACCEPTED_RFQ_UPDATE: {
          const previousRfq = Object.values(acc).find((rfqDetails) =>
            rfqDetails.quotes.some((quote) => quote.id === update.payload),
          )
          if (previousRfq) {
            return {
              ...acc,
              [previousRfq.id]: {
                ...previousRfq,
                quotes: previousRfq.quotes.map((quote) => ({
                  ...quote,
                  state:
                    quote.id === update.payload
                      ? QuoteState.Accepted
                      : QuoteState.Rejected,
                })),
              },
            }
          }
          return acc
        }
        default:
          return acc
      }
    },
    {},
  ),
  shareLatest(),
)

export const [useCreditRfqDetails, getCreditRfqDetails$] = bind<
  [number],
  RfqDetails | undefined
>((rfqId: number) =>
  creditRfqsById$.pipe(map((creditRfqsById) => creditRfqsById[rfqId])),
)

const endOfRfqStateOfWorld$ = creditRfqUpdates$.pipe(
  filter(
    (update) =>
      update.type === START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE ||
      update.type === END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  ),
  map((update) => update.type === END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE),
  startWith(false),
)

export const quotesReceived$: Observable<QuoteDetails> = creditRfqUpdates$.pipe(
  withLatestFrom(endOfRfqStateOfWorld$),
  filter(([_update, endOfRfqStateOfWorld]) => endOfRfqStateOfWorld),
  map(([update, _endOfRfqStateOfWorld]) => update),
  filter(
    (update): update is QuoteCreatedRfqUpdate =>
      update.type === QUOTE_CREATED_RFQ_UPDATE,
  ),
  withLatestFrom(creditRfqsById$),
  map(([update, creditRfqsById]) => {
    const rfq = creditRfqsById[update.payload.rfqId]
    return {
      ...update.payload,
      instrument: rfq.instrument,
      dealer:
        rfq.dealers.find((dealer) => dealer.id === update.payload.dealerId) ??
        null,
      direction: rfq.direction,
      quantity: rfq.quantity,
    }
  }),
)
