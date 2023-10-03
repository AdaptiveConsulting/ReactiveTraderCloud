import { lazy, Suspense, useEffect } from "react"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"
import {
  registerCreditQuoteAcceptedNotifications,
  unregisterCreditQuoteAcceptedNotifications,
} from "@/client/notifications"

const TradesCore = lazy(() => import("./CoreCreditTrades"))

const TradesWrapper = styled.article`
  height: 100%;
  padding: 0.5rem 1rem;
  user-select: none;
  background: ${({ theme }) => theme.core.darkBackground};
`

export const CreditTrades = () => {
  // TODO (5569) - for now, we need to register for RFQ "accepted" here
  // .. otherwise, in OpenFin, there is no past data in the Credit Blotter
  // only processes endStateOfTheWorld rfq update
  useEffect(() => {
    registerCreditQuoteAcceptedNotifications()
    return () => {
      unregisterCreditQuoteAcceptedNotifications()
    }
  }, [])

  return (
    <TradesWrapper>
      <Suspense fallback={<Loader />}>
        <TradesCore />
      </Suspense>
    </TradesWrapper>
  )
}

export default CreditTrades
