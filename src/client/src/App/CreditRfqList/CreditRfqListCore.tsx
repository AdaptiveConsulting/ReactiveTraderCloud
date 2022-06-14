import { creditRfqs$, useCreditRfqs } from "@/services/creditRfqs"
import { FC } from "react"
import styled from "styled-components"

creditRfqs$.subscribe()

const RfqItemWrapper = styled.div`
  padding: 10px 0;
`

export const CreditRfqListCore: FC = () => {
  const rfqs = useCreditRfqs()

  return (
    <div>
      {rfqs.map((rfq) => (
        <RfqItemWrapper key={rfq.id}>
          <div>Id: {rfq.id}</div>
          <div>Instrument Id: {rfq.instrumentId}</div>
          <div>Direction: {rfq.direction}</div>
          <div>Quantity: {rfq.quantity}</div>
          <div>Dealer Ids: {rfq.dealerIds}</div>
          <div>State: {rfq.state}</div>
        </RfqItemWrapper>
      ))}
    </div>
  )
}
