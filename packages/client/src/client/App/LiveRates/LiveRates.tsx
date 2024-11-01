import { joinChannel } from "@finos/fdc3"
import { combineKeys } from "@react-rxjs/utils"
import { lazy, useEffect } from "react"
import { merge } from "rxjs"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { Loader } from "@/client/components/Loader"
import { RegionWrapper } from "@/client/components/Region/RegionWrapper"
import { currencyPairs$ } from "@/services/currencyPairs"
import { getHistoricalPrices$, getPrice$ } from "@/services/prices"

const LiveRatesCore = lazy(() => import("./LiveRatesCore"))

currencyPairs$.subscribe()
combineKeys(currencyPairs$.pipe(map(Object.keys)), (symbol: string) =>
  merge(getHistoricalPrices$(symbol), getPrice$(symbol)),
).subscribe()

const LiveRateWrapper = styled(RegionWrapper)`
  @media (max-width: 480px) {
    padding-right: 1rem;
  }
  overflow-y: auto;
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
    <LiveRateWrapper fallback={loader}>
      <LiveRatesCore>{loader}</LiveRatesCore>
    </LiveRateWrapper>
  )
}

export default LiveRates
