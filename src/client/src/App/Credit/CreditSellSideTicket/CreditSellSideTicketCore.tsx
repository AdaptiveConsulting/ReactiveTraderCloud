import { Loader } from "@/components/Loader"
import { CREDIT_SELL_SIDE_TICKET_HEIGHT } from "@/constants"
import { QuoteState } from "@/generated/TradingGateway"
import { useCreditRfqDetails } from "@/services/credit"
import styled from "styled-components"
import { invertDirection } from "../common"
import { CreditSellSideFooter } from "./CreditSellSideFooter"
import { CreditSellSideHeader } from "./CreditSellSideHeader"
import { CreditSellSideParameters } from "./CreditSellSideParameters"

const CreditSellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: ${CREDIT_SELL_SIDE_TICKET_HEIGHT}px;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

interface CreditSellSideTicketCoreProps {
  rfqId: number
  dealerId: number
}

export const CreditSellSideTicketCore = ({
  rfqId,
  dealerId,
}: CreditSellSideTicketCoreProps) => {
  const rfqDetails = useCreditRfqDetails(rfqId)

  if (!rfqDetails) {
    return <Loader ariaLabel="Loading RFQ" />
  }

  const quote = rfqDetails.quotes.find((quote) => quote.dealerId === dealerId)
  const {
    direction: clientDirection,
    instrumentId,
    state,
    quantity,
  } = rfqDetails

  const direction = invertDirection(clientDirection)
  return (
    <CreditSellSideWrapper>
      <CreditSellSideHeader
        direction={direction}
        instrumentId={instrumentId}
        rfqState={state}
        quoteState={quote?.state ?? QuoteState.Pending}
      />
      <CreditSellSideParameters
        quote={quote}
        state={state}
        quantity={quantity}
      />
      <CreditSellSideFooter rfqId={rfqId} dealerId={dealerId} quote={quote} />
    </CreditSellSideWrapper>
  )
}
