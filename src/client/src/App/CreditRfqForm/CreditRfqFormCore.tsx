import { Subscribe } from "@react-rxjs/core"
import { FC } from "react"
import styled from "styled-components"
import { BuySellToggle } from "./BuySellToggle"
import { CounterPartySelection } from "./CounterPartySelection"
import { CreditInstrumentSearch } from "./CreditInstrumentSearch"
import { RfqButtonPanel } from "./RfqButtonPanel"
import { RfqParameters } from "./RfqParameters"

const CreditRfqFormCoreWrapper = styled.div`
  padding: 1em;
`

const CreditRfqHeader = styled.header`
  padding: 10px;
`

const CreditRfqContent = styled.div`
  padding: 10px;
`

export const CreditRfqFormCore: FC = () => {
  return (
    <CreditRfqFormCoreWrapper>
      <CreditRfqHeader>RFQ Ticket</CreditRfqHeader>
      <CreditRfqContent>
        <Subscribe fallback={<div>Loading...</div>}>
          <BuySellToggle />
          <CreditInstrumentSearch />
          <RfqParameters />
          <CounterPartySelection />
          <RfqButtonPanel />
        </Subscribe>
      </CreditRfqContent>
    </CreditRfqFormCoreWrapper>
  )
}
