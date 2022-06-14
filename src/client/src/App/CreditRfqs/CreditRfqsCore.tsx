import { creditRfqs$ } from "@/services/creditRfqs"
import { Subscribe } from "@react-rxjs/core"
import { FC } from "react"
import styled from "styled-components"
import { CreditRfqList } from "./CreditRfqList"

creditRfqs$.subscribe()

const CreditRfqsCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const CreditRfqsHeader = styled.header`
  padding: 1em;
`

export const CreditRfqsCore: FC = () => {
  return (
    <CreditRfqsCoreWrapper>
      <Subscribe source$={creditRfqs$} fallback={<div>Loading...</div>}>
        <CreditRfqsHeader>RFQs</CreditRfqsHeader>
        <CreditRfqList />
      </Subscribe>
    </CreditRfqsCoreWrapper>
  )
}
