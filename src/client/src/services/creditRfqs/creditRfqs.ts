import {
  CLIENT_SUBSCRIBE_REQUEST,
  RfqBody,
  RfqUpdate,
  RFQ_CLOSED_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE,
  WorkflowService,
} from "@/generated/TradingGateway"
import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"

const [, creditRfqsById$] = bind(
  WorkflowService.subscribe({ type: CLIENT_SUBSCRIBE_REQUEST }).pipe(
    scan((acc: Record<string, RfqBody>, update: RfqUpdate) => {
      console.log(update)
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

export const [useCreditRfqs, creditRfqs$] = bind(
  creditRfqsById$.pipe(map((creditRfqsById) => Object.values(creditRfqsById))),
  [],
)
