import { Subscribe } from "@react-rxjs/core"

import { Loader } from "@/client/components/Loader"
import { useAdaptiveDealerId } from "@/services/credit"

import { useSelectedRfqId } from "../sellSideState"
import { focused$ } from "../utils/useIsFocused"
import {
  NoSelectedMessage,
  NoSelectedWrapper,
  NoSelectHeader,
  SellSideWrapper,
} from "./SellSideTradeTicket.styles"
import { SellSideTradeTicketTicketCore } from "./SellSideTradeTicketCore"

const SellSideTradeTicketInner = () => {
  const dealerId = useAdaptiveDealerId()
  const rfqId = useSelectedRfqId()
  if (!dealerId) {
    return <Loader />
  }

  if (rfqId === null) {
    return (
      <NoSelectedWrapper>
        <NoSelectHeader>No RFQ Selected</NoSelectHeader>
        <NoSelectedMessage>
          <p>
            Click an item above to see its full details.
            <br /> You can place bids on RFQs that are still live.
          </p>
        </NoSelectedMessage>
      </NoSelectedWrapper>
    )
  }

  return <SellSideTradeTicketTicketCore rfqId={rfqId} dealerId={dealerId} />
}

export const SellSideTradeTicket = () => (
  <SellSideWrapper>
    <Subscribe fallback={<Loader />} source$={focused$}>
      <SellSideTradeTicketInner />
    </Subscribe>
  </SellSideWrapper>
)
