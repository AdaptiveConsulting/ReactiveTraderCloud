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
import { scan } from "rxjs/operators"

export const [useCreditRfqs, creditRfqs$] = bind(
  WorkflowService.subscribe({ type: CLIENT_SUBSCRIBE_REQUEST }).pipe(
    scan((acc: RfqBody[], update: RfqUpdate) => {
      switch (update.type) {
        case START_OF_STATE_OF_THE_WORLD_RFQ_UPDATE:
          return []
        case RFQ_CREATED_RFQ_UPDATE:
          return [...acc, update.payload]
        case RFQ_CLOSED_RFQ_UPDATE:
          return acc.filter((rfq) => rfq.id !== update.payload.id)
        default:
          return acc
      }
    }, []),
  ),
)
