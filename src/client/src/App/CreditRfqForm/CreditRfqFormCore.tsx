import { Subscribe } from "@react-rxjs/core"
import { FC } from "react"
import styled from "styled-components"
import { DirectionToggle } from "./DirectionToggle"
import { CounterpartySelection } from "./CounterpartySelection"
import { CreditInstrumentSearch } from "./CreditInstrumentSearch"
import { RfqButtonPanel } from "./RfqButtonPanel"
import { RfqParameters } from "./RfqParameters"

const CreditRfqFormCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.core.lightBackground};
`

const CreditRfqHeader = styled.header`
  padding: 1em;
`

const CreditRfqSection = styled.div<{ fixed?: boolean }>`
  padding: 10px 1em;
  flex: ${({ fixed }) => (fixed ? 0 : 1)};

  &:not(:first-of-type) {
    border-top: 2px solid ${({ theme }) => theme.primary.base};
  }

  & > *:not(:last-of-type) {
    margin-bottom: 18px;
  }
`

const CreditRfqFooter = styled.footer`
  padding: 1em;
  border-top: 1px solid ${({ theme }) => theme.primary.base};
`

export const CreditRfqFormCore: FC = () => {
  return (
    <CreditRfqFormCoreWrapper>
      <Subscribe fallback={<div>Loading...</div>}>
        <CreditRfqHeader>RFQ Ticket</CreditRfqHeader>
        <CreditRfqSection fixed>
          <DirectionToggle />
          <CreditInstrumentSearch />
          <RfqParameters />
        </CreditRfqSection>
        <CreditRfqSection>
          <CounterpartySelection />
        </CreditRfqSection>
        <CreditRfqFooter>
          <RfqButtonPanel />
        </CreditRfqFooter>
      </Subscribe>
    </CreditRfqFormCoreWrapper>
  )
}
