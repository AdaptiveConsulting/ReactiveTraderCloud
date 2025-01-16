import { Subscribe } from "@react-rxjs/core"

import { Loader } from "@/client/components/Loader"
import { Typography } from "@/client/components/Typography"
import { useAdaptiveDealerId } from "@/services/credit"

import { useSelectedRfqId } from "../sellSideState"
import { focused$ } from "../utils/useIsFocused"
import {
  NoSelectedMessage,
  NoSelectedWrapper,
  NoSelectHeader,
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
        <NoSelectHeader>
          <Typography
            variant="Text md/Regular"
            color="Colors/Text/text-primary (900)"
          >
            No RFQ Selected
          </Typography>
        </NoSelectHeader>
        <NoSelectedMessage>
          <Typography
            variant="Text sm/Regular"
            color="Colors/Text/text-primary (900)"
          >
            Click an item above to see its full details.
            <br /> You can place bids on RFQs that are still live.
          </Typography>
        </NoSelectedMessage>
      </NoSelectedWrapper>
    )
  }

  return <SellSideTradeTicketTicketCore rfqId={rfqId} dealerId={dealerId} />
}

export const SellSideTradeTicket = () => (
  <Subscribe fallback={<Loader />} source$={focused$}>
    <SellSideTradeTicketInner />
  </Subscribe>
)
