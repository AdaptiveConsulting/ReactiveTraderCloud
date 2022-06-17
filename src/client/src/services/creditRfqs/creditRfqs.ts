import {
  CLIENT_SUBSCRIBE_REQUEST,
  DealerBody,
  InstrumentBody,
  RfqBody,
  RfqUpdate,
  RFQ_CLOSED_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  WorkflowService,
} from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { map, scan, withLatestFrom } from "rxjs/operators"
import { creditDealers$ } from "../creditDealers"
import { creditInstruments$ } from "../creditInstruments"

const [, creditRfqsById$] = bind(
  WorkflowService.subscribe({ type: CLIENT_SUBSCRIBE_REQUEST }).pipe(
    scan((acc: Record<string, RfqBody>, update: RfqUpdate) => {
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE:
          return {}
        case RFQ_CREATED_RFQ_UPDATE:
          return {
            ...acc,
            [update.payload.id]: update.payload,
          }
        case RFQ_CLOSED_RFQ_UPDATE:
          return {
            ...acc,
            [update.payload.id]: {
              ...acc[update.payload.id],
              state: update.payload.state,
            },
          }
        default:
          return acc
      }
    }, {}),
  ),
)

export interface RfqDetail extends RfqBody {
  instrument: InstrumentBody | null
  dealers: DealerBody[]
}

export const [useCreditRfqs, creditRfqs$] = bind<RfqDetail[]>(
  creditRfqsById$.pipe(
    withLatestFrom(creditInstruments$, creditDealers$),
    map(([creditRfqsById, creditInstruments, creditDealers]) =>
      Object.values(creditRfqsById).map((creditRfq) => ({
        ...creditRfq,
        instrument:
          creditInstruments.find(
            (instrument) => instrument.id === creditRfq.instrumentId,
          ) ?? null,
        dealers: creditRfq.dealerIds.map(
          (dealerId) =>
            creditDealers.find((dealer) => dealer.id === dealerId) ?? {
              id: dealerId,
              name: "Unknown Dealer",
            },
        ),
      })),
    ),
  ),
  [],
)
