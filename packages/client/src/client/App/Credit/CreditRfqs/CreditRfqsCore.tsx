import { useEffect } from "react"

import { Region } from "@/client/components/Region/Region"
import {
  registerCreditQuoteAcceptedNotifications,
  registerCreditQuoteReceivedNotifications,
  unregisterCreditQuoteAcceptedNotifications,
  unregisterCreditQuoteReceivedNotifications,
} from "@/client/notifications"
import { WithChildren } from "@/client/utils/utilityTypes"

import { CreditRfqCardGrid } from "./CreditRfqCards"
import { CreditRfqsHeader } from "./CreditRfqsHeader"

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
    <Region
      Header={<CreditRfqsHeader />}
      Body={<CreditRfqCardGrid />}
      fallback={children}
    />
  )
}

export default CreditRfqsCore
