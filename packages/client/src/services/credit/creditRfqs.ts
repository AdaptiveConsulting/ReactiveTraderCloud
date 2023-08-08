import { bind, shareLatest } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  END_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  InstrumentBody,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  QUOTE_ACCEPTED_RFQ_UPDATE,
  QUOTE_CREATED_RFQ_UPDATE,
  QUOTE_PASSED_RFQ_UPDATE,
  QUOTE_QUOTED_RFQ_UPDATE,
  QuoteBody,
  QuoteQuotedRfqUpdate,
  REJECTED_WITH_PRICE_QUOTE_STATE,
  REJECTED_WITHOUT_PRICE_QUOTE_STATE,
  RFQ_CLOSED_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  RfqBody,
  RfqState,
  RfqUpdate,
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  WorkflowService,
} from "generated/TradingGateway"
import { combineLatest, merge, Observable, of, timer } from "rxjs"
import {
  distinctUntilKeyChanged,
  filter,
  map,
  scan,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs/operators"

import { PricedQuoteBody, PricedQuoteState } from "../rfqs/types"
import { withConnection } from "../withConnection"
import { creditDealers$ } from "./creditDealers"
import { creditInstruments$ } from "./creditInstruments"

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

export interface PricedQuoteDetails extends Omit<QuoteDetails, "state"> {
  state: PricedQuoteState
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
                dealers: dealers.map(
                  (dealerId) =>
                    dealers.find((dealer) => dealer.id === dealerId.id) ?? {
                      id: dealerId.id,
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
        case QUOTE_PASSED_RFQ_UPDATE: {
          const previousRfq = rec[update.payload.rfqId]
          return [
            acc[0],
            {
              ...rec,
              [update.payload.rfqId]: {
                ...previousRfq,
                quotes: previousRfq.quotes.map((quote) => ({
                  ...quote,
                  state:
                    quote.id === update.payload.id
                      ? update.payload.state
                      : quote.state,
                })),
              },
            },
          ]
        }
        case QUOTE_QUOTED_RFQ_UPDATE: {
          const previousRfq = rec[update.payload.rfqId]
          return [
            acc[0],
            {
              ...rec,
              [update.payload.rfqId]: {
                ...previousRfq,
                quotes: previousRfq.quotes.map((quote) => ({
                  ...quote,
                  state:
                    quote.id === update.payload.id
                      ? update.payload.state
                      : quote.state,
                })),
              },
            },
          ]
        }
        // Currently the server sets the state of all the other quotes to
        // Rejected if one quote is accepted
        case QUOTE_ACCEPTED_RFQ_UPDATE: {
          const previousRfq = Object.values(rec).find((rfqDetails) =>
            rfqDetails.quotes.some((quote) => quote.id === update.payload.id),
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
                      quote.id === update.payload.id
                        ? update.payload?.state
                        : { type: REJECTED_WITHOUT_PRICE_QUOTE_STATE },
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

export const [useCreditRfqDetails, getCreditRfqDetails$] = bind<
  [number],
  RfqDetails | undefined
>((rfqId: number) =>
  creditRfqsById$.pipe(
    map((creditRfqsById) => {
      return creditRfqsById[rfqId]
    }),
  ),
)

export const [removedRfqIds$, removeRfqs] = createSignal<number[]>()
export const clearedRfqIds$ = removedRfqIds$.pipe(
  scan<number[], number[]>((acc, rfqIds) => [...acc, ...rfqIds], []),
  startWith<number[]>([]),
)

export const [useExecutedRfqIds] = bind(
  combineLatest([creditRfqsById$, clearedRfqIds$]).pipe(
    map(([creditRfqsById, clearedRfqIds]) =>
      Object.values(creditRfqsById)
        .filter((creditRfq) => creditRfq.state !== RfqState.Open)
        .map((creditRfq) => creditRfq.id)
        .filter((creditRfqId) => !clearedRfqIds.includes(creditRfqId)),
    ),
  ),
  [],
)

export const creditQuotes$ = creditRfqsById$.pipe(
  map((creditRfqsById) =>
    Object.values(creditRfqsById).flatMap((creditRfq) => creditRfq.quotes),
  ),
)

export const INACTIVE_PASSED_QUOTE_STATE = "passedInactiveQuoteState"

export const [useQuoteState] = bind((dealerId, rfqId) =>
  creditQuotes$.pipe(
    map((quotes) =>
      quotes.find(
        (quote) => quote.dealerId === dealerId && quote.rfqId === rfqId,
      ),
    ),
    map((quote) => {
      if (!quote) {
        throw Error("Missing quote") //should never be thrown since we only call this hook with existing quotes
      }

      switch (quote?.state.type) {
        case PENDING_WITHOUT_PRICE_QUOTE_STATE:
          return {
            type: quote.state.type,
            payload: "Awaiting response",
          }
        case PENDING_WITH_PRICE_QUOTE_STATE:
          return {
            type: quote.state.type,
            payload: quote.state.payload,
          }
        case PASSED_QUOTE_STATE:
          return {
            type: quote.state.type,
            payload: "Passed",
          }
        case ACCEPTED_QUOTE_STATE:
          return {
            type: quote.state.type,
            payload: "Accepted",
          }
        case REJECTED_WITH_PRICE_QUOTE_STATE:
          return {
            type: quote.state.type,
            payload: "Rejected",
          }
        default:
          return {
            type: quote.state.type,
            payload: "Rejected",
          }
      }
    }),
    distinctUntilKeyChanged("type"),
    switchMap((state) => {
      if (state.type === PASSED_QUOTE_STATE) {
        // hides the dot after 6 seconds
        return merge(
          of(state),
          timer(6000).pipe(
            map(() => ({
              type: INACTIVE_PASSED_QUOTE_STATE,
              payload: state.payload,
            })),
          ),
        )
      }

      return of(state)
    }),
  ),
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

export const lastQuoteReceived$: Observable<PricedQuoteDetails> =
  creditRfqUpdates$.pipe(
    withLatestFrom(endOfRfqStateOfWorld$),
    filter(([, endOfRfqStateOfWorld]) => endOfRfqStateOfWorld),
    map(([update]) => update),
    filter(
      (update): update is QuoteQuotedRfqUpdate =>
        update.type === QUOTE_QUOTED_RFQ_UPDATE,
    ),
    withLatestFrom(creditRfqsById$),
    map(([update, creditRfqsById]) => {
      const pricedQuoteBody = update.payload as PricedQuoteBody
      const rfq = creditRfqsById[pricedQuoteBody.rfqId]
      return {
        ...pricedQuoteBody,
        instrument: rfq.instrument,
        dealer:
          rfq.dealers.find(
            (dealer) => dealer.id === pricedQuoteBody.dealerId,
          ) ?? null,
        direction: rfq.direction,
        quantity: rfq.quantity,
      }
    }),
    shareLatest(),
  )
