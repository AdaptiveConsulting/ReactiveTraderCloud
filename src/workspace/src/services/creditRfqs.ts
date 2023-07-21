import {
  RfqUpdate,
  InstrumentBody,
  DealerBody,
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  RFQ_CLOSED_RFQ_UPDATE,
  QUOTE_CREATED_RFQ_UPDATE,
  QUOTE_ACCEPTED_RFQ_UPDATE,
  QuoteState,
  END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  WorkflowService,
  Direction,
  QuoteBody,
  RfqBody,
} from "@/generated/TradingGateway"
import { shareLatest } from "@react-rxjs/core"
import { withLatestFrom, scan, filter, map } from "rxjs"
import { creditDealers$ } from "./creditDealers"
import { creditInstruments$ } from "./creditInstruments"
import { withConnection } from "./withConnection"

export interface RfqDetails extends RfqBody {
  instrument: InstrumentBody | null
  dealers: DealerBody[]
  quotes: QuoteBody[]
}

export interface QuoteDetails extends QuoteBody {
  instrument: InstrumentBody | null
  dealer: DealerBody | null
  direction: Direction
  quantity: number
}

const creditRfqUpdates$ = WorkflowService.subscribe().pipe(
  withConnection(),
  shareLatest(),
)

export const creditRfqsById$ = creditRfqUpdates$.pipe(
  withLatestFrom(creditInstruments$, creditDealers$),
  scan<
    [RfqUpdate, InstrumentBody[], DealerBody[]],
    [boolean, Record<number, RfqDetails>]
  >(
    (acc, [update, instruments, dealers]) => {
      const rec = acc[1]
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE: {
          return [false, {}]
        }
        case RFQ_CREATED_RFQ_UPDATE:
          return [
            acc[0],
            {
              ...rec,
              [update.payload.id]: {
                ...rec[update.payload.id],
                ...update.payload,
                instrument:
                  instruments.find(
                    (instrument) =>
                      instrument.id === update.payload.instrumentId,
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
            },
          ]
        case RFQ_CLOSED_RFQ_UPDATE:
          return [
            acc[0],
            {
              ...rec,
              [update.payload.id]: {
                ...rec[update.payload.id],
                ...update.payload,
              },
            },
          ]
        case QUOTE_CREATED_RFQ_UPDATE: {
          const previousRfq = rec[update.payload.rfqId]
          return [
            acc[0],
            {
              ...rec,
              [update.payload.rfqId]: {
                ...previousRfq,
                quotes: previousRfq?.quotes
                  ? previousRfq.quotes.concat([update.payload])
                  : [update.payload],
              },
            },
          ]
        }
        // Currently the server sets the state of all the other quotes to
        // Rejected if one quote is accepted
        case QUOTE_ACCEPTED_RFQ_UPDATE: {
          const previousRfq = Object.values(rec).find((rfqDetails) =>
            rfqDetails.quotes.some((quote) => quote.id === update.payload),
          )
          if (previousRfq) {
            return [
              acc[0],
              {
                ...rec,
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
              },
            ]
          }
          return [acc[0], rec]
        }
        case END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE: {
          return [true, rec]
        }
        default:
          return acc
      }
    },
    [false, {}],
  ),
  filter(([isEndStateOftheWorld]) => isEndStateOftheWorld),
  map(([, rfqDetailsRec]) => rfqDetailsRec),
  shareLatest(),
)
