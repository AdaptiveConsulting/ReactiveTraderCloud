import { Subscribe } from "@react-rxjs/core"
import { Loader } from "client/components/Loader"
import {
  registerCreditQuoteNotifications,
  unregisterCreditQuoteNotifications,
} from "client/notifications"
import { useEffect } from "react"
import styled from "styled-components"

import { CreditRfqCards } from "./CreditRfqCards"
import {
  CreditRfqAcceptedConfirmation,
  CreditRfqCreatedConfirmation,
} from "./CreditRfqConfirmation"
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
