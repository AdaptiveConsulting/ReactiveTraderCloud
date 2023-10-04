import { lazy, Suspense } from "react"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"

const TradesCore = lazy(() => import("./CoreCreditTrades"))

const TradesWrapper = styled.article`
  height: 100%;
  padding: 0.5rem 1rem;
  user-select: none;
  background: ${({ theme }) => theme.core.darkBackground};
`

export const CreditTrades = () => (
  <TradesWrapper>
    <Suspense fallback={<Loader />}>
      <TradesCore />
    </Suspense>
  </TradesWrapper>
)

export default CreditTrades
