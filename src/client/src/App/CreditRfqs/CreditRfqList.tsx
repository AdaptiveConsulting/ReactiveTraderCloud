import { useCreditRfqs } from "@/services/creditRfqs"
import { FC } from "react"
import styled from "styled-components"

const CreditRfqListWrapper = styled.div`
  padding: 0 10px 10px;
`

const CreditRfqItemWrapper = styled.div`
  padding: 10px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:not(:last-of-type) {
    margin-bottom: 10px;
  }
`

export const CreditRfqList: FC = () => {
  const rfqs = useCreditRfqs()

  console.log(rfqs)

  return (
    <CreditRfqListWrapper>
      {rfqs.map((rfq) => (
        <CreditRfqItemWrapper key={rfq.id}>
          <div>Instrument: {rfq.instrument?.name}</div>
          <div>Direction: {rfq.direction}</div>
          <div>Quantity: {rfq.quantity}</div>
          <div>
            Dealers: {rfq.dealers.map((dealer) => dealer.name).join(", ")}
          </div>
          <div>State: {rfq.state}</div>
        </CreditRfqItemWrapper>
      ))}
    </CreditRfqListWrapper>
  )
}
