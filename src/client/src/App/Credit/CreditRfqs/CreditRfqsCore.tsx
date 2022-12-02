import { Loader } from "@/components/Loader"
import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"
import {
  CreditRfqCreatedConfirmation,
  CreditRfqAcceptedConfirmation,
} from "./CreditRfqConfirmation"
import { CreditRfqCards } from "./CreditRfqCards"
import { CreditRfqsHeader } from "./CreditRfqsHeader"
import {
  registerCreditQuoteNotifications,
  unregisterCreditQuoteNotifications,
} from "@/notifications"

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
