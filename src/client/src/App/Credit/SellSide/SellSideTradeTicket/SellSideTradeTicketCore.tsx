import styled from "styled-components"
import { Loader } from "@/components/Loader"
import {
  PENDING_WITH_PRICE_QUOTE_STATE,
  QuoteState,
} from "@/generated/TradingGateway"
import { useCreditRfqDetails } from "@/services/credit"
import { invertDirection } from "@/utils"
import { getSellSideQuoteState, SellSideQuoteState } from "../sellSideState"
import { getSellSideStatusColor } from "../utils"
import { SellSideTradeTicketFooter } from "./SellSideTradeTickerFooter"
import { SellSideTradeTicketHeader } from "./SellSideTradeTicketHeader"
import { SellSideTradeTicketParameters } from "./SellSideTradeTicketParameters"

const SellSideTradeTicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

const SellSideTradeTicketInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #686d74;
  border-radius: 2px;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
`
const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  color: ${({ theme }) => theme.textColor};
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
`

const Diamond = styled.div<{ state: SellSideQuoteState }>`
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-bottom-color: ${({ theme, state }) =>
    getSellSideStatusColor(state, theme)};
  position: relative;
  top: -4px;
  &:after {
    content: "";
    position: absolute;
    left: -4px;
    top: 4px;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-top-color: ${({ theme, state }) =>
      getSellSideStatusColor(state, theme)};
  }
`

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
          quoteState={quote?.state.type}
        />
        <SellSideTradeTicketParameters
          quote={quote}
          state={rfqState}
          quantity={quantity}
        />
        <SellSideTradeTicketFooter
          rfqId={rfqId}
          dealerId={dealerId}
          quote={quote}
        />
      </SellSideTradeTicketInnerWrapper>
    </SellSideTradeTicketWrapper>
  )
}
