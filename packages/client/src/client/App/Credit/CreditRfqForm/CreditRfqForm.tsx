import { lazy, Suspense, useEffect } from "react"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"
import {
  registerCreatedCreditNotification,
  unregisterCreatedCreditNotification,
} from "@/client/notifications"

const CreditRfqFormCore = lazy(() => import("./CreditRfqFormCore"))

const CreditRfqFormWrapper = styled.div`
  height: 100%;
  flex: 0 0 371px;
  overflow: auto;
  padding: 0.5rem 1rem 0.5rem 0;
  user-select: none;
`

const loader = (
  <Loader ariaLabel="Loading New RFQ Form" minWidth="22rem" minHeight="22rem" />
)

export const CreditRfqForm = () => {
  useEffect(() => {
    registerCreatedCreditNotification()
    return () => {
      unregisterCreatedCreditNotification()
    }
  }, [])

  return (
    <CreditRfqFormWrapper>
      <Suspense fallback={loader}>
        <CreditRfqFormCore>{loader}</CreditRfqFormCore>
      </Suspense>
    </CreditRfqFormWrapper>
  )
}

export default CreditRfqForm
