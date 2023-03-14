import {
  ADDED_DEALER_UPDATE,
  DealerBody,
  DealerService,
  DealerUpdate,
  REMOVED_DEALER_UPDATE,
  START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE,
} from "@/generated/TradingGateway"
import { bind, shareLatest } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import { withConnection } from "../../withConnection"
import { mockCreditDealers$ } from "../oldCreditRfqs/mockOldRfqs"

export const ADAPTIVE_BANK_NAME = "Adaptive Bank"

export const [useCreditDealers, creditDealers$] = bind(
  // DealerService.subscribe().pipe(
  mockCreditDealers$().pipe(
    withConnection(),
    scan((acc: DealerBody[], update: DealerUpdate) => {
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE:
          return []
        case ADDED_DEALER_UPDATE:
          return [...acc, update.payload]
        case REMOVED_DEALER_UPDATE:
          return acc.filter((dealer) => dealer.id !== update.payload)
        default:
          return acc
      }
    }, []),
    shareLatest(),
  ),
  [],
)

export const [useCreditDealerById, creditDealerById$] = bind(
  (dealerId: number) =>
    creditDealers$.pipe(
      map((dealers) => dealers.find((dealer) => dealer.id === dealerId)),
    ),
)

export const [useAdaptiveDealerId, adaptiveDealerId$] = bind(
  creditDealers$.pipe(
    map(
      (dealers) =>
        dealers.find((dealer) => dealer.name === ADAPTIVE_BANK_NAME)?.id,
    ),
  ),
)
