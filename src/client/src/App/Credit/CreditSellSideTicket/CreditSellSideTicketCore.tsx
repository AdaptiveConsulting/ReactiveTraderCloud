import { Loader } from "@/components/Loader"
import { useCreditRfqDetails } from "@/services/credit"
import { FC } from "react"
import styled from "styled-components"
import { invertDirection, isRfqTerminated } from "../common"
import { CreditSellSideFooter } from "./CreditSellSideFooter"
import { CreditSellSideHeader } from "./CreditSellSideHeader"
import { CreditSellSideParameters } from "./CreditSellSideParameters"
import { CreditSellSideTimer } from "./CreditSellSideTimer"

const CreditSellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

interface CreditSellSideTicketCoreProps {
  rfqId: number
  dealerId: number
}

export const CreditSellSideTicketCore: FC<CreditSellSideTicketCoreProps> = ({
  rfqId,
  dealerId,
}) => {
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
    creationTimestamp,
    expirySecs,
  } = rfqDetails

  const direction = invertDirection(clientDirection)
  return (
    <CreditSellSideWrapper>
      <CreditSellSideHeader
        direction={direction}
        instrumentId={instrumentId}
        terminated={isRfqTerminated(state)}
      />
      <CreditSellSideParameters
        quote={quote}
        state={state}
        quantity={quantity}
      />
      <CreditSellSideTimer
        rfqState={state}
        start={Number(creationTimestamp)}
        end={Number(creationTimestamp) + expirySecs * 1000}
      />
      <CreditSellSideFooter
        rfqId={rfqId}
        dealerId={dealerId}
        quote={quote}
        state={state}
        direction={direction}
      />
    </CreditSellSideWrapper>
  )
}
