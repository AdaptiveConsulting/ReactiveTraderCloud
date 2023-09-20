import { Subscribe } from "@react-rxjs/core"
import { useEffect } from "react"
import styled from "styled-components"

import {
  registerCreditNotifications,
  unregisterCreditNotifications,
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
    registerCreditNotifications()

    return () => {
      unregisterCreditNotifications()
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
