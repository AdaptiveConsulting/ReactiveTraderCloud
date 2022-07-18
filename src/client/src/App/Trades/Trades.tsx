import { Loader } from "@/components/Loader"
import { FC, lazy, Suspense, useEffect } from "react"
import { creditTrades$, trades$ } from "@/services/trades"
import styled from "styled-components"
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

export const Trades: FC<Props> = ({ credit = false }) => {
  useEffect(() => {
    const sub = credit ? creditTrades$.subscribe() : trades$.subscribe()
    return () => sub.unsubscribe()
  }, [credit])
  return (
    <CreditContext.Provider value={credit}>
      <TradesWrapper>
        <Suspense fallback={<Loader />}>
          <TradesCore />
        </Suspense>
      </TradesWrapper>
    </CreditContext.Provider>
  )
}
