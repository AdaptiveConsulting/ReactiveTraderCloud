import { Loader } from "@/components/Loader"
import { lazy, Suspense } from "react"
import { merge } from "rxjs"
import { currencyPairs$ } from "@/services/currencyPairs"
import { getHistoricalPrices$, getPrice$ } from "@/services/prices"
import styled from "styled-components"
import { combineKeys } from "@react-rxjs/utils"
import { map } from "rxjs/operators"

export const LiveRatesCoreDeferred = import("./LiveRatesCore")
const LiveRatesCore = lazy(() => LiveRatesCoreDeferred)

currencyPairs$.subscribe()
combineKeys(currencyPairs$.pipe(map(Object.keys)), (symbol: string) =>
  merge(getHistoricalPrices$(symbol), getPrice$(symbol)),
).subscribe()

const LiveRateWrapper = styled.div`
  padding: 0.5rem 0 0.5rem 1rem;
  user-select: none;
  height: 100%;
  background: ${({ theme }) => theme.core.darkBackground};

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
`

const OverflowScroll = styled.div`
  overflow-y: scroll;
  height: 100%;
`

const loader = (
  <Loader
    ariaLabel="Loading live FX exchange rates"
    minWidth="22rem"
    minHeight="22rem"
  />
)
export const LiveRates = () => (
  <LiveRateWrapper>
    <OverflowScroll>
      <div data-qa="workspace__tiles-workspace">
        <Suspense fallback={loader}>
          <LiveRatesCore>{loader}</LiveRatesCore>
        </Suspense>
      </div>
    </OverflowScroll>
  </LiveRateWrapper>
)
