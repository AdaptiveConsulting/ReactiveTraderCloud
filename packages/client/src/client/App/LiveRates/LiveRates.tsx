import { joinChannel } from "@finos/fdc3"
import { combineKeys } from "@react-rxjs/utils"
import { lazy, Suspense, useEffect } from "react"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"
import { currencyPairs$ } from "@/services/currencyPairs"
import { getHistoricalPrices$, getPrice$ } from "@/services/prices"

const LiveRatesCore = lazy(() => import("./LiveRatesCore"))

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

export const LiveRates = () => {
  useEffect(() => {
    if (window.fdc3) joinChannel("green")
  }, [])

  return (
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
}

export default LiveRates
