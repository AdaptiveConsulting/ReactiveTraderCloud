import { Loader } from "@/components/Loader"
import { lazy, Suspense } from "react"
import { trades$ } from "@/services/trades"
import styled from "styled-components"
import React from "react"
import { CreditContext } from "./Context"

export const TradesCoreDeferred = import("./TradesCore")
const TradesCore = lazy(() => TradesCoreDeferred)

const TradesWrapper = styled.article`
  height: 100%;
  padding: 0.5rem 1rem;
  user-select: none;
  background: ${({ theme }) => theme.core.darkBackground};
`

interface Props {
  credit?: boolean
}

trades$.subscribe()
export const Trades: React.FC<Props> = ({ credit }) => (
  <CreditContext.Provider value={!!credit}>
    <TradesWrapper>
      <Suspense fallback={<Loader />}>
        <TradesCore credit={credit} />
      </Suspense>
    </TradesWrapper>
  </CreditContext.Provider>
)
