import { Loader } from "@/client/components/Loader"
import { Typography } from "@/client/components/Typography"
import { invertDirection } from "@/client/utils"
import { ACCEPTED_QUOTE_STATE, RfqState } from "@/generated/TradingGateway"
import { useCreditRfqDetails } from "@/services/credit"

import { CardHeader } from "../../CreditRfqs/CreditRfqCards/CardHeader"
import { getSellSideQuoteState, SellSideQuoteState } from "../sellSideState"
import { SellSideTradeTicketFooter } from "./SellSideTradeTickerFooter"
import {
  Banner,
  Diamond,
  SellSideTradeTicketInnerWrapper,
  SellSideTradeTicketWrapper,
} from "./SellSideTradeTicketCore.styles"
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
  const accepted = quote?.state.type === ACCEPTED_QUOTE_STATE
  const terminated = rfqState !== RfqState.Open && !accepted

  return (
    <SellSideTradeTicketWrapper>
      <Typography color="Colors/Text/text-primary (900)">
        <Banner>
          <Diamond state={state} />
          {getHeaderMessage(state)}
        </Banner>
        <SellSideTradeTicketInnerWrapper>
          <CardHeader
            accepted={accepted}
            terminated={terminated}
            direction={direction}
            instrumentId={instrumentId}
          />
          <SellSideTradeTicketParameters
            selectedRfqId={rfqId}
            quote={quote}
            state={rfqState}
            quantity={quantity}
          />
          <SellSideTradeTicketFooter rfqId={rfqId} quote={quote} />
        </SellSideTradeTicketInnerWrapper>
      </Typography>
    </SellSideTradeTicketWrapper>
  )
}
