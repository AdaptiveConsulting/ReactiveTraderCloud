import { useEffect } from "react"
import styled from "styled-components"
import { Subscribe } from "@react-rxjs/core"
import {
  registerCreditQuoteNotifications,
  unregisterCreditQuoteNotifications,
} from "@/notifications"
import { Loader } from "@/components/Loader"
import {
  CreditRfqCreatedConfirmation,
  CreditRfqAcceptedConfirmation,
} from "./CreditRfqConfirmation"
import { CreditRfqCards } from "./CreditRfqCards"
import { CreditRfqsHeader } from "./CreditRfqsHeader"

const CreditRfqsCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`

export const CreditRfqsCore = () => {
  useEffect(() => {
    registerCreditQuoteNotifications()

    return unregisterCreditQuoteNotifications
  }, [])

  return (
    <Subscribe fallback={<Loader ariaLabel="Loading Credit RFQs" />}>
      <CreditRfqsCoreWrapper>
        <CreditRfqsHeader />
        <CreditRfqCards />
        <CreditRfqCreatedConfirmation />
        <CreditRfqAcceptedConfirmation />
      </CreditRfqsCoreWrapper>
    </Subscribe>
  )
}
