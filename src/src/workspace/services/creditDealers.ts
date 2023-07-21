import { filter, map, scan } from "rxjs"

import {
  ADDED_DEALER_UPDATE,
  DealerBody,
  DealerService,
  DealerUpdate,
  REMOVED_DEALER_UPDATE,
  START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE,
} from "@/generated/TradingGateway"

import { withConnection } from "./withConnection"

interface DealerStreamState {
  endOfTheStateOfTheWorld: boolean
  dealers: DealerBody[]
}

export const creditDealers$ = DealerService.subscribe().pipe(
  withConnection(),
  scan(
    (acc: DealerStreamState, update: DealerUpdate) => {
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_DEALER_UPDATE:
          return { endOfTheStateOfTheWorld: false, dealers: [] }
        case ADDED_DEALER_UPDATE:
          return { ...acc, dealers: [...acc.dealers, update.payload] }
        case REMOVED_DEALER_UPDATE:
          return {
            ...acc,
            dealers: acc.dealers.filter(
              (dealer) => dealer.id !== update.payload,
            ),
          }
        default:
          return { ...acc, endOfTheStateOfTheWorld: true }
      }
    },
    { endOfTheStateOfTheWorld: false, dealers: [] },
  ),
  filter((state) => state.endOfTheStateOfTheWorld),
  map((state) => state.dealers),
)
