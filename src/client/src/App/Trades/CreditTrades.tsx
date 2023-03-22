import { lazy, Suspense } from "react"
import styled from "styled-components"

import { Loader } from "@/components/Loader"

const TradesCoreDeferred = import("./CoreCreditTrades")
const TradesCore = lazy(() => TradesCoreDeferred)

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
