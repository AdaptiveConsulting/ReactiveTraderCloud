import { creditRfqs$ } from "@/services/creditRfqs"
import { FC } from "react"
import styled from "styled-components"
import { CreditRfqConfirmation } from "./CreditRfqConfirmation"
import { CreditRfqList } from "./CreditRfqList"

creditRfqs$.subscribe()

const CreditRfqsCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`

const CreditRfqsHeader = styled.header`
  padding: 1em;
`

export const CreditRfqsCore: FC = () => {
  return (
    <CreditRfqsCoreWrapper>
      <CreditRfqsHeader>RFQ's</CreditRfqsHeader>
      <CreditRfqList />
      <CreditRfqConfirmation />
    </CreditRfqsCoreWrapper>
  )
}
