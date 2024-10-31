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
  height: 100%;
  user-select: none;
  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary_alt"]};

  @media (max-width: 480px) {
    padding-right: 1rem;
  }
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
    <LiveRateWrapper data-qa="workspace__tiles-workspace">
      <Suspense fallback={loader}>
        <LiveRatesCore>{loader}</LiveRatesCore>
      </Suspense>
    </LiveRateWrapper>
  )
}

export default LiveRates
