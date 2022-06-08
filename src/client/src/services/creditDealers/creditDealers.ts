import {
  ADDED_DEALER_UPDATE,
  DealerBody,
  DealerService,
  DealerUpdate,
  REMOVED_DEALER_UPDATE,
  START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE,
} from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { scan } from "rxjs/operators"

export const [useCreditDealers, creditDealers$] = bind(
  DealerService.subscribe().pipe(
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
  ),
)
