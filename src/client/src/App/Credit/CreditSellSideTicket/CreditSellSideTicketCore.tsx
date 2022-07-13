import { Loader } from "@/components/Loader"
import { useCreditRfqDetails } from "@/services/credit"
import { FC } from "react"
import styled from "styled-components"
import { CreditSellSideFooter } from "./CreditSellSideFooter"
import { CreditSellSideHeader } from "./CreditSellSideHeader"
import { CreditSellSideParameters } from "./CreditSellSideParameters"
import { CreditSellSideTimer } from "./CreditSellSideTimer"

const CreditSellSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
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

  return (
    <CreditSellSideWrapper>
      <CreditSellSideHeader
        direction={rfqDetails.direction}
        instrumentId={rfqDetails.instrumentId}
      />
      <CreditSellSideParameters
        quote={quote}
        state={rfqDetails.state}
        quantity={rfqDetails.quantity}
      />
      <CreditSellSideTimer
        start={Number(rfqDetails.creationTimestamp)}
        end={
          Number(rfqDetails.creationTimestamp) + rfqDetails.expirySecs * 1000
        }
      />
      <CreditSellSideFooter
        rfqId={rfqId}
        dealerId={dealerId}
        quote={quote}
        state={rfqDetails.state}
        direction={rfqDetails.direction}
      />
    </CreditSellSideWrapper>
  )
}
