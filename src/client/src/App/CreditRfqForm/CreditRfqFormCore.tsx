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
export const CreditRfqFormCore: FC = () => {
  return (
    <CreditRfqFormCoreWrapper>
      <BuySellToggle />
      <CreditInstrumentSearch />
      <RfqParameters />
      <CounterPartySelection />
      <RfqButtonPanel />
    </CreditRfqFormCoreWrapper>
  )
}
