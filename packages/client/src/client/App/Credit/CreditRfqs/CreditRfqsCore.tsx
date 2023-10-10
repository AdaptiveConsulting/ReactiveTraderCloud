import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"

import {
  registerCreditQuoteAcceptedNotifications,
  registerCreditQuoteReceivedNotifications,
  unregisterCreditQuoteAcceptedNotifications,
  unregisterCreditQuoteReceivedNotifications,
} from "@/client/notifications"
import { WithChildren } from "@/client/utils/utilityTypes"

import { CreditRfqCardGrid } from "./CreditRfqCards"
import { CreditRfqsHeader } from "./CreditRfqsHeader"

const CreditRfqsCoreWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`
const CreditRfqsCore = ({ children }: WithChildren) => {
  useEffect(() => {
    registerCreditQuoteReceivedNotifications()
    // the most logical place for accepted notifications,
    // for all cases except the NLP-based nested RFQ ticket
    registerCreditQuoteAcceptedNotifications()

    return () => {
      unregisterCreditQuoteReceivedNotifications()
      unregisterCreditQuoteAcceptedNotifications()
    }
  }, [])

  return (
    <Subscribe fallback={children}>
      <CreditRfqsCoreWrapper>
        <CreditRfqsHeader />
        <CreditRfqCardGrid />
      </CreditRfqsCoreWrapper>
    </Subscribe>
  )
}

export default CreditRfqsCore
