import { Loader } from "@/components/Loader"
import React, { lazy, Suspense } from "react"
import styled from "styled-components"

const TradesCoreDeferred = import("./CoreCreditTrades")
const TradesCore = lazy(() => TradesCoreDeferred)

const TradesWrapper = styled.article`
  height: 100%;
  padding: 0.5rem 1rem;
  user-select: none;
  background: ${({ theme }) => theme.core.darkBackground};
`

export const CreditTrades: React.FC = () => (
  <TradesWrapper>
    <Suspense fallback={<Loader />}>
      <TradesCore />
    </Suspense>
  </TradesWrapper>
)
