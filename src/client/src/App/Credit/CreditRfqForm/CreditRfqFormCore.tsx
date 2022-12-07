import { Loader } from "@/components/Loader"
import {
  enableOpenSellSideTicketForAdaptiveBankRfqs,
  registerSimulatedDealerResponses,
} from "@/services/credit/creditRfqResponses"
import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import { Subscription } from "rxjs"
import styled from "styled-components"
import { supportsTearOut } from "../../TearOutSection/supportsTearOut"
import { TearOutComponent } from "../../TearOutSection/TearOutComponent"
import { CounterpartySelection } from "./CounterpartySelection"
import { CreditInstrumentSearch } from "./CreditInstrumentSearch"
import { DirectionToggle } from "./DirectionToggle"
import { RfqButtonPanel } from "./RfqButtonPanel"
import { RfqParameters } from "./RfqParameters"

const CreditRfqFormCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 260px;
  margin: auto;
  background: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};
`

const CreditRfqHeader = styled.header`
  padding: 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CreditRfqSection = styled.div<{ fixed?: boolean }>`
  padding: 0 8px 8px;
  flex: ${({ fixed }) => `0 ${fixed ? 0 : 1} auto`};
  ${({ fixed }) => (fixed ? "" : "min-height: 0;")}
  display: flex;
  flex-direction: column;

  &:not(:first-of-type) {
    border-top: 2px solid ${({ theme }) => theme.primary.base};
  }

  & > *:not(:last-of-type) {
    margin-bottom: 18px;
  }
`

const SectionHeader = styled.header`
  font-size: 13px;
  padding: 12px 0;
`

const CreditRfqFooter = styled.footer`
  padding: 1em;
  border-top: 1px solid ${({ theme }) => theme.primary.base};
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const CreditRfqFormCore = () => {
  useEffect(() => {
    const subscription = new Subscription()
    subscription.add(registerSimulatedDealerResponses())
    subscription.add(enableOpenSellSideTicketForAdaptiveBankRfqs())

    return () => subscription.unsubscribe()
  }, [])
  return (
    <CreditRfqFormCoreWrapper>
      <Subscribe fallback={<Loader ariaLabel="Loading New RFQ Form" />}>
        <CreditRfqHeader>
          New RFQ {supportsTearOut && <TearOutComponent section="newRfq" />}
        </CreditRfqHeader>
        <DirectionToggle />
        <CreditRfqSection fixed>
          <SectionHeader>RFQ Details</SectionHeader>
          <CreditInstrumentSearch />
          <RfqParameters />
        </CreditRfqSection>
        <CreditRfqSection>
          <SectionHeader>Counterparty Selection</SectionHeader>
          <CounterpartySelection />
        </CreditRfqSection>
        <CreditRfqFooter>
          <RfqButtonPanel />
        </CreditRfqFooter>
      </Subscribe>
    </CreditRfqFormCoreWrapper>
  )
}
