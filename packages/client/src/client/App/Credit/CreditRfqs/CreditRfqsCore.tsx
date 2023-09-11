import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"

import {
  registerCreditQuoteNotifications,
  unregisterCreditQuoteNotifications,
} from "@/client/notifications"
import { WithChildren } from "@/client/utils/utilityTypes"

import { CreditRfqCardGrid } from "./CreditRfqCards"
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
const CreditRfqsCore = ({ children }: WithChildren) => {
  useEffect(() => {
    registerCreditQuoteNotifications()

    return unregisterCreditQuoteNotifications
  }, [])

  return (
    <Subscribe fallback={children}>
      <CreditRfqsCoreWrapper>
        <CreditRfqsHeader />
        <CreditRfqCardGrid />
        <CreditRfqCreatedConfirmation />
        <CreditRfqAcceptedConfirmation />
      </CreditRfqsCoreWrapper>
    </Subscribe>
  )
}

export default CreditRfqsCore
