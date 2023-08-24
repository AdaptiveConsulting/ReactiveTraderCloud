import { Loader } from "client/components/Loader"
import { invertDirection } from "client/utils"
import { PENDING_WITHOUT_PRICE_QUOTE_STATE } from "generated/TradingGateway"
import { useCreditRfqDetails } from "services/credit"

import { getSellSideQuoteState, SellSideQuoteState } from "../sellSideState"
import { SellSideTradeTicketFooter } from "./SellSideTradeTickerFooter"
import {
  Banner,
  Diamond,
  SellSideTradeTicketInnerWrapper,
  SellSideTradeTicketWrapper,
} from "./SellSideTradeTicketCore.styles"
import { SellSideTradeTicketHeader } from "./SellSideTradeTicketHeader"
import { SellSideTradeTicketParameters } from "./SellSideTradeTicketParameters"

const ADAPTIVE_BUYSIDE_NAME = "Adaptive Asset Management"

const getHeaderMessage = (state: SellSideQuoteState) => {
  switch (state) {
    case SellSideQuoteState.New:
      return `RFQ from ${ADAPTIVE_BUYSIDE_NAME}`
    case SellSideQuoteState.Pending:
      return `Quote sent to ${ADAPTIVE_BUYSIDE_NAME}`
    case SellSideQuoteState.Accepted:
      return `${ADAPTIVE_BUYSIDE_NAME} accepted your quote`
    case SellSideQuoteState.Expired:
      return "Your RFQ expired"
    case SellSideQuoteState.Lost:
      return "The offer was traded away"
    case SellSideQuoteState.Cancelled:
      return "Your RFQ was cancelled"
    case SellSideQuoteState.Rejected:
      return "Your offer was rejected"
    case SellSideQuoteState.Passed:
      return "You passed on the RFQ"
  }
}

interface SellSideTradeTicketTicketCoreProps {
  rfqId: number
  dealerId: number
}

export const SellSideTradeTicketTicketCore = ({
  rfqId,
  dealerId,
}: SellSideTradeTicketTicketCoreProps) => {
  const rfqDetails = useCreditRfqDetails(rfqId)

  if (!rfqDetails) {
    return <Loader ariaLabel="Loading RFQ" />
  }

  const quote = rfqDetails.quotes.find((quote) => quote.dealerId === dealerId)

  const {
    direction: clientDirection,
    instrumentId,
    state: rfqState,
    quantity,
  } = rfqDetails

  const direction = invertDirection(clientDirection)
  const state = getSellSideQuoteState(rfqState, quote?.state)

  return (
    <SellSideTradeTicketWrapper>
      <Banner>
        <Diamond state={state} />
        {getHeaderMessage(state)}
      </Banner>
      <SellSideTradeTicketInnerWrapper>
        <SellSideTradeTicketHeader
          direction={direction}
          instrumentId={instrumentId}
          rfqState={rfqState}
          quoteState={
            quote?.state ?? { type: PENDING_WITHOUT_PRICE_QUOTE_STATE }
          }
        />
        <SellSideTradeTicketParameters
          selectedRfqId={rfqId}
          quote={quote}
          state={rfqState}
          quantity={quantity}
        />
        <SellSideTradeTicketFooter rfqId={rfqId} quote={quote} />
      </SellSideTradeTicketInnerWrapper>
    </SellSideTradeTicketWrapper>
  )
}
